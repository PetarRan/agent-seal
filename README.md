# <img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/a7407e4f-8763-4a5e-b125-8d28de7239ad" /> &nbsp;AgentSeal

AgentSeal implements a comprehensive agent action logging and verification system using **Xion's Mobile Developer Kit (Dave)** with **zkTLS (Zero-Knowledge Transport Layer Security)** technology for privacy-preserving verification. Agents can log their actions (task completion, location visits, form submissions) to an immutable blockchain ledger while maintaining privacy through Xion's zero-knowledge proofs.

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Or run specific platforms
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

### App Navigation
- **Dashboard Tab**: Main dashboard showing agent actions and analytics
- **Xion zkTLS Logger Tab**: Privacy-preserving action logging with Xion zkTLS technology

## Xion zkTLS Technology Integration

### How It Works

The app uses Xion's zkTLS technology to provide privacy-preserving verification:

```typescript
// Generate Xion zero-knowledge proof for location verification
const locationProof = await xionZKTLS.generateLocationProof(
  latitude,
  longitude,
  agentId,
  timestamp
);

// Verify location without revealing exact coordinates using Xion zkTLS
const isVerified = await xionZKTLS.verifyProofOnChain(locationProof);
```

### Privacy Features

- **Location Privacy**: Prove agent visited a location without revealing exact coordinates using Xion zkTLS
- **Form Data Privacy**: Verify form completion without exposing form contents using Xion zkTLS
- **Action Privacy**: Verify actions without revealing sensitive metadata using Xion zkTLS
- **Agent Privacy**: Verify agent identity without exposing personal information using Xion zkTLS

## Architecture

### Core Components

1. **AgentActionLogger Component** (`components/AgentActionLogger.tsx`)
   - Main UI for agent authentication and action logging
   - Xion zkTLS privacy controls and proof generation
   - Real-time connection status and transaction feedback
   - Action history display with Xion blockchain transaction hashes

2. **AgentActionService** (`services/agentActionService.ts`)
   - Service layer for action creation and management
   - Integration with Abstraxion signing client
   - Xion zkTLS proof generation and verification
   - Local action history management

3. **XionZKTLS Service** (`services/xionZKTLS.ts`)
   - Xion's zero-knowledge proof generation and verification
   - Privacy-preserving action verification using Xion zkTLS
   - On-chain zk-proof verification on Xion blockchain
   - Configuration management for Xion privacy settings

4. **BlockchainService** (`services/blockchainService.ts`)
   - Smart contract interaction layer
   - Transaction execution and querying
   - Action verification on-chain with Xion zk-proofs

5. **Type Definitions** (`types/agent.ts`)
   - TypeScript interfaces for agent actions and profiles
   - Xion zkTLS proof types and configurations
   - Action metadata structures
   - Verification proof types

## Features

### Agent Authentication
- **Meta Accounts Integration**: Agents authenticate using Abstraxion's Meta Accounts
- **Secure Login**: Blockchain-based authentication with cryptographic signatures
- **Session Management**: Persistent login state with automatic logout capabilities

### Action Logging with Xion zkTLS Privacy
- **Multiple Action Types**: Support for task completion, location visits, form submissions, and verifications
- **Xion Zero-Knowledge Proofs**: Actions are verified using Xion's zkTLS technology without revealing sensitive data
- **Privacy-Preserving Location**: Prove location visits without exposing exact coordinates using Xion zkTLS
- **Private Form Submissions**: Verify form completion without exposing form data using Xion zkTLS
- **Rich Metadata**: Each action includes detailed metadata (location, form data, timestamps)
- **Real-time Logging**: Actions are immediately signed and logged to the Xion blockchain

### Xion Blockchain Integration with zkTLS
- **Smart Contract Integration**: Actions are logged to Xion's Cosmos-based smart contract
- **Immutable Ledger**: All actions are permanently recorded on the Xion blockchain
- **Transaction Verification**: Each action includes a cryptographic signature for verification
- **Zero-Knowledge Verification**: Actions can be verified on-chain without revealing private data using Xion zkTLS

### Action Verification with Xion zkTLS
- **Cryptographic Proof**: Actions are signed with the agent's private key
- **Zero-Knowledge Verification**: Actions can be verified on-chain for authenticity without exposing sensitive data
- **Privacy-Preserving Proofs**: Location and form data are verified using Xion's zkTLS technology
- **Historical Audit**: Complete action history is queryable from the Xion blockchain while maintaining privacy

## Testing the App

### 1. Start the App
```bash
npm run dev
```

### 2. Navigate to Xion zkTLS Logger
- Open the app
- Switch to the "Xion zkTLS Logger" tab
- You'll see the privacy-preserving action logger

### 3. Test Privacy Features

#### Location Privacy Test:
1. Select "LOCATION VISIT" action type
2. Enter latitude/longitude (e.g., 37.7749, -122.4194)
3. Add description: "Visited client office"
4. Toggle "Xion zkTLS Privacy" ON
5. Click "Log Action with Xion zkTLS"
6. **Result**: Action is logged with zkTLS proof that proves location visit WITHOUT revealing exact coordinates

#### Form Privacy Test:
1. Select "FORM SUBMIT" action type
2. Enter JSON form data: `{"field1": "value1", "field2": "value2"}`
3. Add description: "Submitted inspection form"
4. Toggle "Xion zkTLS Privacy" ON
5. Click "Log Action with Xion zkTLS"
6. **Result**: Action is logged with zkTLS proof that proves form completion WITHOUT exposing form contents

