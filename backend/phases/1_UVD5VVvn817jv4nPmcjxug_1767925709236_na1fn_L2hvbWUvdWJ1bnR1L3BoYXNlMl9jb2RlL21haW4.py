
import datetime
import logging

import firebase_admin
import functions_framework
from firebase_admin import auth, credentials, firestore
from firebase_admin.exceptions import FirebaseError

# Initialize Firebase Admin SDK
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Helper Functions ---

def _add_firestore_metadata(data, provenance):
    """Adds schema_version, created_at, updated_at, and provenance to Firestore document."""
    now = datetime.datetime.now(datetime.UTC)
    data['schema_version'] = 1  # Initial schema version
    data['created_at'] = now
    data['updated_at'] = now
    data['provenance'] = provenance
    return data

def _update_firestore_metadata(data, provenance):
    """Updates updated_at and provenance for Firestore document."""
    now = datetime.datetime.now(datetime.UTC)
    data['updated_at'] = now
    data['provenance'] = provenance
    return data

def _handle_error(e, context="", status_code=500):
    logging.error(f"Error in {context}: {e}")
    return {'error': str(e)}, status_code

# --- Cloud Functions ---

@functions_framework.http
def register_user(request):
    """HTTP Cloud Function to register a new user and create their Firestore profile."""
    if request.method != 'POST':
        return {'error': 'Method Not Allowed'}, 405

    request_json = request.get_json(silent=True)
    if not request_json:
        return _handle_error('Invalid JSON in request body', 'register_user', 400)

    email = request_json.get('email')
    password = request_json.get('password')
    display_name = request_json.get('displayName')

    if not all([email, password, display_name]):
        return _handle_error('Missing email, password, or displayName', 'register_user', 400)

    try:
        # 1. Create user in Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name
        )
        logging.info(f"Firebase Auth user created: {user.uid}")

        # 2. Create user profile in Firestore
        user_profile_data = {
            'email': email,
            'display_name': display_name,
            'photo_url': None,
            'onboarding_status': 'not_started',
            'roles': ['viewer'],  # Default role
            'vision_project_id': None
        }
        user_profile_data = _add_firestore_metadata(user_profile_data, 'user_registration')

        db.collection('users').document(user.uid).set(user_profile_data)
        logging.info(f"Firestore user profile created for UID: {user.uid}")

        # Return a simplified AuthResponse (Firebase ID token would be obtained client-side after login)
        return {
            'uid': user.uid,
            'email': user.email,
            'displayName': user.display_name,
            'message': 'User registered successfully'
        }, 201

    except auth.EmailAlreadyExistsError:
        return _handle_error('Email already exists', 'register_user', 409)
    except auth.InvalidPasswordError:
        return _handle_error('Password must be at least 6 characters long', 'register_user', 400)
    except FirebaseError as e:
        return _handle_error(e, 'register_user', 500)
    except Exception as e:
        return _handle_error(e, 'register_user', 500)

@functions_framework.http
def get_user_profile(request):
    """HTTP Cloud Function to retrieve a user's profile from Firestore."""
    if request.method != 'GET':
        return {'error': 'Method Not Allowed'}, 405

    # Authenticate user using Firebase ID Token (assuming token is in Authorization header)
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return _handle_error('Authorization header missing or malformed', 'get_user_profile', 401)

    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except auth.InvalidIdTokenError:
        return _handle_error('Invalid or expired ID token', 'get_user_profile', 401)
    except Exception as e:
        return _handle_error(e, 'get_user_profile', 401)

    # Get userId from path parameter or query parameter (for simplicity, let's assume current user's profile)
    # For a more robust API, userId would be passed as a path parameter and checked against the authenticated UID for authorization
    # For now, we'll assume the request is for the authenticated user's profile.
    user_id_from_request = request.args.get('userId') or uid

    if user_id_from_request != uid: # Basic authorization check: user can only fetch their own profile
        return _handle_error('Forbidden: Cannot access other user\'s profile', 'get_user_profile', 403)

    try:
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return _handle_error('User profile not found', 'get_user_profile', 404)

        profile_data = user_doc.to_dict()
        # Convert Timestamps to ISO format for API response
        if 'created_at' in profile_data: profile_data['createdAt'] = profile_data['created_at'].isoformat()
        if 'updated_at' in profile_data: profile_data['updatedAt'] = profile_data['updated_at'].isoformat()
        profile_data['uid'] = uid # Add UID to the response as per OpenAPI spec

        return profile_data, 200

    except Exception as e:
        return _handle_error(e, 'get_user_profile', 500)

