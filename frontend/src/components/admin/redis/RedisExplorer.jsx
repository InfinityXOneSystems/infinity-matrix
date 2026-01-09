
import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Save, RefreshCw, Type, Clock } from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RedisExplorer = () => {
  const { redis, redisActions } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Filtering keys based on search
  const filteredKeys = redis.keys.filter(k => k.key.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectKey = (keyObj) => {
    setSelectedKey(keyObj);
    setEditValue(keyObj.value);
    setEditMode(false);
  };

  const handleSave = () => {
    if (selectedKey) {
       redisActions.setKey(selectedKey.key, editValue, selectedKey.type, selectedKey.ttl);
       setEditMode(false);
       // Re-select to show updated (simulate immediate update locally)
       setSelectedKey(prev => ({...prev, value: editValue}));
    }
  };

  const handleDelete = () => {
    if (selectedKey) {
       redisActions.deleteKey(selectedKey.key);
       setSelectedKey(null);
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden">
       {/* Sidebar List */}
       <div className="w-80 bg-[#252526] border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/5 flex gap-2">
             <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter keys..." 
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-red-500/50 outline-none" 
                />
             </div>
             <Button size="icon" className="bg-white/5 hover:bg-white/10 text-white border border-white/10">
                <Plus size={16} />
             </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
             {filteredKeys.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs">No keys found</div>
             ) : (
                filteredKeys.map(k => (
                   <div 
                      key={k.id}
                      onClick={() => handleSelectKey(k)}
                      className={cn(
                         "p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between group",
                         selectedKey?.id === k.id ? "bg-red-500/10 border-l-4 border-l-red-500" : "border-l-4 border-l-transparent"
                      )}
                   >
                      <div className="min-w-0">
                         <div className="text-white text-sm font-mono truncate">{k.key}</div>
                         <div className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span className={cn(
                               "px-1 rounded text-[9px] uppercase font-bold",
                               k.type === 'string' ? "bg-blue-500/20 text-blue-400" :
                               k.type === 'hash' ? "bg-purple-500/20 text-purple-400" :
                               k.type === 'list' ? "bg-yellow-500/20 text-yellow-400" :
                               "bg-green-500/20 text-green-400"
                            )}>{k.type}</span>
                            <span>• TTL: {k.ttl === -1 ? '∞' : `${k.ttl}s`}</span>
                         </div>
                      </div>
                   </div>
                ))
             )}
          </div>
          <div className="p-2 border-t border-white/5 text-center text-[10px] text-gray-500">
             {filteredKeys.length} keys loaded
          </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          {selectedKey ? (
             <>
               <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#252526]">
                  <div>
                     <div className="font-bold text-white font-mono text-lg">{selectedKey.key}</div>
                     <div className="text-xs text-gray-400 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Type size={12} /> {selectedKey.type}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {selectedKey.ttl === -1 ? 'No Expiration' : `${selectedKey.ttl}s`}</span>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     {!editMode ? (
                        <Button onClick={() => setEditMode(true)} variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Edit2 size={16} className="mr-2" /> Edit</Button>
                     ) : (
                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 text-white"><Save size={16} className="mr-2" /> Save</Button>
                     )}
                     <Button onClick={handleDelete} variant="ghost" size="sm" className="text-gray-400 hover:text-red-400"><Trash2 size={16} /></Button>
                  </div>
               </div>

               <div className="flex-1 p-6 overflow-y-auto">
                  {editMode ? (
                     <textarea 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full h-full bg-[#0A0A0A] border border-white/10 rounded-lg p-4 font-mono text-sm text-white resize-none focus:border-red-500/50 outline-none" 
                     />
                  ) : (
                     <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-lg p-4 font-mono text-sm text-white/80 whitespace-pre-wrap break-all h-full overflow-auto">
                        {typeof selectedKey.value === 'object' ? JSON.stringify(selectedKey.value, null, 2) : selectedKey.value}
                     </div>
                  )}
               </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Search size={48} className="opacity-20 mb-4" />
                <p>Select a key to view or edit</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default RedisExplorer;
