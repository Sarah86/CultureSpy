
import React, { useState, useEffect } from 'react';
/* Added Zap to the imports to resolve the missing name error */
import { Radar, Crosshair, Loader2, AlertTriangle, Sparkles, Ghost, Zap, RefreshCw, XCircle } from 'lucide-react';
import TerminalText from './TerminalText';

interface LocationScannerProps {
  isScanning: boolean;
  statusText: string;
  error?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

const LocationScanner: React.FC<LocationScannerProps> = ({ isScanning, statusText, error, onRetry, onClose }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isScanning && !error) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning, error]);

  if (!isScanning && !error) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-spyDark/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      <div className="relative mb-12">
        {/* Glow behind radar */}
        <div className={`absolute inset-0 rounded-full blur-[60px] animate-pulse ${error ? 'bg-spyRed/20' : 'bg-spyCyan/20'}`}></div>
        
        <div className={`w-48 h-48 border-4 rounded-full flex items-center justify-center relative overflow-hidden transition-colors ${error ? 'border-spyRed/20' : 'border-spyCyan/20'}`}>
          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent ${error ? 'to-spyRed/5' : 'to-spyCyan/5'}`}></div>
          <Radar className={`${error ? 'text-spyRed' : 'text-spyCyan'} w-24 h-24 ${error ? '' : 'animate-spin-slow'}`} strokeWidth={1} />
          
          {/* Radar sweeper */}
          {!error && <div className="absolute inset-0 border-r-4 border-spyCyan/40 rounded-full animate-spin"></div>}
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
           <Crosshair className={`${error ? 'text-spyRed' : 'text-spyPink'} w-12 h-12 animate-pulse`} />
           <Ghost size={20} className={`absolute animate-bounce ${error ? 'text-spyRed/50' : 'text-spyPink/50'}`} />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-4 -right-4 animate-bounce delay-75"><Sparkles className={error ? "text-spyRed" : "text-spyAmber"} size={24}/></div>
        <div className="absolute -bottom-4 -left-4 animate-bounce delay-150"><Zap className={error ? "text-spyRed" : "text-spyCyan"} size={24}/></div>
      </div>

      <div className="max-w-xs w-full space-y-6">
        <div className="space-y-2">
          <h2 className={`font-black text-3xl tracking-tighter uppercase italic ${error ? 'text-spyRed' : 'text-spyCyan'}`}>
            {error ? 'RADAR_CRASHED' : 'MEGA_SCANNER'}
          </h2>
          <div className="flex justify-center gap-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-3 h-1 rounded-full ${error ? 'bg-spyRed' : 'bg-spyCyan'} animate-pulse`} style={{ animationDelay: `${i * 100}ms` }}></div>
             ))}
          </div>
        </div>
        
        <div className={`flex flex-col justify-center bg-black/40 rounded-3xl p-6 border-2 shadow-inner transition-all ${error ? 'border-spyRed/20 h-auto py-8' : 'border-white/5 h-24'}`}>
          {error ? (
            <div className="space-y-4">
              <div className="text-spyRed text-sm font-black flex items-center gap-3 justify-center">
                <AlertTriangle size={24} className="animate-bounce" /> {error}
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={onRetry}
                  className="bg-spyRed text-black font-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs uppercase"
                >
                  <RefreshCw size={14} /> TRY_AGAIN_HERO
                </button>
                <button 
                  onClick={onClose}
                  className="bg-white/10 text-white/60 font-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-[10px] uppercase"
                >
                  <XCircle size={14} /> ABORT_SCAN
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white text-sm font-black uppercase tracking-widest leading-tight">
              <TerminalText text={`${statusText}${dots}`} delay={20} />
            </p>
          )}
        </div>

        {!error && (
          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border-2 border-white/5 p-1">
            <div className="bg-gradient-to-r from-spyCyan to-spyPink h-full rounded-full animate-[loading_4s_ease-in-out_infinite] shadow-[0_0_15px_#00f2ff]"></div>
          </div>
        )}
        
        {!error && <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">Calibrating Secret Sauce...</p>}
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 10%; }
          50% { width: 90%; }
          100% { width: 10%; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LocationScanner;