@functions_framework.http
def update_user_profile(request):
    """HTTP Cloud Function to update a user's profile in Firestore."""
    if request.method != 'PUT':
        return {'error': 'Method Not Allowed'}, 405

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return _handle_error('Authorization header missing or malformed', 'update_user_profile', 401)

    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except auth.InvalidIdTokenError:
        return _handle_error('Invalid or expired ID token', 'update_user_profile', 401)
    except Exception as e:
        return _handle_error(e, 'update_user_profile', 401)

    request_json = request.get_json(silent=True)
    if not request_json:
        return _handle_error('Invalid JSON in request body', 'update_user_profile', 400)

    # For simplicity, assuming userId from path matches authenticated user. In a real scenario, validate.
    user_id_from_path = request.args.get('userId') # Assuming userId is passed as a query param for simplicity
    if not user_id_from_path or user_id_from_path != uid:
        return _handle_error('Forbidden: Cannot update other user\'s profile or missing userId', 'update_user_profile', 403)

    update_data = {}
    if 'displayName' in request_json: update_data['display_name'] = request_json['displayName']
    if 'photoUrl' in request_json: update_data['photo_url'] = request_json['photoUrl']

    if not update_data:
        return _handle_error('No valid fields to update', 'update_user_profile', 400)

    try:
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return _handle_error('User profile not found', 'update_user_profile', 404)

        update_data = _update_firestore_metadata(update_data, 'user_profile_update')
        user_ref.update(update_data)
        logging.info(f"User profile updated for UID: {uid}")

        # Fetch updated profile to return
        updated_profile_doc = user_ref.get()
        updated_profile_data = updated_profile_doc.to_dict()
        if 'created_at' in updated_profile_data: updated_profile_data['createdAt'] = updated_profile_data['created_at'].isoformat()
        if 'updated_at' in updated_profile_data: updated_profile_data['updatedAt'] = updated_profile_data['updated_at'].isoformat()
        updated_profile_data['uid'] = uid

        return updated_profile_data, 200

    except Exception as e:
        return _handle_error(e, 'update_user_profile', 500)


# Note: Firebase Auth handles direct login (email/password) client-side, returning ID tokens.
# A separate Cloud Function for 'login' might be used for custom token generation or additional backend logic post-login,
# but for standard email/password, the client SDK handles the primary authentication flow.
# The OpenAPI spec includes a /auth/login endpoint, which would typically be handled by the client directly
# exchanging credentials for an ID token. If a backend endpoint is strictly required for login,
# it would involve verifying credentials and potentially returning custom tokens or session cookies.
# For this implementation, we focus on user management and profile persistence after Firebase Auth handles primary login.

@functions_framework.http
def start_onboarding(request):
    """HTTP Cloud Function to initiate the onboarding flow for a user."""
    if request.method != 'POST':
        return {'error': 'Method Not Allowed'}, 405

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return _handle_error('Authorization header missing or malformed', 'start_onboarding', 401)

    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except auth.InvalidIdTokenError:
        return _handle_error('Invalid or expired ID token', 'start_onboarding', 401)
    except Exception as e:
        return _handle_error(e, 'start_onboarding', 401)

    try:
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return _handle_error('User profile not found', 'start_onboarding', 404)

        # Update onboarding status to 'in_progress'
        update_data = {'onboarding_status': 'in_progress'}
        update_data = _update_firestore_metadata(update_data, 'onboarding_start')
        user_ref.update(update_data)
        logging.info(f"Onboarding started for UID: {uid}")

        return {'message': 'Onboarding flow started.'}, 200

    except Exception as e:
        return _handle_error(e, 'start_onboarding', 500)

@functions_framework.http
def submit_onboarding_questions(request):
    """HTTP Cloud Function to submit responses to onboarding discovery questions."""
    if request.method != 'POST':
        return {'error': 'Method Not Allowed'}, 405

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return _handle_error('Authorization header missing or malformed', 'submit_onboarding_questions', 401)

    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except auth.InvalidIdTokenError:
        return _handle_error('Invalid or expired ID token', 'submit_onboarding_questions', 401)
    except Exception as e:
        return _handle_error(e, 'submit_onboarding_questions', 401)

    request_json = request.get_json(silent=True)
    if not request_json:
        return _handle_error('Invalid JSON in request body', 'submit_onboarding_questions', 400)

    # Validate all 8 questions are present
    question_keys = [f'question{i}' for i in range(1, 9)]
    if not all(q in request_json for q in question_keys):
        return _handle_error('Missing one or more discovery questions', 'submit_onboarding_questions', 400)

    try:
        # Store onboarding responses
        onboarding_responses_data = {'user_id': uid}
        for q_key in question_keys:
            onboarding_responses_data[q_key] = request_json[q_key]

        onboarding_responses_data = _add_firestore_metadata(onboarding_responses_data, 'onboarding_questions_submission')
        db.collection('onboarding_responses').document(uid).set(onboarding_responses_data)
        logging.info(f"Onboarding questions submitted for UID: {uid}")

        return {'message': 'Onboarding questions submitted.'}, 200

    except Exception as e:
        return _handle_error(e, 'submit_onboarding_questions', 500)

