import React from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Circle,
  Radio,
  Cpu,
  Zap,
  Target,
  FileCode,
  Globe,
  BookOpen,
} from 'lucide-react';
import { PipelineStage, AgentType } from '../types';

interface ActivityPipelineProps {
  stages: PipelineStage[];
  isAnalyzing: boolean;
  activeAgent: AgentType | string;
  statusMap?: Record<string, string>;
}

export const ActivityPipeline: React.FC<ActivityPipelineProps> = ({
  stages,
  isAnalyzing,
  activeAgent,
  statusMap,
}) => {
  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'SOC Agent':
        return <ShieldAlert className="w-4 h-4 text-cyan-400" />;
      case 'Code Security Agent':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'Threat Intelligence Agent':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'MITRE Analysis Agent':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'Cyber Learning Agent':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      default:
        return <Cpu className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <aside className="w-full h-full bg-[#010409] p-6 flex flex-col gap-6 overflow-y-auto border-l border-slate-800 select-none">
      
      {/* Activity Timeline Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            CyberSphere Activity
          </h3>
          <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
            {isAnalyzing ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        {/* Vertical Stepper Timeline */}
        <div className="space-y-6 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-800" />

          {stages.map((stage, idx) => {
            const isDone = stage.status === 'completed';
            const isActive = stage.status === 'active';
            const isWait = stage.status === 'waiting' || stage.status === 'idle';

            return (
              <div
                key={stage.id || idx}
                className={`flex items-start gap-4 relative z-10 transition-all ${
                  isWait ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {/* Node Status Indicator */}
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] border-4 border-[#010409] flex-shrink-0" />
                ) : isActive ? (
                  <div className="w-4 h-4 rounded-full bg-slate-900 border-4 border-[#010409] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-cyan-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-900 border-4 border-[#010409] flex-shrink-0" />
                )}

                {/* Node Text Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold ${
                      isActive
                        ? 'text-cyan-400'
                        : isDone
                        ? 'text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {stage.detail ||
                      (isDone
                        ? 'Execution complete'
                        : isActive
                        ? 'Processing heuristics...'
                        : 'Pending queue')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Ecosystem Card (from Sophisticated Dark layout) */}
      <div className="mt-auto">
        <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
            Agent Ecosystem
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className={`text-slate-300 font-medium ${activeAgent === 'SOC Agent' ? 'text-white font-bold' : ''}`}>
                SOC Analyst
              </span>
              <span className={`text-[10px] font-bold ${activeAgent === 'SOC Agent' ? 'text-cyan-400' : 'text-slate-500'}`}>
                {activeAgent === 'SOC Agent' || statusMap?.soc === 'completed' ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>

            <div className={`flex items-center justify-between ${activeAgent === 'Threat Intelligence Agent' ? '' : 'opacity-50'}`}>
              <span className="text-slate-300 font-medium">Threat Intel</span>
              <span className={`text-[10px] font-bold ${activeAgent === 'Threat Intelligence Agent' ? 'text-cyan-400' : 'text-slate-500'}`}>
                {activeAgent === 'Threat Intelligence Agent' || statusMap?.threat === 'completed' ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>

            <div className={`flex items-center justify-between ${activeAgent === 'Code Security Agent' ? '' : 'opacity-50'}`}>
              <span className="text-slate-300 font-medium">Code Sec</span>
              <span className={`text-[10px] font-bold ${activeAgent === 'Code Security Agent' ? 'text-cyan-400' : 'text-slate-500'}`}>
                {activeAgent === 'Code Security Agent' || statusMap?.code === 'completed' ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>

            <div className={`flex items-center justify-between ${activeAgent === 'MITRE Analysis Agent' ? '' : 'opacity-50'}`}>
              <span className="text-slate-300 font-medium">MITRE Mapper</span>
              <span className={`text-[10px] font-bold ${activeAgent === 'MITRE Analysis Agent' ? 'text-purple-400' : 'text-slate-500'}`}>
                {activeAgent === 'MITRE Analysis Agent' || statusMap?.mitre === 'completed' ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>CORE NODE</span>
            <span className="text-emerald-400">SYNCED</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
