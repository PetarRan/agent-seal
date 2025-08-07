import { AgentAction } from '../../types/agent/agent';
import { useAbstraxionSigningClient, useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';

export class BlockchainService {
  private static instance: BlockchainService;
  private contractAddress: string;
  private rpcUrl: string;

  constructor() {
    this.contractAddress = process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS || '';
    this.rpcUrl = process.env.EXPO_PUBLIC_RPC_URL || 'https://xion-testnet-rpc.burnt.com';
  }

  static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // Log action to blockchain
  async logActionToChain(
    action: AgentAction,
    signature: string,
    agentAddress: string
  ): Promise<string> {
    try {
      // In a real implementation, this would call the blockchain
      console.log('Logging action to blockchain:', {
        action,
        signature,
        agentAddress,
        contractAddress: this.contractAddress
      });

      // Simulate blockchain transaction
      const txHash = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      return txHash;
    } catch (error) {
      throw new Error(`Failed to log action to blockchain: ${error}`);
    }
  }

  // Query agent actions from blockchain
  async queryAgentActions(agentId: string): Promise<AgentAction[]> {
    try {
      // In a real implementation, this would query the blockchain
      console.log('Querying agent actions from blockchain:', {
        agentId,
        contractAddress: this.contractAddress
      });

      // Return mock data for now
      return [];
    } catch (error) {
      console.error('Failed to query agent actions:', error);
      return [];
    }
  }

  // Verify action on blockchain
  async verifyActionOnChain(action: AgentAction, signature: string): Promise<boolean> {
    try {
      // In a real implementation, this would verify on blockchain
      console.log('Verifying action on blockchain:', {
        action,
        signature,
        contractAddress: this.contractAddress
      });

      return true; // Placeholder verification
    } catch (error) {
      console.error('Failed to verify action on blockchain:', error);
      return false;
    }
  }

  // Get blockchain status
  async getBlockchainStatus(): Promise<any> {
    try {
      return {
        connected: true,
        contractAddress: this.contractAddress,
        rpcUrl: this.rpcUrl
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// React hook for blockchain service
export const useBlockchainService = () => {
  const { client: signingClient } = useAbstraxionSigningClient();
  const { data: account } = useAbstraxionAccount();
  const blockchainService = BlockchainService.getInstance();

  const logActionToChain = async (
    action: AgentAction,
    signature: string,
    agentAddress: string
  ): Promise<string> => {
    return await blockchainService.logActionToChain(action, signature, agentAddress);
  };

  const queryAgentActions = async (agentId: string): Promise<AgentAction[]> => {
    return await blockchainService.queryAgentActions(agentId);
  };

  const verifyActionOnChain = async (action: AgentAction, signature: string): Promise<boolean> => {
    return await blockchainService.verifyActionOnChain(action, signature);
  };

  const getBlockchainStatus = async (): Promise<any> => {
    return await blockchainService.getBlockchainStatus();
  };

  return {
    logActionToChain,
    queryAgentActions,
    verifyActionOnChain,
    getBlockchainStatus,
    isConnected: !!account && !!signingClient,
    agentAddress: account?.bech32Address
  };
};
