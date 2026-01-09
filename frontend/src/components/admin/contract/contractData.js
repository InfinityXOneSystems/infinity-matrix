
export const DATA_MODELS = [
  {
    id: 'User',
    description: 'Core identity entity',
    fields: [
      { name: 'id', type: 'uuid', required: true, desc: 'Primary Key' },
      { name: 'email', type: 'string', required: true, desc: 'Unique email address' },
      { name: 'role', type: 'enum', required: true, desc: 'admin | user | investor' },
      { name: 'created_at', type: 'datetime', required: true, desc: 'ISO 8601' }
    ]
  },
  {
    id: 'Agent',
    description: 'Autonomous neural agent configuration',
    fields: [
      { name: 'id', type: 'uuid', required: true, desc: 'Primary Key' },
      { name: 'owner_id', type: 'uuid', required: true, desc: 'FK -> User.id' },
      { name: 'name', type: 'string', required: true, desc: 'Display name' },
      { name: 'model', type: 'string', required: true, desc: 'LLM Model ID' },
      { name: 'capabilities', type: 'array<string>', required: false, desc: 'List of allowed tools' }
    ]
  },
  {
    id: 'Workflow',
    description: 'Orchestrated sequence of tasks',
    fields: [
      { name: 'id', type: 'uuid', required: true, desc: 'Primary Key' },
      { name: 'steps', type: 'json', required: true, desc: 'DAG definition of steps' },
      { name: 'status', type: 'enum', required: true, desc: 'active | paused | draft' },
      { name: 'trigger', type: 'string', required: true, desc: 'Event that starts flow' }
    ]
  },
  {
    id: 'Prediction',
    description: 'AI-generated market forecast',
    fields: [
      { name: 'id', type: 'uuid', required: true, desc: 'Primary Key' },
      { name: 'asset', type: 'string', required: true, desc: 'Symbol (BTC, ETH)' },
      { name: 'target_price', type: 'float', required: true, desc: 'Predicted value' },
      { name: 'confidence', type: 'float', required: true, desc: '0.0 - 1.0' },
      { name: 'horizon', type: 'string', required: true, desc: '1h, 24h, 7d' }
    ]
  }
];

export const ERROR_CODES = [
  { code: 'AUTH_INVALID_TOKEN', status: 401, message: 'The access token provided is expired, revoked, or malformed.' },
  { code: 'RATE_LIMIT_EXCEEDED', status: 429, message: 'You have exceeded the allowed requests for your tier.' },
  { code: 'RESOURCE_NOT_FOUND', status: 404, message: 'The requested entity ID does not exist.' },
  { code: 'VALIDATION_ERROR', status: 400, message: 'Request body failed schema validation.' },
  { code: 'INTERNAL_ERROR', status: 500, message: 'An unexpected system error occurred.' },
  { code: 'INSUFFICIENT_FUNDS', status: 402, message: 'Wallet balance is too low for this operation.' }
];

export const WEBHOOK_EVENTS = [
  { event: 'agent.completed', desc: 'Triggered when an agent finishes a task.' },
  { event: 'market.alert', desc: 'Triggered when a price target is hit.' },
  { event: 'system.maintenance', desc: 'Triggered 1 hour before scheduled downtime.' },
  { event: 'workflow.failed', desc: 'Triggered when a workflow step errors out.' }
];

export const WEBSOCKET_MESSAGES = [
  { type: 'subscribe', dir: 'Client -> Server', desc: 'Subscribe to a realtime channel.' },
  { type: 'ticker', dir: 'Server -> Client', desc: 'Realtime price update.' },
  { type: 'log', dir: 'Server -> Client', desc: 'Streamed log line from agent.' },
  { type: 'heartbeat', dir: 'Bidirectional', desc: 'Keep-alive ping/pong.' }
];

// React Flow Elements for ERD
export const ERD_NODES = [
  { id: 'User', type: 'input', data: { label: 'User' }, position: { x: 250, y: 0 }, style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', width: 150 } },
  { id: 'Agent', data: { label: 'Agent' }, position: { x: 100, y: 150 }, style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', width: 150 } },
  { id: 'Workflow', data: { label: 'Workflow' }, position: { x: 400, y: 150 }, style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', width: 150 } },
  { id: 'Log', data: { label: 'Audit Log' }, position: { x: 250, y: 300 }, style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', width: 150 } },
  { id: 'Key', data: { label: 'API Key' }, position: { x: 500, y: 50 }, style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', width: 150 } }
];

export const ERD_EDGES = [
  { id: 'e1-2', source: 'User', target: 'Agent', label: 'owns', animated: true, style: { stroke: '#0066FF' } },
  { id: 'e1-3', source: 'User', target: 'Workflow', label: 'creates', animated: true, style: { stroke: '#0066FF' } },
  { id: 'e2-4', source: 'Agent', target: 'Log', label: 'generates', style: { stroke: '#39FF14' } },
  { id: 'e3-4', source: 'Workflow', target: 'Log', label: 'logs to', style: { stroke: '#39FF14' } },
  { id: 'e1-5', source: 'User', target: 'Key', label: 'has', style: { stroke: '#0066FF' } }
];

// React Flow Elements for Auth Flow
export const AUTH_NODES = [
  { id: 'Client', type: 'input', data: { label: 'Client App' }, position: { x: 0, y: 50 }, style: { background: '#0066FF', color: '#fff', border: 'none' } },
  { id: 'Gateway', data: { label: 'API Gateway' }, position: { x: 200, y: 50 }, style: { background: '#333', color: '#fff', border: '1px solid #555' } },
  { id: 'Auth', data: { label: 'Auth Service' }, position: { x: 200, y: 200 }, style: { background: '#333', color: '#fff', border: '1px solid #555' } },
  { id: 'Service', data: { label: 'Core Service' }, position: { x: 400, y: 50 }, style: { background: '#39FF14', color: '#000', border: 'none' } },
  { id: 'DB', type: 'output', data: { label: 'Database' }, position: { x: 600, y: 50 }, style: { background: '#333', color: '#fff', border: '1px solid #555' } }
];

export const AUTH_EDGES = [
  { id: 'a1', source: 'Client', target: 'Gateway', label: 'Request + JWT', animated: true, style: { stroke: '#fff' } },
  { id: 'a2', source: 'Gateway', target: 'Auth', label: 'Validate', style: { stroke: '#aaa' }, type: 'step' },
  { id: 'a3', source: 'Auth', target: 'Gateway', label: 'OK/401', style: { stroke: '#aaa' }, type: 'step' },
  { id: 'a4', source: 'Gateway', target: 'Service', label: 'Proxy', animated: true, style: { stroke: '#39FF14' } },
  { id: 'a5', source: 'Service', target: 'DB', label: 'Query', style: { stroke: '#39FF14' } }
];
