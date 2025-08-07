// Import Xion zkTLS types first
import { XionZKTLSProof, XionLocationProof, XionFormProof } from '../../services/xion/xionZKTLS';

// Agent Action Types
export interface AgentAction {
  agentId: string;
  timestamp: number;
  actionType: 'task_completion' | 'location_visit' | 'form_submit' | 'verification';
  actionMetadata: {
    description: string;
    taskId?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    formData?: any;
    [key: string]: any;
  };
  blockchainTxHash?: string;
  status: 'pending' | 'completed' | 'failed';
  zkProof?: XionZKTLSProof | XionLocationProof | XionFormProof;
}

export interface ActionLogEntry {
  action: AgentAction;
  timestamp: number;
  signature: string;
  verified: boolean;
}



export interface XionZKTLSConfig {
  enablePrivacy: boolean;
  proofType: 'location' | 'form' | 'action' | 'all';
  xionChainId: string;
  rpcUrl: string;
}
