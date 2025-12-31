/**
 * Context Sync Tree View
 */
import * vscode from 'vscode';
import { ContextManager } from '../contextManager';

export class ContextSyncView implements vscode.TreeDataProvider<SyncTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SyncTreeItem | undefined | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private extensionUri: vscode.Uri,
    private contextManager: ContextManager
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: SyncTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: SyncTreeItem): Promise<SyncTreeItem[]> {
    if (!element) {
      const lastSync = this.contextManager.getLastSyncTime();
      const lastSyncStr = lastSync ? lastSync.toLocaleString() : 'Never';
      
      return [
        new SyncTreeItem(
          `Last Sync: ${lastSyncStr}`,
          vscode.TreeItemCollapsibleState.None
        ),
      ];
    }
    return [];
  }
}

class SyncTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.iconPath = new vscode.ThemeIcon('sync');
  }
}
