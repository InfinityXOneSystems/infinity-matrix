
import hashlib
import hmac
import os
from datetime import UTC, datetime

import firebase_admin
from evidence_pack_generator import EvidencePackGenerator
from firebase_admin import credentials, firestore
from flask import Flask, abort, jsonify, request

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase Admin SDK
def initialize_firebase():
    try:
        # Load Firebase Admin SDK credentials from a JSON file
        cred_path = os.environ.get("FIREBASE_ADMIN_SDK_PATH", "firebase_admin_config.json")
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Firebase Admin SDK config file not found at {cred_path}")

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        app.logger.info("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        app.logger.error(f"Error initializing Firebase Admin SDK: {e}")
        raise

initialize_firebase()
db = firestore.client()

# Configuration
# This should ideally be loaded from environment variables or a secure config management system
CONFIG = {
    "DEFAULT_SCHEMA_VERSION": 1,
    "AUDIT_LOG_COLLECTION": "audit_logs",
    "RBAC_ROLES_COLLECTION": "rbac_roles",
    "RBAC_USERS_COLLECTION": "rbac_users",
    "CONTRACTS_COLLECTION": "contracts",
    "DEPLOYED_SERVICES_COLLECTION": "deployed_services",
    "CI_STATUS_COLLECTION": "ci_status",
    "AUTOPILOT_SETTINGS_COLLECTION": "autopilot_settings",
    "VISION_CORTEX_DATA_COLLECTION": "vision_cortex_data",
    "EVIDENCE_PACKS_COLLECTION": "evidence_packs",
    "GITHUB_WEBHOOK_SECRET": os.environ.get("GITHUB_WEBHOOK_SECRET", "super_secret_github_webhook_key"), # Replace with actual secret
    "GCS_EVIDENCE_PACK_BUCKET": os.environ.get("GCS_EVIDENCE_PACK_BUCKET", "infinityx-evidence-packs"), # GCS bucket for evidence packs
    "APP_LOGGER": app.logger # Pass app logger to generator
}

# Initialize Evidence Pack Generator
evidence_pack_generator = EvidencePackGenerator(db, CONFIG["GCS_EVIDENCE_PACK_BUCKET"], CONFIG)

# Helper function for Firestore operations
def get_firestore_timestamp():
    return datetime.now(UTC)

def add_firestore_metadata(data):
    now = get_firestore_timestamp()
    data["created_at"] = now
    data["updated_at"] = now
    data["schema_version"] = CONFIG["DEFAULT_SCHEMA_VERSION"]
    data["provenance"] = "api_creation"
    return data

def update_firestore_metadata(data, provenance="api_update"):
    data["updated_at"] = get_firestore_timestamp()
    data["provenance"] = provenance
    return data

def log_audit_event(actor, action, resource_type, resource_id, details=None):
    audit_log_entry = {
        "timestamp": get_firestore_timestamp(),
        "actor": actor,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details if details is not None else {},
        "schema_version": CONFIG["DEFAULT_SCHEMA_VERSION"],
        "created_at": get_firestore_timestamp(),
        "updated_at": get_firestore_timestamp(),
        "provenance": "audit_system"
    }
    try:
        db.collection(CONFIG["AUDIT_LOG_COLLECTION"]).add(audit_log_entry)
    except Exception as e:
        app.logger.error(f"Failed to write audit log: {e}")

# RBAC Middleware (simplified for demonstration)
def rbac_required(resource, action):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # In a real application, you would get the user\'s ID from the authenticated token
            # For this example, we\'ll assume a user ID is passed in a header or context
            user_id = request.headers.get("X-User-ID", "anonymous") # Placeholder

            if user_id == "anonymous":
                abort(401, description="Authentication required.")

            # Fetch user\'s roles
            user_doc = db.collection(CONFIG["RBAC_USERS_COLLECTION"]).document(user_id).get()
            if not user_doc.exists:
                abort(403, description="User not found or no roles assigned.")
            user_roles = user_doc.to_dict().get("roles", [])

            # Check if any of the user\'s roles have the required permission
            has_permission = False
            for role_id in user_roles:
                role_doc = db.collection(CONFIG["RBAC_ROLES_COLLECTION"]).document(role_id).get()
                if role_doc.exists:
                    permissions = role_doc.to_dict().get("permissions", [])
                    for perm in permissions:
                        if perm.get("resource") == resource and perm.get("action") == action:
                            has_permission = True
                            break
                if has_permission:
                    break

            if not has_permission:
                abort(403, description=f"Permission denied: Requires {action} on {resource}.")

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Error Handling
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"code": 400, "message": error.description}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"code": 401, "message": error.description}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({"code": 403, "message": error.description}), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({"code": 404, "message": error.description}), 404

