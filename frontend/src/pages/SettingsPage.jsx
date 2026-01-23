import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { toast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <>
      <Helmet>
        <title>Settings - Infinity ΞXAI</title>
      </Helmet>
      
      <div className="flex-1 bg-black p-6 md:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div className="bg-[#050a14] border border-white/10 rounded-xl p-8">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Profile Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white">Profile Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white/70">Display Name</Label>
                    <Input 
                      id="name" 
                      defaultValue="Demo User" 
                      className="bg-black border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white/70">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue="user@example.com" 
                      className="bg-black border-white/10 text-white"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-xl font-medium text-white">API Configuration</h3>
                <div className="grid gap-4">
                   <div className="grid gap-2">
                    <Label htmlFor="api-key" className="text-white/70">Custom API Endpoint</Label>
                    <Input 
                      id="api-key" 
                      placeholder="https://your-railway-app.railway.app/api"
                      className="bg-black border-white/10 text-white placeholder:text-white/20"
                    />
                    <p className="text-xs text-white/40">Override the default Railway backend URL for local testing.</p>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-xl font-medium text-white">Preferences</h3>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-white/70">Email Notifications</Label>
                  <div className="h-6 w-11 bg-[#0091FF] rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-white/70">Sound Effects</Label>
                  <div className="h-6 w-11 bg-white/10 rounded-full relative cursor-pointer">
                     <div className="absolute left-1 top-1 h-4 w-4 bg-white/50 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="bg-[#0091FF] hover:bg-[#007ACC] text-white">
                  Save Changes
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;