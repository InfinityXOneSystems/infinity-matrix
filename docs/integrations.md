# Webhook Integration Guide

## Overview

The Infinity Matrix Auto-Builder supports webhook integrations for triggering builds from external services like GitHub, GitLab, VS Code, ChatGPT plugins, and custom applications.

## GitHub Integration

### Setup GitHub Webhook

1. Go to your repository settings
2. Click "Webhooks" → "Add webhook"
3. Configure:
   - **Payload URL**: `https://your-domain.com/api/v1/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Your webhook secret
   - **Events**: Choose relevant events (push, pull_request, issues, etc.)

### GitHub Webhook Handler

```python
from fastapi import APIRouter, Request, HTTPException
from infinity_matrix import AutoBuilder

router = APIRouter()
builder = AutoBuilder()

@router.post("/webhooks/github")
async def github_webhook(request: Request):
    """Handle GitHub webhook events."""
    
    # Verify webhook signature
    signature = request.headers.get("X-Hub-Signature-256")
    # ... verify signature logic
    
    payload = await request.json()
    event_type = request.headers.get("X-GitHub-Event")
    
    if event_type == "push":
        # Trigger build on push
        branch = payload.get("ref", "").replace("refs/heads/", "")
        repo_name = payload.get("repository", {}).get("name")
        
        build = await builder.build(
            prompt=f"Update {repo_name} project based on latest push to {branch}"
        )
        
        return {"status": "build_triggered", "build_id": build.id}
    
    elif event_type == "issues":
        # Trigger build from issue
        issue = payload.get("issue", {})
        if "auto-build" in [label["name"] for label in issue.get("labels", [])]:
            build = await builder.build(
                prompt=issue.get("title", "")
            )
            return {"status": "build_triggered", "build_id": build.id}
    
    return {"status": "ignored"}
```

## VS Code Extension Integration

### Extension Manifest

```json
{
  "name": "infinity-builder",
  "displayName": "Infinity Matrix Builder",
  "description": "Trigger builds from VS Code",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.80.0"
  },
  "activationEvents": ["onCommand:infinity-builder.build"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "infinity-builder.build",
        "title": "Infinity: Build Project"
      }
    ]
  }
}
```

### Extension Code

```typescript
import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'infinity-builder.build',
        async () => {
            const apiUrl = vscode.workspace
                .getConfiguration('infinity-builder')
                .get('apiUrl', 'http://localhost:8000');
            
            const prompt = await vscode.window.showInputBox({
                prompt: 'Enter build description',
                placeHolder: 'Create a REST API for...'
            });
            
            if (!prompt) return;
            
            try {
                const response = await axios.post(
                    `${apiUrl}/api/v1/builds`,
                    { prompt }
                );
                
                const buildId = response.data.build_id;
                vscode.window.showInformationMessage(
                    `Build started: ${buildId}`
                );
                
                // Monitor build status
                monitorBuild(apiUrl, buildId);
                
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Build failed: ${error.message}`
                );
            }
        }
    );
    
    context.subscriptions.push(disposable);
}

async function monitorBuild(apiUrl: string, buildId: string) {
    // Poll build status
    const interval = setInterval(async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/v1/builds/${buildId}`
            );
            
            const status = response.data;
            
            if (status.status === 'completed') {
                vscode.window.showInformationMessage(
                    `Build completed: ${buildId}`
                );
                clearInterval(interval);
            } else if (status.status === 'failed') {
                vscode.window.showErrorMessage(
                    `Build failed: ${status.error}`
                );
                clearInterval(interval);
            }
        } catch (error) {
            clearInterval(interval);
        }
    }, 5000);
}
```

## ChatGPT Plugin

### Plugin Manifest

```json
{
  "schema_version": "v1",
  "name_for_human": "Infinity Builder",
  "name_for_model": "infinity_builder",
  "description_for_human": "Build projects and applications from natural language descriptions.",
  "description_for_model": "Plugin for building software projects from descriptions. It can create microservices, APIs, web apps, and more.",
  "auth": {
    "type": "service_http",
    "authorization_type": "bearer"
  },
  "api": {
    "type": "openapi",
    "url": "https://your-domain.com/openapi.json"
  },
  "logo_url": "https://your-domain.com/logo.png",
  "contact_email": "support@infinityxai.com",
  "legal_info_url": "https://your-domain.com/legal"
}
```

### OpenAPI Spec for Plugin

The FastAPI application automatically generates OpenAPI spec at `/openapi.json`.

## Slack Integration

### Slack Bot

```python
from slack_sdk import WebClient
from slack_sdk.socket_mode import SocketModeClient
from slack_sdk.socket_mode.request import SocketModeRequest
from slack_sdk.socket_mode.response import SocketModeResponse

slack_token = "xoxb-your-token"
app_token = "xapp-your-token"

client = WebClient(token=slack_token)
socket_client = SocketModeClient(app_token=app_token, web_client=client)