@app.errorhandler(500)
def internal_server_error(error):
    app.logger.exception("Internal Server Error")
    return jsonify({"code": 500, "message": "Internal Server Error"}), 500

# --- API Endpoints ---

# Contracts
@app.route("/contracts", methods=["GET"])
@rbac_required("contracts", "read")
def get_contracts():
    contracts_ref = db.collection(CONFIG["CONTRACTS_COLLECTION"])
    contracts = [doc.to_dict() for doc in contracts_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "contracts", "all")
    return jsonify(contracts)

@app.route("/contracts", methods=["POST"])
@rbac_required("contracts", "write")
def create_contract():
    data = request.get_json()
    if not data or "name" not in data or "content" not in data:
        abort(400, description="Missing contract name or content.")

    # Calculate SHA-256 hash
    content_hash = hashlib.sha256(data["content"].encode("utf-8")).hexdigest()
    data["hash_value"] = content_hash
    data["sha_validation"] = True # Assuming valid on creation

    data = add_firestore_metadata(data)
    _, doc_ref = db.collection(CONFIG["CONTRACTS_COLLECTION"]).add(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "contracts", doc_ref.id, data)
    return jsonify({"id": doc_ref.id, **data}), 201

@app.route("/contracts/<string:contract_id>", methods=["GET"])
@rbac_required("contracts", "read")
def get_contract_by_id(contract_id):
    contract_doc = db.collection(CONFIG["CONTRACTS_COLLECTION"]).document(contract_id).get()
    if not contract_doc.exists:
        abort(404, description="Contract not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "contracts", contract_id)
    return jsonify({"id": contract_doc.id, **contract_doc.to_dict()})

@app.route("/contracts/<string:contract_id>", methods=["PUT"])
@rbac_required("contracts", "write")
def update_contract_by_id(contract_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")

    contract_ref = db.collection(CONFIG["CONTRACTS_COLLECTION"]).document(contract_id)
    contract_doc = contract_ref.get()
    if not contract_doc.exists:
        abort(404, description="Contract not found.")

    # Update SHA-256 hash if content is updated
    if "content" in data:
        content_hash = hashlib.sha256(data["content"].encode("utf-8")).hexdigest()
        data["hash_value"] = content_hash
        data["sha_validation"] = True # Re-validate on content update

    data = update_firestore_metadata(data)
    contract_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "contracts", contract_id, data)
    return jsonify({"id": contract_id, **data})

@app.route("/contracts/<string:contract_id>", methods=["DELETE"])
@rbac_required("contracts", "delete")
def delete_contract_by_id(contract_id):
    contract_ref = db.collection(CONFIG["CONTRACTS_COLLECTION"]).document(contract_id)
    if not contract_ref.get().exists:
        abort(404, description="Contract not found.")
    contract_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "contracts", contract_id)
    return "", 204

# Deployed Services
@app.route("/deployed-services", methods=["GET"])
@rbac_required("deployed_services", "read")
def get_deployed_services():
    services_ref = db.collection(CONFIG["DEPLOYED_SERVICES_COLLECTION"])
    services = [doc.to_dict() for doc in services_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "deployed_services", "all")
    return jsonify(services)

@app.route("/deployed-services", methods=["POST"])
@rbac_required("deployed_services", "write")
def create_deployed_service():
    data = request.get_json()
    if not data or "service_name" not in data or "project_id" not in data or "region" not in data:
        abort(400, description="Missing service_name, project_id, or region.")
    data = add_firestore_metadata(data)
    _, doc_ref = db.collection(CONFIG["DEPLOYED_SERVICES_COLLECTION"]).add(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "deployed_services", doc_ref.id, data)
    return jsonify({"id": doc_ref.id, **data}), 201

