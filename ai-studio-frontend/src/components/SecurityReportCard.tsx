import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { StructuredFinding, RiskLevel } from '../types';

interface SecurityReportCardProps {
  finding: StructuredFinding;
}

export const SecurityReportCard: React.FC<SecurityReportCardProps> = ({ finding }) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-wider uppercase font-mono">
            CRITICAL RISK
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-wider uppercase font-mono">
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider uppercase font-mono">
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase font-mono">
            LOW RISK
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-wider uppercase font-mono">
            SECURITY ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="mt-3 w-full rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5">
      
      {/* Header with Risk Level & Agent Source */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {getRiskBadge(finding.riskLevel)}
          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider uppercase font-mono">
            {finding.agentName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            Investigation Report
          </span>
        </div>
      </div>

      {/* Simple Plain-Language Explanation for Beginners */}
      {finding.simpleExplanation && (
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-slate-300 text-sm leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-1">
              Assessment Summary
            </span>
            <p className="text-sm text-slate-300">{finding.simpleExplanation}</p>
          </div>
        </div>
      )}

      {/* Observed Findings & Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Observed Findings */}
        {finding.observedFindings && finding.observedFindings.length > 0 && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Observed Findings
            </h4>
            <ul className="space-y-2">
              {finding.observedFindings.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Possible Threat Impact */}
        {finding.possibleImpact && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Threat Impact
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {finding.possibleImpact}
            </p>
          </div>
        )}
      </div>

      {/* In-depth Security Analysis */}
      {finding.securityAnalysis && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Security Analysis & Threat Correlation
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {finding.securityAnalysis}
          </p>
        </div>
      )}

      {/* Recommended Actions */}
      {finding.recommendedActions && finding.recommendedActions.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Recommended Remediation Actions
          </h4>
          <div className="space-y-2.5">
            {finding.recommendedActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{action.title}</span>
                  </div>
                  {action.priority && (
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        action.priority === 'immediate'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {action.priority}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2 pl-5 leading-relaxed">
                  {action.description}
                </p>

                {action.command && (
                  <div className="mt-2 pl-5">
                    <div className="relative group rounded-lg bg-black/80 border border-slate-800 p-2.5 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                      <div className="overflow-x-auto whitespace-pre-wrap break-all pr-8">
                        <Terminal className="inline w-3 h-3 text-emerald-500 mr-2" />
                        {action.command}
                      </div>
                      <button
                        onClick={() => copyToClipboard(action.command!, idx)}
                        className="absolute right-2 top-2 p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Technical Details for Advanced Security Teams */}
      {finding.technicalDetails && (
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              {showTechnical ? 'HIDE TECHNICAL DETAILS' : 'VIEW TECHNICAL DETAILS (MITRE & EVIDENCE)'}
            </span>
            {showTechnical ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {showTechnical && (
            <div className="mt-3 p-4 rounded-xl bg-[#010409] border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
              {/* MITRE ATT&CK Matrix Tactics */}
              {finding.technicalDetails.mitreTactics && (
                <div>
                  <div className="text-[11px] text-purple-400 font-bold uppercase mb-1.5 flex items-center gap-1.5">
                    <span>🎯</span> MITRE ATT&CK Mapping
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {finding.technicalDetails.mitreTactics.map((tactic, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300 text-[11px] font-mono"
                      >
                        {tactic.id}: {tactic.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CVE & CWE References */}
              {finding.technicalDetails.cveReferences && (
                <div>
                  <div className="text-[11px] text-amber-400 font-bold uppercase mb-1.5 flex items-center gap-1.5">
                    <span>🛡</span> Security Standards & Weakness Class
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {finding.technicalDetails.cveReferences.map((cve, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                      >
                        {cve}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Evidence Snippets */}
              {finding.technicalDetails.evidenceSnippets && (
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                    <span>📄</span> Extracted Evidence Signatures
                  </div>
                  <div className="p-2.5 rounded bg-black/90 border border-slate-800 text-[11px] text-cyan-200 overflow-x-auto whitespace-pre-wrap">
                    {finding.technicalDetails.evidenceSnippets.join('\n')}
                  </div>
                </div>
              )}

              {/* Extra Telemetry Specs */}
              {finding.technicalDetails.rawDetails && (
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  {finding.technicalDetails.rawDetails}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
