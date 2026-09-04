import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Terminal,
  Cpu,
  CheckCircle2,
  Network,
  Code2,
  Brain,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#020617] text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div className="space-y-3 md:col-span-1">

          <div className="flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(8,145,178,0.4)]">
              <Shield className="w-4 h-4 text-white" />
            </div>

            <span className="text-base font-bold font-display text-white tracking-wider">
              CYBERSPHERE AI
            </span>

          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Intelligent cybersecurity analysis platform for security
            investigation, network analysis, code analysis, and SOC
            security assessment.
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">

            <CheckCircle2 className="w-3 h-3 text-cyan-400" />

            <span>
              SECURITY ANALYSIS PLATFORM
            </span>

          </div>

        </div>


        {/* Working Intelligence Agents */}
        <div className="space-y-2">

          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Intelligence Matrix
          </h4>

          <ul className="space-y-1.5 text-xs">

            <li>
              <Link
                to="/agents"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3 text-cyan-400" />
                SOC Security Analysis
              </Link>
            </li>

            <li>
              <Link
                to="/agents"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3 h-3 text-blue-400" />
                Code Security Analysis
              </Link>
            </li>

            <li>
              <Link
                to="/agents"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Network className="w-3 h-3 text-emerald-400" />
                Network Security Analysis
              </Link>
            </li>

            <li>
              <Link
                to="/assistant"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Brain className="w-3 h-3 text-purple-400" />
                AI Security Assessment
              </Link>
            </li>

          </ul>

        </div>


        {/* Command Features */}
        <div className="space-y-2">

          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Command Features
          </h4>

          <ul className="space-y-1.5 text-xs">

            <li>
              <Link
                to="/assistant"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Terminal className="w-3 h-3 text-cyan-400" />
                Unified Security Prompt
              </Link>
            </li>

            <li>
              <Link
                to="/uploads"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-blue-400" />
                Security File Uploads
              </Link>
            </li>

            <li>
              <Link
                to="/history"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Cpu className="w-3 h-3 text-purple-400" />
                Investigation History
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>⚡</span>
                Investigation Dashboard
              </Link>
            </li>

          </ul>

        </div>


        {/* System Status */}
        <div className="space-y-2">

          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            System Status
          </h4>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-400">

            <div className="flex justify-between">
              <span>AI Engine:</span>
              <span className="text-cyan-400 font-bold">
                READY
              </span>
            </div>

            <div className="flex justify-between">
              <span>Security Agents:</span>
              <span className="text-cyan-400 font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex justify-between">
              <span>Analysis Pipeline:</span>
              <span className="text-emerald-400 font-bold">
                ONLINE
              </span>
            </div>

            <div className="flex justify-between">
              <span>System Status:</span>
              <span className="text-cyan-400 font-bold">
                READY
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* Bottom Footer */}

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">

        <div>
          © {new Date().getFullYear()} CyberSphere AI.
          Built for intelligent cybersecurity investigation and
          security analysis.
        </div>

        <div className="flex items-center gap-4">

          <span className="hover:text-slate-400 cursor-pointer">
            Security Policy
          </span>

          <span className="hover:text-slate-400 cursor-pointer">
            Vulnerability Disclosure
          </span>

          <span className="hover:text-slate-400 cursor-pointer">
            Security Standards
          </span>

        </div>

      </div>

    </footer>
  );
};