# Monaco IDE Quick Start Guide

## Installation & Setup

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

This installs:
- `@monaco-editor/react` - Monaco Editor React wrapper
- `monaco-editor` - Core Monaco Editor
- All existing dependencies

### 2. Install Backend Dependencies
```bash
pip install fastapi uvicorn
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

### 3. Start the Backend API
```bash
python3 -m uvicorn src.gateway.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 4. Start the Frontend Dev Server
```bash
cd frontend
npm run dev
```

The frontend will be available at:
- Frontend: http://localhost:3000
- Monaco IDE: http://localhost:3000/ide

## Quick Test

### Test Backend APIs

1. **Health Check**
```bash
curl http://localhost:8000/health
```

2. **Chat API**
```bash
curl -X POST http://localhost:8000/api/v1/code/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "add a function to calculate factorial",
    "code_context": "// Start here",
    "language": "javascript"
  }'
```

Expected Response:
```json
{
  "message": "I'll add that for you. Applying changes now...",
  "code_edit": "// Start here\n\n// New code added by AI",
  "action": "edit"
}
```

3. **Orchestration API**
```bash
curl -X POST http://localhost:8000/api/v1/code/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "task_description": "Optimize this code for performance",
    "context": {"language": "javascript"},
    "target_agent_type": "autonomous"
  }'
```

Expected Response:
```json
{
  "task_id": "uuid-here",
  "status": "queued",
  "assigned_agent": "autonomous",
  "estimated_completion": "2-5 minutes"
}
```

4. **Check Task Status**
```bash
curl http://localhost:8000/api/v1/code/orchestrate/{task_id}
```

### Test Frontend

1. **Open Monaco IDE**
   - Navigate to: http://localhost:3000/ide
   - Or: http://localhost:3000/app/monaco-ide

2. **Test Chat Features**
   - Type in chat: "add a function to reverse a string"
   - Watch the code update in real-time
   - See orchestration task created in chat

3. **Test Code Editing**
   - Edit code in Monaco editor
   - Use chat to request changes
   - Click "Save" to save changes
   - Click "Run" to execute code

4. **Test Terminal**
   - Type: "run this code" in chat
   - Terminal panel opens automatically
   - See execution output

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

Create a `.env` file in the root directory for backend:
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Database (if needed)
DATABASE_URL=postgresql://user:password@localhost/infinity_matrix
```

## Common Commands

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
# Start with hot reload
uvicorn src.gateway.main:app --reload

# Start in production mode
uvicorn src.gateway.main:app --host 0.0.0.0 --port 8000

# Run with workers
uvicorn src.gateway.main:app --workers 4
```

## Accessing the Features

### Monaco Editor
- **URL**: `/ide` or `/app/monaco-ide`
- **Features**: 
  - Code editing with syntax highlighting
  - Minimap navigation
  - Multi-cursor editing
  - IntelliSense

### Chat Assistant
- **Location**: Right panel in IDE
- **Usage**: 
  - Type commands like "add function", "refactor", "debug"
  - AI responds and modifies code
  - See orchestration tasks created

### Terminal
- **Location**: Bottom panel (appears on "run")
- **Usage**:
  - Shows code execution output
  - Displays orchestration results
  - Can be toggled on/off

### Orchestration
- **Automatic**: Created for complex tasks
- **Manual**: Use API directly
- **Monitoring**: Check task status via API or chat

## Example Workflows

### 1. Add a New Function
```
User (in chat): "add a function to calculate the Fibonacci sequence"
AI: Analyzes request → Generates code → Updates editor → Creates orchestration task
Result: New function appears in editor with explanation
```

### 2. Refactor Code
```
User: "refactor this to use arrow functions"
AI: Converts functions → Updates code → Shows changes
Result: Code is refactored and optimized
```

### 3. Debug Code
```
User: "debug this function, it's not working"
AI: Analyzes code → Identifies issues → Suggests fixes
Result: Explanation of bugs with fix suggestions
```

### 4. Run Code
```
User: "run this code"
AI: Triggers execution → Opens terminal → Shows output
Result: Terminal displays execution results
```

## Troubleshooting

### Frontend Won't Start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with specific Node version
nvm use 18
npm install
npm run dev
```

### Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Install missing dependencies
pip install -r requirements.txt

# Try with specific Python
python3.11 -m uvicorn src.gateway.main:app
```

### Monaco Editor Not Loading
```bash
# Clear browser cache
# Check browser console for errors
# Verify Monaco CDN is accessible
# Reinstall @monaco-editor/react

npm uninstall @monaco-editor/react
npm install @monaco-editor/react
```

### Chat Not Responding
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify CORS settings
# Check browser network tab for errors
# Ensure API URL is correct in .env
```

## Production Deployment

### Frontend
```bash
# Build for production
npm run build

# Serve with a static server
npm install -g serve
serve -s dist -l 3000
```

### Backend
```bash
# Use Gunicorn with Uvicorn workers
pip install gunicorn
gunicorn src.gateway.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### Docker
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]

# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "src.gateway.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Next Steps

1. **Explore API Documentation**: Visit http://localhost:8000/docs
2. **Customize Theme**: Edit Monaco theme in `MonacoIDEPage.jsx`
3. **Add Languages**: Configure additional language support
4. **Extend Chat**: Add custom AI commands and responses
5. **Deploy**: Follow production deployment guide above

## Support Resources

- **API Docs**: http://localhost:8000/docs
- **Documentation**: See `MONACO_IDE_DOCUMENTATION.md`
- **Code**: Check `frontend/src/pages/MonacoIDEPage.jsx`
- **API**: Review `src/gateway/routers/code_editor.py`

## Key Files

```
Frontend:
- frontend/src/pages/MonacoIDEPage.jsx     (Main IDE component)
- frontend/src/services/monacoIDEService.js (API client)
- frontend/src/App.jsx                      (Routing)

Backend:
- src/gateway/main.py                       (FastAPI app)
- src/gateway/routers/code_editor.py        (IDE endpoints)
- src/gateway/middleware.py                 (Middleware)
- src/orchestrator/core.py                  (Orchestration)
```

## Success Indicators

✅ Backend responds at http://localhost:8000  
✅ Frontend loads at http://localhost:3000  
✅ Monaco IDE accessible at /ide  
✅ Chat sends messages and gets responses  
✅ Code updates when AI makes changes  
✅ Terminal shows output  
✅ Orchestration tasks are created  

Congratulations! Your Monaco IDE with Chat and Autonomous Orchestration is now running! 🎉
