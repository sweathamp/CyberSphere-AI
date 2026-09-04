import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Globe,
  Code,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

import { CyberSphereVisual } from '../components/CyberSphereVisual';
import { useApp } from '../context/AppContext';
import {
  sampleSshLog,
  samplePythonVulnerableCode,
} from '../data/mockData';

export const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { createNewInvestigation } = useApp();

  const handleLaunch = (
    title: string,
    prompt: string,
    category: any
  ) => {
    createNewInvestigation(title, prompt, category);
    navigate('/assistant');
  };

  /*
    CyberSphere currently provides these real analysis workflows.
    Removed old placeholder/fake agents such as:
    - MITRE ATT&CK Agent
    - Cyber Learning Agent
    - Other unsupported autonomous agent claims
  */

  const capabilities = [
    {
      id: 'logs',
      name: 'Security Log Analysis',
      role: 'Log & Incident Investigation',
      badge: 'SECURITY ANALYSIS',
      badgeColor:
        'text-cyan-300 bg-cyan-950/80 border-cyan-500/40',
      icon: (
        <ShieldAlert className="w-6 h-6 text-cyan-400" />
      ),
      description:
        'Analyze security logs and suspicious activity to identify authentication anomalies, brute-force attempts, unusual access patterns, and potential security incidents.',
      capabilities: [
        'Authentication and SSH log analysis',
        'Brute-force activity identification',
        'Suspicious IP and session investigation',
        'Security incident observations and recommendations',
      ],
      samplePrompt: sampleSshLog,
      sampleLabel: 'Analyze Security Logs',
    },

    {
      id: 'threat',
      name: 'Threat Intelligence Analysis',
      role: 'IP, Domain & URL Investigation',
      badge: 'THREAT CHECK',
      badgeColor:
        'text-blue-300 bg-blue-950/80 border-blue-500/40',
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      description:
        'Investigate suspicious IP addresses, domains, URLs, and other indicators to help understand potential threats and assess their security relevance.',
      capabilities: [
        'Suspicious IP investigation',
        'Domain and URL security analysis',
        'Threat indicator assessment',
        'Risk observations and defensive guidance',
      ],
      samplePrompt:
        'Analyze the following suspicious IP address and provide a defensive threat assessment:\n\nIP Address: 194.26.29.112\n\nClearly explain the potential security risks, what should be investigated, and recommended defensive actions.',
      sampleLabel: 'Investigate Suspicious IP',
    },

    {
      id: 'code',
      name: 'Code Security Analysis',
      role: 'Source Code Vulnerability Review',
      badge: 'CODE ANALYSIS',
      badgeColor:
        'text-emerald-300 bg-emerald-950/80 border-emerald-500/40',
      icon: <Code className="w-6 h-6 text-emerald-400" />,
      description:
        'Review source code for common security weaknesses, insecure implementation patterns, exposed secrets, and vulnerabilities that may require remediation.',
      capabilities: [
        'Common vulnerability identification',
        'Injection risk analysis',
        'Hardcoded secret detection',
        'Secure coding recommendations',
      ],
      samplePrompt: samplePythonVulnerableCode,
      sampleLabel: 'Analyze Vulnerable Code',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 py-10 px-4 sm:px-6 lg:px-8 cyber-grid">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            CyberSphere Analysis Capabilities
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
            CYBERSPHERE
            <br />
            <span className="text-cyan-400">
              SECURITY INTELLIGENCE
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
            Explore the core cybersecurity analysis capabilities currently
            available in CyberSphere AI. Analyze security logs, investigate
            suspicious indicators, and review source code for potential
            security issues.
          </p>
        </div>

        {/* CYBERSPHERE CORE */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">

          <div className="space-y-4 max-w-lg">

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>CYBERSPHERE AI CORE</span>
            </div>

            <h2 className="text-2xl font-bold font-display uppercase text-white">
              UNIFIED SECURITY ANALYSIS
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              CyberSphere AI provides a unified environment for analyzing
              cybersecurity data. Submit logs, suspicious indicators, or
              source code and receive structured security observations and
              defensive recommendations.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">

              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 font-bold">
                ✓ Security Analysis
              </span>

              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 font-bold">
                ✓ Threat Investigation
              </span>

              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 font-bold">
                ✓ Code Review
              </span>

            </div>
          </div>

          <div className="flex justify-center">
            <CyberSphereVisual
              size="md"
              statusText="SECURITY INTELLIGENCE READY"
            />
          </div>

        </div>

        {/* CAPABILITIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {capabilities.map((capability) => (

            <div
              key={capability.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 group"
            >

              <div className="space-y-4">

                {/* ICON & BADGE */}
                <div className="flex items-center justify-between">

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    {capability.icon}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${capability.badgeColor}`}
                  >
                    {capability.badge}
                  </span>

                </div>

                {/* TITLE */}
                <div>

                  <h3 className="text-base font-bold font-display text-white">
                    {capability.name}
                  </h3>

                  <span className="text-xs font-mono text-cyan-400">
                    {capability.role}
                  </span>

                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {capability.description}
                </p>

                {/* FEATURES */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">

                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">
                    Available Capabilities:
                  </span>

                  {capability.capabilities.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-2 text-xs text-slate-400"
                    >

                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />

                      <span>{item}</span>

                    </div>

                  ))}

                </div>

              </div>

              {/* BUTTON */}
              <div className="pt-4 border-t border-slate-800">

                <button
                  onClick={() =>
                    handleLaunch(
                      capability.name,
                      capability.samplePrompt,
                      capability.id
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-[0_0_15px_rgba(8,145,178,0.2)]"
                >

                  <Terminal className="w-3.5 h-3.5" />

                  <span>
                    OPEN ANALYSIS
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
};