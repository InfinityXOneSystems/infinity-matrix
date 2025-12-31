/**
 * Intelligence Tree View
 */
import * as vscode from 'vscode';
import { MCPClient } from '../mcpClient';

export class IntelligenceView implements vscode.TreeDataProvider<IntelligenceTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<IntelligenceTreeItem | undefined | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private extensionUri: vscode.Uri,
    private mcpClient: MCPClient
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: IntelligenceTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: IntelligenceTreeItem): Promise<IntelligenceTreeItem[]> {
    if (!element) {
      // TODO: Fetch shared intelligence from server
      return [
        new IntelligenceTreeItem(
          'No shared intelligence yet',
          vscode.TreeItemCollapsibleState.None
        ),
      ];
    }
    return [];
  }
}

class IntelligenceTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.iconPath = new vscode.ThemeIcon('lightbulb');
  }
}
