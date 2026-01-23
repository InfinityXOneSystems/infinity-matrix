"""Repository management utilities for Git operations."""

from pathlib import Path
from typing import list

from git import Repo
from git.exc import GitCommandError


class RepositoryManager:
    """
    Manages Git repository operations.

    Handles creating branches, committing changes, creating pull requests,
    and other Git-related operations for the auto-builder.
    """

    def __init__(self, repo_path: Path):
        """
        Initialize repository manager.

        Args:
            repo_path: Path to the repository
        """
        self.repo_path = repo_path
        self.repo: Repo | None = None

    def init_repo(self, initial_commit: bool = True) -> None:
        """
        Initialize a new Git repository.

        Args:
            initial_commit: Whether to create an initial commit
        """
        self.repo = Repo.init(self.repo_path)

        if initial_commit:
            # Create .gitignore
            gitignore_path = self.repo_path / ".gitignore"
            if not gitignore_path.exists():
                gitignore_path.write_text("__pycache__/\n*.pyc\n.venv/\n")

            self.repo.index.add([".gitignore"])
            self.repo.index.commit("Initial commit")

    def clone_repo(self, url: str) -> None:
        """
        Clone a repository from URL.

        Args:
            url: Git repository URL
        """
        self.repo = Repo.clone_from(url, self.repo_path)

    def create_branch(self, branch_name: str) -> None:
        """
        Create and checkout a new branch.

        Args:
            branch_name: Name of the branch to create
        """
        if not self.repo:
            raise ValueError("Repository not initialized")

        # Create new branch
        new_branch = self.repo.create_head(branch_name)
        new_branch.checkout()

    def commit_changes(self, message: str, files: list[str] | None = None) -> None:
        """
        Commit changes to the repository.

        Args:
            message: Commit message
            files: list of files to commit (None = all changes)
        """
        if not self.repo:
            raise ValueError("Repository not initialized")

        if files:
            self.repo.index.add(files)
        else:
            self.repo.git.add(A=True)

        self.repo.index.commit(message)

    def push_changes(self, remote: str = "origin", branch: str | None = None) -> None:
        """
        Push changes to remote repository.

        Args:
            remote: Remote name
            branch: Branch name (None = current branch)
        """
        if not self.repo:
            raise ValueError("Repository not initialized")

        if branch is None:
            branch = self.repo.active_branch.name

        try:
            origin = self.repo.remote(remote)
            origin.push(branch)
        except GitCommandError as e:
            raise RuntimeError(f"Failed to push changes: {str(e)}")

    def get_current_branch(self) -> str:
        """
        Get the current branch name.

        Returns:
            Current branch name
        """
        if not self.repo:
            raise ValueError("Repository not initialized")

        return self.repo.active_branch.name

    def get_status(self) -> dict[str, list[str]]:
        """
        Get repository status.

        Returns:
            Dictionary with status information
        """
        if not self.repo:
            raise ValueError("Repository not initialized")

        return {
            "modified": [item.a_path for item in self.repo.index.diff(None)],
            "untracked": self.repo.untracked_files,
            "staged": [item.a_path for item in self.repo.index.diff("HEAD")],
        }

    def create_tag(self, tag_name: str, message: str | None = None) -> None:
        """
        Create a Git tag.

        Args:
            tag_name: Tag name
            message: Tag message
        """
        if not self.repo:
            raise ValueError("Repository not initialized")

        self.repo.create_tag(tag_name, message=message)
