/**
 * Context Manager for tracking and syncing code context
 */
import * as vscode from 'vscode';
import { MCPClient, ContextSyncRequest } from './mcpClient';

export class ContextManager {
  private mcpClient: MCPClient;
  private lastSyncTime: Date | null = null;
  private syncDebounceTimer: NodeJS.Timeout | null = null;

  constructor(mcpClient: MCPClient) {
    this.mcpClient = mcpClient;
  }

  async handleDocumentChange(event: vscode.TextDocumentChangeEvent): Promise<void> {
    // Debounce sync to avoid excessive API calls
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
    }

    this.syncDebounceTimer = setTimeout(async () => {
      await this.syncCurrentContext();
    }, 2000); // 2 second debounce
  }

  async syncCurrentContext(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const workspace = vscode.workspace.workspaceFolders?.[0];

    const codeContext = {
      fileName: document.fileName,
      language: document.languageId,
      content: document.getText(),
      cursorPosition: {
        line: editor.selection.active.line,
        character: editor.selection.active.character,
      },
      selectedText: document.getText(editor.selection),
    };

    const config = vscode.workspace.getConfiguration('infinityMatrix');
    const enabledProviders = config.get<string[]>('enabledProviders', []);

    const request: ContextSyncRequest = {
      provider: 'vscode_copilot',
      workspace_id: workspace?.uri.toString(),
      code_context: codeContext,
      conversation_history: [],
      file_references: [document.fileName],
      preferences: {},
      target_providers: enabledProviders,
    };

    try {
      await this.mcpClient.syncContext(request);
      this.lastSyncTime = new Date();
    } catch (error) {
      console.error('Failed to sync context:', error);
    }
  }

  getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }
}
