export interface AgentAction {
  agentId: string;
  timestamp: number;
  actionType: 'task_completion' | 'location_visit' | 'form_submit' | 'verification';
  actionMetadata: {
    taskId?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    formData?: Record<string, any>;
    description: string;
    verificationHash?: string;
  };
  blockchainTxHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface AgentProfile {
  agentId: string;
  name: string;
  role: string;
  isActive: boolean;
  lastAction?: AgentAction;
}

export interface ActionLogEntry {
  action: AgentAction;
  signedMessage: string;
  verificationProof: string;
}
