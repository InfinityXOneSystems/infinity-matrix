/**
 * Infinity Matrix VS Code Extension
 * Main extension entry point
 */
import * as vscode from 'vscode';
import { MCPClient } from './mcpClient';
import { ContextManager } from './contextManager';
import { AIProvidersView } from './views/aiProvidersView';
import { ContextSyncView } from './views/contextSyncView';
import { IntelligenceView } from './views/intelligenceView';

let mcpClient: MCPClient;
let contextManager: ContextManager;

export function activate(context: vscode.ExtensionContext): void {
  console.log('Infinity Matrix extension is now active');

  // Initialize MCP client
  const config = vscode.workspace.getConfiguration('infinityMatrix');
  const serverUrl = config.get<string>('serverUrl', 'http://localhost:3000');
  
  mcpClient = new MCPClient(serverUrl);
  contextManager = new ContextManager(mcpClient);

  // Register views
  const aiProvidersView = new AIProvidersView(context.extensionUri, mcpClient);
  const contextSyncView = new ContextSyncView(context.extensionUri, contextManager);
  const intelligenceView = new IntelligenceView(context.extensionUri, mcpClient);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('infinityMatrix.aiProviders', aiProvidersView),
    vscode.window.registerTreeDataProvider('infinityMatrix.contextSync', contextSyncView),
    vscode.window.registerTreeDataProvider('infinityMatrix.intelligence', intelligenceView)
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('infinityMatrix.syncContext', async () => {
      await syncContext();
    }),
    
    vscode.commands.registerCommand('infinityMatrix.shareIntelligence', async () => {
      await shareIntelligence();
    }),
    
    vscode.commands.registerCommand('infinityMatrix.connect', async () => {
      await connectToServer();
    }),
    
    vscode.commands.registerCommand('infinityMatrix.disconnect', async () => {
      await disconnectFromServer();
    }),
    
    vscode.commands.registerCommand('infinityMatrix.showStatus', async () => {
      await showStatus();
    })
  );

  // Auto-connect on startup
  if (config.get<boolean>('autoConnect', true)) {
    connectToServer().catch(console.error);
  }

  // Watch for file changes and auto-sync
  if (config.get<boolean>('autoSync', true)) {
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(async (event) => {
        await contextManager.handleDocumentChange(event);
      })
    );
  }

  // Status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = '$(sync~spin) Infinity Matrix';
  statusBarItem.tooltip = 'Infinity Matrix Status';
  statusBarItem.command = 'infinityMatrix.showStatus';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

export function deactivate(): void {
  if (mcpClient) {
    mcpClient.disconnect();
  }
}

async function syncContext(): Promise<void> {
  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Syncing context to all AI providers...',
        cancellable: false,
      },
      async () => {
        await contextManager.syncCurrentContext();
      }
    );
    
    vscode.window.showInformationMessage('Context synchronized successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to sync context: ${error}`);
  }
}

async function shareIntelligence(): Promise<void> {
  const input = await vscode.window.showInputBox({
    prompt: 'Enter intelligence to share',
    placeHolder: 'e.g., Best practices, code patterns, insights...',
  });

  if (!input) {
    return;
  }

  try {
    await mcpClient.shareIntelligence({
      source_provider: 'vscode_copilot',
      intelligence_type: 'user_input',
      content: { text: input },
      confidence_score: 1.0,
      tags: ['manual', 'vscode'],
      target_providers: [],
    });

    vscode.window.showInformationMessage('Intelligence shared successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to share intelligence: ${error}`);
  }
}

async function connectToServer(): Promise<void> {
  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Connecting to Infinity Matrix MCP server...',
        cancellable: false,
      },
      async () => {
        await mcpClient.connect();
      }
    );

    vscode.window.showInformationMessage('Connected to Infinity Matrix MCP server!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to connect: ${error}`);
  }
}

async function disconnectFromServer(): Promise<void> {
  mcpClient.disconnect();
  vscode.window.showInformationMessage('Disconnected from Infinity Matrix MCP server');
}

async function showStatus(): Promise<void> {
  const status = await mcpClient.getStatus();
  
  const statusMessage = `
    **Infinity Matrix Status**
    
    Server: ${status.connected ? '🟢 Connected' : '🔴 Disconnected'}
    Active Providers: ${status.activeProviders}
    Last Sync: ${status.lastSync || 'Never'}
  `;

  vscode.window.showInformationMessage(statusMessage);
}
