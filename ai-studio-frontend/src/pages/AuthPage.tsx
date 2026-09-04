import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { CyberSphereVisual } from '../components/CyberSphereVisual';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('alex.vance@cybersphere.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoSignIn = (roleEmail: string) => {
    setEmail(roleEmail);
    setIsLoading(true);
    setTimeout(() => {
      login(roleEmail, 'demo-secret-pass');
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#050711] cyber-grid">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
        
        {/* LEFT COLUMN: Login / Sign Up Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold font-display tracking-wider text-white">
                CYBERSPHERE AI
              </h2>
            </div>
            <p className="text-sm text-slate-400 font-light">
              Your intelligent cybersecurity workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                Security Identity / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  id="auth-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@cybersphere.internal"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase">
                Password / Access Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  id="auth-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>AUTHENTICATING SECURE TUNNEL...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                id="auth-toggle-mode"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium uppercase tracking-wider transition-colors border border-slate-700"
              >
                {isSignUp ? 'Already have credentials? Sign In' : 'Need an enterprise account? Sign Up'}
              </button>
            </div>
          </form>

          {/* Quick Fast-Demo Logins */}
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-cyan-400 block mb-2 font-semibold">
              ⚡ QUICK OPERATOR DEMO ACCESS:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('lead.soc@cybersphere.internal')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 text-[11px] font-mono flex items-center gap-1.5"
              >
                <KeyRound className="w-3 h-3 text-cyan-400" />
                <span>Lead SOC Analyst</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('sec.engineer@cybersphere.internal')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 text-[11px] font-mono flex items-center gap-1.5"
              >
                <KeyRound className="w-3 h-3 text-emerald-400" />
                <span>AppSec Engineer</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Cinematic AI Cybersecurity Visual */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#070b1a] to-[#04060f] p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col items-center justify-center relative overflow-hidden text-center">
          
          <div className="relative z-10 space-y-6">
            <div className="w-full flex justify-center">
              <CyberSphereVisual size="lg" statusText="CYBERSPHERE INTELLIGENCE NODE ONLINE" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-lg font-bold font-display text-white tracking-wide">
                MULTI-AGENT DEFENSE CORE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous SOC log correlation, static code vulnerability analysis, and zero-day threat intelligence at machine speed.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AES-256 ZERO-KNOWLEDGE WORKSPACE</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
