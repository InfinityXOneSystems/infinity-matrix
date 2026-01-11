"""
GitHub Copilot and GitHub API integration
"""
from typing import Any, dict, list

import structlog
from github import Auth, Github

from ..config import settings
from ..core.exceptions import AIProviderException
from ..core.mcp_protocol import AIProvider

logger = structlog.get_logger()


class GitHubIntegration:
    """GitHub integration for MCP"""

    def __init__(self):
        if not settings.GITHUB_TOKEN:
            raise ValueError("GITHUB_TOKEN is required")

        auth = Auth.Token(settings.GITHUB_TOKEN)
        self.client = Github(auth=auth)
        self.provider = AIProvider.GITHUB_COPILOT

    async def create_pull_request(
        self,
        repository: str,
        title: str,
        body: str,
        head_branch: str,
        base_branch: str = "main",
    ) -> dict[str, Any]:
        """Create a pull request"""
        try:
            repo = self.client.get_repo(repository)
            pr = repo.create_pull(
                title=title,
                body=body,
                head=head_branch,
                base=base_branch,
            )

            logger.info(
                "Pull request created",
                repository=repository,
                pr_number=pr.number,
            )

            return {
                "pr_number": pr.number,
                "url": pr.html_url,
                "state": pr.state,
            }
        except Exception as e:
            logger.exception("Error creating pull request", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def auto_approve_pr(
        self,
        repository: str,
        pr_number: int,
        comment: str = "Auto-approved by Infinity Matrix MCP",
    ) -> dict[str, Any]:
        """Automatically approve a pull request"""
        try:
            repo = self.client.get_repo(repository)
            pr = repo.get_pull(pr_number)

            # Create approval review
            pr.create_review(
                body=comment,
                event="APPROVE",
            )

            logger.info(
                "Pull request approved",
                repository=repository,
                pr_number=pr_number,
            )

            return {
                "pr_number": pr_number,
                "approved": True,
                "url": pr.html_url,
            }
        except Exception as e:
            logger.exception("Error approving pull request", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def auto_merge_pr(
        self,
        repository: str,
        pr_number: int,
        merge_method: str = "squash",
    ) -> dict[str, Any]:
        """Automatically merge a pull request"""
        try:
            repo = self.client.get_repo(repository)
            pr = repo.get_pull(pr_number)

            # Check if PR is mergeable
            if not pr.mergeable:
                raise ValueError("Pull request is not mergeable")

            # Check if all checks have passed
            if pr.mergeable_state != "clean":
                logger.warning(
                    "Pull request mergeable state is not clean",
                    state=pr.mergeable_state,
                )

            # Merge the PR
            merge_result = pr.merge(
                merge_method=merge_method,
                commit_message=f"Auto-merged by Infinity Matrix MCP (#{pr_number})",
            )

            logger.info(
                "Pull request merged",
                repository=repository,
                pr_number=pr_number,
                merged=merge_result.merged,
            )

            return {
                "pr_number": pr_number,
                "merged": merge_result.merged,
                "sha": merge_result.sha,
            }
        except Exception as e:
            logger.exception("Error merging pull request", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def create_issue(
        self,
        repository: str,
        title: str,
        body: str,
        labels: list[str] | None = None,
        assignees: list[str] | None = None,
    ) -> dict[str, Any]:
        """Create a GitHub issue"""
        try:
            repo = self.client.get_repo(repository)
            issue = repo.create_issue(
                title=title,
                body=body,
                labels=labels or [],
                assignees=assignees or [],
            )

            logger.info(
                "Issue created",
                repository=repository,
                issue_number=issue.number,
            )

            return {
                "issue_number": issue.number,
                "url": issue.html_url,
                "state": issue.state,
            }
        except Exception as e:
            logger.exception("Error creating issue", error=str(e))
            raise AIProviderException(self.provider.value, str(e))

    async def get_repository_context(self, repository: str) -> dict[str, Any]:
        """Get repository context for AI synchronization"""
        try:
            repo = self.client.get_repo(repository)

            # Get recent commits
            commits = list(repo.get_commits()[:10])

            # Get open PRs
            prs = list(repo.get_pulls(state="open"))

            # Get open issues
            issues = list(repo.get_issues(state="open"))

            return {
                "repository": repository,
                "default_branch": repo.default_branch,
                "recent_commits": [
                    {
                        "sha": commit.sha[:7],
                        "message": commit.commit.message.split("\n")[0],
                        "author": commit.commit.author.name,
                    }
                    for commit in commits
                ],
                "open_prs": [
                    {
                        "number": pr.number,
                        "title": pr.title,
                        "author": pr.user.login,
                    }
                    for pr in prs[:10]
                ],
                "open_issues": [
                    {
                        "number": issue.number,
                        "title": issue.title,
                        "author": issue.user.login,
                    }
                    for issue in issues[:10]
                ],
            }
        except Exception as e:
            logger.exception("Error getting repository context", error=str(e))
            raise AIProviderException(self.provider.value, str(e))


# Singleton instance
_github_integration: GitHubIntegration | None = None


def get_github_integration() -> GitHubIntegration:
    """Get GitHub integration instance"""
    global _github_integration
    if _github_integration is None:
        _github_integration = GitHubIntegration()
    return _github_integration
