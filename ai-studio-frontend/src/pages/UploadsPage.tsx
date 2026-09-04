import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderLock,
  UploadCloud,
  FileText,
  FileCode,
  Trash2,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  FileSpreadsheet,
  FileArchive,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SecurityFile } from '../types';

export const UploadsPage: React.FC = () => {
  const navigate = useNavigate();
  const { files, addFile, removeFile, quickAnalyzeFile } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processFile(selected);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      let type: SecurityFile['type'] = 'document';
      if (file.name.endsWith('.py') || file.name.endsWith('.js') || file.name.endsWith('.ts')) {
        type = 'code';
      } else if (file.name.endsWith('.log') || file.name.endsWith('.txt')) {
        type = 'log';
      } else if (file.name.endsWith('.csv')) {
        type = 'csv';
      }

      addFile({
        name: file.name,
        type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        previewContent: content.slice(0, 1000),
      });
    };
    reader.readAsText(file);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'log':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-amber-400" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleAnalyze = (file: SecurityFile) => {
    quickAnalyzeFile(file);
    navigate('/assistant');
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 cyber-grid space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wide text-white flex items-center gap-2.5">
            <FolderLock className="w-7 h-7 text-emerald-400" />
            <span>SECURITY DATA & TELEMETRY VAULT</span>
          </h1>
          <p className="text-sm text-slate-400 font-light mt-1">
            Securely upload logs, repositories, PCAP summaries, and compliance CSVs for autonomous multi-agent analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>ZERO-KNOWLEDGE STORAGE</span>
        </div>
      </div>

      {/* DRAG AND DROP UPLOAD ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_40px_rgba(6,182,212,0.3)] scale-[1.01]'
            : 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-slate-900/90 shadow-xl'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept=".log,.txt,.py,.js,.ts,.json,.csv,.pdf,.zip"
        />

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold font-display uppercase tracking-wide text-white mb-1">
          DROP SECURITY FILES HERE
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-3 font-light">
          Drag & drop files directly or click to browse your local file system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">.LOG</span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">.PY / .JS</span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">.CSV</span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">.JSON</span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">.PDF</span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">.ZIP</span>
        </div>
      </div>

      {/* FILE REPOSITORY TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-200">
            Ingested Security Assets ({files.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">ENCRYPTED AT REST</span>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4 text-right">Autonomous Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{file.name}</div>
                        {file.previewContent && (
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                            {file.previewContent.slice(0, 60)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 uppercase text-slate-400">{file.type}</td>
                    <td className="px-6 py-4 text-slate-400">{file.size}</td>
                    <td className="px-6 py-4 text-slate-400">{file.uploadDate}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleAnalyze(file)}
                        className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>ANALYZE</span>
                      </button>

                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 rounded-lg hover:bg-red-950/60 border border-transparent hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
