import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Globe,
  Code,
  Target,
  BookOpen,
  ArrowRight,
  Terminal,
  FileText,
  Trash2,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  UploadCloud,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SecurityFile, RiskLevel } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    investigations,
    files,
    setCurrentInvestigationId,
    createNewInvestigation,
    removeFile,
    quickAnalyzeFile,
  } = useApp();

  const [quickPrompt, setQuickPrompt] = useState('');

  // Determine Greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const handleStartInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    const invId = createNewInvestigation(
      quickPrompt ? quickPrompt.slice(0, 36) + '...' : undefined,
      quickPrompt || undefined
    );
    navigate('/assistant');
  };

  const handleOpenAssistantDirect = () => {
    const invId = createNewInvestigation();
    navigate('/assistant');
  };

  const handleSelectInvestigation = (id: string) => {
    setCurrentInvestigationId(id);
    navigate('/assistant');
  };

  const handleCategoryLaunch = (category: string, title: string, placeholderPrompt: string) => {
    createNewInvestigation(title, placeholderPrompt, category);
    navigate('/assistant');
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-mono font-bold">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded bg-orange-950/80 border border-orange-500/50 text-orange-300 text-[11px] font-mono font-bold">
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold">
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-bold">
            LOW RISK
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[11px] font-mono font-bold">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 cyber-grid space-y-10 max-w-7xl mx-auto">
      
      {/* TOP GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wide text-white flex items-center gap-2">
            <span>{getGreeting()}, {user?.name ? user.name.toUpperCase() : 'ANALYST'} 👋</span>
          </h1>
          <p className="text-sm text-slate-400 font-light mt-1">
            Your cybersecurity intelligence workspace is ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>5 AGENTS SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* PRIMARY FEATURE: START A NEW INVESTIGATION */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#0a1128] via-[#09153a] to-[#0d1430] border border-cyan-500/40 p-6 sm:p-10 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRIMARY COMMAND HUB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white">
            START A NEW INVESTIGATION
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Tell CyberSphere what you need help with. You can ask a question, share code, upload logs,
            provide a suspicious link, IP address, domain, document, repository, or other cybersecurity data.
          </p>

          {/* Quick Input Bar inside primary feature */}
          <form onSubmit={handleStartInvestigation} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                id="dashboard-quick-input"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Ask anything, paste code, IP, domain, or logs..."
                className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono shadow-inner"
              />
            </div>

            <button
              type="submit"
              id="dashboard-cta-open-assistant"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Terminal className="w-4 h-4" />
              <span>OPEN CYBERSPHERE ASSISTANT</span>
            </button>
          </form>
        </div>
      </section>

      {/* SECOND SECTION: EXPLORE CYBERSPHERE (Interactive Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            EXPLORE CYBERSPHERE INTELLIGENCE
          </h2>
          <span className="text-xs text-slate-400 font-mono">5 SPECIALIZED AGENTS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* SOC Security Analysis */}
          <div
            onClick={() =>
              handleCategoryLaunch(
                'soc',
                'SOC Log Investigation',
                'Investigate suspicious SSH and firewall telemetry'
              )
            }
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display mb-1">
                SOC SECURITY ANALYSIS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze suspicious activity and security logs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 group-hover:text-cyan-300 font-mono">
              <span>Launch SOC</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Threat Intelligence */}
          <div
            onClick={() =>
              handleCategoryLaunch(
                'threat',
                'Threat Intel Investigation',
                'Query threat indicators for IP 194.26.29.112'
              )
            }
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display mb-1">
                THREAT INTELLIGENCE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Investigate suspicious IPs, URLs, and domains.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 group-hover:text-blue-300 font-mono">
              <span>Investigate IOCs</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Secure Code Review */}
          <div
            onClick={() =>
              handleCategoryLaunch(
                'code',
                'Source Code Security Audit',
                'Review Python / JS authentication endpoints for CWE-89 & IDOR'
              )
            }
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display mb-1">
                SECURE CODE REVIEW
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze source code for security weaknesses.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 group-hover:text-emerald-300 font-mono">
              <span>Audit Code</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* MITRE Analysis */}
          <div
            onClick={() =>
              handleCategoryLaunch(
                'mitre',
                'MITRE ATT&CK Matrix Mapping',
                'Map observed lateral movement and privilege escalation techniques'
              )
            }
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display mb-1">
                MITRE ANALYSIS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand relevant attack techniques.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 group-hover:text-purple-300 font-mono">
              <span>Map Matrix</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Cyber Learning */}
          <div
            onClick={() =>
              handleCategoryLaunch(
                'learning',
                'Cybersecurity Learning',
                'What is SQL Injection and how does parameterized query prevent it?'
              )
            }
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display mb-1">
                CYBER LEARNING
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn cybersecurity concepts in simple language.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 group-hover:text-amber-300 font-mono">
              <span>Learn Concepts</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* THIRD SECTION: RECENT INVESTIGATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            RECENT INVESTIGATIONS
          </h2>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {investigations.slice(0, 3).map((inv) => (
            <div
              key={inv.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                    {inv.agent}
                  </span>
                  {getRiskBadge(inv.riskLevel)}
                </div>
                <h3 className="text-sm font-bold text-white font-display mb-1 line-clamp-1">
                  {inv.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {inv.snippet}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {inv.timestamp}
                </span>
                <button
                  onClick={() => handleSelectInvestigation(inv.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wider font-mono transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOURTH SECTION: YOUR UPLOADS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            YOUR UPLOADS
          </h2>
          <button
            onClick={() => navigate('/uploads')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Manage Security Data</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">File Name</th>
                  <th className="px-5 py-3.5">File Type</th>
                  <th className="px-5 py-3.5">File Size</th>
                  <th className="px-5 py-3.5">Upload Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {files.slice(0, 4).map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{file.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{file.type}</td>
                    <td className="px-5 py-3.5 text-slate-400">{file.size}</td>
                    <td className="px-5 py-3.5 text-slate-400">{file.uploadDate}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          quickAnalyzeFile(file);
                          navigate('/assistant');
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors text-[11px] font-bold"
                      >
                        ANALYZE
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};
