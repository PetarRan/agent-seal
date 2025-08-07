# AgentSeal Source Code Structure

This directory contains the organized source code for the AgentSeal application.

## Directory Structure

```
src/
├── components/          # React components
│   ├── features/       # Feature-specific components
│   │   ├── AgentActionLogger.tsx
│   │   ├── MainApp.tsx
│   │   ├── ManagerDashboard.tsx
│   │   ├── Settings.tsx
│   │   ├── SplashScreen.tsx
│   │   └── AgentActionDetail.tsx
│   └── ui/            # Reusable UI components (future)
├── services/           # Business logic and API services
│   ├── agent/         # Agent-related services
│   │   └── agentActionService.ts
│   ├── blockchain/    # Blockchain interaction services
│   │   ├── blockchainService.ts
│   │   └── blockchainEventService.ts
│   └── xion/          # Xion blockchain services
│       ├── xionRealIntegration.ts
│       └── xionZKTLS.ts
├── types/             # TypeScript type definitions
│   └── agent/         # Agent-related types
│       └── agent.ts
├── utils/             # Utility functions (future)
├── hooks/             # Custom React hooks (future)
├── constants/         # Application constants (future)
├── contracts/         # Smart contract files
│   └── xion_agent_contract.rs
└── scripts/           # Build and deployment scripts
    └── deploy_xion_contract.sh
```

## Import Patterns

### Components
```typescript
import { AgentActionLogger, MainApp } from '@/components';
```

### Services
```typescript
import { useAgentActionLogging, useXionRealIntegration } from '@/services';
```

### Types
```typescript
import { AgentAction, XionZKTLSProof } from '@/types';
```

## Key Features

- **Modular Structure**: Organized by feature and responsibility
- **Type Safety**: Comprehensive TypeScript types
- **Service Layer**: Clean separation of business logic
- **Xion Integration**: Dedicated services for Xion blockchain
- **zkTLS Support**: Privacy-preserving proof generation
- **Path Aliases**: Clean imports with `@/` prefix

## Development Guidelines

1. **Components**: Place feature-specific components in `components/features/`
2. **Services**: Organize by domain (agent, blockchain, xion)
3. **Types**: Keep types close to their usage
4. **Imports**: Use the index files for clean imports
5. **Naming**: Use descriptive, consistent naming conventions
