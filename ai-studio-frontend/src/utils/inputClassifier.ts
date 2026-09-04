import { AgentType, InputClassification } from '../types';

export function classifyInput(input: string, attachedFileName?: string): InputClassification {
  const text = input.trim();

  // If a file is attached, inspect filename extension
  if (attachedFileName) {
    const lowerName = attachedFileName.toLowerCase();
    if (lowerName.endsWith('.py') || lowerName.endsWith('.js') || lowerName.endsWith('.ts') || 
        lowerName.endsWith('.go') || lowerName.endsWith('.cpp') || lowerName.endsWith('.c') || 
        lowerName.endsWith('.java') || lowerName.endsWith('.php') || lowerName.endsWith('.rb') ||
        lowerName.endsWith('.sql')) {
      return {
        type: 'code',
        subType: `${attachedFileName.split('.').pop()?.toUpperCase()} source file attached`,
        recommendedAgent: 'Code Security Agent',
        confidence: 0.98,
        label: `Source code file: ${attachedFileName}`,
        iconName: 'Code',
      };
    }

    if (lowerName.endsWith('.log') || lowerName.endsWith('.txt') || lowerName.includes('syslog') || 
        lowerName.includes('auth') || lowerName.includes('access')) {
      return {
        type: 'log',
        subType: 'Security Log file attached',
        recommendedAgent: 'SOC Agent',
        confidence: 0.97,
        label: `Security log attached: ${attachedFileName}`,
        iconName: 'ShieldAlert',
      };
    }

    if (lowerName.endsWith('.pcap') || lowerName.endsWith('.csv')) {
      return {
        type: 'log',
        subType: 'Network / Telemetry file attached',
        recommendedAgent: 'SOC Agent',
        confidence: 0.95,
        label: `Telemetry capture attached: ${attachedFileName}`,
        iconName: 'Activity',
      };
    }
  }

  if (!text) {
    return {
      type: 'general',
      subType: 'General Cybersecurity Query',
      recommendedAgent: 'CyberSphere Orchestrator',
      confidence: 0.5,
      label: 'Intelligent Security Core',
      iconName: 'Shield',
    };
  }

  // 1. SSH / Syslog / Authentication Logs Detection
  const sshPatterns = [
    /sshd\[\d+\]:/i,
    /Failed password for/i,
    /Accepted publickey for/i,
    /Invalid user/i,
    /pam_unix\(sshd:auth\)/i,
    /connection closed by \d+\.\d+\.\d+\.\d+/i,
    /Authentication failure for/i,
  ];

  const webLogPatterns = [
    /GET\s+\/[^\s]*\s+HTTP\/1\.[01]/i,
    /POST\s+\/[^\s]*\s+HTTP\/1\.[01]/i,
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s+-\s+-\s+\[\d{2}\/[A-Za-z]{3}\/\d{4}/,
    /nginx\/\d+\.\d+\.\d+/,
    /Apache\/\d+\.\d+\.\d+/,
  ];

  const firewallLogPatterns = [
    /\b(SRC=\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|DST=\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/i,
    /\b(DROP_INPUT|REJECT_INPUT|UFW BLOCK|iptables)\b/i,
    /\b(eventSource|awsRegion|userIdentity|sourceIPAddress)\b/,
  ];

  if (sshPatterns.some((p) => p.test(text))) {
    return {
      type: 'log',
      subType: 'SSH Authentication Logs',
      recommendedAgent: 'SOC Agent',
      confidence: 0.96,
      label: 'SSH Security Logs Detected',
      iconName: 'ShieldAlert',
    };
  }

  if (webLogPatterns.some((p) => p.test(text)) || firewallLogPatterns.some((p) => p.test(text))) {
    return {
      type: 'log',
      subType: 'Network / Web Access Logs',
      recommendedAgent: 'SOC Agent',
      confidence: 0.94,
      label: 'Security Access Logs Detected',
      iconName: 'Activity',
    };
  }

  // 2. Source Code Detection
  const pythonPatterns = [
    /def\s+[a-zA-Z_]\w*\s*\([^)]*\)\s*:/,
    /import\s+[a-zA-Z0-9_.]+|from\s+[a-zA-Z0-9_.]+\s+import/,
    /class\s+[a-zA-Z_]\w*(\s*\(.*\))?\s*:/,
    /if\s+__name__\s*==\s*['"]__main__['"]\s*:/,
    /app\s*=\s*Flask\(__name__\)/,
    /cursor\.execute\(["'].*%(s|d)/,
  ];

  const jsTsPatterns = [
    /(const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*(require\(|async\s*\(|\(.*?\)\s*=>)/,
    /function\s+[a-zA-Z0-9_$]*\s*\([^)]*\)\s*\{/,
    /import\s+.*\s+from\s+['"][^'"]+['"]/,
    /export\s+(default\s+)?(class|function|const|interface)/,
    /app\.(get|post|put|delete|use)\(/,
  ];

  const sqlPatterns = [
    /SELECT\s+.*\s+FROM\s+/i,
    /UNION\s+(ALL\s+)?SELECT\s+/i,
    /INSERT\s+INTO\s+.*VALUES/i,
    /DROP\s+TABLE\s+/i,
    /UPDATE\s+.*SET\s+/i,
    /'\s+OR\s+'?1'?='?1/i,
    /admin'\s*--/,
  ];

  const otherCodePatterns = [
    /#include\s+<.*?>/,
    /package\s+main;?\s+import/,
    /public\s+class\s+\w+/,
    /fn\s+main\s*\(\s*\)\s*\{/,
    /<\?php/,
  ];

  if (pythonPatterns.some((p) => p.test(text))) {
    return {
      type: 'code',
      subType: 'Python Source Code',
      recommendedAgent: 'Code Security Agent',
      confidence: 0.95,
      label: 'Python Source Code Detected',
      iconName: 'Code',
    };
  }

  if (jsTsPatterns.some((p) => p.test(text))) {
    return {
      type: 'code',
      subType: 'JavaScript / TypeScript Code',
      recommendedAgent: 'Code Security Agent',
      confidence: 0.95,
      label: 'JavaScript / TypeScript Detected',
      iconName: 'Code',
    };
  }

  if (sqlPatterns.some((p) => p.test(text))) {
    return {
      type: 'code',
      subType: 'SQL Query / Injection Pattern',
      recommendedAgent: 'Code Security Agent',
      confidence: 0.93,
      label: 'SQL Statement / Injection Query Detected',
      iconName: 'Database',
    };
  }

  if (otherCodePatterns.some((p) => p.test(text))) {
    return {
      type: 'code',
      subType: 'Source Code File',
      recommendedAgent: 'Code Security Agent',
      confidence: 0.91,
      label: 'Source Code Detected',
      iconName: 'Code',
    };
  }

  // 3. Threat Indicators: IP, URL, Domain, Hash, CVE
  const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
  const urlRegex = /(https?:\/\/[^\s]+|hxxps?:\/\/[^\s]+)/i;
  const domainRegex = /\b([a-zA-Z0-9-]+\.)+(com|net|org|io|ru|xyz|top|cc|cn|info|biz|tk|pw|onion)\b/i;
  const cveRegex = /\bCVE-\d{4}-\d{4,7}\b/i;
  const hashRegex = /\b([a-fA-F0-9]{64}|[a-fA-F0-9]{40}|[a-fA-F0-9]{32})\b/;

  if (cveRegex.test(text)) {
    return {
      type: 'threat_indicator',
      subType: 'CVE Vulnerability Identifier',
      recommendedAgent: 'Threat Intelligence Agent',
      confidence: 0.97,
      label: 'CVE Identifier Detected',
      iconName: 'AlertTriangle',
    };
  }

  if (urlRegex.test(text) || (text.startsWith('http') || text.startsWith('hxxp') || text.includes('.com/') || text.includes('.xyz/'))) {
    return {
      type: 'threat_indicator',
      subType: 'URL / Web Endpoint',
      recommendedAgent: 'Threat Intelligence Agent',
      confidence: 0.96,
      label: 'Website URL Detected',
      iconName: 'Globe',
    };
  }

  if (ipv4Regex.test(text) && text.length < 80) {
    return {
      type: 'threat_indicator',
      subType: 'IPv4 Address Indicator',
      recommendedAgent: 'Threat Intelligence Agent',
      confidence: 0.94,
      label: 'IP Address Detected',
      iconName: 'Network',
    };
  }

  if (domainRegex.test(text) && text.split(/\s+/).length <= 4) {
    return {
      type: 'threat_indicator',
      subType: 'Domain / FQDN Indicator',
      recommendedAgent: 'Threat Intelligence Agent',
      confidence: 0.92,
      label: 'Domain / Hostname Detected',
      iconName: 'Globe',
    };
  }

  if (hashRegex.test(text) && text.split(/\s+/).length <= 2) {
    return {
      type: 'threat_indicator',
      subType: 'Cryptographic Hash (SHA256/MD5)',
      recommendedAgent: 'Threat Intelligence Agent',
      confidence: 0.93,
      label: 'File Hash Indicator Detected',
      iconName: 'Fingerprint',
    };
  }

  // 4. MITRE ATT&CK Queries
  const mitreRegex = /\b(T\d{4}(\.\d{3})?|mitre|att&ck|lateral movement|persistence|credential dumping|privilege escalation|command and control)\b/i;
  if (mitreRegex.test(text)) {
    return {
      type: 'threat_indicator',
      subType: 'MITRE ATT&CK TTP Query',
      recommendedAgent: 'MITRE Analysis Agent',
      confidence: 0.92,
      label: 'MITRE ATT&CK Technique Query',
      iconName: 'Target',
    };
  }

  // 5. Cybersecurity Educational / Learning Questions
  const learningQuestionPhrases = [
    /what is /i,
    /how does /i,
    /explain /i,
    /why is /i,
    /difference between /i,
    /how to prevent /i,
    /what are /i,
    /define /i,
    /tutorial /i,
    /how can an attacker /i,
    /basics of /i,
  ];

  const securityConcepts = [
    /sql injection/i,
    /cross[- ]site scripting|xss/i,
    /csrf/i,
    /buffer overflow/i,
    /zero[- ]day/i,
    /ransomware/i,
    /phishing/i,
    /man[- ]in[- ]the[- ]middle/i,
    /ddos|denial of service/i,
    /zero trust/i,
    /jwt security/i,
    /cryptography|rsa|aes/i,
    /firewall|siem|edr|soar/i,
    /burp suite|nmap|metasploit|wireshark/i,
    /owasp/i,
  ];

  if (learningQuestionPhrases.some((p) => p.test(text)) || 
     (securityConcepts.some((p) => p.test(text)) && text.length < 120 && !text.includes('\n'))) {
    return {
      type: 'learning_question',
      subType: 'Cybersecurity Concept / Question',
      recommendedAgent: 'Cyber Learning Agent',
      confidence: 0.93,
      label: 'Cybersecurity Learning Query',
      iconName: 'BookOpen',
    };
  }

  // Fallback / General inquiry
  return {
    type: 'general',
    subType: 'Security Investigation Request',
    recommendedAgent: 'CyberSphere Orchestrator',
    confidence: 0.8,
    label: 'CyberSphere Intelligence Ready',
    iconName: 'ShieldCheck',
  };
}
