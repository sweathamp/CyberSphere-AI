import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Globe,
  Code,
  Activity,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Terminal,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { CyberSphereVisual } from '../components/CyberSphereVisual';
import { useApp } from '../context/AppContext';
import { sampleSshLog, samplePythonVulnerableCode } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createNewInvestigation } = useApp();

  const handleQuickLaunch = (prompt: string, title?: string) => {
    const invId = createNewInvestigation(title, prompt);
    navigate('/assistant');
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-300 cyber-grid overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#22d3ee]" />
              <span className="font-semibold tracking-wider uppercase">AI CYBERSECURITY COMMAND CENTER</span>
            </div>

            {/* Large Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white uppercase leading-[1.1]">
              YOUR INTELLIGENT <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                CYBERSECURITY
              </span> <br />
              COMPANION
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-300 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Understand threats. Analyze risks. Investigate security issues. Get clear solutions.
              One unified intelligence assistant working beside you.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-btn-enter"
                onClick={() => navigate('/assistant')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>ENTER CYBERSPHERE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-btn-explore"
                onClick={() => navigate('/agents')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:border-slate-700"
              >
                <span>EXPLORE CAPABILITIES</span>
              </button>
            </div>

            {/* Live Quick Prompt Presets */}
            <div className="pt-4 text-xs text-slate-400">
              <span className="font-mono text-cyan-400 block mb-2 font-semibold uppercase tracking-wider">
                ⚡ TEST INSTANTLY WITH ONE CLICK:
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <button
                  onClick={() =>
                    handleQuickLaunch(
                      sampleSshLog,
                      'SSH Authentication Incident Analysis'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-slate-300 transition-colors text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>SSH Brute Force Logs</span>
                </button>

                <button
                  onClick={() =>
                    handleQuickLaunch(
                      samplePythonVulnerableCode,
                      'Python SQLi Code Review'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 text-slate-300 transition-colors text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Code className="w-3 h-3 text-emerald-400" />
                  <span>Vulnerable Flask Code</span>
                </button>

                <button
                  onClick={() =>
                    handleQuickLaunch(
                      'Is IP 194.26.29.112 associated with active C2 botnets?',
                      'Threat Intel: 194.26.29.112'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:text-blue-300 text-slate-300 transition-colors text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span>Threat IP 194.26.29.112</span>
                </button>

                <button
                  onClick={() =>
                    handleQuickLaunch(
                      'What is SQL Injection and how do parameterized queries mitigate it?',
                      'Learning: SQL Injection'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:text-purple-300 text-slate-300 transition-colors text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-purple-400" />
                  <span>What is SQL Injection?</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: 3D Glowing CyberSphere */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center rounded-3xl bg-slate-900/50 border border-slate-800 p-4 shadow-2xl backdrop-blur-xl">
              <CyberSphereVisual size="hero" statusText="CYBERSPHERE INTELLIGENCE CORE ACTIVE" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: ONE INTELLIGENT ASSISTANT. MULTIPLE SECURITY CAPABILITIES */}
      <section className="relative py-16 sm:py-24 border-t border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Unified Security Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white">
              ONE INTELLIGENT ASSISTANT. <br />
              <span className="text-cyan-400">MULTIPLE SECURITY CAPABILITIES.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              No need to switch between disparate tools or fragmented input fields.
              CyberSphere automatically determines context and engages specialized autonomous agents.
            </p>
          </div>

          {/* 5 Core Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* 1. Security Investigation */}
            <div
              onClick={() => handleQuickLaunch('Investigate unauthorized root sudo elevation attempt', 'Security Incident Triage')}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1 flex items-center justify-between">
                <span>Security Investigation</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous end-to-end incident triage, root cause identification, and remediation plans.
              </p>
            </div>

            {/* 2. Threat Intelligence */}
            <div
              onClick={() => handleQuickLaunch('Query threat intelligence for malicious domain payload', 'Threat Intel Lookup')}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1 flex items-center justify-between">
                <span>Threat Intelligence</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze suspicious IPs, phishing domains, hashes, and adversary command-and-control infrastructure.
              </p>
            </div>

            {/* 3. Secure Code Review */}
            <div
              onClick={() => handleQuickLaunch(samplePythonVulnerableCode, 'Secure Code Audit')}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1 flex items-center justify-between">
                <span>Secure Code Review</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan Python, JS, SQL, and Go for OWASP vulnerabilities, injection bugs, and insecure dependencies.
              </p>
            </div>

            {/* 4. SOC Log Analysis */}
            <div
              onClick={() => handleQuickLaunch(sampleSshLog, 'SOC Log Investigation')}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1 flex items-center justify-between">
                <span>SOC Log Analysis</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parse SSH, Apache, Nginx, Linux syslog, and cloud audit logs to detect brute-force and privilege escalation.
              </p>
            </div>

            {/* 5. Cybersecurity Learning */}
            <div
              onClick={() => handleQuickLaunch('Explain the mechanics of Cross-Site Scripting (XSS) and CSP headers', 'Learning: XSS & CSP')}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1 flex items-center justify-between">
                <span>Cyber Learning</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master core security concepts, attack techniques, and defense strategies in simple, structured language.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: VISUAL FLOW */}
      <section className="relative py-16 sm:py-24 border-t border-slate-800 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
              AUTONOMOUS INVESTIGATION PIPELINE
            </h2>
            <p className="text-sm text-slate-400">
              How CyberSphere transforms raw chaotic data into actionable security intelligence.
            </p>
          </div>

          {/* Visual Step Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center mx-auto">
                01
              </div>
              <h4 className="text-sm font-bold uppercase text-white font-display">USER INPUT</h4>
              <p className="text-xs text-slate-400">
                Paste logs, code, domain, or ask a question in one field.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-blue-400 text-blue-300 text-xs font-mono font-bold flex items-center justify-center mx-auto">
                02
              </div>
              <h4 className="text-sm font-bold uppercase text-white font-display">UNDERSTANDS</h4>
              <p className="text-xs text-slate-400">
                Classifies syntax, file headers, IP indicators, and schemas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-purple-400 text-purple-300 text-xs font-mono font-bold flex items-center justify-center mx-auto">
                03
              </div>
              <h4 className="text-sm font-bold uppercase text-white font-display">AGENT SELECTION</h4>
              <p className="text-xs text-slate-400">
                Activates SOC, Code Security, Threat Intel, or MITRE agent.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-indigo-400 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center mx-auto">
                04
              </div>
              <h4 className="text-sm font-bold uppercase text-white font-display">SECURITY ANALYSIS</h4>
              <p className="text-xs text-slate-400">
                Correlates threat signatures, MITRE techniques, and CVE indices.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center mx-auto">
                05
              </div>
              <h4 className="text-sm font-bold uppercase text-white font-display">CLEAR SOLUTIONS</h4>
              <p className="text-xs text-slate-400">
                Delivers risk ratings, findings, and copyable remediation commands.
              </p>
            </div>

          </div>

          {/* Bottom Banner CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-display text-white mb-1">
                READY TO ELEVATE YOUR CYBERSECURITY DEFENSE?
              </h3>
              <p className="text-sm text-slate-300">
                Experience an intelligent cybersecurity expert working beside you in real time.
              </p>
            </div>
            <button
              onClick={() => navigate('/assistant')}
              className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all cursor-pointer whitespace-nowrap"
            >
              LAUNCH COMMAND CENTER
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
