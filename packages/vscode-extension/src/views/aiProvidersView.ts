/**
 * AI Providers Tree View
 */
import * as vscode from 'vscode';
import { MCPClient } from '../mcpClient';

export class AIProvidersView implements vscode.TreeDataProvider<ProviderTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ProviderTreeItem | undefined | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private extensionUri: vscode.Uri,
    private mcpClient: MCPClient
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: ProviderTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ProviderTreeItem): Promise<ProviderTreeItem[]> {
    if (!element) {
      try {
        const response = await this.mcpClient.getProviders();
        return response.providers.map(
          (provider) =>
            new ProviderTreeItem(
              provider.name,
              provider.enabled ? 'connected' : 'disconnected',
              vscode.TreeItemCollapsibleState.None
            )
        );
      } catch (error) {
        return [];
      }
    }
    return [];
  }
}

class ProviderTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly status: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${label} - ${status}`;
    this.description = status;
    this.iconPath = new vscode.ThemeIcon(
      status === 'connected' ? 'check' : 'circle-outline'
    );
  }
}
