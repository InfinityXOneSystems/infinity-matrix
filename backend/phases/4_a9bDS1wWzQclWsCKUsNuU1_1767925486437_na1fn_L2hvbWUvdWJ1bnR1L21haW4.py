
import json
import logging
import os
from datetime import datetime
from functools import wraps

from flask import Flask, abort, g, jsonify, request
from google.auth.exceptions import DefaultCredentialsError
from google.cloud import firestore

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Firestore client
try:
    db = firestore.Client()
    logging.info("Firestore client initialized successfully.")
except DefaultCredentialsError as e:
    logging.error(f"Failed to initialize Firestore client: {e}. Ensure GOOGLE_APPLICATION_CREDENTIALS is set or running on GCP.")
    # In a production environment, you might want to exit or handle this more gracefully
    # For now, we'll let the app start but Firestore operations will fail.
    db = None

# Configuration for collections
AGENT_TEMPLATES_COLLECTION = 'agent_templates'
AGENT_INSTANCES_COLLECTION = 'agent_instances'
USERS_COLLECTION = 'users'

# --- Utility Functions ---

def _get_timestamp():
    return datetime.utcnow()

def _add_firestore_metadata(data, schema_version='1.0', provenance='InfinityXAI-Phase5'):
    now = _get_timestamp()
    data['schema_version'] = schema_version
    data['created_at'] = now
    data['updated_at'] = now
    data['provenance'] = provenance
    return data

def _update_firestore_metadata(data):
    data['updated_at'] = _get_timestamp()
    return data

def _generate_evidence_pack(action, entity_type, entity_id, payload, result, user_id):
    # Placeholder for evidence pack generation logic
    # In a real scenario, this would store detailed audit logs, request/response payloads,
    # and potentially snapshots of relevant data to a secure storage (e.g., Cloud Storage).
    evidence = {
        'timestamp': _get_timestamp().isoformat(),
        'action': action,
        'entity_type': entity_type,
        'entity_id': entity_id,
        'payload': payload,
        'result': result,
        'user_id': user_id,
        'status': 'success' if result else 'failure'
    }
    logging.info(f"Evidence pack generated: {json.dumps(evidence)}")
    # Example: Store evidence in a dedicated Firestore collection or Cloud Storage
    # db.collection('evidence_packs').add(evidence)
    return evidence

# --- RBAC and Security Hardening ---

def _get_user_role(user_id):
    # In a real application, this would query a user management system or Firestore 'users' collection
    # For demonstration, we'll use a mock user store.
    if not db:
        logging.error("Firestore client not initialized, cannot get user role.")
        return None
    try:
        user_ref = db.collection(USERS_COLLECTION).document(user_id).get()
        if user_ref.exists:
            return user_ref.to_dict().get('role')
        return 'viewer' # Default role if user not found
    except Exception as e:
        logging.error(f"Error fetching user role for {user_id}: {e}")
        return None