@functions_framework.http
def complete_onboarding(request):
    """HTTP Cloud Function to complete onboarding and auto-generate a Vision Project."""
    if request.method != 'POST':
        return {'error': 'Method Not Allowed'}, 405

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return _handle_error('Authorization header missing or malformed', 'complete_onboarding', 401)

    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except auth.InvalidIdTokenError:
        return _handle_error('Invalid or expired ID token', 'complete_onboarding', 401)
    except Exception as e:
        return _handle_error(e, 'complete_onboarding', 401)

    try:
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return _handle_error('User profile not found', 'complete_onboarding', 404)

        # Check if onboarding questions were submitted (optional, but good practice)
        onboarding_responses_doc = db.collection('onboarding_responses').document(uid).get()
        if not onboarding_responses_doc.exists:
            return _handle_error('Onboarding questions not submitted yet', 'complete_onboarding', 400)

        # 1. Auto-generate Vision Project
        vision_project_id = f'vp_{uid}_{datetime.datetime.now().strftime("%Y%m%d%H%M%S")}'
        vision_project_data = {
            'user_id': uid,
            'project_name': 'My First Vision Project',
            'status': 'active',
            'configuration': {'default_setting': True}, # Placeholder for initial configuration
        }
        vision_project_data = _add_firestore_metadata(vision_project_data, 'vision_project_auto_generation')
        db.collection('vision_projects').document(vision_project_id).set(vision_project_data)
        logging.info(f"Vision Project {vision_project_id} auto-generated for UID: {uid}")

        # 2. Update user profile with completed onboarding status and vision_project_id
        update_data = {
            'onboarding_status': 'completed',
            'vision_project_id': vision_project_id
        }
        update_data = _update_firestore_metadata(update_data, 'onboarding_completion')
        user_ref.update(update_data)
        logging.info(f"Onboarding completed for UID: {uid}")

        return {
            'message': 'Onboarding completed and Vision Project created.',
            'visionProjectId': vision_project_id
        }, 200

    except Exception as e:
        return _handle_error(e, 'complete_onboarding', 500)

@functions_framework.http
def assign_user_role(request):
    """HTTP Cloud Function to assign a role to a user. Requires 'admin' or 'owner' role."""
    if request.method != 'POST':
        return {'error': 'Method Not Allowed'}, 405

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return _handle_error('Authorization header missing or malformed', 'assign_user_role', 401)

    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        requester_uid = decoded_token['uid']
    except auth.InvalidIdTokenError:
        return _handle_error('Invalid or expired ID token', 'assign_user_role', 401)
    except Exception as e:
        return _handle_error(e, 'assign_user_role', 401)

    request_json = request.get_json(silent=True)
    if not request_json:
        return _handle_error('Invalid JSON in request body', 'assign_user_role', 400)

    target_uid = request_json.get('targetUid')
    role_to_assign = request_json.get('role')

    if not all([target_uid, role_to_assign]):
        return _handle_error('Missing targetUid or role', 'assign_user_role', 400)

    valid_roles = ['owner', 'admin', 'viewer']
    if role_to_assign not in valid_roles:
        return _handle_error(f'Invalid role: {role_to_assign}. Valid roles are {', '.join(valid_roles)}', 'assign_user_role', 400)

    try:
        # 1. Check if the requester has 'admin' or 'owner' role
        requester_profile_ref = db.collection('users').document(requester_uid)
        requester_profile_doc = requester_profile_ref.get()

        if not requester_profile_doc.exists:
            return _handle_error('Requester profile not found', 'assign_user_role', 404)

        requester_roles = requester_profile_doc.to_dict().get('roles', [])
        if 'admin' not in requester_roles and 'owner' not in requester_roles:
            return _handle_error('Forbidden: Insufficient permissions to assign roles', 'assign_user_role', 403)

        # 2. Update the target user's roles
        target_user_ref = db.collection('users').document(target_uid)
        target_user_doc = target_user_ref.get()

        if not target_user_doc.exists:
            return _handle_error('Target user profile not found', 'assign_user_role', 404)

        current_roles = target_user_doc.to_dict().get('roles', [])
        if role_to_assign not in current_roles:
            current_roles.append(role_to_assign)
            update_data = {'roles': current_roles}
            update_data = _update_firestore_metadata(update_data, f'role_assignment_by_{requester_uid}')
            target_user_ref.update(update_data)
            logging.info(f"Role '{role_to_assign}' assigned to UID: {target_uid} by {requester_uid}")
        else:
            logging.info(f"User {target_uid} already has role '{role_to_assign}'. No change made.")

        return {'message': f"Role '{role_to_assign}' assigned to user {target_uid} successfully."}, 200

    except Exception as e:
        return _handle_error(e, 'assign_user_role', 500)
