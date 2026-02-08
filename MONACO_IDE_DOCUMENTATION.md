# Monaco IDE with Chat & Autonomous Orchestration

## Overview

This implementation adds a complete **Monaco Editor IDE** with integrated **Chat UI** and **Autonomous Orchestration** capabilities to the Infinity Matrix system.

## Features

### 1. Monaco Code Editor
- **Black Theme (v0 dev style)**: Custom "infinity-dark" theme with VS Code-like appearance
- **Full Language Support**: JavaScript, TypeScript, Python, and more via Monaco
- **Advanced Features**:
  - Syntax highlighting
  - Code completion
  - Minimap
  - Line numbers
  - Smart indentation
  - Multi-cursor editing

### 2. Integrated Chat UI
- **Side Panel Layout**: Collapsible chat panel alongside the editor
- **AI Assistant**: Real-time communication with AI for code assistance
- **Message Types**:
  - User messages
  - Assistant responses
  - System notifications
  - Orchestration status updates

### 3. Self-Editing Capability
- **Direct Code Manipulation**: AI can modify code directly in the editor
- **Visual Feedback**: Toast notifications when code is updated
- **Change Tracking**: See what the AI modified in real-time
- **Undo Support**: Full Monaco undo/redo history

### 4. Autonomous Orchestration
- **Task Creation**: Submit tasks to autonomous agents
- **Agent Assignment**: Intelligent routing to appropriate agent types
- **Status Tracking**: Real-time task status updates
- **Multi-Agent Support**: Integration with the Infinity Matrix agent system

## Architecture

### Frontend Components

#### MonacoIDEPage.jsx
Location: `/frontend/src/pages/MonacoIDEPage.jsx`

Main component that provides:
- Monaco Editor integration using `@monaco-editor/react`
- Custom "infinity-dark" theme matching VS Code's black theme
- Split panel layout with editor and chat
- Terminal panel for code execution output
- Toolbar with Save, Run, and Settings actions

Key Features:
```javascript
- Editor configuration with 14px Fira Code font
- Custom theme with black background (#000000)
- Green accent color (#39FF14) for cursors and highlights
- Collapsible chat panel (400px wide)
- Terminal panel (200px height)
```

#### monacoIDEService.js
Location: `/frontend/src/services/monacoIDEService.js`

API service providing:
- `sendChatMessage()`: Send chat messages with code context
- `editCode()`: Request AI code edits
- `orchestrateTask()`: Create orchestration tasks
- `getTaskStatus()`: Poll task completion status
- `pollTaskStatus()`: Automated polling with callbacks

### Backend API Endpoints

#### Code Editor Router
Location: `/src/gateway/routers/code_editor.py`

Endpoints:

**POST /api/v1/code/chat**
- Chat with AI assistant about code
- Receives: message, code_context, language
- Returns: AI response, optional code edits, action type

**POST /api/v1/code/edit**
- Request code editing from AI
- Receives: file_name, language, original_code, instruction
- Returns: edited_code, explanation, changes_summary

**POST /api/v1/code/orchestrate**
- Create autonomous orchestration task
- Receives: task_description, context, target_agent_type
- Returns: task_id, status, assigned_agent, estimated_completion

**GET /api/v1/code/orchestrate/{task_id}**
- Get orchestration task status
- Returns: task status, agent, description

## Usage

### Accessing the IDE

1. Navigate to `/ide` or `/app/monaco-ide` in your browser
2. The IDE will load with a sample JavaScript file

### Using the Chat Assistant

1. Type a message in the chat input (bottom of chat panel)
2. Examples:
   - "add a function to calculate fibonacci"
   - "refactor this code to use arrow functions"
   - "add error handling to this function"
   - "comment the code"
   - "run this code"

3. The AI will:
   - Analyze your request
   - Modify the code if applicable
   - Provide an explanation
   - Create an orchestration task for complex operations

### Self-Editing Workflow