@app.route("/deployed-services/<string:service_id>", methods=["GET"])
@rbac_required("deployed_services", "read")
def get_deployed_service_by_id(service_id):
    service_doc = db.collection(CONFIG["DEPLOYED_SERVICES_COLLECTION"]).document(service_id).get()
    if not service_doc.exists:
        abort(404, description="Deployed service not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "deployed_services", service_id)
    return jsonify({"id": service_doc.id, **service_doc.to_dict()})

@app.route("/deployed-services/<string:service_id>", methods=["PUT"])
@rbac_required("deployed_services", "write")
def update_deployed_service_by_id(service_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")
    service_ref = db.collection(CONFIG["DEPLOYED_SERVICES_COLLECTION"]).document(service_id)
    if not service_ref.get().exists:
        abort(404, description="Deployed service not found.")
    data = update_firestore_metadata(data)
    service_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "deployed_services", service_id, data)
    return jsonify({"id": service_id, **data})

@app.route("/deployed-services/<string:service_id>", methods=["DELETE"])
@rbac_required("deployed_services", "delete")
def delete_deployed_service_by_id(service_id):
    service_ref = db.collection(CONFIG["DEPLOYED_SERVICES_COLLECTION"]).document(service_id)
    if not service_ref.get().exists:
        abort(404, description="Deployed service not found.")
    service_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "deployed_services", service_id)
    return "", 204

# CI Status
@app.route("/ci-status", methods=["GET"])
@rbac_required("ci_status", "read")
def get_ci_statuses():
    ci_status_ref = db.collection(CONFIG["CI_STATUS_COLLECTION"])
    statuses = [doc.to_dict() for doc in ci_status_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "ci_status", "all")
    return jsonify(statuses)

@app.route("/ci-status", methods=["POST"])
@rbac_required("ci_status", "write")
def create_ci_status():
    data = request.get_json()
    if not data or "workflow_name" not in data or "repository" not in data:
        abort(400, description="Missing workflow_name or repository.")
    data = add_firestore_metadata(data)
    _, doc_ref = db.collection(CONFIG["CI_STATUS_COLLECTION"]).add(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "ci_status", doc_ref.id, data)
    return jsonify({"id": doc_ref.id, **data}), 201

@app.route("/ci-status/<string:ci_status_id>", methods=["GET"])
@rbac_required("ci_status", "read")
def get_ci_status_by_id(ci_status_id):
    ci_status_doc = db.collection(CONFIG["CI_STATUS_COLLECTION"]).document(ci_status_id).get()
    if not ci_status_doc.exists:
        abort(404, description="CI Status not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "ci_status", ci_status_id)
    return jsonify({"id": ci_status_doc.id, **ci_status_doc.to_dict()})

@app.route("/ci-status/<string:ci_status_id>", methods=["PUT"])
@rbac_required("ci_status", "write")
def update_ci_status_by_id(ci_status_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")
    ci_status_ref = db.collection(CONFIG["CI_STATUS_COLLECTION"]).document(ci_status_id)
    if not ci_status_ref.get().exists:
        abort(404, description="CI Status not found.")
    data = update_firestore_metadata(data)
    ci_status_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "ci_status", ci_status_id, data)
    return jsonify({"id": ci_status_id, **data})

@app.route("/ci-status/<string:ci_status_id>", methods=["DELETE"])
@rbac_required("ci_status", "delete")
def delete_ci_status_by_id(ci_status_id):
    ci_status_ref = db.collection(CONFIG["CI_STATUS_COLLECTION"]).document(ci_status_id)
    if not ci_status_ref.get().exists:
        abort(404, description="CI Status not found.")
    ci_status_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "ci_status", ci_status_id)
    return "", 204

