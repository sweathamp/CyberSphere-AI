export type AgentType = 
  | 'SOC Agent'
  | 'Code Security Agent'
  | 'Threat Intelligence Agent'
  | 'MITRE Analysis Agent'
  | 'Cyber Learning Agent'
  | 'CyberSphere Orchestrator';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'INFO';

export type InvestigationStatus = 'in_progress' | 'completed' | 'waiting' | 'action_required';

export interface ActionItem {
  title: string;
  description: string;
  command?: string;
  priority?: 'immediate' | 'medium' | 'low';
}

export interface TechnicalDetails {
  mitreTactics?: { id: string; name: string; url?: string }[];
  cveReferences?: string[];
  evidenceSnippets?: string[];
  rawDetails?: string;
  signatures?: string[];
}

export interface StructuredFinding {
  riskLevel: RiskLevel;
  observedFindings: string[];
  securityAnalysis: string;
  possibleImpact: string;
  recommendedActions: ActionItem[];
  technicalDetails?: TechnicalDetails;
  agentName: string;
  simpleExplanation?: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  message: string;
  detectedType?: string;
  structuredFinding?: StructuredFinding;
  agent?: string;
  status?: {
    orchestrator?: 'completed' | 'active' | 'waiting';
    soc?: 'completed' | 'active' | 'waiting';
    threat?: 'completed' | 'active' | 'waiting';
    mitre?: 'completed' | 'active' | 'waiting';
    code?: 'completed' | 'active' | 'waiting';
    learning?: 'completed' | 'active' | 'waiting';
    [key: string]: string | undefined;
  };
  attachments?: Attachment[];
}

export interface Investigation {
  id: string;
  title: string;
  agent: AgentType | string;
  riskLevel: RiskLevel;
  status: InvestigationStatus;
  timestamp: string;
  updatedAt?: string;
  snippet: string;
  messages: ChatMessage[];
  category: 'soc' | 'code' | 'threat' | 'learning' | 'mitre';
  attachedFiles?: string[];
}

export interface SecurityFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  previewContent?: string;
  category: 'logs' | 'code' | 'pdf' | 'csv' | 'zip' | 'document';
}

export interface PipelineStage {
  id: string;
  label: string;
  status: 'idle' | 'active' | 'completed' | 'waiting';
  detail?: string;
  agent?: string;
}

export interface InputClassification {
  type: 'code' | 'log' | 'threat_indicator' | 'learning_question' | 'general';
  subType: string;
  recommendedAgent: AgentType;
  confidence: number;
  label: string;
  iconName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  securityClearance: string;
  avatar?: string;
}
