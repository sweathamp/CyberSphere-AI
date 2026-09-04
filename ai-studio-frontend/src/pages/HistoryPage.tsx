import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  ArrowRight,
  Clock,
  ShieldAlert,
  Code,
  Globe,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskLevel } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    investigations,
    setCurrentInvestigationId,
    createNewInvestigation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredInvestigations = investigations.filter((inv) => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.agent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || inv.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenInvestigation = (id: string) => {
    setCurrentInvestigationId(id);
    navigate('/assistant');
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] font-mono font-bold">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded bg-orange-950/80 border border-orange-500/50 text-orange-300 text-[10px] font-mono font-bold">
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-mono font-bold">
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold">
            LOW RISK
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono font-bold">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 cyber-grid space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wide text-white flex items-center gap-2.5">
            <History className="w-7 h-7 text-cyan-400" />
            <span>INVESTIGATION HISTORY</span>
          </h1>
          <p className="text-sm text-slate-400 font-light mt-1">
            Complete audit trail and threat intelligence dossiers across all sessions.
          </p>
        </div>

        <button
          onClick={() => {
            createNewInvestigation();
            navigate('/assistant');
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>NEW INVESTIGATION</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            id="history-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, agent, or keyword..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto text-xs font-mono">
          {[
            { id: 'all', label: 'ALL SESSIONS' },
            { id: 'soc', label: 'SOC LOGS' },
            { id: 'code', label: 'CODE AUDITS' },
            { id: 'threat', label: 'THREAT INTEL' },
            { id: 'learning', label: 'LEARNING' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* INVESTIGATION CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInvestigations.map((inv) => (
          <div
            key={inv.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  {inv.agent}
                </span>
                {getRiskBadge(inv.riskLevel)}
              </div>

              <h3 className="text-base font-bold text-white font-display line-clamp-2 group-hover:text-cyan-200 transition-colors">
                {inv.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {inv.snippet}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{inv.timestamp}</span>
              </div>

              <button
                onClick={() => handleOpenInvestigation(inv.id)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>OPEN SESSION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInvestigations.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 font-mono text-xs space-y-2">
          <p>No investigations matched your filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            Clear filters
          </button>
        </div>
      )}

    </div>
  );
};