# Autopilot Settings
@app.route("/autopilot-settings", methods=["GET"])
@rbac_required("autopilot_settings", "read")
def get_autopilot_settings():
    # Assuming there\'s only one autopilot settings document, or we fetch the latest
    settings_ref = db.collection(CONFIG["AUTOPILOT_SETTINGS_COLLECTION"])
    settings_doc = next(settings_ref.limit(1).stream(), None)
    if not settings_doc:
        abort(404, description="Autopilot settings not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "autopilot_settings", settings_doc.id)
    return jsonify({"id": settings_doc.id, **settings_doc.to_dict()})

@app.route("/autopilot-settings", methods=["PUT"])
@rbac_required("autopilot_settings", "write")
def update_autopilot_settings():
    data = request.get_json()
    if not data or "mode" not in data or "kill_switch_active" not in data:
        abort(400, description="Missing mode or kill_switch_active.")

    settings_ref = db.collection(CONFIG["AUTOPILOT_SETTINGS_COLLECTION"])
    settings_doc = next(settings_ref.limit(1).stream(), None)

    if settings_doc:
        # Update existing document
        settings_id = settings_doc.id
        data = update_firestore_metadata(data, provenance="api_update")
        settings_ref.document(settings_id).update(data)
        log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "autopilot_settings", settings_id, data)
        return jsonify({"id": settings_id, **data})
    else:
        # Create new document if none exists
        data = add_firestore_metadata(data)
        _, doc_ref = settings_ref.add(data)
        log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "autopilot_settings", doc_ref.id, data)
        return jsonify({"id": doc_ref.id, **data}), 201

# Vision Cortex Data
@app.route("/vision-cortex-data", methods=["GET"])
@rbac_required("vision_cortex_data", "read")
def get_vision_cortex_data():
    vc_data_ref = db.collection(CONFIG["VISION_CORTEX_DATA_COLLECTION"])
    data = [doc.to_dict() for doc in vc_data_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "vision_cortex_data", "all")
    return jsonify(data)

@app.route("/vision-cortex-data", methods=["POST"])
@rbac_required("vision_cortex_data", "write")
def create_vision_cortex_data():
    data = request.get_json()
    if not data or "data_type" not in data or "payload" not in data:
        abort(400, description="Missing data_type or payload.")
    data = add_firestore_metadata(data)
    _, doc_ref = db.collection(CONFIG["VISION_CORTEX_DATA_COLLECTION"]).add(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "vision_cortex_data", doc_ref.id, data)
    return jsonify({"id": doc_ref.id, **data}), 201

@app.route("/vision-cortex-data/<string:data_id>", methods=["GET"])
@rbac_required("vision_cortex_data", "read")
def get_vision_cortex_data_by_id(data_id):
    vc_data_doc = db.collection(CONFIG["VISION_CORTEX_DATA_COLLECTION"]).document(data_id).get()
    if not vc_data_doc.exists:
        abort(404, description="Vision Cortex data not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "vision_cortex_data", data_id)
    return jsonify({"id": vc_data_doc.id, **vc_data_doc.to_dict()})

@app.route("/vision-cortex-data/<string:data_id>", methods=["PUT"])
@rbac_required("vision_cortex_data", "write")
def update_vision_cortex_data_by_id(data_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")
    vc_data_ref = db.collection(CONFIG["VISION_CORTEX_DATA_COLLECTION"]).document(data_id)
    if not vc_data_ref.get().exists:
        abort(404, description="Vision Cortex data not found.")
    data = update_firestore_metadata(data)
    vc_data_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "vision_cortex_data", data_id, data)
    return jsonify({"id": data_id, **data})

@app.route("/vision-cortex-data/<string:data_id>", methods=["DELETE"])
@rbac_required("vision_cortex_data", "delete")
def delete_vision_cortex_data_by_id(data_id):
    vc_data_ref = db.collection(CONFIG["VISION_CORTEX_DATA_COLLECTION"]).document(data_id)
    if not vc_data_ref.get().exists:
        abort(404, description="Vision Cortex data not found.")
    vc_data_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "vision_cortex_data", data_id)
    return "", 204

