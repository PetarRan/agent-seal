# AgentSeal

agent seal implements a comprehensive agent action logging and verification system using blockchain technology. agents can log their actions (task completion, location visits, form submissions) to an immutable blockchain ledger, providing proof of authenticity and verifiable action history.

## Features

### Agent Authentication
- **Meta Accounts Integration**: Agents authenticate using Abstraxion's Meta Accounts
- **Secure Login**: Blockchain-based authentication with cryptographic signatures
- **Session Management**: Persistent login state with automatic logout capabilities

### Action Logging
- **Multiple Action Types**: Support for task completion, location visits, form submissions, and verifications
- **Rich Metadata**: Each action includes detailed metadata (location, form data, timestamps)
- **Real-time Logging**: Actions are immediately signed and logged to the blockchain

### Blockchain Integration
- **Smart Contract Integration**: Actions are logged to a Cosmos-based smart contract
- **Immutable Ledger**: All actions are permanently recorded on the blockchain
- **Transaction Verification**: Each action includes a cryptographic signature for verification

### Action Verification
- **Cryptographic Proof**: Actions are signed with the agent's private key
- **Blockchain Verification**: Actions can be verified on-chain for authenticity
- **Historical Audit**: Complete action history is queryable from the blockchain

## Architecture

### Core Components

1. **AgentActionLogger Component** (`components/AgentActionLogger.tsx`)
   - Main UI for agent authentication and action logging
   - Real-time connection status and transaction feedback
   - Action history display with blockchain transaction hashes

2. **AgentActionService** (`services/agentActionService.ts`)
   - Service layer for action creation and management
   - Integration with Abstraxion signing client
   - Local action history management

3. **BlockchainService** (`services/blockchainService.ts`)
   - Smart contract interaction layer
   - Transaction execution and querying
   - Action verification on-chain

4. **Type Definitions** (`types/agent.ts`)
   - TypeScript interfaces for agent actions and profiles
   - Action metadata structures
   - Verification proof types

### Blockchain Integration

The system integrates with a Cosmos-based smart contract that provides:

```rust
// Smart Contract Message Structure
pub struct LogAgentAction {
    pub agent_id: String,
    pub timestamp: u64,
    pub action_type: String,
    pub action_metadata: ActionMetadata,
    pub signature: String,
    pub agent_address: String,
}

pub struct ActionMetadata {
    pub description: String,
    pub task_id: Option<String>,
    pub location: Option<Location>,
    pub form_data: Option<Map<String, Value>>,
}
```

## Usage

### 1. Agent Authentication

```typescript
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';

const { data: account, isConnected, login, logout } = useAbstraxionAccount();

// Login agent
await login();

// Check connection status
if (isConnected) {
  console.log('Agent address:', account.bech32Address);
}
```

### 2. Logging Actions

```typescript
import { useAgentActionLogging } from './services/agentActionService';

const { logAction, isConnected } = useAgentActionLogging();

// Log a task completion
const txHash = await logAction('agent_001', 'task_completion', {
  description: 'Completed field inspection',
  taskId: 'task_123',
});

// Log a location visit
const txHash = await logAction('agent_001', 'location_visit', {
  description: 'Visited inspection site',
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'San Francisco, CA'
  }
});
```

### 3. Action Verification

```typescript
import { useBlockchainService } from './services/blockchainService';

const { verifyActionOnChain, queryAgentActions } = useBlockchainService();

// Verify an action on-chain
const isVerified = await verifyActionOnChain(action, signature);

// Query agent's action history
const actions = await queryAgentActions('agent_001');
```

## Environment Configuration

Create a `.env.local` file with the following variables:

```env
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS=xion1wuu294dntknh3s6h02m6nhnpu86l5hr2hrpyf3srz58qpunchuequ6gfcm
EXPO_PUBLIC_RPC_URL=https://your-rpc-endpoint
EXPO_PUBLIC_GAS_PRICE=0.025ustars
```

## Smart Contract Integration

The system expects a smart contract with the following message types:

### Execute Messages
- `log_agent_action`: Log a new agent action to the blockchain
- `verify_action`: Verify an action's authenticity

### Query Messages
- `get_agent_actions`: Retrieve action history for an agent
- `get_action_by_tx`: Get action details by transaction hash
- `verify_action`: Verify action authenticity

## Security Features

### Cryptographic Signatures
- All actions are signed with the agent's private key
- Signatures are verified on-chain for authenticity
- Non-repudiation of actions

### Immutable Ledger
- All actions are permanently recorded on the blockchain
- Historical audit trail is tamper-proof
- Timestamp verification for action chronology

### Agent Authentication
- Meta Accounts provide secure authentication
- Private keys never leave the device
- Session-based authentication with automatic logout

## Development

### Prerequisites
- Node.js 18+
- Expo CLI
- Abstraxion React Native SDK
- Cosmos SDK development environment

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

### Testing

```bash
# Run tests
npm test

# Run with specific environment
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS=your_contract npm start
```

## API Reference

### AgentActionService

```typescript
class AgentActionService {
  static getInstance(): AgentActionService
  createAction(agentId: string, actionType: string, metadata: any): AgentAction
  logActionToBlockchain(action: AgentAction, signingClient: any, agentAddress: string): Promise<string>
  verifyAction(action: AgentAction, signature: string): Promise<boolean>
  getAgentActionHistory(agentId: string): AgentAction[]
}
```

### useAgentActionLogging Hook

```typescript
const {
  logAction,
  verifyAction,
  isConnected,
  agentAddress
} = useAgentActionLogging();
```

### useBlockchainService Hook

```typescript
const {
  logActionToChain,
  queryAgentActions,
  verifyActionOnChain,
  isConnected
} = useBlockchainService();
```
