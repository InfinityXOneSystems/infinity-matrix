
import React from 'react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Github, Fingerprint, Chrome, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import BackgroundEnergy from '@/components/BackgroundEnergy';

const SignInSignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSimulatedLogin = () => {
    localStorage.setItem('infinity_auth', 'true');
    localStorage.setItem('user_data', JSON.stringify({ name: 'Demo User', role: 'Architect', email: 'demo@infinityx.ai' }));
    
    toast({
      title: "Welcome back!",
      description: "Logging you into the system...",
      className: "bg-[#0066FF] text-white border-none"
    });

    if(onLogin) onLogin();
    
    setTimeout(() => {
      navigate('/admin');
    }, 800);
  };

  return (
    <>
      <Helmet><title>Log In | Infinity X</title></Helmet>
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#000000] text-white">
        <BackgroundEnergy />
        
        <div className="w-full max-w-md relative z-10">
          <div className="glass-panel p-10 rounded-3xl border border-[#0066FF]/20 shadow-[0_0_80px_rgba(0,102,255,0.15)] backdrop-blur-xl bg-black/80">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto bg-[#0066FF]/10 rounded-full flex items-center justify-center mb-6 text-[#0066FF] ring-1 ring-[#0066FF]/30">
                <Fingerprint size={32} />
              </div>
              <h1 className="text-3xl font-light mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-white/40 text-sm">Access your Agent Builder Dashboard.</p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleSimulatedLogin} 
                className="w-full h-14 bg-white text-black hover:bg-gray-200 font-medium tracking-wide text-sm rounded-xl transition-all hover:scale-[1.02]"
              >
                <Chrome className="mr-3 w-5 h-5" />
                Sign in with Google
              </Button>
              
              <Button 
                onClick={handleSimulatedLogin} 
                className="w-full h-14 bg-white/5 text-white hover:bg-white/10 border border-white/10 font-medium tracking-wide text-sm rounded-xl transition-all hover:scale-[1.02]"
              >
                <Github className="mr-3 w-5 h-5" />
                Sign in with GitHub
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-white/40">Or</span></div>
              </div>

               <Button 
                onClick={handleSimulatedLogin} 
                className="w-full h-14 bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 border border-[#39FF14]/30 font-bold tracking-wide text-sm rounded-xl transition-all hover:scale-[1.02]"
              >
                <Shield className="mr-3 w-5 h-5" />
                Enter Demo Mode
              </Button>
            </div>
            
            <div className="mt-8 text-center border-t border-white/5 pt-6">
               <p className="text-[10px] text-white/20 uppercase tracking-widest">
                  Secure & Encrypted • v4.2
               </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInSignUp;