# Evidence Packs
@app.route("/evidence-packs", methods=["GET"])
@rbac_required("evidence_packs", "read")
def get_evidence_packs():
    packs_ref = db.collection(CONFIG["EVIDENCE_PACKS_COLLECTION"])
    packs = [doc.to_dict() for doc in packs_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "evidence_packs", "all")
    return jsonify(packs)

@app.route("/evidence-packs", methods=["POST"])
@rbac_required("evidence_packs", "write")
def create_evidence_pack():
    data = request.get_json()
    if not data or "pack_name" not in data:
        abort(400, description="Missing pack_name.")

    actor = request.headers.get("X-User-ID", "anonymous")
    data_query_params = data.get("data_query_params")
    expiration_days = data.get("expiration_days", 7)

    try:
        pack_info = evidence_pack_generator.generate_evidence_pack(
            pack_name=data["pack_name"],
            actor=actor,
            data_query_params=data_query_params,
            expiration_days=expiration_days
        )
        log_audit_event(actor, "create", "evidence_packs", pack_info["id"], pack_info)
        return jsonify(pack_info), 201
    except Exception as e:
        app.logger.error(f"Error generating evidence pack: {e}")
        abort(500, description=f"Failed to generate evidence pack: {e}")

@app.route("/evidence-packs/<string:pack_id>", methods=["GET"])
@rbac_required("evidence_packs", "read")
def get_evidence_pack_by_id(pack_id):
    pack_doc = db.collection(CONFIG["EVIDENCE_PACKS_COLLECTION"]).document(pack_id).get()
    if not pack_doc.exists:
        abort(404, description="Evidence pack not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "evidence_packs", pack_id)
    return jsonify({"id": pack_doc.id, **pack_doc.to_dict()})

@app.route("/evidence-packs/<string:pack_id>/signed-url", methods=["GET"])
@rbac_required("evidence_packs", "read")
def get_evidence_pack_signed_url(pack_id):
    try:
        signed_url = evidence_pack_generator.get_signed_url(pack_id)
        if signed_url:
            log_audit_event(request.headers.get("X-User-ID", "anonymous"), "get_signed_url", "evidence_packs", pack_id)
            return jsonify({"pack_id": pack_id, "signed_url": signed_url})
        else:
            abort(404, description="Evidence pack or signed URL not found.")
    except Exception as e:
        app.logger.error(f"Error retrieving signed URL for evidence pack {pack_id}: {e}")
        abort(500, description=f"Failed to retrieve signed URL: {e}")

@app.route("/evidence-packs/<string:pack_id>", methods=["PUT"])
@rbac_required("evidence_packs", "write")
def update_evidence_pack_by_id(pack_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")
    pack_ref = db.collection(CONFIG["EVIDENCE_PACKS_COLLECTION"]).document(pack_id)
    if not pack_ref.get().exists:
        abort(404, description="Evidence pack not found.")
    data = update_firestore_metadata(data)
    pack_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "evidence_packs", pack_id, data)
    return jsonify({"id": pack_id, **data})

@app.route("/evidence-packs/<string:pack_id>", methods=["DELETE"])
@rbac_required("evidence_packs", "delete")
def delete_evidence_pack_by_id(pack_id):
    pack_ref = db.collection(CONFIG["EVIDENCE_PACKS_COLLECTION"]).document(pack_id)
    if not pack_ref.get().exists:
        abort(404, description="Evidence pack not found.")
    pack_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "evidence_packs", pack_id)
    return "", 204

# Audit Log (Read-only for most users, write via internal functions)
@app.route("/audit-logs", methods=["GET"])
@rbac_required("audit_logs", "read")
def get_audit_logs():
    logs_ref = db.collection(CONFIG["AUDIT_LOG_COLLECTION"])
    logs = [doc.to_dict() for doc in logs_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "audit_logs", "all")
    return jsonify(logs)

