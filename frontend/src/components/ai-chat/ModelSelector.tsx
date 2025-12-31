import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { aiService } from '../../services/aiService';
import { Button } from '../ui/Button';
import type { AIModel } from '../../types';

export function ModelSelector() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, setSelectedModel } = useChatStore();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await aiService.getModels();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    setIsOpen(false);
  };

  const selectedModelInfo = models.find((m) => m.id === selectedModel);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span className="truncate">
          {selectedModelInfo?.name || selectedModel}
        </span>
        <Settings className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="p-2">
              <h4 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                Select AI Model
              </h4>
              <div className="space-y-1">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedModel === model.id
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    disabled={!model.isAvailable}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{model.name}</span>
                      {!model.isAvailable && (
                        <span className="text-xs text-gray-500">Unavailable</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {model.provider}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
