"""
Evidence Pack Generator
Automatically generates launch evidence documentation with proof artifacts.
"""

from typing import List, Dict, Any
from datetime import datetime
import subprocess
import json
import requests

class EvidenceGenerator:
    """
    Generates comprehensive evidence packs for deployments.
    
    Includes:
    - Deployment URLs
    - Health check results
    - Curl outputs
    - Screenshot references
    - Contract hashes
    - Test results
    - Performance metrics
    """
    
    def __init__(self, environment: str = "staging"):
        self.environment = environment
        self.evidence = {
            "environment": environment,
            "generated_at": datetime.utcnow().isoformat(),
            "services": {},
            "health_checks": {},
            "tests": {},
            "contracts": {},
            "screenshots": []
        }
    
    def add_service(self, name: str, url: str):
        """Add a deployed service"""
        self.evidence["services"][name] = {
            "url": url,
            "added_at": datetime.utcnow().isoformat()
        }
    
    def check_health(self, service_name: str, health_url: str) -> Dict[str, Any]:
        """Check service health and record result"""
        try:
            response = requests.get(health_url, timeout=10)
            result = {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "status_code": response.status_code,
                "response": response.json() if response.headers.get("content-type") == "application/json" else response.text,
                "checked_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            result = {
                "status": "error",
                "error": str(e),
                "checked_at": datetime.utcnow().isoformat()
            }
        
        self.evidence["health_checks"][service_name] = result
        return result
    
    def run_curl_test(self, service_name: str, endpoint: str) -> Dict[str, Any]:
        """Run curl test and capture output"""
        try:
            result = subprocess.run(
                ["curl", "-s", endpoint],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            return {
                "endpoint": endpoint,
                "output": result.stdout,
                "exit_code": result.returncode,
                "tested_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "error": str(e),
                "tested_at": datetime.utcnow().isoformat()
            }
    
    def add_contract_hash(self, contract_name: str, hash_value: str):
        """Add contract hash for verification"""
        self.evidence["contracts"][contract_name] = {
            "hash": hash_value,
            "recorded_at": datetime.utcnow().isoformat()
        }
    
    def add_test_results(self, test_suite: str, results: Dict[str, Any]):
        """Add test results"""
        self.evidence["tests"][test_suite] = {
            "results": results,
            "recorded_at": datetime.utcnow().isoformat()
        }
    
    def add_screenshot(self, description: str, path: str):
        """Add screenshot reference"""
        self.evidence["screenshots"].append({
            "description": description,
            "path": path,
            "captured_at": datetime.utcnow().isoformat()
        })
    
    def generate_markdown(self) -> str:
        """Generate markdown evidence pack"""
        md = f"""# Launch Evidence Pack - {self.environment.upper()}

**Generated:** {self.evidence['generated_at']}  
**Environment:** {self.environment}

---

## 🚀 Deployed Services

"""
        
        for service_name, service_info in self.evidence["services"].items():
            md += f"### {service_name}\n"
            md += f"- **URL:** {service_info['url']}\n"
            md += f"- **Deployed:** {service_info['added_at']}\n\n"
        
        md += "---\n\n## ✅ Health Checks\n\n"
        
        for service_name, health_info in self.evidence["health_checks"].items():
            status_emoji = "✅" if health_info["status"] == "healthy" else "❌"
            md += f"### {status_emoji} {service_name}\n"
            md += f"- **Status:** {health_info['status']}\n"
            if "status_code" in health_info:
                md += f"- **Status Code:** {health_info['status_code']}\n"
            if "response" in health_info:
                md += f"- **Response:**\n```json\n{json.dumps(health_info['response'], indent=2)}\n```\n"
            if "error" in health_info:
                md += f"- **Error:** {health_info['error']}\n"
            md += f"- **Checked:** {health_info['checked_at']}\n\n"
        
        if self.evidence["contracts"]:
            md += "---\n\n## 📜 Contract Hashes\n\n"
            for contract_name, contract_info in self.evidence["contracts"].items():
                md += f"- **{contract_name}:** `{contract_info['hash']}`\n"
            md += "\n"
        
        if self.evidence["tests"]:
            md += "---\n\n## 🧪 Test Results\n\n"
            for test_suite, test_info in self.evidence["tests"].items():
                md += f"### {test_suite}\n"
                md += f"```json\n{json.dumps(test_info['results'], indent=2)}\n```\n\n"
        
        if self.evidence["screenshots"]:
            md += "---\n\n## 📸 Screenshots\n\n"
            for screenshot in self.evidence["screenshots"]:
                md += f"- **{screenshot['description']}:** `{screenshot['path']}`\n"
            md += "\n"
        
        md += "---\n\n## 📊 Summary\n\n"
        healthy_count = sum(1 for h in self.evidence["health_checks"].values() if h["status"] == "healthy")
        total_checks = len(self.evidence["health_checks"])
        md += f"- **Services Deployed:** {len(self.evidence['services'])}\n"
        md += f"- **Health Checks:** {healthy_count}/{total_checks} passing\n"
        md += f"- **Contracts Verified:** {len(self.evidence['contracts'])}\n"
        md += f"- **Test Suites Run:** {len(self.evidence['tests'])}\n"
        
        return md
    
    def save(self, output_path: str):
        """Save evidence pack to file"""
        markdown = self.generate_markdown()
        with open(output_path, "w") as f:
            f.write(markdown)
        
        # Also save JSON
        json_path = output_path.replace(".md", ".json")
        with open(json_path, "w") as f:
            json.dump(self.evidence, f, indent=2)
        
        return output_path

# Example usage
if __name__ == "__main__":
    generator = EvidenceGenerator(environment="staging")
    
    # Add services
    generator.add_service("MCP Gateway", "https://infinity-mcp-gateway-staging.run.app")
    generator.add_service("API", "https://infinity-api-staging.run.app")
    generator.add_service("Web", "https://infinity-web-staging.run.app")
    
    # Check health
    generator.check_health("MCP Gateway", "https://infinity-mcp-gateway-staging.run.app/mcp/health")
    generator.check_health("API", "https://infinity-api-staging.run.app/health")
    
    # Add contract hashes
    generator.add_contract_hash("backend_api", "abc123def456")
    
    # Save
    output_path = generator.save("ops/reports/LAUNCH_EVIDENCE_PACK_STAGING.md")
    print(f"Evidence pack saved to: {output_path}")