@app.route("/audit-logs/<string:log_id>", methods=["GET"])
@rbac_required("audit_logs", "read")
def get_audit_log_by_id(log_id):
    log_doc = db.collection(CONFIG["AUDIT_LOG_COLLECTION"]).document(log_id).get()
    if not log_doc.exists:
        abort(404, description="Audit log entry not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "audit_logs", log_id)
    return jsonify({"id": log_doc.id, **log_doc.to_dict()})

# RBAC Management
@app.route("/rbac/roles", methods=["GET"])
@rbac_required("rbac_roles", "read")
def get_rbac_roles():
    roles_ref = db.collection(CONFIG["RBAC_ROLES_COLLECTION"])
    roles = [doc.to_dict() for doc in roles_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "rbac_roles", "all")
    return jsonify(roles)

@app.route("/rbac/roles", methods=["POST"])
@rbac_required("rbac_roles", "write")
def create_rbac_role():
    data = request.get_json()
    if not data or "role_name" not in data or "permissions" not in data:
        abort(400, description="Missing role_name or permissions.")
    data = add_firestore_metadata(data)
    _, doc_ref = db.collection(CONFIG["RBAC_ROLES_COLLECTION"]).add(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "rbac_roles", doc_ref.id, data)
    return jsonify({"id": doc_ref.id, **data}), 201

@app.route("/rbac/roles/<string:role_id>", methods=["GET"])
@rbac_required("rbac_roles", "read")
def get_rbac_role_by_id(role_id):
    role_doc = db.collection(CONFIG["RBAC_ROLES_COLLECTION"]).document(role_id).get()
    if not role_doc.exists:
        abort(404, description="RBAC Role not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "rbac_roles", role_id)
    return jsonify({"id": role_doc.id, **role_doc.to_dict()})

@app.route("/rbac/roles/<string:role_id>", methods=["PUT"])
@rbac_required("rbac_roles", "write")
def update_rbac_role_by_id(role_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")
    role_ref = db.collection(CONFIG["RBAC_ROLES_COLLECTION"]).document(role_id)
    if not role_ref.get().exists:
        abort(404, description="RBAC Role not found.")
    data = update_firestore_metadata(data)
    role_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "rbac_roles", role_id, data)
    return jsonify({"id": role_id, **data})

@app.route("/rbac/roles/<string:role_id>", methods=["DELETE"])
@rbac_required("rbac_roles", "delete")
def delete_rbac_role_by_id(role_id):
    role_ref = db.collection(CONFIG["RBAC_ROLES_COLLECTION"]).document(role_id)
    if not role_ref.get().exists:
        abort(404, description="RBAC Role not found.")
    role_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "rbac_roles", role_id)
    return "", 204

@app.route("/rbac/users", methods=["GET"])
@rbac_required("rbac_users", "read")
def get_rbac_users():
    users_ref = db.collection(CONFIG["RBAC_USERS_COLLECTION"])
    users = [doc.to_dict() for doc in users_ref.stream()]
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "rbac_users", "all")
    return jsonify(users)

@app.route("/rbac/users", methods=["POST"])
@rbac_required("rbac_users", "write")
def create_rbac_user():
    data = request.get_json()
    if not data or "user_id" not in data or "roles" not in data:
        abort(400, description="Missing user_id or roles.")
    data = add_firestore_metadata(data)
    _, doc_ref = db.collection(CONFIG["RBAC_USERS_COLLECTION"]).add(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "create", "rbac_users", doc_ref.id, data)
    return jsonify({"id": doc_ref.id, **data}), 201

@app.route("/rbac/users/<string:user_id>", methods=["GET"])
@rbac_required("rbac_users", "read")
def get_rbac_user_by_id(user_id):
    user_doc = db.collection(CONFIG["RBAC_USERS_COLLECTION"]).document(user_id).get()
    if not user_doc.exists:
        abort(404, description="RBAC User not found.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "read", "rbac_users", user_id)
    return jsonify({"id": user_doc.id, **user_doc.to_dict()})

@app.route("/rbac/users/<string:user_id>", methods=["PUT"])
@rbac_required("rbac_users", "write")
def update_rbac_user_by_id(user_id):
    data = request.get_json()
    if not data:
        abort(400, description="No data provided for update.")
    user_ref = db.collection(CONFIG["RBAC_USERS_COLLECTION"]).document(user_id)
    if not user_ref.get().exists:
        abort(404, description="RBAC User not found.")
    data = update_firestore_metadata(data)
    user_ref.update(data)
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "update", "rbac_users", user_id, data)
    return jsonify({"id": user_id, **data})