#### Action Verification Test:
1. Log any action with zkTLS privacy enabled
2. Click "Verify with Xion zkTLS" on any action
3. **Result**: Action is verified on-chain using zkTLS proofs while maintaining privacy

## Configuration

### Environment Variables
Create a `.env.local` file:

```env
EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS=xion1....asda
EXPO_PUBLIC_RPC_URL=https://xion-testnet-rpc.burnt.com
EXPO_PUBLIC_GAS_PRICE=0.025ustars
```

### Xion Smart Contract Integration

The system expects a Xion smart contract with the following message types:

#### Execute Messages
- `log_agent_action`: Log a new agent action to the Xion blockchain with zkTLS proof
- `verify_action`: Verify an action's authenticity using Xion zkTLS proof
- `verify_zk_proof`: Verify zero-knowledge proof on Xion blockchain

#### Query Messages
- `get_agent_actions`: Retrieve action history for an agent (privacy-preserving)
- `get_action_by_tx`: Get action details by transaction hash
- `verify_action`: Verify action authenticity with Xion zkTLS proof
- `verify_zk_proof`: Verify zero-knowledge proof

## Security Features with Xion zkTLS

### Zero-Knowledge Proofs
- All actions are verified using Xion's zkTLS technology for privacy
- Location data is hashed and verified without revealing coordinates
- Form data is verified without exposing contents
- Agent identity is verified without exposing personal information

### Cryptographic Signatures
- All actions are signed with the agent's private key
- Signatures are verified on-chain for authenticity
- Non-repudiation of actions with privacy preservation

### Immutable Ledger with Privacy
- All actions are permanently recorded on the Xion blockchain
- Historical audit trail is tamper-proof and privacy-preserving
- Timestamp verification for action chronology
- Zero-knowledge verification for sensitive data

### Agent Authentication
- Meta Accounts provide secure authentication
- Private keys never leave the device
- Session-based authentication with automatic logout
- Privacy-preserving identity verification

## Xion Mobile Developer Kit (Dave) Integration

This project leverages Xion's Mobile Developer Kit (Dave) to provide:

- **Built-in zkTLS Features**: No complex coding needed for zero-knowledge proofs
- **iOS and Android Support**: Cross-platform mobile development
- **Xion Blockchain Integration**: Seamless connection to Xion testnet
- **Privacy-Preserving Verification**: Automatic zkTLS proof generation and verification

## Xion Hackathon Compliance

This project meets all Xion hackathon requirements:

✅ **Uses Xion's Mobile Developer Kit (Dave)**  
✅ **Implements zkTLS technology**  
✅ **Privacy-preserving verification**  
✅ **On-chain source of truth**  
✅ **iOS/Android mobile app**  
✅ **Verifiable internet data**  

## Development

### Prerequisites
- Node.js 18+
- Expo CLI
- Abstraxion React Native SDK
- Xion Mobile Developer Kit (Dave)
- Cosmos SDK development environment

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

### Testing Xion zkTLS Features

```bash
# Run tests with Xion zkTLS verification
npm test

# Run with specific Xion zkTLS configuration
EXPO_PUBLIC_RPC_URL=https://xion-testnet-rpc.burnt.com npm run dev
```

## API Reference

### AgentActionService with Xion zkTLS

```typescript
class AgentActionService {
  static getInstance(): AgentActionService
  createActionWithXionZKTLS(agentId: string, actionType: string, metadata: any): Promise<AgentAction>
  logActionToXionWithZKTLS(action: AgentAction, signingClient: any, agentAddress: string): Promise<string>
  verifyActionWithXionZKTLS(action: AgentAction, signature: string): Promise<boolean>
  getAgentActionHistory(agentId: string): AgentAction[]
}
```

### useAgentActionLoggingWithXionZKTLS Hook

```typescript
const {
  logActionWithXionZKTLS,
  verifyActionWithXionZKTLS,
  queryAgentActionsFromXion,
  isConnected,
  agentAddress,
  xionZKTLS
} = useAgentActionLoggingWithXionZKTLS();
```

### useXionZKTLS Hook

```typescript
const {
  generateLocationProof,
  generateFormProof,
  generateActionProof,
  verifyProofOnChain,
  verifyLocationProof,
  configure,
  getConfig
} = useXionZKTLS();
```

### useBlockchainService Hook

```typescript
const {
  logActionToChain,
  queryAgentActions,
  verifyActionOnChain,
  verifyZKProof,
  isConnected
} = useBlockchainService();
```

## Xion zkTLS Privacy Features

### Location Privacy
- Prove agent visited a location without revealing exact coordinates using Xion zkTLS
- Hash-based verification for location data
- Privacy-preserving location proofs

### Form Data Privacy
- Verify form completion without exposing form contents using Xion zkTLS
- Hash-based verification for form data
- Privacy-preserving form proofs

### Action Privacy
- Verify actions without revealing sensitive metadata using Xion zkTLS
- Zero-knowledge action verification
- Privacy-preserving action proofs

### Agent Privacy
- Verify agent identity without exposing personal information using Xion zkTLS
- Privacy-preserving identity verification
- Zero-knowledge identity proofs

- **Xion Mobile Developer Kit (Dave)** integration
- **zkTLS technology** implementation
- **Privacy-preserving verification** features
- **On-chain source of truth** connection
- **Mobile-first app** design
- **Verifiable internet data** using zkTLS
