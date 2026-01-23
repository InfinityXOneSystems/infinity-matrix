
from flask import Flask, request, jsonify
from datetime import datetime
import uuid
import logging

logging.basicConfig(level=logging.INFO, format=\'%(asctime)s - %(levelname)s - %(message)s\')
import firebase_admin
from firebase_admin import credentials, firestore
from functools import wraps

# --- RBAC and Security Hardening ---
def requires_role(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
           # In a production environment, this would integrate with an authentication system (e.g., Firebase Authentication, Google Identity Platform).
            # User roles would be extracted from a validated JWT or session token.
            # For this example, we simulate roles being passed in the 'X-User-Roles' header for demonstration purposes.
            user_roles = request.headers.get("X-User-Roles", "").split(",")
            if role not in user_roles and "admin" not in user_roles:
                return jsonify({"error": "Unauthorized: Insufficient permissions"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.after_request
def add_security_headers(response):
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src \'self\'; script-src \'self\'; object-src \'none\'; style-src \'self\'; img-src \'self\'; media-src \'self\'; frame-ancestors \'none\';"
    return response

# --- End RBAC and Security Hardening ---

app = Flask(__name__)

# Initialize Firebase Admin SDK
# In a production environment, use a service account key file
# For local development, you might need to set GOOGLE_APPLICATION_CREDENTIALS
# environment variable or provide the path to the service account key.
# For this example, we'll assume it's set up for the environment.

try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def _add_firestore_metadata(data):
    data["schema_version"] = "1.0.0"
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    data["provenance"] = {"source": "api", "user_id": "anonymous"} # Placeholder
    return data

def _update_firestore_metadata(data):
    data["updated_at"] = datetime.utcnow()
    return data

def _generate_evidence_pack(doc_type, doc):
    # For simplicity, an evidence pack is the document itself for now.
    # In a real-world scenario, this would involve more complex data aggregation,
    # formatting, and potentially inclusion of external data or audit trails.
    # Convert datetime objects to ISO format strings for JSON serialization
    processed_doc = {k: v.isoformat() if isinstance(v, datetime) else v for k, v in doc.items()}
    return {
        "evidence_pack_type": doc_type,
        "generated_at": datetime.utcnow().isoformat(),
        "data": processed_doc
    }

# Problem Solver Endpoints
@app.route("/problems", methods=["POST"])
@requires_role("problem_creator")
def create_problem():
    data = request.json
    problem_id = str(uuid.uuid4())
    problem = {"problem_id": problem_id, **data}
    problem = _add_firestore_metadata(problem)
    
    try:
        db.collection("problems").document(problem_id).set(problem)
        return jsonify(problem), 201
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/problems", methods=["GET"])
@requires_role("problem_viewer")
def get_problems():
    try:
        problems = [doc.to_dict() for doc in db.collection("problems").stream()]
        return jsonify(problems)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/problems/<problem_id>", methods=["GET"])
@requires_role("problem_viewer")
def get_problem(problem_id):
    try:
        problem_ref = db.collection("problems").document(problem_id)
        problem = problem_ref.get()
        if not problem.exists:
            return jsonify({"error": "Problem not found"}), 404
        return jsonify(problem.to_dict())
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/problems/<problem_id>/evidence_pack", methods=["GET"])
@requires_role("problem_viewer")
def get_problem_evidence_pack(problem_id):
    try:
        problem_ref = db.collection("problems").document(problem_id)
        problem = problem_ref.get()
        if not problem.exists:
            return jsonify({"error": "Problem not found"}), 404
        return jsonify(_generate_evidence_pack("problem", problem.to_dict()))
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/problems/<problem_id>", methods=["PUT"])
@requires_role("problem_editor")
def update_problem(problem_id):
    data = request.json
    problem_ref = db.collection("problems").document(problem_id)
    problem = problem_ref.get()
    if not problem.exists:
        return jsonify({"error": "Problem not found"}), 404
    
    updated_problem = problem.to_dict()
    updated_problem.update(data)
    updated_problem = _update_firestore_metadata(updated_problem)
    
    try:
        problem_ref.set(updated_problem)
        return jsonify(updated_problem)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Simulation Endpoints
@app.route("/simulations", methods=["POST"])
@requires_role("simulation_creator")
def create_simulation():
    data = request.json
    simulation_id = str(uuid.uuid4())
    simulation = {"simulation_id": simulation_id, **data}
    simulation = _add_firestore_metadata(simulation)
    
    try:
        db.collection("simulations").document(simulation_id).set(simulation)
        return jsonify(simulation), 201
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/simulations", methods=["GET"])
@requires_role("simulation_viewer")
def get_simulations():
    try:
        simulations = [doc.to_dict() for doc in db.collection("simulations").stream()]
        return jsonify(simulations)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/simulations/<simulation_id>", methods=["GET"])
@requires_role("simulation_viewer")
def get_simulation(simulation_id):
    try:
        simulation_ref = db.collection("simulations").document(simulation_id)
        simulation = simulation_ref.get()
        if not simulation.exists:
            return jsonify({"error": "Simulation not found"}), 404
        return jsonify(simulation.to_dict())
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/simulations/<simulation_id>/evidence_pack", methods=["GET"])
@requires_role("simulation_viewer")
def get_simulation_evidence_pack(simulation_id):
    try:
        simulation_ref = db.collection("simulations").document(simulation_id)
        simulation = simulation_ref.get()
        if not simulation.exists:
            return jsonify({"error": "Simulation not found"}), 404
        return jsonify(_generate_evidence_pack("simulation", simulation.to_dict()))
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/simulations/<simulation_id>", methods=["PUT"])
@requires_role("simulation_editor")
def update_simulation(simulation_id):
    data = request.json
    simulation_ref = db.collection("simulations").document(simulation_id)
    simulation = simulation_ref.get()
    if not simulation.exists:
        return jsonify({"error": "Simulation not found"}), 404
    
    updated_simulation = simulation.to_dict()
    updated_simulation.update(data)
    updated_simulation = _update_firestore_metadata(updated_simulation)
    
    try:
        simulation_ref.set(updated_simulation)
        return jsonify(updated_simulation)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Decision Maker Endpoints
@app.route("/decisions", methods=["POST"])
@requires_role("decision_maker")
def create_decision():
    data = request.json
    decision_id = str(uuid.uuid4())
    decision = {"decision_id": decision_id, **data}
    decision = _add_firestore_metadata(decision)
    
    try:
        db.collection("decisions").document(decision_id).set(decision)
        return jsonify(decision), 201
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/decisions", methods=["GET"])
@requires_role("decision_viewer")
def get_decisions():
    try:
        decisions = [doc.to_dict() for doc in db.collection("decisions").stream()]
        return jsonify(decisions)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/decisions/<decision_id>", methods=["GET"])
@requires_role("decision_viewer")
def get_decision(decision_id):
    try:
        decision_ref = db.collection("decisions").document(decision_id)
        decision = decision_ref.get()
        if not decision.exists:
            return jsonify({"error": "Decision not found"}), 404
        return jsonify(decision.to_dict())
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/decisions/<decision_id>/evidence_pack", methods=["GET"])
@requires_role("decision_viewer")
def get_decision_evidence_pack(decision_id):
    try:
        decision_ref = db.collection("decisions").document(decision_id)
        decision = decision_ref.get()
        if not decision.exists:
            return jsonify({"error": "Decision not found"}), 404
        return jsonify(_generate_evidence_pack("decision", decision.to_dict()))
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/decisions/<decision_id>", methods=["PUT"])
@requires_role("decision_editor")
def update_decision(decision_id):
    data = request.json
    decision_ref = db.collection("decisions").document(decision_id)
    decision = decision_ref.get()
    if not decision.exists:
        return jsonify({"error": "Decision not found"}), 404
    
    updated_decision = decision.to_dict()
    updated_decision.update(data)
    updated_decision = _update_firestore_metadata(updated_decision)
    
    try:
        decision_ref.set(updated_decision)
        return jsonify(updated_decision)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Universal Predict Endpoints
@app.route("/predictions", methods=["POST"])
@requires_role("prediction_creator")
def create_prediction():
    data = request.json
    prediction_id = str(uuid.uuid4())
    prediction = {"prediction_id": prediction_id, **data}
    prediction = _add_firestore_metadata(prediction)
    
    try:
        db.collection("predictions").document(prediction_id).set(prediction)
        return jsonify(prediction), 201
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/predictions", methods=["GET"])
@requires_role("prediction_viewer")
def get_predictions():
    try:
        predictions = [doc.to_dict() for doc in db.collection("predictions").stream()]
        return jsonify(predictions)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/predictions/<prediction_id>", methods=["GET"])
@requires_role("prediction_viewer")
def get_prediction(prediction_id):
    try:
        prediction_ref = db.collection("predictions").document(prediction_id)
        prediction = prediction_ref.get()
        if not prediction.exists:
            return jsonify({"error": "Prediction not found"}), 404
        return jsonify(prediction.to_dict())
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/predictions/<prediction_id>/evidence_pack", methods=["GET"])
@requires_role("prediction_viewer")
def get_prediction_evidence_pack(prediction_id):
    try:
        prediction_ref = db.collection("predictions").document(prediction_id)
        prediction = prediction_ref.get()
        if not prediction.exists:
            return jsonify({"error": "Prediction not found"}), 404
        return jsonify(_generate_evidence_pack("prediction", prediction.to_dict()))
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/predictions/<prediction_id>", methods=["PUT"])
@requires_role("prediction_editor")
def update_prediction(prediction_id):
    data = request.json
    prediction_ref = db.collection("predictions").document(prediction_id)
    prediction = prediction_ref.get()
    if not prediction.exists:
        return jsonify({"error": "Prediction not found"}), 404
    
    updated_prediction = prediction.to_dict()
    updated_prediction.update(data)
    updated_prediction = _update_firestore_metadata(updated_prediction)
    
    try:
        prediction_ref.set(updated_prediction)
        return jsonify(updated_prediction)
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host=\'0.0.0.0\', port=5000)
