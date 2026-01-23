
import React, { useState } from 'react';
import { 
  Braces, ChevronRight, ChevronDown, Type, 
  Key, Hash, Calendar, ToggleLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DATA_MODELS } from './contractData';

const TypeIcon = ({ type }) => {
  if (type.includes('uuid') || type.includes('id')) return <Key size={12} className="text-yellow-500" />;
  if (type.includes('string')) return <Type size={12} className="text-green-400" />;
  if (type.includes('float') || type.includes('int')) return <Hash size={12} className="text-blue-400" />;
  if (type.includes('date')) return <Calendar size={12} className="text-purple-400" />;
  if (type.includes('bool')) return <ToggleLeft size={12} className="text-orange-400" />;
  if (type.includes('json') || type.includes('array')) return <Braces size={12} className="text-white/60" />;
  return <Type size={12} className="text-gray-500" />;
};

const ModelCard = ({ model }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden mb-4 transition-all hover:border-white/20">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer bg-white/5 hover:bg-white/10"
      >
        <div className="flex items-center gap-3">
           <div className="bg-blue-500/20 p-1.5 rounded text-blue-400">
              <Braces size={16} />
           </div>
           <div>
              <div className="font-bold text-white text-sm">{model.id}</div>
              <div className="text-[10px] text-white/40">{model.description}</div>
           </div>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />}
      </div>

      {isOpen && (
        <div className="p-4 border-t border-white/5 bg-[#111]">
           <table className="w-full text-left text-xs font-mono">
              <thead>
                 <tr className="text-white/30 border-b border-white/10">
                    <th className="pb-2 pl-2">Field</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Req</th>
                    <th className="pb-2 text-right pr-2">Description</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {model.fields.map((field, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                       <td className="py-2 pl-2 text-white/90">{field.name}</td>
                       <td className="py-2">
                          <div className="flex items-center gap-1.5 text-white/60">
                             <TypeIcon type={field.type} />
                             {field.type}
                          </div>
                       </td>
                       <td className="py-2">
                          {field.required ? (
                             <span className="text-red-400 text-[10px] font-bold">YES</span>
                          ) : (
                             <span className="text-white/20 text-[10px]">NO</span>
                          )}
                       </td>
                       <td className="py-2 text-right pr-2 text-white/40 italic">{field.desc}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
           <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-white/30 flex justify-between">
              <span>SQL: CREATE TABLE {model.id.toLowerCase()}s ...</span>
              <button className="text-blue-400 hover:text-blue-300">Copy Schema</button>
           </div>
        </div>
      )}
    </div>
  );
};

const SchemaViewer = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {DATA_MODELS.map(model => (
          <ModelCard key={model.id} model={model} />
       ))}
    </div>
  );
};

export default SchemaViewer;