@socket_client.socket_mode_request_listeners.append
async def process_request(client: SocketModeClient, req: SocketModeRequest):
    if req.type == "slash_commands" and req.payload.get("command") == "/build":
        # Acknowledge command
        response = SocketModeResponse(envelope_id=req.envelope_id)
        socket_client.send_socket_mode_response(response)
        
        # Get build description
        text = req.payload.get("text", "")
        
        # Trigger build
        builder = AutoBuilder()
        build = await builder.build(prompt=text)
        
        # Send response
        client.chat_postMessage(
            channel=req.payload["channel_id"],
            text=f"Build started: {build.id}\nStatus: {build.status}"
        )

socket_client.connect()
```

## Discord Bot

### Discord Bot

```python
import discord
from discord.ext import commands
from infinity_matrix import AutoBuilder

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)
builder = AutoBuilder()

@bot.command()
async def build(ctx, *, description: str):
    """Trigger a build from Discord."""
    await ctx.send(f"Starting build: {description}")
    
    build_status = await builder.build(prompt=description)
    
    await ctx.send(
        f"Build created!\n"
        f"ID: {build_status.id}\n"
        f"Status: {build_status.status}"
    )

bot.run("YOUR_BOT_TOKEN")
```

## Custom Web Interface

### React Component

```tsx
import React, { useState } from 'react';
import axios from 'axios';

function BuildTrigger() {
  const [prompt, setPrompt] = useState('');
  const [buildId, setBuildId] = useState('');
  const [status, setStatus] = useState('');

  const triggerBuild = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/builds',
        { prompt }
      );
      
      setBuildId(response.data.build_id);
      setStatus('Build started');
      
      // Monitor status
      monitorBuild(response.data.build_id);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const monitorBuild = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/builds/${id}`
        );
        
        setStatus(`${response.data.status} (${response.data.progress}%)`);
        
        if (['completed', 'failed'].includes(response.data.status)) {
          clearInterval(interval);
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div>
      <h2>Infinity Matrix Builder</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what you want to build..."
        rows={4}
        style={{ width: '100%' }}
      />
      <button onClick={triggerBuild}>Build</button>
      
      {buildId && (
        <div>
          <p>Build ID: {buildId}</p>
          <p>Status: {status}</p>
        </div>
      )}
    </div>
  );
}

export default BuildTrigger;
```

## API Gateway Integration

### AWS API Gateway + Lambda

```python
import json
import boto3
from infinity_matrix import AutoBuilder

def lambda_handler(event, context):
    """AWS Lambda handler for API Gateway."""
    
    builder = AutoBuilder()
    
    # Parse request
    body = json.loads(event.get('body', '{}'))
    prompt = body.get('prompt')
    
    if not prompt:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'prompt is required'})
        }
    
    # Trigger build (note: Lambda has time limits)
    # In production, use Step Functions for long-running tasks
    import asyncio
    build = asyncio.run(builder.build(prompt=prompt))
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'build_id': build.id,
            'status': build.status
        })
    }
```

## Zapier Integration

### Zapier API

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ZapierTrigger(BaseModel):
    event: str
    data: dict

@router.post("/webhooks/zapier")
async def zapier_webhook(trigger: ZapierTrigger):
    """Handle Zapier webhook."""
    
    if trigger.event == "build_request":
        prompt = trigger.data.get("prompt")
        builder = AutoBuilder()
        build = await builder.build(prompt=prompt)
        
        return {
            "build_id": build.id,
            "status": build.status,
            "name": build.name
        }
    
    return {"status": "ignored"}
```

## Webhooks Best Practices

1. **Verify Signatures**: Always verify webhook signatures to prevent unauthorized access
2. **Idempotency**: Handle duplicate webhook deliveries gracefully
3. **Async Processing**: Use background tasks for long-running operations
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Error Handling**: Return appropriate HTTP status codes
6. **Logging**: Log all webhook events for debugging
7. **Retries**: Implement retry logic for failed webhooks
8. **Timeouts**: Set appropriate timeouts to prevent hanging requests

## Security Considerations

- Use HTTPS for all webhook endpoints
- Implement webhook signature verification
- Use API keys or OAuth for authentication
- Rate limit webhook endpoints
- Validate all input data
- Monitor for suspicious activity
- Implement IP allowlisting when possible

## Testing Webhooks

### Using cURL

```bash
# Test webhook endpoint
curl -X POST http://localhost:8000/api/v1/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{
    "ref": "refs/heads/main",
    "repository": {
      "name": "test-repo"
    }
  }'
```

### Using Postman

1. Create a new POST request
2. Set URL to webhook endpoint
3. Add headers (Content-Type, X-GitHub-Event, etc.)
4. Set JSON body
5. Send request

### Using webhook.site

For testing webhooks without deploying:
1. Go to https://webhook.site
2. Copy the unique URL
3. Use as webhook endpoint
4. View received requests in real-time
