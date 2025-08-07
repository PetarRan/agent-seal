import { useAbstraxionClient, useAbstraxionSigningClient } from '@burnt-labs/abstraxion-react-native';
import { AgentAction } from '../types/agent';

export interface SmartContractConfig {
  contractAddress: string;
  rpcUrl: string;
  gasPrice: string;
}

export class BlockchainService {
  private static instance: BlockchainService;
  private config: SmartContractConfig;

  constructor(config: SmartContractConfig) {
    this.config = config;
  }

  static getInstance(config?: SmartContractConfig): BlockchainService {
    if (!BlockchainService.instance && config) {
      BlockchainService.instance = new BlockchainService(config);
    }
    return BlockchainService.instance;
  }

  // Log agent action to smart contract
  async logAgentAction(
    action: AgentAction,
    signature: string,
    signingClient: any,
    agentAddress: string
  ): Promise<string> {
    try {
      // Create the message for the smart contract
      const message = {
        log_agent_action: {
          agent_id: action.agentId,
          timestamp: action.timestamp,
          action_type: action.actionType,
          action_metadata: action.actionMetadata,
          signature: signature,
          agent_address: agentAddress
        }
      };

      // Execute the smart contract
      const result = await signingClient.execute(
        agentAddress,
        this.config.contractAddress,
        message,
        'auto'
      );

      console.log('Smart contract execution result:', result);
      
      // Return the transaction hash
      return result.transactionHash;
    } catch (error) {
      console.error('Failed to log action to smart contract:', error);
      throw new Error(`Smart contract execution failed: ${error}`);
    }
  }

  // Query agent action history from smart contract
  async queryAgentActions(
    agentId: string,
    client: any
  ): Promise<AgentAction[]> {
    try {
      const query = {
        get_agent_actions: {
          agent_id: agentId
        }
      };

      const result = await client.queryContractSmart(
        this.config.contractAddress,
        query
      );

      return result.actions || [];
    } catch (error) {
      console.error('Failed to query agent actions:', error);
      return [];
    }
  }

  // Verify action authenticity on blockchain
  async verifyActionOnChain(
    action: AgentAction,
    signature: string,
    client: any
  ): Promise<boolean> {
    try {
      const query = {
        verify_action: {
          agent_id: action.agentId,
          timestamp: action.timestamp,
          action_type: action.actionType,
          action_metadata: action.actionMetadata,
          signature: signature
        }
      };

      const result = await client.queryContractSmart(
        this.config.contractAddress,
        query
      );

      return result.verified || false;
    } catch (error) {
      console.error('Failed to verify action on chain:', error);
      return false;
    }
  }

  // Get action by transaction hash
  async getActionByTxHash(
    txHash: string,
    client: any
  ): Promise<AgentAction | null> {
    try {
      const query = {
        get_action_by_tx: {
          tx_hash: txHash
        }
      };

      const result = await client.queryContractSmart(
        this.config.contractAddress,
        query
      );

      return result.action || null;
    } catch (error) {
      console.error('Failed to get action by tx hash:', error);
      return null;
    }
  }
}

// React hook for blockchain operations
export const useBlockchainService = () => {
  const { client } = useAbstraxionClient();
  const { client: signingClient } = useAbstraxionSigningClient();

  const logActionToChain = async (
    action: AgentAction,
    signature: string,
    agentAddress: string
  ): Promise<string> => {
    if (!signingClient) {
      throw new Error('Signing client not available');
    }

    const contractAddress = process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    const config: SmartContractConfig = {
      contractAddress,
      rpcUrl: process.env.EXPO_PUBLIC_RPC_URL || '',
      gasPrice: process.env.EXPO_PUBLIC_GAS_PRICE || '0.025ustars'
    };

    const blockchainService = BlockchainService.getInstance(config);
    return await blockchainService.logAgentAction(action, signature, signingClient, agentAddress);
  };

  const queryAgentActions = async (agentId: string): Promise<AgentAction[]> => {
    if (!client) {
      throw new Error('Client not available');
    }

    const contractAddress = process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    const config: SmartContractConfig = {
      contractAddress,
      rpcUrl: process.env.EXPO_PUBLIC_RPC_URL || '',
      gasPrice: process.env.EXPO_PUBLIC_GAS_PRICE || '0.025ustars'
    };

    const blockchainService = BlockchainService.getInstance(config);
    return await blockchainService.queryAgentActions(agentId, client);
  };

  const verifyActionOnChain = async (
    action: AgentAction,
    signature: string
  ): Promise<boolean> => {
    if (!client) {
      throw new Error('Client not available');
    }

    const contractAddress = process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    const config: SmartContractConfig = {
      contractAddress,
      rpcUrl: process.env.EXPO_PUBLIC_RPC_URL || '',
      gasPrice: process.env.EXPO_PUBLIC_GAS_PRICE || '0.025ustars'
    };

    const blockchainService = BlockchainService.getInstance(config);
    return await blockchainService.verifyActionOnChain(action, signature, client);
  };

  return {
    logActionToChain,
    queryAgentActions,
    verifyActionOnChain,
    isConnected: !!client
  };
};
