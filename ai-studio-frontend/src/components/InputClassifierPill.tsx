import React from 'react';
import {
  Code,
  ShieldAlert,
  Activity,
  Globe,
  Database,
  BookOpen,
  Target,
  FileText,
  AlertTriangle,
  Fingerprint,
  Network,
  Sparkles,
} from 'lucide-react';
import { InputClassification } from '../types';

interface InputClassifierPillProps {
  classification: InputClassification;
}

export const InputClassifierPill: React.FC<InputClassifierPillProps> = ({ classification }) => {
  const getIcon = () => {
    switch (classification.iconName) {
      case 'Code':
        return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Activity':
        return <Activity className="w-3.5 h-3.5 text-blue-400" />;
      case 'Globe':
        return <Globe className="w-3.5 h-3.5 text-sky-400" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      case 'Target':
        return <Target className="w-3.5 h-3.5 text-rose-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'Fingerprint':
        return <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Network':
        return <Network className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-900/30 text-cyan-400 text-[10px] rounded-md border border-cyan-500/20 uppercase font-bold tracking-tight shadow-sm backdrop-blur-md transition-all duration-300 animate-fadeIn">
      {getIcon()}
      <span className="font-semibold text-slate-100">{classification.label}</span>
      <span className="text-slate-500 font-normal">→</span>
      <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
        {classification.recommendedAgent}
      </span>
    </div>
  );
};
