
import React from 'react';
import { Mail } from 'lucide-react';

const AdminGmail = () => (
   <div className="p-8 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-4">
         <Mail size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Workspace Inbox</h2>
      <p className="text-white/40 max-w-md mb-6">Secure integration with Google Workspace Mail. Requires OAuth2 token refresh.</p>
      <button className="px-6 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">Connect Account</button>
   </div>
);
export default AdminGmail;
