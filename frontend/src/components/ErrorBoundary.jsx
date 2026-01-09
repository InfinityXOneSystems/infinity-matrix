import React from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.add('error', 'Uncaught React Error', { error: error.toString(), componentStack: errorInfo.componentStack });
    this.setState({ errorInfo });
  }

  handleReset = () => {
    logger.add('info', 'User triggered error boundary reset');
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-900/5 pointer-events-none" />
          
          <div className="max-w-lg w-full bg-[#050a14] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl relative z-10">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white">System Error Detected</h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              The application encountered a critical error and needs to restart. 
              All diagnostics have been logged for analysis.
            </p>
            
            {this.state.error && (
              <div className="bg-black/50 p-4 rounded-lg text-left mb-8 overflow-auto max-h-48 border border-white/10 font-mono text-xs">
                <p className="text-red-400 font-bold mb-2">{this.state.error.toString()}</p>
                <pre className="text-white/40 whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
               <Button 
                onClick={this.handleReset}
                className="bg-red-600 hover:bg-red-700 text-white gap-2 px-8"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;