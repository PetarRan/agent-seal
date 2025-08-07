import { AgentAction } from '../../types/agent/agent';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';

export interface BlockchainEvent {
  type: 'action_logged' | 'action_verified' | 'agent_connected' | 'agent_disconnected';
  data: any;
  timestamp: number;
  txHash?: string;
}

export class BlockchainEventService {
  private static instance: BlockchainEventService;
  private events: BlockchainEvent[] = [];
  private listeners: Map<string, Function[]> = new Map();

  static getInstance(): BlockchainEventService {
    if (!BlockchainEventService.instance) {
      BlockchainEventService.instance = new BlockchainEventService();
    }
    return BlockchainEventService.instance;
  }

  // Add event listener
  addEventListener(eventType: string, callback: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  // Remove event listener
  removeEventListener(eventType: string, callback: Function): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event
  private emitEvent(eventType: string, data: any): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Log agent action event
  logAgentActionEvent(action: AgentAction, txHash: string): void {
    const event: BlockchainEvent = {
      type: 'action_logged',
      data: action,
      timestamp: Date.now(),
      txHash
    };

    this.events.push(event);
    this.emitEvent('action_logged', event);
  }

  // Log action verification event
  logActionVerificationEvent(action: AgentAction, verified: boolean): void {
    const event: BlockchainEvent = {
      type: 'action_verified',
      data: { action, verified },
      timestamp: Date.now()
    };

    this.events.push(event);
    this.emitEvent('action_verified', event);
  }

  // Log agent connection event
  logAgentConnectionEvent(agentId: string, connected: boolean): void {
    const event: BlockchainEvent = {
      type: connected ? 'agent_connected' : 'agent_disconnected',
      data: { agentId, connected },
      timestamp: Date.now()
    };

    this.events.push(event);
    this.emitEvent(event.type, event);
  }

  // Get all events
  getAllEvents(): BlockchainEvent[] {
    return [...this.events];
  }

  // Get events by type
  getEventsByType(eventType: string): BlockchainEvent[] {
    return this.events.filter(event => event.type === eventType);
  }

  // Get recent events
  getRecentEvents(limit: number = 10): BlockchainEvent[] {
    return this.events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Clear events
  clearEvents(): void {
    this.events = [];
  }
}

// React hook for blockchain events
export const useBlockchainEvents = () => {
  const { data: account } = useAbstraxionAccount();
  const eventService = BlockchainEventService.getInstance();

  // Fetch agent actions (mock implementation)
  const fetchAgentActions = async (agentId: string): Promise<AgentAction[]> => {
    try {
      // In a real implementation, this would fetch from blockchain
      console.log('Fetching agent actions for:', agentId);
      
      // Return mock data
      return [
        {
          agentId,
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          actionType: 'task_completion',
          actionMetadata: {
            description: 'Completed task',
            taskId: 'task_001'
          },
          blockchainTxHash: 'mock_tx_hash_1',
          status: 'completed'
        },
        {
          agentId,
          timestamp: Date.now() - 4 * 60 * 60 * 1000,
          actionType: 'location_visit',
          actionMetadata: {
            description: 'Visited location',
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
              address: 'San Francisco, CA'
            }
          },
          blockchainTxHash: 'mock_tx_hash_2',
          status: 'completed'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch agent actions:', error);
      return [];
    }
  };

  // Get agents list
  const getAgents = async (): Promise<string[]> => {
    try {
      // In a real implementation, this would fetch from blockchain
      console.log('Fetching agents list');
      
      // Return mock data
      return ['agent_001', 'agent_002', 'agent_003'];
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return [];
    }
  };

  // Subscribe to events
  const subscribeToEvents = (eventType: string, callback: Function): (() => void) => {
    eventService.addEventListener(eventType, callback);
    
    // Return unsubscribe function
    return () => {
      eventService.removeEventListener(eventType, callback);
    };
  };

  // Get recent events
  const getRecentEvents = (limit: number = 10): BlockchainEvent[] => {
    return eventService.getRecentEvents(limit);
  };

  return {
    fetchAgentActions,
    getAgents,
    subscribeToEvents,
    getRecentEvents,
    isConnected: !!account
  };
};
