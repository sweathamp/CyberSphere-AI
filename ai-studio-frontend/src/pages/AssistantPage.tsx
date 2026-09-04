import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Code,
  FileText,
  Globe,
  Paperclip,
  Plus,
  RefreshCw,
  Send,
  Shield,
  User,
  X,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { ActivityPipeline } from '../components/ActivityPipeline';
import { SecurityReportCard } from '../components/SecurityReportCard';
import { InputClassifierPill } from '../components/InputClassifierPill';
import { classifyInput } from '../utils/inputClassifier';
import { SecurityFile } from '../types';
import {
  sampleSshLog,
  samplePythonVulnerableCode,
} from '../data/mockData';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    currentInvestigation,
    isAnalyzing,
    pipelineStages,
    activeAgent,
    sendMessage,
    createNewInvestigation,
    addFile,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [attachedFile, setAttachedFile] =
    useState<SecurityFile | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const liveClassification = classifyInput(
    inputMessage,
    attachedFile?.name
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [
    currentInvestigation?.messages,
    isAnalyzing,
  ]);

  /*
    STATUS MAP FIX

    Backend status object may contain:
    {
      orchestrator: "completed",
      soc: undefined
    }

    ActivityPipeline expects only string values.

    So we normalize everything into:
    Record<string, string>
  */

  const latestMessage =
    currentInvestigation?.messages?.slice(-1)[0];

  const rawStatus =
    latestMessage?.status as
      | Record<string, string | undefined>
      | undefined;

  const normalizedStatusMap: Record<string, string> =
    {};

  if (rawStatus) {
    Object.entries(rawStatus).forEach(
      ([key, value]) => {
        if (typeof value === 'string') {
          normalizedStatusMap[key] = value;
        }
      }
    );
  }

  /*
    SEND MESSAGE
  */

  const handleSend = async (
    e?: React.FormEvent
  ) => {
    if (e) {
      e.preventDefault();
    }

    if (
      (!inputMessage.trim() && !attachedFile) ||
      isAnalyzing
    ) {
      return;
    }

    const textToSend = inputMessage;
    const fileToSend = attachedFile;

    setInputMessage('');
    setAttachedFile(null);

    await sendMessage(
      textToSend,
      fileToSend
    );
  };

  /*
    ENTER TO SEND
  */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  /*
    FILE UPLOAD
  */

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile =
      e.target.files?.[0];

    if (!uploadedFile) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const content =
        event.target?.result as string;

      const fileName =
        uploadedFile.name.toLowerCase();

      /*
        FILE TYPE
      */

      const detectedType =
        fileName.endsWith('.py') ||
        fileName.endsWith('.js') ||
        fileName.endsWith('.ts') ||
        fileName.endsWith('.java') ||
        fileName.endsWith('.cpp') ||
        fileName.endsWith('.c') ||
        fileName.endsWith('.php')
          ? 'code'
          : fileName.endsWith('.log') ||
            fileName.endsWith('.txt')
          ? 'log'
          : fileName.endsWith('.csv')
          ? 'csv'
          : 'document';

      /*
        CATEGORY FIX

        Allowed categories:

        code
        csv
        document
        logs
        pdf
        zip
      */

      const detectedCategory:
        | 'code'
        | 'csv'
        | 'document'
        | 'logs'
        | 'pdf'
        | 'zip' =
        fileName.endsWith('.py') ||
        fileName.endsWith('.js') ||
        fileName.endsWith('.ts') ||
        fileName.endsWith('.java') ||
        fileName.endsWith('.cpp') ||
        fileName.endsWith('.c') ||
        fileName.endsWith('.php')
          ? 'code'
          : fileName.endsWith('.log') ||
            fileName.endsWith('.txt')
          ? 'logs'
          : fileName.endsWith('.csv')
          ? 'csv'
          : fileName.endsWith('.pdf')
          ? 'pdf'
          : fileName.endsWith('.zip')
          ? 'zip'
          : 'document';

      /*
        ADD FILE
      */

      const newFileObj = addFile({
        name: uploadedFile.name,

        type: detectedType,

        category: detectedCategory,

        size: `${(
          uploadedFile.size / 1024
        ).toFixed(1)} KB`,

        uploadDate:
          new Date().toLocaleDateString(
            'en-US',
            {
              month: 'short',
              day: 'numeric',
            }
          ),

        previewContent:
          content.slice(0, 800),
      });

      setAttachedFile(newFileObj);
    };

    reader.readAsText(uploadedFile);
  };

  /*
    PRESET SELECT
  */

  const handlePresetSelect = (
    presetText: string
  ) => {
    setInputMessage(presetText);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col bg-[#020617] text-slate-300 cyber-grid overflow-hidden">

      {/* TOP COMMAND BAR */}

      <div className="h-14 border-b border-slate-800 bg-slate-950/70 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md">

        <div className="flex items-center gap-3">

          <button
            id="assistant-back-btn"
            onClick={() =>
              navigate('/dashboard')
            }
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />

            <span className="hidden sm:inline">
              DASHBOARD
            </span>

          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-white">
                CYBERSPHERE ASSISTANT
              </h2>

              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                ACTIVE SESSION
              </span>

            </div>

            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              AI-POWERED CYBERSECURITY
              INVESTIGATION WORKSPACE
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            id="assistant-new-session-btn"
            onClick={() =>
              createNewInvestigation()
            }
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >

            <Plus className="w-3.5 h-3.5" />

            <span className="hidden sm:inline">
              NEW INVESTIGATION
            </span>

          </button>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-400">

            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />

            <span className="font-bold tracking-wider uppercase">
              READY
            </span>

          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* CHAT AREA */}

        <div className="w-full lg:w-[75%] flex flex-col h-full bg-slate-950/20 relative">

          {/* CHAT MESSAGES */}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* EMPTY STATE */}

            {(
              !currentInvestigation?.messages ||
              currentInvestigation.messages.length === 0
            ) && (

              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-xl mx-auto my-auto">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">

                  <Shield className="w-7 h-7 text-white" />

                </div>

                <div className="space-y-2">

                  <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                    I AM READY TO INVESTIGATE WITH YOU.
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">

                    Provide any cybersecurity input below.
                    I will automatically identify the context,
                    activate the right intelligence agents,
                    and provide actionable remediation.

                  </p>

                </div>

                {/* SAMPLE CARDS */}

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">

                  <button
                    onClick={() =>
                      handlePresetSelect(
                        sampleSshLog
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-xs font-mono transition-all text-slate-300 cursor-pointer"
                  >

                    <div className="text-cyan-400 font-bold mb-1 flex items-center justify-between">

                      <span>
                        SSH Brute Force Log
                      </span>

                      <Activity className="w-3.5 h-3.5" />

                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">

                      Failed password for root from
                      192.168.1.100 port 45212 ssh2...

                    </p>

                  </button>

                  <button
                    onClick={() =>
                      handlePresetSelect(
                        samplePythonVulnerableCode
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-xs font-mono transition-all text-slate-300 cursor-pointer"
                  >

                    <div className="text-emerald-400 font-bold mb-1 flex items-center justify-between">

                      <span>
                        Python SQL Injection Code
                      </span>

                      <Code className="w-3.5 h-3.5" />

                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">

                      Analyze vulnerable Python database
                      query construction...

                    </p>

                  </button>

                  <button
                    onClick={() =>
                      handlePresetSelect(
                        'Is IP 194.26.29.112 associated with any active ransomware campaigns or botnets?'
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 text-xs font-mono transition-all text-slate-300 cursor-pointer"
                  >

                    <div className="text-blue-400 font-bold mb-1 flex items-center justify-between">

                      <span>
                        Threat Intel Lookup
                      </span>

                      <Globe className="w-3.5 h-3.5" />

                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">

                      Lookup suspicious IP and domain
                      reputation...

                    </p>

                  </button>

                  <button
                    onClick={() =>
                      handlePresetSelect(
                        'Explain how Cross-Site Request Forgery (CSRF) tokens work.'
                      )
                    }
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 text-xs font-mono transition-all text-slate-300 cursor-pointer"
                  >

                    <div className="text-purple-400 font-bold mb-1 flex items-center justify-between">

                      <span>
                        Cyber Learning
                      </span>

                      <BookOpen className="w-3.5 h-3.5" />

                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">

                      Learn cybersecurity concepts
                      with CyberSphere...

                    </p>

                  </button>

                </div>

              </div>

            )}

            {/* MESSAGES */}

            {currentInvestigation?.messages?.map(
              (msg) => (

                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    msg.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  {msg.sender === 'assistant' && (

                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg">

                      <Shield className="w-5 h-5" />

                    </div>

                  )}

                  <div
                    className={`max-w-3xl space-y-2 ${
                      msg.sender === 'user'
                        ? 'items-end text-right'
                        : 'items-start text-left'
                    }`}
                  >

                    {/* MESSAGE METADATA */}

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">

                      {msg.sender === 'user' ? (

                        <>
                          <span>
                            {msg.timestamp}
                          </span>

                          <span className="text-slate-300 font-bold">
                            OPERATOR
                          </span>

                          {msg.detectedType && (

                            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold">

                              {msg.detectedType}

                            </span>

                          )}

                        </>

                      ) : (

                        <>

                          <span className="text-cyan-300 font-bold uppercase tracking-wider">

                            {msg.agent ||
                              'CYBERSPHERE INTELLIGENCE'}

                          </span>

                          <span className="text-slate-500">
                            |
                          </span>

                          <span>
                            {msg.timestamp}
                          </span>

                        </>

                      )}

                    </div>

                    {/* ATTACHMENTS */}

                    {msg.attachments &&
                      msg.attachments.length > 0 && (

                        <div className="inline-flex flex-wrap gap-2 mb-1">

                          {msg.attachments.map(
                            (att, idx) => (

                              <div
                                key={idx}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2"
                              >

                                <FileText className="w-3.5 h-3.5 text-cyan-400" />

                                <span>
                                  {att.name}
                                </span>

                                <span className="text-slate-500">
                                  ({att.size})
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    {/* MESSAGE */}

                    <div
                      className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900/60 border border-slate-800 text-slate-200 rounded-tr-none text-left font-mono whitespace-pre-wrap'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                      }`}
                    >

                      {msg.sender === 'assistant' ? (
                        <div className="cybersphere-markdown text-slate-200">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => (
                                <h1 className="mb-4 text-xl font-bold text-cyan-300">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="mt-5 mb-3 text-lg font-bold text-cyan-300">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="mt-4 mb-2 text-base font-bold text-cyan-200">{children}</h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="mt-4 mb-2 text-sm font-bold text-cyan-200">{children}</h4>
                              ),
                              p: ({ children }) => (
                                <p className="mb-3 leading-7 text-slate-300">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-3 list-disc space-y-1 pl-5 text-slate-300">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-3 list-decimal space-y-1 pl-5 text-slate-300">{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="leading-7">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold text-cyan-200">{children}</strong>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="my-3 border-l-2 border-cyan-500/60 pl-4 italic text-slate-400">{children}</blockquote>
                              ),
                              code: ({ children, className }) => (
                                <code
                                  className={
                                    className
                                      ? "font-mono text-xs text-emerald-300"
                                      : "rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-emerald-300"
                                  }
                                >
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="my-4 overflow-x-auto rounded-xl border border-slate-700 bg-[#020617] p-4">{children}</pre>
                              ),
                              hr: () => <hr className="my-5 border-slate-700" />,
                            }}
                          >
                            {msg.message}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap font-mono">
                          {msg.message}
                        </div>
                      )}

                    </div>

                    {/* SECURITY REPORT */}

                    {msg.structuredFinding && (

                      <SecurityReportCard
                        finding={
                          msg.structuredFinding
                        }
                      />

                    )}

                  </div>

                  {msg.sender === 'user' && (

                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400">

                      <User className="w-4 h-4" />

                    </div>

                  )}

                </div>

              )
            )}

            {/* ANALYZING */}

            {isAnalyzing && (

              <div className="flex gap-3 sm:gap-4 justify-start animate-fadeIn">

                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-cyan-400 flex items-center justify-center">

                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />

                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 rounded-tl-none text-xs font-mono text-cyan-300">

                  CYBERSPHERE INTELLIGENCE ENGINE
                  RUNNING...

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          {/* INPUT AREA */}

          <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#010409]/95 backdrop-blur-xl space-y-2.5">

            {(inputMessage.trim() ||
              attachedFile) && (

              <div className="flex items-center justify-between px-1">

                <InputClassifierPill
                  classification={
                    liveClassification
                  }
                />

                <span className="text-[10px] font-mono text-slate-500">

                  Enter to Submit • Shift+Enter
                  for newline

                </span>

              </div>

            )}

            {/* FILE PREVIEW */}

            {attachedFile && (

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-xs font-mono text-cyan-300">

                <FileText className="w-3.5 h-3.5" />

                <span>

                  Attached: {attachedFile.name}
                  {' '}
                  ({attachedFile.size})

                </span>

                <button
                  onClick={() =>
                    setAttachedFile(null)
                  }
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >

                  <X className="w-3 h-3" />

                </button>

              </div>

            )}

            {/* INPUT FORM */}

            <form
              onSubmit={handleSend}
              className="relative flex items-end gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-cyan-500/60 transition-all"
            >

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".log,.txt,.py,.js,.ts,.json,.csv,.pdf,.zip,.sh,.java"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors flex-shrink-0 cursor-pointer"
              >

                <Paperclip className="w-4 h-4" />

              </button>

              <textarea
                id="assistant-input-field"
                rows={2}
                value={inputMessage}
                onChange={(e) =>
                  setInputMessage(
                    e.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask a cybersecurity question, paste logs, source code, IP, domain, or URL..."
                className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono py-1.5 px-2 max-h-36 overflow-y-auto"
              />

              <button
                type="submit"
                id="assistant-send-btn"
                disabled={
                  (!inputMessage.trim() &&
                    !attachedFile) ||
                  isAnalyzing
                }
                className={`py-2 px-6 rounded-xl font-bold text-xs flex-shrink-0 transition-all duration-200 cursor-pointer uppercase tracking-wider ${
                  (!inputMessage.trim() &&
                    !attachedFile) ||
                  isAnalyzing
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >

                <span className="hidden sm:inline">
                  SEND
                </span>

                <Send className="w-3.5 h-3.5 sm:hidden inline" />

              </button>

            </form>

            {/* QUICK PRESETS */}

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-slate-400">

              <span className="text-slate-500 text-[10px] uppercase font-bold">

                PRESETS:

              </span>

              <button
                onClick={() =>
                  handlePresetSelect(
                    sampleSshLog
                  )
                }
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
              >
                SSH Logs
              </button>

              <button
                onClick={() =>
                  handlePresetSelect(
                    samplePythonVulnerableCode
                  )
                }
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
              >
                Vulnerable Code
              </button>

              <button
                onClick={() =>
                  handlePresetSelect(
                    'Analyze IP 194.26.29.112'
                  )
                }
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
              >
                IP Threat Check
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT ACTIVITY PANEL */}

        <div className="hidden lg:block lg:w-[25%] h-full">

          <ActivityPipeline
            stages={pipelineStages}
            isAnalyzing={isAnalyzing}
            activeAgent={activeAgent}
            statusMap={normalizedStatusMap}
          />

        </div>

      </div>

    </div>
  );
};