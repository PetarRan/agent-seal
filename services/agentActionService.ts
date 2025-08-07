import { AgentAction, ActionLogEntry } from '../types/agent';
import { useAbstraxionSigningClient, useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { useBlockchainService } from './blockchainService';

export class AgentActionService {
  private static instance: AgentActionService;
  private actionLog: AgentAction[] = [];

  static getInstance(): AgentActionService {
    if (!AgentActionService.instance) {
      AgentActionService.instance = new AgentActionService();
    }
    return AgentActionService.instance;
  }

  // Create a new agent action
  createAction(
    agentId: string,
    actionType: AgentAction['actionType'],
    metadata: AgentAction['actionMetadata']
  ): AgentAction {
    const action: AgentAction = {
      agentId,
      timestamp: Date.now(),
      actionType,
      actionMetadata: metadata,
      status: 'pending'
    };

    this.actionLog.push(action);
    return action;
  }

  // Log action to blockchain
  async logActionToBlockchain(
    action: AgentAction,
    signingClient: any,
    agentAddress: string
  ): Promise<string> {
    try {
      // Create the message to be signed
      const message = this.createActionMessage(action);
      
      // Sign the message
      const signature = await signingClient.signArb(agentAddress, message);
      
      // Use blockchain service to log to smart contract
      const { logActionToChain } = useBlockchainService();
      const txHash = await logActionToChain(action, signature, agentAddress);
      
      // Update action with blockchain transaction hash
      action.blockchainTxHash = txHash;
      action.status = 'completed';
      
      return txHash;
    } catch (error) {
      action.status = 'failed';
      throw new Error(`Failed to log action to blockchain: ${error}`);
    }
  }

  // Create a message for signing
  private createActionMessage(action: AgentAction): string {
    const messageData = {
      agentId: action.agentId,
      timestamp: action.timestamp,
      actionType: action.actionType,
      metadata: action.actionMetadata,
      nonce: Math.random().toString(36).substring(2, 15)
    };

    return JSON.stringify(messageData);
  }

  // Create blockchain transaction (fallback method)
  private async createBlockchainTransaction(action: AgentAction, signature: string): Promise<string> {
    // Fallback method if blockchain service is not available
    const txData = {
      action: action,
      signature: signature,
      timestamp: Date.now()
    };

    console.log('Creating fallback blockchain transaction:', txData);
    
    // Simulate blockchain transaction hash
    return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Verify action authenticity
  async verifyAction(action: AgentAction, signature: string): Promise<boolean> {
    try {
      const message = this.createActionMessage(action);
      // In a real implementation, you would verify the signature here
      // using the agent's public key
      
      console.log('Verifying action:', {
        action,
        signature,
        message
      });
      
      return true; // Placeholder verification
    } catch (error) {
      console.error('Action verification failed:', error);
      return false;
    }
  }

  // Get action history for an agent
  getAgentActionHistory(agentId: string): AgentAction[] {
    return this.actionLog.filter(action => action.agentId === agentId);
  }

  // Get all pending actions
  getPendingActions(): AgentAction[] {
    return this.actionLog.filter(action => action.status === 'pending');
  }

  // Get action by transaction hash
  getActionByTxHash(txHash: string): AgentAction | undefined {
    return this.actionLog.find(action => action.blockchainTxHash === txHash);
  }
}

// React hook for agent action logging
export const useAgentActionLogging = () => {
  const { client: signingClient, signArb } = useAbstraxionSigningClient();
  const { data: account } = useAbstraxionAccount();
  
  const logAction = async (
    agentId: string,
    actionType: AgentAction['actionType'],
    metadata: AgentAction['actionMetadata']
  ): Promise<string> => {
    if (!signingClient || !account) {
      throw new Error('Agent not connected to blockchain');
    }

    const actionService = AgentActionService.getInstance();
    const action = actionService.createAction(agentId, actionType, metadata);
    
    const txHash = await actionService.logActionToBlockchain(
      action,
      signingClient,
      account.bech32Address
    );

    return txHash;
  };

  const verifyAction = async (action: AgentAction, signature: string): Promise<boolean> => {
    const actionService = AgentActionService.getInstance();
    return await actionService.verifyAction(action, signature);
  };

  return {
    logAction,
    verifyAction,
    isConnected: !!account,
    agentAddress: account?.bech32Address
  };
};
