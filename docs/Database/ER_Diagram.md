# CyberSphere Entity Relationship Diagram

## Core Relationships

- Users → Conversations: One-to-Many
- Conversations → Messages: One-to-Many
- Users → Uploaded Files: One-to-Many
- Conversations → Uploaded Files: One-to-Many
- Uploaded Files → Analysis Results: One-to-Many
- Users → Reports: One-to-Many
- Conversations → Reports: One-to-Many
- Conversations → Agent Runs: One-to-Many

## Entity Relationship

```text
Users
  │
  └── Conversations
          ├── Messages
          ├── Uploaded Files
          │      └── Analysis Results
          ├── Reports
          └── Agent Runs