```
User: "add a function"
  ↓
AI processes request
  ↓
Code is updated in editor
  ↓
Toast notification appears
  ↓
Orchestration task created (if complex)
```

### Terminal Output

- Click "Run" in toolbar or ask AI to "run code"
- Terminal panel opens automatically
- Shows execution output
- Can be collapsed when not needed

## API Integration

### Chat API Example

```javascript
const response = await MonacoIDEService.sendChatMessage(
  "add a function to sort an array",
  currentCode,
  "javascript"
);

if (response.code_edit) {
  setCode(response.code_edit);  // Update editor
}
```

### Orchestration API Example

```javascript
const task = await MonacoIDEService.orchestrateTask(
  "Refactor this codebase to use TypeScript",
  { language: "javascript", fileCount: 10 }
);

// Poll for completion
MonacoIDEService.pollTaskStatus(
  task.task_id,
  (status) => console.log("Status:", status.status)
);
```

## Theme Customization

The "infinity-dark" theme can be customized in the `handleEditorDidMount` function:

```javascript
monaco.editor.defineTheme('infinity-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C586C0' },
    // ... more rules
  ],
  colors: {
    'editor.background': '#000000',
    'editorCursor.foreground': '#39FF14',
    // ... more colors
  }
});
```

## Future Enhancements

### Planned Features
1. **File System Integration**: Open/save files from local or cloud storage
2. **Multi-file Editing**: Tabs for multiple files
3. **Git Integration**: Built-in version control
4. **Collaborative Editing**: Real-time collaboration with other users
5. **Code Review**: AI-powered code review suggestions
6. **Debugging**: Integrated debugger with breakpoints
7. **Extensions**: Plugin system for custom functionality

### Enhanced Orchestration
1. **Advanced Task Types**: Deploy, test, build, analyze
2. **Agent Specialization**: Route to specialized agents (Python expert, React expert)
3. **Progress Tracking**: Visual progress bars for long-running tasks
4. **Error Recovery**: Automatic retry and fallback strategies

## Technical Details

### Dependencies
- `@monaco-editor/react`: ^4.6.0
- `monaco-editor`: ^0.52.2
- `framer-motion`: ^11.15.0
- `lucide-react`: ^0.469.0

### Browser Requirements
- Modern browsers with ES6+ support
- WebGL for Monaco features
- Minimum 2GB RAM recommended

### Performance
- Monaco lazy loads language workers
- Syntax highlighting is debounced
- Chat messages use virtual scrolling for large histories
- Code changes are throttled to prevent excessive updates

## Security Considerations

1. **API Key Required**: Production should require authentication
2. **Code Execution Sandbox**: Terminal runs in isolated environment
3. **Input Validation**: All user inputs are sanitized
4. **CORS Configuration**: Restricted origins in production
5. **Rate Limiting**: Prevents API abuse

## Testing

### Manual Testing
1. Open the IDE at `/ide`
2. Test chat functionality: "add a function"
3. Verify code updates appear in editor
4. Check terminal output with "run code"
5. Confirm orchestration tasks are created

### API Testing
```bash
# Test chat endpoint
curl -X POST http://localhost:8000/api/v1/code/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "add a function", "code_context": "console.log(1);", "language": "javascript"}'

# Test orchestration endpoint
curl -X POST http://localhost:8000/api/v1/code/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"task_description": "Refactor code", "context": {}}'
```

## Troubleshooting

### Editor Not Loading
- Check Monaco CDN is accessible
- Verify `@monaco-editor/react` is installed
- Check browser console for errors

### Chat Not Responding
- Verify backend API is running on port 8000
- Check CORS configuration
- Ensure `/api/v1/code/chat` endpoint is accessible

### Code Changes Not Applying
- Check `setCode()` is being called
- Verify Monaco editor ref is initialized
- Look for JavaScript errors in console

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify API endpoints are responding
3. Review FastAPI docs at `/docs`
4. Check orchestration agent status

## License

Part of the Infinity Matrix system - MIT License
