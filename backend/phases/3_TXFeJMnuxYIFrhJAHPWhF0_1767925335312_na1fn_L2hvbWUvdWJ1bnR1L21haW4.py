
import datetime
import json
import logging
import os
import uuid
from functools import wraps

import jwt
from flask import Flask, jsonify, request
from google.cloud import firestore

# Initialize Flask App
app = Flask(__name__)

# Initialize Firestore DB
db = firestore.Client()

# Configure logging
logging.basicConfig(level=logging.INFO, format=
    '%(asctime)s - %(levelname)s - %(message)s')

# Constants for Firestore Collections
PORTFOLIOS_COLLECTION = 'x1_portfolios'
TRADE_HISTORY_SUBCOLLECTION = 'x1_trade_history'
LEADERBOARD_COLLECTION = 'x1_leaderboard'
DAILY_PICKS_COLLECTION = 'x1_daily_picks'

# Secret key for JWT (should be loaded from environment variables in production)
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')

# --- RBAC and Security Hardening ---

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]

        if not token:
            logging.warning('Authentication attempt without token.')
            return jsonify({'code': 'UNAUTHORIZED', 'message': 'Authentication Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user = data # Attach user info to request object
        except jwt.ExpiredSignatureError:
            logging.warning('Authentication attempt with expired token.')
            return jsonify({'code': 'UNAUTHORIZED', 'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            logging.warning('Authentication attempt with invalid token.')
            return jsonify({'code': 'UNAUTHORIZED', 'message': 'Token is invalid!'}), 401
        except Exception as e:
            logging.error(f'JWT decoding error: {e}')
            return jsonify({'code': 'UNAUTHORIZED', 'message': 'Token processing error!'}), 401

        return f(*args, **kwargs)
    return decorated

def roles_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(request, 'user') or 'roles' not in request.user:
                logging.warning(f'Authorization failed: User roles not found for endpoint {request.path}')
                return jsonify({'code': 'FORBIDDEN', 'message': 'User roles not found.'}), 403

            user_roles = request.user['roles']
            if not any(role in user_roles for role in roles):
                logging.warning(f'Authorization failed: User {request.user.get("user_id", "unknown")} lacks required roles {roles} for endpoint {request.path}')
                return jsonify({'code': 'FORBIDDEN', 'message': 'Insufficient permissions.'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Helper function to add common Firestore fields
def add_common_firestore_fields(data, schema_version=1, provenance='system'):
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    data['schema_version'] = schema_version
    data['created_at'] = now
    data['updated_at'] = now
    data['provenance'] = provenance
    return data

# Helper function to update common Firestore fields
def update_common_firestore_fields(data):
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    data['updated_at'] = now
    return data

# --- Portfolio Management Endpoints ---

@app.route('/portfolios', methods=['POST'])
@token_required
@roles_required(['portfolio_manager'])
def create_portfolio():
    try:
        data = request.get_json()
        user_id = request.user.get('user_id') # Get user_id from authenticated token
        portfolio_name = data.get('portfolio_name')
        cash_balance = data.get('cash_balance', 0.0)

        if not user_id or not portfolio_name:
            logging.error(f'BAD_REQUEST: Missing user_id or portfolio_name in create_portfolio for user {user_id}')
            return jsonify({'code': 'BAD_REQUEST', 'message': 'User ID and portfolio name are required'}), 400

        portfolio_id = str(uuid.uuid4())
        portfolio_data = {
            'user_id': user_id,
            'portfolio_name': portfolio_name,
            'cash_balance': float(cash_balance),
            'holdings': {},
            'performance_metrics': {'accuracy': 0.0, 'profit': 0.0, 'combined_score': 0.0},
            'trade_history_ref': f'{PORTFOLIOS_COLLECTION}/{portfolio_id}/{TRADE_HISTORY_SUBCOLLECTION}'
        }
        portfolio_data = add_common_firestore_fields(portfolio_data, provenance='user_input')

        db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id).set(portfolio_data)
        logging.info(f'Portfolio {portfolio_id} created for user {user_id}')
        return jsonify({'id': portfolio_id, **portfolio_data}), 201
    except Exception as e:
        logging.error(f'Error creating portfolio for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

@app.route('/portfolios/<string:portfolio_id>', methods=['GET'])
@token_required
@roles_required(['portfolio_viewer', 'portfolio_manager'])
def get_portfolio(portfolio_id):
    try:
        portfolio_ref = db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id)
        portfolio = portfolio_ref.get()

        if not portfolio.exists:
            logging.warning(f'NOT_FOUND: Portfolio {portfolio_id} not found for user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'NOT_FOUND', 'message': 'Portfolio not found'}), 404

        # Ensure user can only access their own portfolios
        if portfolio.to_dict().get('user_id') != request.user.get('user_id') and 'portfolio_manager' not in request.user.get('roles', []):
            logging.warning(f'FORBIDDEN: User {request.user.get("user_id", "unknown")} attempted to access unauthorized portfolio {portfolio_id}')
            return jsonify({'code': 'FORBIDDEN', 'message': 'Access to this portfolio is forbidden.'}), 403

        return jsonify({'id': portfolio.id, **portfolio.to_dict()}), 200
    except Exception as e:
        logging.error(f'Error getting portfolio {portfolio_id} for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

@app.route('/portfolios/<string:portfolio_id>', methods=['PUT'])
@token_required
@roles_required(['portfolio_manager'])
def update_portfolio(portfolio_id):
    try:
        data = request.get_json()
        portfolio_ref = db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id)
        portfolio = portfolio_ref.get()

        if not portfolio.exists:
            logging.warning(f'NOT_FOUND: Portfolio {portfolio_id} not found for user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'NOT_FOUND', 'message': 'Portfolio not found'}), 404

        # Ensure user can only update their own portfolios
        if portfolio.to_dict().get('user_id') != request.user.get('user_id'):
            logging.warning(f'FORBIDDEN: User {request.user.get("user_id", "unknown")} attempted to update unauthorized portfolio {portfolio_id}')
            return jsonify({'code': 'FORBIDDEN', 'message': 'Access to this portfolio is forbidden.'}), 403

        update_data = {}
        if 'portfolio_name' in data:
            update_data['portfolio_name'] = data['portfolio_name']
        if 'cash_balance' in data:
            update_data['cash_balance'] = float(data['cash_balance'])

        if not update_data:
            logging.warning(f'BAD_REQUEST: No fields to update for portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'BAD_REQUEST', 'message': 'No fields to update'}), 400

        update_data = update_common_firestore_fields(update_data)
        portfolio_ref.update(update_data)
        logging.info(f'Portfolio {portfolio_id} updated by user {request.user.get("user_id", "unknown")}.')
        updated_portfolio = portfolio_ref.get().to_dict()
        return jsonify({'id': portfolio_id, **updated_portfolio}), 200
    except Exception as e:
        logging.error(f'Error updating portfolio {portfolio_id} for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

@app.route('/portfolios/<string:portfolio_id>', methods=['DELETE'])
@token_required
@roles_required(['portfolio_manager'])
def delete_portfolio(portfolio_id):
    try:
        portfolio_ref = db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id)
        portfolio = portfolio_ref.get()

        if not portfolio.exists:
            logging.warning(f'NOT_FOUND: Portfolio {portfolio_id} not found for user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'NOT_FOUND', 'message': 'Portfolio not found'}), 404

        # Ensure user can only delete their own portfolios
        if portfolio.to_dict().get('user_id') != request.user.get('user_id'):
            logging.warning(f'FORBIDDEN: User {request.user.get("user_id", "unknown")} attempted to delete unauthorized portfolio {portfolio_id}')
            return jsonify({'code': 'FORBIDDEN', 'message': 'Access to this portfolio is forbidden.'}), 403

        portfolio_ref.delete()
        logging.info(f'Portfolio {portfolio_id} deleted by user {request.user.get("user_id", "unknown")}.')
        return '', 204
    except Exception as e:
        logging.error(f'Error deleting portfolio {portfolio_id} for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

# --- Trade Management Endpoints ---

@app.route('/portfolios/<string:portfolio_id>/trades', methods=['POST'])
@token_required
@roles_required(['portfolio_manager'])
def place_trade(portfolio_id):
    try:
        data = request.get_json()
        symbol = data.get('symbol')
        trade_type = data.get('trade_type')
        quantity = data.get('quantity')
        price = data.get('price')
        confidence_score = data.get('confidence_score')
        gated_by_high_confidence = data.get('gated_by_high_confidence', False)

        if not all([symbol, trade_type, quantity, price]):
            logging.error(f'BAD_REQUEST: Missing trade parameters for portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'BAD_REQUEST', 'message': 'Symbol, trade_type, quantity, and price are required'}), 400

        portfolio_ref = db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id)
        portfolio = portfolio_ref.get()

        if not portfolio.exists:
            logging.warning(f'NOT_FOUND: Portfolio {portfolio_id} not found for user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'NOT_FOUND', 'message': 'Portfolio not found'}), 404

        # Ensure user can only place trades in their own portfolios
        if portfolio.to_dict().get('user_id') != request.user.get('user_id'):
            logging.warning(f'FORBIDDEN: User {request.user.get("user_id", "unknown")} attempted to place trade in unauthorized portfolio {portfolio_id}')
            return jsonify({'code': 'FORBIDDEN', 'message': 'Access to this portfolio is forbidden.'}), 403

        portfolio_data = portfolio.to_dict()
        current_cash = portfolio_data.get('cash_balance', 0.0)
        holdings = portfolio_data.get('holdings', {})

        trade_amount = quantity * price

        if trade_type == 'BUY':
            if current_cash < trade_amount:
                logging.warning(f'BAD_REQUEST: Insufficient cash for BUY trade in portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}')
                return jsonify({'code': 'BAD_REQUEST', 'message': 'Insufficient cash balance'}), 400
            portfolio_data['cash_balance'] -= trade_amount
            if symbol in holdings:
                current_quantity = holdings[symbol]['quantity']
                current_avg_price = holdings[symbol]['average_price']
                new_quantity = current_quantity + quantity
                new_avg_price = ((current_quantity * current_avg_price) + trade_amount) / new_quantity
                holdings[symbol] = {'quantity': new_quantity, 'average_price': new_avg_price}
            else:
                holdings[symbol] = {'quantity': quantity, 'average_price': price}
        elif trade_type == 'SELL':
            if symbol not in holdings or holdings[symbol]['quantity'] < quantity:
                logging.warning(f'BAD_REQUEST: Insufficient shares for SELL trade in portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}')
                return jsonify({'code': 'BAD_REQUEST', 'message': 'Insufficient shares to sell'}), 400
            portfolio_data['cash_balance'] += trade_amount
            holdings[symbol]['quantity'] -= quantity
            if holdings[symbol]['quantity'] == 0:
                del holdings[symbol]
        else:
            logging.warning(f'BAD_REQUEST: Invalid trade_type {trade_type} for portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'BAD_REQUEST', 'message': 'Invalid trade_type. Must be BUY or SELL.'}), 400

        portfolio_data['holdings'] = holdings
        portfolio_data = update_common_firestore_fields(portfolio_data)
        portfolio_ref.update(portfolio_data)

        trade_id = str(uuid.uuid4())
        trade_history_data = {
            'symbol': symbol,
            'trade_type': trade_type,
            'quantity': quantity,
            'price': price,
            'trade_timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
            'status': 'EXECUTED',
            'confidence_score': confidence_score,
            'gated_by_high_confidence': gated_by_high_confidence
        }
        trade_history_data = add_common_firestore_fields(trade_history_data, provenance='user_input')

        db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id).collection(TRADE_HISTORY_SUBCOLLECTION).document(trade_id).set(trade_history_data)
        logging.info(f'Trade {trade_id} placed for portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}.')

        # TODO: Update leaderboard scores asynchronously (e.g., via Pub/Sub trigger)

        return jsonify({'id': trade_id, **trade_history_data}), 201
    except Exception as e:
        logging.error(f'Error placing trade for portfolio {portfolio_id} by user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

@app.route('/portfolios/<string:portfolio_id>/trades', methods=['GET'])
@token_required
@roles_required(['portfolio_viewer', 'portfolio_manager'])
def get_trade_history(portfolio_id):
    try:
        portfolio_ref = db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id)
        portfolio = portfolio_ref.get()

        if not portfolio.exists:
            logging.warning(f'NOT_FOUND: Portfolio {portfolio_id} not found for user {request.user.get("user_id", "unknown")}')
            return jsonify({'code': 'NOT_FOUND', 'message': 'Portfolio not found'}), 404

        # Ensure user can only access trade history for their own portfolios
        if portfolio.to_dict().get('user_id') != request.user.get('user_id') and 'portfolio_manager' not in request.user.get('roles', []):
            logging.warning(f'FORBIDDEN: User {request.user.get("user_id", "unknown")} attempted to access unauthorized trade history for portfolio {portfolio_id}')
            return jsonify({'code': 'FORBIDDEN', 'message': 'Access to this portfolio\'s trade history is forbidden.'}), 403

        trades_ref = portfolio_ref.collection(TRADE_HISTORY_SUBCOLLECTION).order_by('trade_timestamp', direction=firestore.Query.DESCENDING).stream()
        trade_history = []
        for trade in trades_ref:
            trade_history.append({'id': trade.id, **trade.to_dict()})

        return jsonify(trade_history), 200
    except Exception as e:
        logging.error(f'Error getting trade history for portfolio {portfolio_id} for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

# --- Leaderboard Endpoints ---

@app.route('/leaderboard', methods=['GET'])
@token_required
@roles_required(['leaderboard_viewer'])
def get_leaderboard():
    try:
        leaderboard_ref = db.collection(LEADERBOARD_COLLECTION).order_by('combined_score', direction=firestore.Query.DESCENDING).stream()
        leaderboard = []
        for entry in leaderboard_ref:
            leaderboard.append({'id': entry.id, **entry.to_dict()})
        logging.info(f'Leaderboard accessed by user {request.user.get("user_id", "unknown")}.')
        return jsonify(leaderboard), 200
    except Exception as e:
        logging.error(f'Error getting leaderboard for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

# --- Daily Picks Endpoints ---

@app.route('/daily-picks', methods=['GET'])
@token_required
@roles_required(['daily_picks_viewer'])
def get_daily_picks():
    try:
        # For simplicity, let's just get picks for today. In a real scenario, this might involve a date parameter.
        today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + datetime.timedelta(days=1)

        picks_ref = db.collection(DAILY_PICKS_COLLECTION)
        # Firestore timestamp comparison needs to be careful with string formats. It's better to store as Firestore Timestamps.
        # For now, assuming ISO format strings are comparable, but this should be improved.
        query = picks_ref.where('pick_date', '>=', today_start.isoformat() + 'Z').where('pick_date', '<', today_end.isoformat() + 'Z').stream()

        daily_picks = []
        for pick in query:
            daily_picks.append({'id': pick.id, **pick.to_dict()})
        logging.info(f'Daily picks accessed by user {request.user.get("user_id", "unknown")}.')
        return jsonify(daily_picks), 200
    except Exception as e:
        logging.error(f'Error getting daily picks for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

# --- Evidence Pack Generation ---

@app.route('/evidence-pack', methods=['POST'])
@token_required
@roles_required(['admin', 'auditor'])
def generate_evidence_pack():
    try:
        pack_id = str(uuid.uuid4())
        evidence_data = {
            'pack_id': pack_id,
            'generated_at': datetime.datetime.utcnow().isoformat() + 'Z',
            'generated_by_user': request.user.get('user_id', 'unknown'),
            'collections_data': {}
        }

        # Collect data from all relevant collections
        collections_to_collect = [
            PORTFOLIOS_COLLECTION,
            LEADERBOARD_COLLECTION,
            DAILY_PICKS_COLLECTION
        ]

        for collection_name in collections_to_collect:
            docs = []
            for doc in db.collection(collection_name).stream():
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                # Handle nested sub-collections like trade history
                if collection_name == PORTFOLIOS_COLLECTION:
                    portfolio_id = doc.id
                    trades = []
                    trade_history_ref = db.collection(PORTFOLIOS_COLLECTION).document(portfolio_id).collection(TRADE_HISTORY_SUBCOLLECTION).stream()
                    for trade_doc in trade_history_ref:
                        trade_data = trade_doc.to_dict()
                        trade_data['id'] = trade_doc.id
                        trades.append(trade_data)
                    doc_data[TRADE_HISTORY_SUBCOLLECTION] = trades
                docs.append(doc_data)
            evidence_data['collections_data'][collection_name] = docs

        # Define a directory for evidence packs (e.g., 'evidence_packs')
        evidence_dir = 'evidence_packs'
        os.makedirs(evidence_dir, exist_ok=True)
        file_path = os.path.join(evidence_dir, f'evidence_pack_{pack_id}.json')

        with open(file_path, 'w') as f:
            json.dump(evidence_data, f, indent=4)

        logging.info(f'Evidence pack {pack_id} generated by user {request.user.get("user_id", "unknown")} and saved to {file_path}.')
        # In a real GCP environment, this would be uploaded to Cloud Storage
        return jsonify({
            'code': 'SUCCESS',
            'message': 'Evidence pack generated successfully',
            'pack_id': pack_id,
            'file_path': file_path # In production, this would be a Cloud Storage URL
        }), 200
    except Exception as e:
        logging.error(f'Error generating evidence pack for user {request.user.get("user_id", "unknown")}: {e}')
        return jsonify({'code': 'INTERNAL_SERVER_ERROR', 'message': str(e)}), 500

# Example of how to run the Flask app locally for testing
if __name__ == '__main__':
    # Set environment variable for Google Cloud credentials if running locally
    # os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/path/to/your/service-account-key.json'
    # For local testing, you can generate a simple JWT token with a tool like jwt.io
    # Example payload: {'user_id': 'test_user', 'roles': ['portfolio_manager', 'leaderboard_viewer', 'daily_picks_viewer', 'admin', 'auditor']}
    # Use 'super-secret-key' as the secret for signing.
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