def requires_role(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Mock authentication: In a real app, this would come from JWT, session, etc.
            # For simplicity, we'll assume user_id is passed in a header or context.
            user_id = request.headers.get('X-User-ID', 'anonymous')
            g.user_id = user_id # Store user_id in Flask's global context

            if user_id == 'anonymous':
                abort(401, description="Authentication required.")

            user_role = _get_user_role(user_id)
            if user_role is None:
                abort(500, description="Could not determine user role.")

            # Define role hierarchy or direct match
            role_hierarchy = {
                'admin': ['admin', 'developer', 'viewer'],
                'developer': ['developer', 'viewer'],
                'viewer': ['viewer']
            }

            if required_role not in role_hierarchy.get(user_role, []):
                abort(403, description=f"Insufficient permissions. Required role: {required_role}")
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# --- Error Handling ---

@app.errorhandler(400)
def bad_request(e):
    logging.error(f"Bad Request: {e.description}")
    return jsonify(error=e.description), 400

@app.errorhandler(401)
def unauthorized(e):
    logging.warning(f"Unauthorized: {e.description}")
    return jsonify(error=e.description), 401

@app.errorhandler(403)
def forbidden(e):
    logging.warning(f"Forbidden: {e.description}")
    return jsonify(error=e.description), 403

@app.errorhandler(404)
def not_found(e):
    logging.warning(f"Not Found: {e.description}")
    return jsonify(error=e.description), 404

@app.errorhandler(500)
def internal_server_error(e):
    logging.exception(f"Internal Server Error: {e.description}")
    return jsonify(error=e.description), 500

# --- API Endpoints ---

@app.route('/agent-templates', methods=['GET'])
@requires_role('viewer')
def list_agent_templates():
    if not db:
        abort(500, description="Database not initialized.")
    try:
        templates_ref = db.collection(AGENT_TEMPLATES_COLLECTION).stream()
        templates = [template.to_dict() for template in templates_ref]
        _generate_evidence_pack('list_agent_templates', AGENT_TEMPLATES_COLLECTION, 'all', None, templates, g.user_id)
        return jsonify(templates), 200
    except Exception as e:
        logging.error(f"Error listing agent templates: {e}")
        abort(500, description="Failed to retrieve agent templates.")

@app.route('/agent-templates/<string:template_id>', methods=['GET'])
@requires_role('viewer')
def get_agent_template(template_id):
    if not db:
        abort(500, description="Database not initialized.")
    try:
        template_ref = db.collection(AGENT_TEMPLATES_COLLECTION).document(template_id).get()
        if not template_ref.exists:
            abort(404, description=f"Agent template with ID {template_id} not found.")
        template_data = template_ref.to_dict()
        _generate_evidence_pack('get_agent_template', AGENT_TEMPLATES_COLLECTION, template_id, None, template_data, g.user_id)
        return jsonify(template_data), 200
    except Exception as e:
        logging.error(f"Error getting agent template {template_id}: {e}")
        abort(500, description="Failed to retrieve agent template.")

@app.route('/agent-instances', methods=['GET'])
@requires_role('viewer')
def list_agent_instances():
    if not db:
        abort(500, description="Database not initialized.")
    try:
        # In a real app, filter by user_id for security
        instances_ref = db.collection(AGENT_INSTANCES_COLLECTION).where('user_id', '==', g.user_id).stream()
        instances = [instance.to_dict() for instance in instances_ref]
        _generate_evidence_pack('list_agent_instances', AGENT_INSTANCES_COLLECTION, 'all', None, instances, g.user_id)
        return jsonify(instances), 200
    except Exception as e:
        logging.error(f"Error listing agent instances for user {g.user_id}: {e}")
        abort(500, description="Failed to retrieve agent instances.")

@app.route('/agent-instances', methods=['POST'])
@requires_role('developer')
def create_agent_instance():
    if not db:
        abort(500, description="Database not initialized.")
    data = request.get_json()
    if not data:
        abort(400, description="No input data provided.")

    required_fields = ['template_id', 'name', 'autonomy_mode']
    if not all(field in data for field in required_fields):
        abort(400, description=f"Missing required fields: {', '.join(required_fields)}.")

    # Validate autonomy_mode
    valid_autonomy_modes = ['Full Auto', 'Hybrid', 'Manual']
    if data['autonomy_mode'] not in valid_autonomy_modes:
        abort(400, description=f"Invalid autonomy_mode. Must be one of {valid_autonomy_modes}.")

    try:
        # Check if template_id exists
        template_ref = db.collection(AGENT_TEMPLATES_COLLECTION).document(data['template_id']).get()
        if not template_ref.exists:
            abort(400, description=f"Agent template with ID {data['template_id']} does not exist.")

        instance_data = {
            'user_id': g.user_id,
            'template_id': data['template_id'],
            'name': data['name'],
            'custom_parameters': data.get('custom_parameters', {}),
            'autonomy_mode': data['autonomy_mode'],
            'persistent_memory': {},
            'day_0_plan': 'Generated Day 0 Plan Placeholder',
            'status': 'creating'
        }
        instance_data = _add_firestore_metadata(instance_data)

        # Firestore automatically generates an ID if not provided
        doc_ref = db.collection(AGENT_INSTANCES_COLLECTION).add(instance_data)
        instance_id = doc_ref[1].id
        instance_data['instance_id'] = instance_id # Add ID to the returned data

        _generate_evidence_pack('create_agent_instance', AGENT_INSTANCES_COLLECTION, instance_id, data, instance_data, g.user_id)
        return jsonify(instance_data), 201
    except Exception as e:
        logging.error(f"Error creating agent instance for user {g.user_id}: {e}")
        abort(500, description="Failed to create agent instance.")

@app.route('/agent-instances/<string:instance_id>', methods=['GET'])
@requires_role('viewer')
def get_agent_instance(instance_id):
    if not db:
        abort(500, description="Database not initialized.")
    try:
        instance_ref = db.collection(AGENT_INSTANCES_COLLECTION).document(instance_id).get()
        if not instance_ref.exists:
            abort(404, description=f"Agent instance with ID {instance_id} not found.")

        instance_data = instance_ref.to_dict()
        if instance_data.get('user_id') != g.user_id and _get_user_role(g.user_id) != 'admin':
            abort(403, description="You do not have permission to access this agent instance.")

        _generate_evidence_pack('get_agent_instance', AGENT_INSTANCES_COLLECTION, instance_id, None, instance_data, g.user_id)
        return jsonify(instance_data), 200
    except Exception as e:
        logging.error(f"Error getting agent instance {instance_id} for user {g.user_id}: {e}")
        abort(500, description="Failed to retrieve agent instance.")

@app.route('/agent-instances/<string:instance_id>', methods=['PATCH'])
@requires_role('developer')
def update_agent_instance(instance_id):
    if not db:
        abort(500, description="Database not initialized.")
    data = request.get_json()
    if not data:
        abort(400, description="No input data provided for update.")

    try:
        instance_ref = db.collection(AGENT_INSTANCES_COLLECTION).document(instance_id)
        instance_doc = instance_ref.get()

        if not instance_doc.exists:
            abort(404, description=f"Agent instance with ID {instance_id} not found.")

        existing_data = instance_doc.to_dict()
        if existing_data.get('user_id') != g.user_id and _get_user_role(g.user_id) != 'admin':
            abort(403, description="You do not have permission to update this agent instance.")

        # Only allow specific fields to be updated
        updatable_fields = ['name', 'custom_parameters', 'autonomy_mode', 'persistent_memory', 'status']
        update_payload = {k: v for k, v in data.items() if k in updatable_fields}

        if 'autonomy_mode' in update_payload:
            valid_autonomy_modes = ['Full Auto', 'Hybrid', 'Manual']
            if update_payload['autonomy_mode'] not in valid_autonomy_modes:
                abort(400, description=f"Invalid autonomy_mode. Must be one of {valid_autonomy_modes}.")

        if not update_payload:
            abort(400, description="No valid fields provided for update.")

        update_payload = _update_firestore_metadata(update_payload)
        instance_ref.update(update_payload)

        updated_instance_data = instance_ref.get().to_dict()
        _generate_evidence_pack('update_agent_instance', AGENT_INSTANCES_COLLECTION, instance_id, data, updated_instance_data, g.user_id)
        return jsonify(updated_instance_data), 200
    except Exception as e:
        logging.error(f"Error updating agent instance {instance_id} for user {g.user_id}: {e}")
        abort(500, description="Failed to update agent instance.")

# --- Initial Data Seeding (for demonstration/development) ---

def seed_agent_templates():
    if not db:
        logging.error("Firestore client not initialized, cannot seed templates.")
        return

    templates_data = [
        {
            'template_id': 'template-001',
            'name': 'Basic Chatbot',
            'description': 'A simple conversational AI agent.',
            'version': '1.0.0',
            'parameters': {'language': 'en', 'personality': 'friendly'}
        },
        {
            'template_id': 'template-002',
            'name': 'Data Analyst Agent',
            'description': 'Agent for analyzing data and generating reports.',
            'version': '1.0.0',
            'parameters': {'data_sources': ['csv', 'sql'], 'output_format': 'json'}
        },
        {
            'template_id': 'template-003',
            'name': 'Code Generator Agent',
            'description': 'Generates code snippets based on natural language descriptions.',
            'version': '1.0.0',
            'parameters': {'programming_language': 'python', 'framework': 'flask'}
        },
        {
            'template_id': 'template-004',
            'name': 'Marketing Content Creator',
            'description': 'Creates marketing copy and social media posts.',
            'version': '1.0.0',
            'parameters': {'tone': 'professional', 'platform': 'linkedin'}
        },
        {
            'template_id': 'template-005',
            'name': 'Customer Support Agent',
            'description': 'Handles common customer inquiries and provides support.',
            'version': '1.0.0',
            'parameters': {'support_topics': ['billing', 'technical'], 'response_time': 'immediate'}
        },
        {
            'template_id': 'template-006',
            'name': 'Project Manager Agent',
            'description': 'Assists with project planning, task assignment, and progress tracking.',
            'version': '1.0.0',
            'parameters': {'methodology': 'agile', 'tools': ['jira', 'slack']}
        },
        {
            'template_id': 'template-007',
            'name': 'Research Assistant Agent',
            'description': 'Conducts research on specified topics and summarizes findings.',
            'version': '1.0.0',
            'parameters': {'search_depth': 'deep', 'sources': ['academic', 'web']}
        },
        {
            'template_id': 'template-008',
            'name': 'Financial Advisor Agent',
            'description': 'Provides financial advice and investment recommendations.',
            'version': '1.0.0',
            'parameters': {'risk_tolerance': 'medium', 'investment_horizon': 'long-term'}
        },
        {
            'template_id': 'template-009',
            'name': 'Legal Document Reviewer',
            'description': 'Reviews legal documents for compliance and key clauses.',
            'version': '1.0.0',
            'parameters': {'document_type': 'contract', 'jurisdiction': 'us'}
        },
        {
            'template_id': 'template-010',
            'name': 'Healthcare Triage Agent',
            'description': 'Assesses symptoms and recommends next steps for healthcare.',
            'version': '1.0.0',
            'parameters': {'specialty': 'general', 'guidelines': 'who'}
        },
        {
            'template_id': 'template-011',
            'name': 'Educational Tutor Agent',
            'description': 'Provides tutoring and explanations on various subjects.',
            'version': '1.0.0',
            'parameters': {'subject': 'mathematics', 'grade_level': 'high school'}
        },
        {
            'template_id': 'template-012',
            'name': 'Travel Planner Agent',
            'description': 'Helps plan trips, find flights, and book accommodations.',
            'version': '1.0.0',
            'parameters': {'destination_type': 'leisure', 'budget': 'medium'}
        },
        {
            'template_id': 'template-013',
            'name': 'Recipe Generator Agent',
            'description': 'Generates recipes based on available ingredients and dietary preferences.',
            'version': '1.0.0',
            'parameters': {'cuisine': 'italian', 'dietary_restrictions': ['vegetarian']}
        },
        {
            'template_id': 'template-014',
            'name': 'Fitness Coach Agent',
            'description': 'Creates personalized workout plans and tracks progress.',
            'version': '1.0.0',
            'parameters': {'goal': 'muscle gain', 'equipment': 'gym'}
        },
        {
            'template_id': 'template-015',
            'name': 'Event Organizer Agent',
            'description': 'Assists in organizing events, managing guest lists, and logistics.',
            'version': '1.0.0',
            'parameters': {'event_type': 'conference', 'attendees': '100'}
        },
        {
            'template_id': 'template-016',
            'name': 'HR Assistant Agent',
            'description': 'Handles HR-related queries, onboarding, and policy information.',
            'version': '1.0.0',
            'parameters': {'department': 'recruitment', 'policy_area': 'leave'}
        },
        {
            'template_id': 'template-017',
            'name': 'IT Support Agent',
            'description': 'Provides technical support and troubleshooting for IT issues.',
            'version': '1.0.0',
            'parameters': {'system': 'windows', 'issue_type': 'network'}
        },
        {
            'template_id': 'template-018',
            'name': 'Content Summarizer Agent',
            'description': 'Summarizes long articles, documents, or web pages.',
            'version': '1.0.0',
            'parameters': {'length': 'short', 'format': 'bullet points'}
        },
        {
            'template_id': 'template-019',
            'name': 'Sentiment Analysis Agent',
            'description': 'Analyzes text for sentiment (positive, negative, neutral).',
            'version': '1.0.0',
            'parameters': {'input_type': 'social media', 'granularity': 'sentence'}
        },
        {
            'template_id': 'template-020',
            'name': 'Language Translator Agent',
            'description': 'Translates text between different languages.',
            'version': '1.0.0',
            'parameters': {'source_language': 'en', 'target_language': 'es'}
        }
    ]

    logging.info(f"Seeding {len(templates_data)} agent templates...")
    for template in templates_data:
        doc_ref = db.collection(AGENT_TEMPLATES_COLLECTION).document(template['template_id'])
        if not doc_ref.get().exists:
            doc_ref.set(_add_firestore_metadata(template))
            logging.info(f"Seeded template: {template['name']}")
        else:
            logging.info(f"Template '{template['name']}' already exists, skipping seeding.")

def seed_users():
    if not db:
        logging.error("Firestore client not initialized, cannot seed users.")
        return

    users_data = [
        {'user_id': 'user-admin-123', 'email': 'admin@example.com', 'role': 'admin'},
        {'user_id': 'user-dev-456', 'email': 'developer@example.com', 'role': 'developer'},
        {'user_id': 'user-viewer-789', 'email': 'viewer@example.com', 'role': 'viewer'},
    ]

    logging.info(f"Seeding {len(users_data)} users...")
    for user in users_data:
        doc_ref = db.collection(USERS_COLLECTION).document(user['user_id'])
        if not doc_ref.get().exists:
            doc_ref.set(_add_firestore_metadata(user))
            logging.info(f"Seeded user: {user['email']} with role {user['role']}")
        else:
            logging.info(f"User '{user['email']}' already exists, skipping seeding.")

# Run seeding on app startup (for development/testing)
with app.app_context():
    if db:
        seed_users()
        seed_agent_templates()

if __name__ == '__main__':
    # For local development, use 'flask run' or a WSGI server like Gunicorn for production.
    # Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set for local testing.
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
