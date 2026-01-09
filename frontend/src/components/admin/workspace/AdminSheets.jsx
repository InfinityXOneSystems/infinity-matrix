
import React from 'react';
import { Table } from 'lucide-react';

const AdminSheets = () => (
   <div className="p-8 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mb-4">
         <Table size={32} />
      </div>
      <h2 className="text-xl font-bold mb-2">Data Sheets</h2>
      <p className="text-white/40 max-w-md">Live sync with financial and operational spreadsheets.</p>
   </div>
);
export default AdminSheets;
