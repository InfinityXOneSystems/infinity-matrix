
import React, { useState } from 'react';
import { 
  Github, Cloud, Database, CreditCard, Code, 
  Server, Shield, Box, Globe, Save, Plug, Wifi, CheckCircle,
  AlertTriangle, XCircle, Flame, HardDrive, Terminal, Copy
} from 'lucide-react';
import { useAdmin } from '@/lib/AdminProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import IntegrationPanel from './IntegrationPanel';

const AdminIntegrationHub = () => {
  const { integrations, integrationActions } = useAdmin();
  const [activeIntegration, setActiveIntegration] = useState('all');
  const [showCurl, setShowCurl] = useState({}); // Keyed by service

  const categories = [
    { id: 'all', label: 'All Systems' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'code', label: 'Code & Dev' },
    { id: 'payment', label: 'Payments' }
  ];

  const handleInputChange = (service, field, value) => {
    integrationActions.updateConfig(service, { [field]: value });
  };

  const toggleCurl = (service) => {
    setShowCurl(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Command copied to clipboard." });
  };

  const getValidationStatus = (service) => {
    const config = integrations[service];
    const hasData = Object.entries(config).some(([k, v]) => 
       k !== 'connected' && k !== 'lastTestResult' && v && v.toString().length > 0
    );
    return hasData ? 'valid' : 'invalid';
  };

  const ValidationIcon = ({ status }) => {
    if (status === 'valid') return <CheckCircle size={14} className="text-[#39FF14]" />;
    return <AlertTriangle size={14} className="text-amber-500 dark:text-yellow-500" />;
  };

  // Helper to render test results if they exist
  const TestResultDisplay = ({ result }) => {
    if (!result) return null;
    return (
       <div className={cn("mt-4 p-3 rounded-lg border text-[10px] font-mono", result.success ? "bg-green-100/50 border-green-500/20 dark:bg-green-950/20" : "bg-red-100/50 border-red-500/20 dark:bg-red-950/20")}>
          <div className="flex justify-between items-center mb-2 border-b border-black/5 dark:border-white/5 pb-1">
             <span className={cn("font-bold uppercase", result.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                {result.success ? 'Success' : 'Failed'} ({result.status})
             </span>
             <span className="text-slate-500 dark:text-white/40">{result.latency}ms</span>
          </div>
          <pre className="text-slate-700 dark:text-white/70 whitespace-pre-wrap max-h-24 overflow-y-auto">
             {JSON.stringify(result.body, null, 2)}
          </pre>
       </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-transparent text-slate-900 dark:text-white overflow-hidden rounded-tl-2xl border-l-2 border-t-2 border-white/20">
       {/* Header */}
       <div className="h-20 border-b-2 border-white/20 flex items-center px-8 justify-between bg-white/80 dark:bg-black/40 backdrop-blur-xl shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center border-2 border-black/5 dark:border-white/20">
                <Box className="text-slate-900 dark:text-white" size={28} />
             </div>
             <div>
                <h1 className="font-bold text-2xl tracking-wide text-slate-900 dark:text-white">Integration<span className="text-[#0066FF] dark:text-[#39FF14]">Hub</span></h1>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/50">
                   <Shield size={12} className="text-[#0066FF] dark:text-[#39FF14]" /> CENTRAL NERVOUS SYSTEM
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-200 dark:bg-black/40 rounded-lg p-1 border border-black/5 dark:border-white/10">
             {categories.map(cat => (
                <button
                   key={cat.id}
                   onClick={() => setActiveIntegration(cat.id)}
                   className={cn(
                      "px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider",
                      activeIntegration === cat.id ? "bg-white shadow-sm dark:bg-white/10 text-black dark:text-white" : "text-slate-500 dark:text-white/40 hover:text-black dark:hover:text-white"
                   )}
                >
                   {cat.label}
                </button>
             ))}
          </div>
       </div>

       {/* Main Grid */}
       <div className="flex-1 overflow-y-auto p-8 bg-transparent custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             
             {/* Firestore Panel */}
             <IntegrationPanel 
                title="Firestore" 
                icon={Flame} 
                connected={integrations.firestore.connected}
                color="text-orange-500"
                onConnect={() => integrationActions.connect('firestore')}
                onDisconnect={() => integrationActions.disconnect('firestore')}
                onTest={() => integrationActions.testConnection('firestore')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('firestore')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Project ID</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="my-project-id"
                        value={integrations.firestore.projectId}
                        onChange={(e) => handleInputChange('firestore', 'projectId', e.target.value)}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">DB ID</label>
                        <Input 
                          className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400" 
                          placeholder="(default)"
                          value={integrations.firestore.databaseId}
                          onChange={(e) => handleInputChange('firestore', 'databaseId', e.target.value)}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">API Key</label>
                        <Input 
                          type="password" 
                          className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400" 
                          placeholder="AIza..."
                          value={integrations.firestore.apiKey}
                          onChange={(e) => handleInputChange('firestore', 'apiKey', e.target.value)}
                        />
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2 mt-2">
                       <Button size="sm" onClick={() => integrationActions.saveSecrets('Firestore')} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs">
                          <Save size={14} className="mr-2" /> Save Config
                       </Button>
                       <Button size="sm" onClick={() => toggleCurl('firestore')} variant="ghost" className="text-slate-500 dark:text-white/50 hover:text-black dark:hover:text-white px-2">
                          <Terminal size={14} />
                       </Button>
                   </div>

                   {/* Auto-CURL for Firestore */}
                   {showCurl.firestore && (
                      <div className="bg-slate-950 dark:bg-[#111] p-2 rounded border border-black/10 dark:border-white/10 mt-2 relative group">
                         <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap break-all pr-6">
                            {`curl -X GET "https://firestore.googleapis.com/v1/projects/${integrations.firestore.projectId || '{project}'}/databases/${integrations.firestore.databaseId || '(default)'}/documents" \\ \n  -H "key: ${integrations.firestore.apiKey || '{key}'}"`}
                         </pre>
                         <button onClick={() => copyToClipboard(`curl ...`)} className="absolute top-1 right-1 text-white/30 hover:text-white"><Copy size={12} /></button>
                      </div>
                   )}
                   
                   <TestResultDisplay result={integrations.firestore.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* Google Cloud Storage Panel */}
             <IntegrationPanel 
                title="Cloud Storage" 
                icon={HardDrive} 
                connected={integrations.gcs.connected}
                color="text-blue-500 dark:text-blue-300"
                onConnect={() => integrationActions.connect('gcs')}
                onDisconnect={() => integrationActions.disconnect('gcs')}
                onTest={() => integrationActions.testConnection('gcs')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('gcs')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Bucket Name</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="my-bucket-v1"
                        value={integrations.gcs.bucketName}
                        onChange={(e) => handleInputChange('gcs', 'bucketName', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Project ID</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="my-gcp-project"
                        value={integrations.gcs.projectId}
                        onChange={(e) => handleInputChange('gcs', 'projectId', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Service Account JSON</label>
                      <textarea 
                         className="w-full h-12 bg-white dark:bg-black/40 border rounded-md border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-mono p-2 focus:outline-none focus:border-[#0066FF] placeholder:text-slate-400"
                         placeholder='{"type": "service_account"...}'
                         value={integrations.gcs.serviceAccountJson}
                         onChange={(e) => handleInputChange('gcs', 'serviceAccountJson', e.target.value)}
                      />
                   </div>

                   <div className="flex items-center gap-2 mt-2">
                       <Button size="sm" onClick={() => integrationActions.saveSecrets('GCS')} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs">
                          <Save size={14} className="mr-2" /> Save Config
                       </Button>
                       <Button size="sm" onClick={() => toggleCurl('gcs')} variant="ghost" className="text-slate-500 dark:text-white/50 hover:text-black dark:hover:text-white px-2">
                          <Terminal size={14} />
                       </Button>
                   </div>

                   {/* Auto-CURL for GCS */}
                   {showCurl.gcs && (
                      <div className="bg-slate-950 dark:bg-[#111] p-2 rounded border border-black/10 dark:border-white/10 mt-2 relative group">
                         <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap break-all pr-6">
                            {`curl -X GET "https://storage.googleapis.com/storage/v1/b/${integrations.gcs.bucketName || '{bucket}'}/o" \\ \n  -H "Authorization: Bearer $(gcloud auth print-access-token)"`}
                         </pre>
                         <button onClick={() => copyToClipboard(`curl ...`)} className="absolute top-1 right-1 text-white/30 hover:text-white"><Copy size={12} /></button>
                      </div>
                   )}

                   <TestResultDisplay result={integrations.gcs.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* GitHub Panel */}
             <IntegrationPanel 
                title="GitHub" 
                icon={Github} 
                connected={integrations.github.connected}
                color="text-slate-900 dark:text-white"
                onConnect={() => integrationActions.connect('github')}
                onDisconnect={() => integrationActions.disconnect('github')}
                onTest={() => integrationActions.testConnection('github')}
             >
                <div className="space-y-4 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('github')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Username</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="e.g. infinity-dev"
                        value={integrations.github.username}
                        onChange={(e) => handleInputChange('github', 'username', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Personal Access Token</label>
                      <Input 
                        type="password" 
                        className="h-9 bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="ghp_..."
                        value={integrations.github.token}
                        onChange={(e) => handleInputChange('github', 'token', e.target.value)}
                      />
                   </div>
                   <div className="flex items-center gap-2 mt-2">
                       <Button size="sm" onClick={() => integrationActions.saveSecrets('Github')} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs">
                          <Save size={14} className="mr-2" /> Save Config
                       </Button>
                   </div>
                   <TestResultDisplay result={integrations.github.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* Google Cloud Panel */}
             <IntegrationPanel 
                title="Google Cloud" 
                icon={Cloud} 
                connected={integrations.googleCloud.connected}
                color="text-blue-600 dark:text-blue-400"
                onConnect={() => integrationActions.connect('googleCloud')}
                onDisconnect={() => integrationActions.disconnect('googleCloud')}
                onTest={() => integrationActions.testConnection('googleCloud')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('googleCloud')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Project ID</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="my-project-id"
                        value={integrations.googleCloud.projectId}
                        onChange={(e) => handleInputChange('googleCloud', 'projectId', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Service Account JSON</label>
                      <textarea 
                         className="w-full h-16 bg-white dark:bg-black/40 border rounded-md border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-mono p-2 focus:outline-none focus:border-[#0066FF] placeholder:text-slate-400"
                         placeholder='{"type": "service_account", ...}'
                         value={integrations.googleCloud.serviceAccountJson}
                         onChange={(e) => handleInputChange('googleCloud', 'serviceAccountJson', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Cloud Run URL</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="https://..."
                        value={integrations.googleCloud.cloudRunUrl}
                        onChange={(e) => handleInputChange('googleCloud', 'cloudRunUrl', e.target.value)}
                      />
                   </div>
                   <Button size="sm" onClick={() => integrationActions.saveSecrets('GCP')} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs mt-2">
                      <Save size={14} className="mr-2" /> Save Config
                   </Button>
                   <TestResultDisplay result={integrations.googleCloud.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* Stripe Panel */}
             <IntegrationPanel 
                title="Stripe Payments" 
                icon={CreditCard} 
                connected={integrations.stripe.connected}
                color="text-[#635BFF]"
                onConnect={() => integrationActions.connect('stripe')}
                onDisconnect={() => integrationActions.disconnect('stripe')}
                onTest={() => integrationActions.testConnection('stripe')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('stripe')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Publishable Key</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="pk_live_..."
                        value={integrations.stripe.publishableKey}
                        onChange={(e) => handleInputChange('stripe', 'publishableKey', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Secret Key</label>
                      <Input 
                        type="password"
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="sk_live_..."
                        value={integrations.stripe.secretKey}
                        onChange={(e) => handleInputChange('stripe', 'secretKey', e.target.value)}
                      />
                   </div>
                   <Button size="sm" onClick={() => integrationActions.saveSecrets('Stripe')} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs mt-2">
                      <Save size={14} className="mr-2" /> Save Config
                   </Button>
                   <TestResultDisplay result={integrations.stripe.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* Firebase Panel */}
             <IntegrationPanel 
                title="Firebase" 
                icon={Database} 
                connected={integrations.firebase.connected}
                color="text-amber-500 dark:text-yellow-500"
                onConnect={() => integrationActions.connect('firebase')}
                onDisconnect={() => integrationActions.disconnect('firebase')}
                onTest={() => integrationActions.testConnection('firebase')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('firebase')} /></div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">API Key</label>
                        <Input 
                          className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                          placeholder="AIza..."
                          value={integrations.firebase.apiKey}
                          onChange={(e) => handleInputChange('firebase', 'apiKey', e.target.value)}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Project ID</label>
                        <Input 
                          className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                          placeholder="my-app"
                          value={integrations.firebase.projectId}
                          onChange={(e) => handleInputChange('firebase', 'projectId', e.target.value)}
                        />
                     </div>
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Auth Domain</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="app.firebaseapp.com"
                        value={integrations.firebase.authDomain}
                        onChange={(e) => handleInputChange('firebase', 'authDomain', e.target.value)}
                      />
                   </div>
                   <Button size="sm" onClick={() => integrationActions.saveSecrets('Firebase')} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs mt-2">
                      <Save size={14} className="mr-2" /> Save Config
                   </Button>
                   <TestResultDisplay result={integrations.firebase.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* VS Code Panel */}
             <IntegrationPanel 
                title="VS Code Sync" 
                icon={Code} 
                connected={integrations.vscode.connected}
                color="text-blue-600 dark:text-blue-500"
                onConnect={() => integrationActions.connect('vscode')}
                onDisconnect={() => integrationActions.disconnect('vscode')}
                onTest={() => integrationActions.testConnection('vscode')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('vscode')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">API Token</label>
                      <Input 
                        type="password"
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="vscode_pat_..."
                        value={integrations.vscode.apiToken}
                        onChange={(e) => handleInputChange('vscode', 'apiToken', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Copilot API Key</label>
                      <Input 
                        type="password"
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="copilot_key_..."
                        value={integrations.vscode.copilotKey}
                        onChange={(e) => handleInputChange('vscode', 'copilotKey', e.target.value)}
                      />
                   </div>
                   <Button size="sm" onClick={() => integrationActions.saveSecrets('VS Code')} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs mt-2">
                      <Save size={14} className="mr-2" /> Save Config
                   </Button>
                   <TestResultDisplay result={integrations.vscode.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* API Gateway Panel */}
             <IntegrationPanel 
                title="API Gateway" 
                icon={Globe} 
                connected={integrations.apiGateway.connected}
                color="text-purple-600 dark:text-purple-400"
                onConnect={() => integrationActions.connect('apiGateway')}
                onDisconnect={() => integrationActions.disconnect('apiGateway')}
                onTest={() => integrationActions.testConnection('apiGateway')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('apiGateway')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Gateway URL</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="https://api.my-gateway.com"
                        value={integrations.apiGateway.url}
                        onChange={(e) => handleInputChange('apiGateway', 'url', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Admin API Key</label>
                      <Input 
                        type="password"
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="key_..."
                        value={integrations.apiGateway.apiKey}
                        onChange={(e) => handleInputChange('apiGateway', 'apiKey', e.target.value)}
                      />
                   </div>
                   <Button size="sm" onClick={() => integrationActions.saveSecrets('API Gateway')} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs mt-2">
                      <Save size={14} className="mr-2" /> Save Config
                   </Button>
                   <TestResultDisplay result={integrations.apiGateway.lastTestResult} />
                </div>
             </IntegrationPanel>

             {/* Docker Panel */}
             <IntegrationPanel 
                title="Docker Hub" 
                icon={Server} 
                connected={integrations.docker.connected}
                color="text-blue-700 dark:text-blue-600"
                onConnect={() => integrationActions.connect('docker')}
                onDisconnect={() => integrationActions.disconnect('docker')}
                onTest={() => integrationActions.testConnection('docker')}
             >
                <div className="space-y-3 relative">
                   <div className="absolute -top-12 right-0"><ValidationIcon status={getValidationStatus('docker')} /></div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Username</label>
                      <Input 
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="docker-user"
                        value={integrations.docker.username}
                        onChange={(e) => handleInputChange('docker', 'username', e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-slate-500 dark:text-white/40 font-bold block mb-1">Access Token</label>
                      <Input 
                        type="password"
                        className="h-9 bg-white dark:bg-black/40 text-xs font-mono border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="dckr_pat_..."
                        value={integrations.docker.token}
                        onChange={(e) => handleInputChange('docker', 'token', e.target.value)}
                      />
                   </div>
                   <Button size="sm" onClick={() => integrationActions.saveSecrets('Docker')} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs mt-2">
                      <Save size={14} className="mr-2" /> Save Config
                   </Button>
                   <TestResultDisplay result={integrations.docker.lastTestResult} />
                </div>
             </IntegrationPanel>

          </div>
       </div>
    </div>
  );
};

export default AdminIntegrationHub;
