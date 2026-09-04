import { Investigation, SecurityFile, ChatMessage } from '../types';

export const sampleSshLog = `Mar 28 03:14:22 prod-db-01 sshd[14829]: Invalid user admin from 194.26.29.112 port 48291
Mar 28 03:14:23 prod-db-01 sshd[14829]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=194.26.29.112
Mar 28 03:14:25 prod-db-01 sshd[14829]: Failed password for invalid user admin from 194.26.29.112 port 48291 ssh2
Mar 28 03:14:27 prod-db-01 sshd[14834]: Invalid user root from 194.26.29.112 port 48302
Mar 28 03:14:29 prod-db-01 sshd[14834]: Failed password for invalid user root from 194.26.29.112 port 48302 ssh2
Mar 28 03:14:31 prod-db-01 sshd[14840]: Accepted password for deploy from 194.26.29.112 port 48315 ssh2
Mar 28 03:14:32 prod-db-01 sudo:   deploy : TTY=pts/1 ; PWD=/home/deploy ; USER=root ; COMMAND=/bin/bash`;

export const samplePythonVulnerableCode = `from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    user_id = request.args.get('id')
    
    # CRITICAL: Direct string concatenation leads to SQL Injection
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = f"SELECT id, username, email, password_hash, role FROM users WHERE id = '{user_id}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "id": user[0],
        "username": user[1],
        "email": user[2],
        "password_hash": user[3], # Sensitive data exposure
        "role": user[4]
    })`;

export const sampleThreatIp = `194.26.29.112`;

export const initialFiles: SecurityFile[] = [
  {
    id: 'file-1',
    name: 'server_logs.txt',
    type: 'Log File',
    size: '142 KB',
    uploadDate: 'Today at 09:12 AM',
    category: 'logs',
    previewContent: sampleSshLog,
  },
  {
    id: 'file-2',
    name: 'backend_project.zip',
    type: 'Archive / Project',
    size: '4.2 MB',
    uploadDate: 'Yesterday at 04:30 PM',
    category: 'zip',
    previewContent: 'Zip project containing 24 files across /src/auth, /src/db, /src/routes.',
  },
  {
    id: 'file-3',
    name: 'security_report.pdf',
    type: 'PDF Document',
    size: '1.8 MB',
    uploadDate: 'Oct 24, 2026',
    category: 'pdf',
    previewContent: 'Q3 External Penetration Testing Summary & Remediation Audit.',
  },
  {
    id: 'file-4',
    name: 'users.csv',
    type: 'CSV Data',
    size: '68 KB',
    uploadDate: 'Oct 20, 2026',
    category: 'csv',
    previewContent: 'id,username,email,last_login_ip,mfa_enabled\n1,admin,admin@corp.internal,10.0.4.12,true\n2,deploy,deploy@corp.internal,194.26.29.112,false',
  },
  {
    id: 'file-5',
    name: 'api_auth_middleware.py',
    type: 'Python Source',
    size: '12 KB',
    uploadDate: 'Oct 18, 2026',
    category: 'code',
    previewContent: samplePythonVulnerableCode,
  },
];