@app.route("/rbac/users/<string:user_id>", methods=["DELETE"])
@rbac_required("rbac_users", "delete")
def delete_rbac_user_by_id(user_id):
    user_ref = db.collection(CONFIG["RBAC_USERS_COLLECTION"]).document(user_id)
    if not user_ref.get().exists:
        abort(404, description="RBAC User not found.")
    user_ref.delete()
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "delete", "rbac_users", user_id)
    return "", 204

# GitHub Webhook for CI Status updates
@app.route("/github-webhook", methods=["POST"])
def github_webhook():
    signature = request.headers.get("X-Hub-Signature-256")
    if not signature:
        abort(400, description="X-Hub-Signature-256 header missing.")

    payload_body = request.get_data()
    secret = CONFIG["GITHUB_WEBHOOK_SECRET"].encode("utf-8")

    # Verify webhook signature
    try:
        mac = hmac.new(secret, payload_body, hashlib.sha256)
        expected_signature = "sha256=" + mac.hexdigest()
        if not hmac.compare_digest(expected_signature, signature):
            abort(403, description="Invalid GitHub webhook signature.")
    except Exception as e:
        app.logger.error(f"Error verifying GitHub webhook signature: {e}")
        abort(500, description="Error verifying webhook signature.")

    event = request.headers.get("X-GitHub-Event", "unknown")
    payload = request.get_json()

    if event == "workflow_run":
        action = payload.get("action")
        workflow_run = payload.get("workflow_run", {})

        workflow_name = workflow_run.get("name")
        repository_full_name = payload.get("repository", {}).get("full_name")
        run_id = str(workflow_run.get("id"))
        status = workflow_run.get("status") # can be "queued", "in_progress", "completed"
        conclusion = workflow_run.get("conclusion") # "success", "failure", "cancelled", etc.
        html_url = workflow_run.get("html_url")

        if action == "completed":
            final_status = conclusion if conclusion else status
        else:
            final_status = status

        if workflow_name and repository_full_name and run_id:
            # Find existing CI status or create a new one
            ci_status_ref = db.collection(CONFIG["CI_STATUS_COLLECTION"])
            query = ci_status_ref.where("workflow_name", "==", workflow_name).where("repository", "==", repository_full_name).limit(1)
            docs = list(query.stream())

            ci_data = {
                "workflow_name": workflow_name,
                "repository": repository_full_name,
                "last_run_id": run_id,
                "last_run_status": final_status,
                "last_run_url": html_url,
            }

            if docs:
                doc_id = docs[0].id
                ci_data = update_firestore_metadata(ci_data, provenance="github_webhook")
                ci_status_ref.document(doc_id).update(ci_data)
                log_audit_event("github_webhook", "update", "ci_status", doc_id, ci_data)
            else:
                ci_data = add_firestore_metadata(ci_data)
                _, doc_ref = ci_status_ref.add(ci_data)
                log_audit_event("github_webhook", "create", "ci_status", doc_ref.id, ci_data)

            app.logger.info(f"CI Status updated for {workflow_name} in {repository_full_name}: {final_status}")
            return jsonify({"status": "success", "message": "CI status updated."}), 200

    return jsonify({"status": "ignored", "message": "Event not handled or missing data."}), 200

# Mirror Reality Validation (Placeholder - actual logic would be complex)
@app.route("/mirror-reality-validation", methods=["POST"])
@rbac_required("mirror_reality_validation", "trigger")
def trigger_mirror_reality_validation():
    # In a real scenario, this would trigger a background process
    # to compare system state with external data sources.
    app.logger.info("Mirror reality validation triggered.")
    log_audit_event(request.headers.get("X-User-ID", "anonymous"), "trigger", "mirror_reality_validation", "system")
    return jsonify({"status": "accepted", "message": "Mirror reality validation initiated."}), 202


if __name__ == "__main__":
    # For local development, use Flask\'s built-in server
    # In production, Gunicorn or similar WSGI server should be used
    app.run(debug=True, host="0.0.0.0", port=8080)
