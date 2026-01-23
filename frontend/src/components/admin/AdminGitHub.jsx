
import React from 'react';
import { GitBranch, GitCommit, GitPullRequest, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminGitHub = () => {
  const repos = [
    { name: "infinity-core", stars: 1240, forks: 85, status: "up-to-date", lastCommit: "fix: neural weights optimization" },
    { name: "vision-cortex-sdk", stars: 890, forks: 42, status: "syncing", lastCommit: "feat: multimodal input support" },
    { name: "quantum-builder", stars: 2100, forks: 150, status: "up-to-date", lastCommit: "chore: update dependencies" }
  ];

  return (
    <div className="h-full p-4 md:p-6 text-white overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-light flex items-center gap-2">
            <GitBranch className="text-[#0066FF]" /> GitHub Mirror
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Bi-directional sync enabled. Managing 3 organizations.
          </p>
        </div>
        <Button size="sm" className="bg-[#2da44e] hover:bg-[#2c974b] text-white gap-2">
          <RefreshCw size={14} /> Sync All
        </Button>
      </div>

      <div className="grid gap-4">
        {repos.map((repo, i) => (
          <div key={i} className="glass-panel p-4 border border-white/10 bg-black/40 backdrop-blur-xl rounded-lg hover:border-[#0066FF]/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#58a6ff] hover:underline cursor-pointer">{repo.name}</h3>
              <div className="flex items-center gap-1 text-xs text-white/60">
                 <Star size={12} /> {repo.stars}
              </div>
            </div>
            <div className="text-xs text-white/40 font-mono mb-4 flex items-center gap-2">
               <GitCommit size={12} /> {repo.lastCommit}
            </div>
            <div className="flex gap-2">
               <span className="px-2 py-0.5 rounded-full bg-[#238636]/10 text-[#238636] border border-[#238636]/20 text-[10px] uppercase font-bold">
                  {repo.status}
               </span>
               <span className="px-2 py-0.5 rounded-full bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/20 text-[10px] uppercase font-bold flex items-center gap-1">
                  <GitPullRequest size={10} /> 0 Open PRs
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGitHub;
