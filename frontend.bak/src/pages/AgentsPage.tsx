
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { AgentCard } from '../components/admin/AgentCard';
import { Button } from '../components/ui/Button';
import { adminService } from '../services/adminService';
import { useSystemStore } from '../store/systemStore';

export function AgentsPage() {
  const { agents, setAgents } = useSystemStore();

  const { isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const data = await adminService.getAgents();
      setAgents(data);
      return data;
    },
    refetchInterval: 5000,
  });

  const handleStartAgent = async (id: string) => {
    try {
      await adminService.startAgent(id);
    } catch (error) {
      console.error('Error starting agent:', error);
    }
  };

  const handleStopAgent = async (id: string) => {
    try {
      await adminService.stopAgent(id);
    } catch (error) {
      console.error('Error stopping agent:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agents</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor your intelligent agents
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-5 w-5" />
          Add Agent
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onStart={handleStartAgent}
            onStop={handleStopAgent}
          />
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No agents found. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