export const initialInvestigations: Investigation[] = [
  {
    id: 'inv-1',
    title: 'SSH Suspicious Login Investigation',
    agent: 'SOC Agent',
    riskLevel: 'HIGH',
    status: 'completed',
    timestamp: '2 hours ago',
    updatedAt: '2026-09-01T07:45:00Z',
    snippet: 'Brute-force attack followed by successful authentication of "deploy" account from malicious foreign IP 194.26.29.112.',
    category: 'soc',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        timestamp: '07:42 AM',
        message: 'I observed high authentication spikes on our primary database server. Here are the logs:\n\n' + sampleSshLog,
        detectedType: 'SSH Security Logs Detected',
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        timestamp: '07:45 AM',
        agent: 'SOC Agent',
        message: 'I have analyzed the provided authentication stream. A severe security incident was identified: an external attacker executed a dictionary password attack and successfully compromised the "deploy" service credential.',
        structuredFinding: {
          riskLevel: 'HIGH',
          agentName: 'SOC Security Agent',
          simpleExplanation: 'Someone attempted to guess passwords repeatedly on your database server and eventually succeeded in logging into the "deploy" account and executing root privilege commands.',
          observedFindings: [
            'Repeated failed SSH login attempts for users "admin" and "root" from source IP 194.26.29.112',
            'Successful password authentication for user "deploy" at 03:14:31',
            'Immediate execution of privileged root shell (`sudo /bin/bash`) one second after login',
          ],
          securityAnalysis: 'The timeline reveals automated SSH credential stuffing / dictionary attack followed by interactive privilege escalation. The rapid transition from login to `/bin/bash` with sudo confirms intentional human or scripted operator takeover rather than legitimate admin workflow.',
          possibleImpact: 'Complete host compromise of `prod-db-01`. Potential unauthorized access to production database records, credential dumping from memory, and lateral movement into the internal VPC network.',
          recommendedActions: [
            {
              title: 'Immediately Revoke Session & Block Source IP',
              description: 'Terminate active SSH sessions for "deploy" and drop incoming packets from 194.26.29.112 at the firewall.',
              command: 'sudo pkill -u deploy; sudo iptables -I INPUT -s 194.26.29.112 -j DROP',
              priority: 'immediate',
            },
            {
              title: 'Rotate "deploy" Password & Enforce Key-Only Auth',
              description: 'Disable password authentication globally in `/etc/ssh/sshd_config`.',
              command: 'sudo sed -i "s/^PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config && sudo systemctl restart sshd',
              priority: 'immediate',
            },
            {
              title: 'Audit Sudoers File & Ssh Authorized Keys',
              description: 'Check for persistence mechanisms placed in `/home/deploy/.ssh/authorized_keys` or `/tmp`.',
              command: 'cat /home/deploy/.ssh/authorized_keys; ls -la /tmp',
              priority: 'medium',
            },
          ],
          technicalDetails: {
            mitreTactics: [
              { id: 'T1110.001', name: 'Brute Force: Password Guessing' },
              { id: 'T1078.003', name: 'Valid Accounts: Local Accounts' },
              { id: 'T1548.003', name: 'Abuse Elevation Control Mechanism: Sudo' },
            ],
            evidenceSnippets: [
              'sshd[14840]: Accepted password for deploy from 194.26.29.112 port 48315 ssh2',
              'sudo: deploy : TTY=pts/1 ; COMMAND=/bin/bash',
            ],
            cveReferences: ['CWE-307: Improper Restriction of Excessive Authentication Attempts'],
            rawDetails: 'Threat Actor IP GeoIP: AS44050 (High-risk bulletproof hosting ASN). Attack velocity: 4 attempts in 10 seconds.',
          },
        },
        status: {
          orchestrator: 'completed',
          soc: 'completed',
          threat: 'completed',
          mitre: 'completed',
        },
      },
    ],
  },
  {
    id: 'inv-2',
    title: 'Python Code Security Review',
    agent: 'Code Security Agent',
    riskLevel: 'CRITICAL',
    status: 'completed',
    timestamp: 'Yesterday',
    updatedAt: '2026-08-31T15:20:00Z',
    snippet: 'Found raw SQL concatenation vulnerability (CWE-89) and plaintext password hash leakage in `/api/user/profile` endpoint.',
    category: 'code',
    messages: [
      {
        id: 'msg-code-1',
        sender: 'user',
        timestamp: '03:18 PM',
        message: 'Can you review this Flask profile endpoint for security issues?\n\n' + samplePythonVulnerableCode,
        detectedType: 'Python Source Code Detected',
      },
      {
        id: 'msg-code-2',
        sender: 'assistant',
        timestamp: '03:20 PM',
        agent: 'Code Security Agent',
        message: 'I have completed the source code security review for the provided Python endpoint. Two critical security vulnerabilities were discovered requiring remediation.',
        structuredFinding: {
          riskLevel: 'CRITICAL',
          agentName: 'Code Security Agent',
          simpleExplanation: 'The code takes user input and sticks it directly into an SQL query without protection, allowing attackers to view any user record or modify database tables. Additionally, password hashes are exposed in the JSON response.',
          observedFindings: [
            'Direct f-string formatting into SQL string (`WHERE id = \'{user_id}\'`) allowing classic SQL injection.',
            'Direct exposure of `password_hash` column in API JSON response payload.',
            'Lack of authentication or JWT authorization verification before querying profile.',
          ],
          securityAnalysis: 'An attacker passing `?id=1\' OR \'1\'=\'1` or `?id=1\' UNION SELECT 1,username,email,password_hash,role FROM users--` can dump the entire authentication table. Furthermore, returning the cryptographic password hash in client responses violates OWASP API Security Top 10 (Broken Object Level Authorization & Data Leakage).',
          possibleImpact: 'Full database exfiltration, credential cracking, administrative privilege takeover, and regulatory compliance violation (GDPR/HIPAA).',
          recommendedActions: [
            {
              title: 'Use Parameterized Queries / Prepared Statements',
              description: 'Pass parameters as a tuple to `cursor.execute` instead of building strings.',
              command: `cursor.execute("SELECT id, username, email, role FROM users WHERE id = ?", (user_id,))`,
              priority: 'immediate',
            },
            {
              title: 'Strip Sensitive Fields From Response',
              description: 'Omit `password_hash` and sensitive tokens from API serialization models.',
              command: `return jsonify({"id": user[0], "username": user[1], "email": user[2], "role": user[3]})`,
              priority: 'immediate',
            },
          ],
          technicalDetails: {
            mitreTactics: [
              { id: 'T1190', name: 'Exploit Public-Facing Application' },
              { id: 'T1059', name: 'Command and Scripting Interpreter' },
            ],
            cveReferences: ['CWE-89: SQL Injection', 'CWE-200: Exposure of Sensitive Information to an Unauthorized Actor'],
            evidenceSnippets: [
              `query = f"SELECT id, username, email, password_hash, role FROM users WHERE id = '{user_id}'"`,
              `"password_hash": user[3]`,
            ],
          },
        },
        status: {
          orchestrator: 'completed',
          code: 'completed',
          threat: 'waiting',
          mitre: 'completed',
        },
      },
    ],
  },
  {
    id: 'inv-3',
    title: 'Website Security Investigation',
    agent: 'Threat Intelligence Agent',
    riskLevel: 'MEDIUM',
    status: 'in_progress',
    timestamp: 'Today at 08:30 AM',
    updatedAt: '2026-09-01T08:30:00Z',
    snippet: 'Analyzing suspicious domain payload `hxxps://secure-auth-gateway-verify.xyz/login` for active phishing kit signatures.',
    category: 'threat',
    messages: [
      {
        id: 'msg-th-1',
        sender: 'user',
        timestamp: '08:29 AM',
        message: 'A client reported an email with link: https://secure-auth-gateway-verify.xyz/login. Is this safe or malicious?',
        detectedType: 'Website URL Detected',
      },
      {
        id: 'msg-th-2',
        sender: 'assistant',
        timestamp: '08:30 AM',
        agent: 'Threat Intelligence Agent',
        message: 'Threat intelligence analysis indicates high probability of a credential harvesting phishing domain spoofing enterprise Single Sign-On portals.',
        structuredFinding: {
          riskLevel: 'MEDIUM',
          agentName: 'Threat Intelligence Agent',
          simpleExplanation: 'This website is a newly registered counterfeit domain designed to trick users into typing their work login credentials.',
          observedFindings: [
            'Domain registered only 3 days ago via privacy proxy registrar in Iceland.',
            'SSL certificate issued by Let\'s Encrypt with mismatched organization subject.',
            'Cloned CSS assets referencing standard Microsoft Entra ID login styles.',
          ],
          securityAnalysis: 'The URL `secure-auth-gateway-verify.xyz` utilizes typosquatting and deceptive brand authority keywords. Domain reputation feeds flag this host for active credential harvester kits targeting corporate SSO credentials.',
          possibleImpact: 'Compromise of employee user sessions, bypass of non-FIDO2 Multi-Factor Authentication via reverse proxy adversary-in-the-middle (AitM).',
          recommendedActions: [
            {
              title: 'Add Domain to Corporate DNS Blacklist',
              description: 'Sinkhole `secure-auth-gateway-verify.xyz` on internal DNS and secure web gateways.',
              command: 'sudo pihole -b secure-auth-gateway-verify.xyz',
              priority: 'immediate',
            },
            {
              title: 'Search Email Gateway Logs',
              description: 'Identify all recipients who received messages containing this domain in the past 72 hours.',
              priority: 'immediate',
            },
          ],
          technicalDetails: {
            mitreTactics: [
              { id: 'T1566.002', name: 'Phishing: Spearphishing Link' },
              { id: 'T1583.001', name: 'Acquire Infrastructure: Domains' },
            ],
            cveReferences: ['CAPEC-98: Phishing'],
            evidenceSnippets: [
              'Domain Age: 3 days',
              'Registrar: NameCheap WhoisGuard',
              'Hosting IP: 185.220.101.5',
            ],
          },
        },
        status: {
          orchestrator: 'completed',
          threat: 'completed',
          soc: 'waiting',
          mitre: 'completed',
        },
      },
    ],
  },
  {
    id: 'inv-4',
    title: 'SQL Injection Fundamentals & Prevention',
    agent: 'Cyber Learning Agent',
    riskLevel: 'LOW',
    status: 'completed',
    timestamp: '3 days ago',
    updatedAt: '2026-08-29T11:00:00Z',
    snippet: 'Comprehensive educational breakdown of SQL Injection mechanics, boolean-based, union-based, and modern parameterized mitigation.',
    category: 'learning',
    messages: [
      {
        id: 'msg-learn-1',
        sender: 'user',
        timestamp: '10:58 AM',
        message: 'What is SQL Injection and how does parameterized query prevent it?',
        detectedType: 'Cybersecurity Learning Query',
      },
      {
        id: 'msg-learn-2',
        sender: 'assistant',
        timestamp: '11:00 AM',
        agent: 'Cyber Learning Agent',
        message: 'SQL Injection (SQLi) is one of the most critical web security vulnerabilities (OWASP Top 10 #3: Injection). Let\'s break it down in clear, intuitive terms.',
        structuredFinding: {
          riskLevel: 'LOW',
          agentName: 'Cyber Learning Agent',
          simpleExplanation: 'SQL Injection happens when an application treats user input as code instructions instead of plain data, allowing an attacker to change what database commands run.',
          observedFindings: [
            'Core vulnerability mechanism: Mixing control plane (code logic) with data plane (user input).',
            'Attack vector: Malicious SQL syntax like `\' OR 1=1 --` changes the logical truth conditions of queries.',
            'Key solution: Prepared statements pre-compile the SQL statement structure on the database engine first.',
          ],
          securityAnalysis: 'When an application concatenates strings, the SQL parser processes attacker-supplied characters (such as quotes, semicolons, dashes) as command tokens. When using Parameterized Queries, the database driver sends the query structure and the parameters separately. Even if input contains `\' OR 1=1 --`, it is treated purely as a literal string value.',
          possibleImpact: 'Without mitigation: Unauthorized database read/write, data destruction, authentication bypass, and potential remote code execution via database features like `xp_cmdshell` or `INTO OUTFILE`.',
          recommendedActions: [
            {
              title: 'Always Use Prepared Statements / ORM',
              description: 'Use placeholders (`?` or `$1` or named parameters `:user_id`) in your database driver.',
              command: '# Python SQLite:\ncursor.execute("SELECT * FROM users WHERE email = ?", (email,))',
              priority: 'immediate',
            },
            {
              title: 'Enforce Least Privilege Database Users',
              description: 'Ensure web application database credentials only have SELECT/INSERT/UPDATE permissions on necessary tables.',
              priority: 'medium',
            },
          ],
          technicalDetails: {
            mitreTactics: [
              { id: 'T1190', name: 'Exploit Public-Facing Application' },
            ],
            cveReferences: ['CWE-89: SQL Injection', 'OWASP-A03:2021-Injection'],
          },
        },
        status: {
          orchestrator: 'completed',
          learning: 'completed',
        },
      },
    ],
  },
];
