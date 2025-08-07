import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { AgentAction } from '../../types/agent/agent';
import { AgentActionDetail } from './AgentActionDetail';
import { Settings } from '../ui/Settings';
import { useBlockchainEvents } from '../../services/blockchain/blockchainEventService';
import { useXionRealIntegration } from '../../services/xion/xionRealIntegration';

interface ManagerDashboardProps {
  onAgentActionPress: (action: AgentAction) => void;
  onLogout: () => void;
  authMode?: 'abstraxion' | 'demo' | 'none';
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ 
  onAgentActionPress, 
  onLogout,
  authMode = 'none'
}) => {
  const { data: account } = useAbstraxionAccount();
  const { fetchAgentActions, getAgents } = useBlockchainEvents();
  const { queryActionsFromXion } = useXionRealIntegration();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showActionDetail, setShowActionDetail] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [agents, setAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Dropdown states
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('All agents');
  const [selectedActionType, setSelectedActionType] = useState('All actions');
  const [selectedStatus, setSelectedStatus] = useState('All status');
  
  // Dropdown options
  const agentOptions = ['All agents', 'OpenAI', 'Claude'];
  const actionOptions = ['All actions', 'Emails', 'Pull requests', 'Code changes'];
  const statusOptions = ['All status', 'Done', 'In progress', 'Scheduled'];

  // Determine connection status based on auth mode
  const getConnectionStatus = () => {
    switch (authMode) {
      case 'abstraxion':
        return account ? 'Connected to Xion' : 'Connecting to Xion';
      case 'demo':
        return 'Demo Mode Active';
      default:
        return 'Disconnected';
    }
  };

  const isConnectedStatus = authMode === 'abstraxion' ? !!account : authMode === 'demo';

  // Load data from both sources
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load from Xion blockchain (real actions logged via zkTLS)
      let xionActions: any[] = [];
      if (authMode === 'abstraxion') {
        try {
          xionActions = await queryActionsFromXion('test_agent_001');
          setIsConnected(true);
        } catch (error) {
          console.log('Xion blockchain not available, using mock data only');
          xionActions = [];
          setIsConnected(false);
        }
      } else if (authMode === 'demo') {
        // In demo mode, simulate Xion actions
        xionActions = [
          {
            agentId: 'demo_agent_001',
            timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
            actionType: 'task_completion',
            metadata: {
              description: 'Demo task completed via zkTLS',
              taskId: 'demo_task_001',
            },
            xionTxHash: `demo_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
          }
        ];
        setIsConnected(true);
      }
      
      // Convert Xion actions to AgentAction format
      const convertedActions: AgentAction[] = xionActions.map((xionAction: any) => ({
        agentId: xionAction.agentId,
        timestamp: xionAction.timestamp,
        actionType: xionAction.actionType as AgentAction['actionType'],
        actionMetadata: xionAction.metadata,
        blockchainTxHash: xionAction.xionTxHash,
        status: 'completed'
      }));
      
      // Combine with mock data for demo
      const mockActions: AgentAction[] = [
        {
          agentId: 'openai_agent_001',
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          actionType: 'task_completion',
          actionMetadata: {
            description: 'Sent an email to the HR team regarding the problem with the holidays',
            taskId: 'task_001',
          },
          blockchainTxHash: 'cd81f167392c65fc3fe4553486c228a52281cee238085b3b4c8a1c5d3c9e182e',
          status: 'completed',
        },
        {
          agentId: 'openai_agent_001',
          timestamp: Date.now() - 4 * 60 * 60 * 1000,
          actionType: 'task_completion',
          actionMetadata: {
            description: 'Updated project documentation',
            taskId: 'task_002',
          },
          blockchainTxHash: 'ab72e456789c12d34e567f890a123b456c789d012e345f678g901h234i567j',
          status: 'completed',
        },
        {
          agentId: 'openai_agent_001',
          timestamp: Date.now() - 6 * 60 * 60 * 1000,
          actionType: 'location_visit',
          actionMetadata: {
            description: 'Visited client office for meeting',
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
              address: 'San Francisco, CA',
            },
          },
          blockchainTxHash: 'ef89a234b567c890d123e456f789g012h345i678j901k234l567m890n',
          status: 'completed',
        },
      ];
      
      // Combine and sort by timestamp (newest first)
      const allActions = [...convertedActions, ...mockActions].sort((a, b) => b.timestamp - a.timestamp);
      
      setAgentActions(allActions);
      setAgents(['openai_agent_001', 'test_agent_001', 'demo_agent_001']);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to mock data only
      const mockActions: AgentAction[] = [
        {
          agentId: 'openai_agent_001',
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          actionType: 'task_completion',
          actionMetadata: {
            description: 'Sent an email to the HR team regarding the problem with the holidays',
            taskId: 'task_001',
          },
          blockchainTxHash: 'cd81f167392c65fc3fe4553486c228a52281cee238085b3b4c8a1c5d3c9e182e',
          status: 'completed',
        },
        {
          agentId: 'openai_agent_001',
          timestamp: Date.now() - 4 * 60 * 60 * 1000,
          actionType: 'task_completion',
          actionMetadata: {
            description: 'Updated project documentation',
            taskId: 'task_002',
          },
          blockchainTxHash: 'ab72e456789c12d34e567f890a123b456c789d012e345f678g901h234i567j',
          status: 'completed',
        },
        {
          agentId: 'openai_agent_001',
          timestamp: Date.now() - 6 * 60 * 60 * 1000,
          actionType: 'location_visit',
          actionMetadata: {
            description: 'Visited client office for meeting',
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
              address: 'San Francisco, CA',
            },
          },
          blockchainTxHash: 'ef89a234b567c890d123e456f789g012h345i678j901k234l567m890n',
          status: 'completed',
        },
      ];
      setAgentActions(mockActions);
      setAgents(['openai_agent_001']);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data from blockchain
  useEffect(() => {
    loadData();
  }, [authMode]); // Reload when auth mode changes

  // Fade in animation for background
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAgentActionPress = (action: AgentAction) => {
    setSelectedAction(action);
    setShowActionDetail(true);
  };

  const handleAcknowledgeAction = (action: AgentAction) => {
    // In real app, this would update the blockchain
    console.log('Acknowledged action:', action);
    setShowActionDetail(false);
  };

  const handleFlagIssue = (action: AgentAction) => {
    // In real app, this would flag the action for review
    console.log('Flagged action:', action);
    setShowActionDetail(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ago`;
    }
    return `${hours}h ago`;
  };

  const getDayName = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[date.getDay()];
  };

  const getDateRange = () => {
    const dates = [];
    for (let i = 4; i <= 9; i++) {
      const date = new Date(2025, 7, i); // August 2025
      dates.push(date);
    }
    return dates;
  };

  const getCurrentDay = () => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[new Date().getDay()];
  };

  const getCurrentDate = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date();
    return `${months[date.getMonth()]} ${date.getDate()}\n${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Black Background */}
      <View style={styles.blackBackground} />
      
      {/* Animated Background Image */}
      <Animated.Image 
        source={require('../../../assets/media/homebg.png')} 
        style={[
          styles.backgroundImage,
          {
            opacity: fadeAnim,
          }
        ]} 
        resizeMode="cover" 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.connectionStatus}>
            <View style={[styles.connectionDot, isConnectedStatus ? styles.connectedDot : styles.disconnectedDot]} />
            <Text style={styles.connectionText}>
              {getConnectionStatus()}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Image source={require('../../../assets/media/profile.png')} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Day and Date */}
      <View style={styles.dateSection}>
        <View style={styles.currentDayContainer}>
          <Text style={styles.currentDayText}>{getCurrentDay()}</Text>
          <View style={styles.currentDayDot} />
        </View>
        <Text style={styles.fullDateText}>{getCurrentDate()}</Text>
      </View>

      {/* Greeting and Summary */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>Good morning, Jessica.</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>You have </Text>
            <Image source={require('../../../assets/icons/aigen.png')} style={styles.summaryIcon} />
            <Text style={styles.summaryText}> 4 agents doing </Text>
            <Image source={require('../../../assets/icons/check.png')} style={styles.summaryIcon} />
            <Text style={styles.summaryText}> 6 tasks. All your</Text>
          </View>
          <View style={styles.verificationRow}>
            <Text style={styles.summaryText}>agents have been </Text>
            <Image source={require('../../../assets/icons/verifiedbig.png')} style={styles.verifiedIcon} />
            <Text style={styles.verifiedText}> verified</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section - White Overlay */}
      <View style={styles.bottomSection}>
        {/* Calendar Timeline */}
        <View style={styles.calendarContainer}>
          {getDateRange().map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarItem,
                date.getDate() === 9 && styles.selectedCalendarItem,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.calendarNumber,
                date.getDate() === 9 && styles.selectedCalendarText,
              ]}>
                {date.getDate()}
              </Text>
              <Text style={[
                styles.calendarDay,
                date.getDate() === 9 && styles.selectedCalendarText,
              ]}>
                {getDayName(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={styles.filterItem}
            onPress={() => setShowAgentDropdown(!showAgentDropdown)}
          >
            <Text style={styles.filterText}>{selectedAgent}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterItem}
            onPress={() => setShowActionDropdown(!showActionDropdown)}
          >
            <Text style={styles.filterText}>{selectedActionType}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterItem}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <Text style={styles.filterText}>{selectedStatus}</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menus */}
        {showAgentDropdown && (
          <View style={styles.dropdownMenu}>
            {agentOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedAgent(option);
                  setShowAgentDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showActionDropdown && (
          <View style={styles.dropdownMenu}>
            {actionOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedActionType(option);
                  setShowActionDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showStatusDropdown && (
          <View style={styles.dropdownMenu}>
            {statusOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedStatus(option);
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tasks Header */}
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>Tasks</Text>
          <Text style={styles.tasksCount}>{agentActions.length} tasks</Text>
        </View>

        {/* Tasks List */}
        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading agent actions...</Text>
            </View>
          ) : (
            agentActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.taskItem}
                onPress={() => handleAgentActionPress(action)}
              >
                <View style={styles.taskLeft}>
                  <Image source={require('../../../assets/icons/openai.png')} style={styles.agentLogo} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.agentName}>OpenAI Agent</Text>
                    <View style={styles.actionRow}>
                      <Text style={styles.actionText}>Sent an </Text>
                      <Image source={require('../../../assets/icons/email.png')} style={styles.actionIcon} />
                      <Text style={styles.actionText}> email</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.taskRight}>
                  <Text style={styles.taskTime}>
                    {formatTimeAgo(action.timestamp)}
                  </Text>
                  <Image source={require('../../../assets/icons/verifiedsmall.png')} style={styles.verificationSmall} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Modal Components */}
      {showActionDetail && selectedAction && (
        <AgentActionDetail
          action={selectedAction}
          onClose={() => setShowActionDetail(false)}
          onAcknowledge={() => handleAcknowledgeAction(selectedAction)}
          onFlagIssue={() => handleFlagIssue(selectedAction)}
        />
      )}

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          walletAddress={account?.bech32Address || (authMode === 'demo' ? 'demo_wallet_address' : '')}
          onLogout={onLogout}
          onRefresh={loadData}
          authMode={authMode}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Hauora',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectedDot: {
    backgroundColor: '#4CAF50',
  },
  disconnectedDot: {
    backgroundColor: '#FF3B30',
  },
  connectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  settingsButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  currentDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDayText: {
    fontSize: 42,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Hauora',
  },
  currentDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EE6655',
    marginLeft: 10,
  },
  fullDateText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    lineHeight: 20,
  },
  greetingSection: {
    flex: 0.45,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 25,
    fontWeight: '500',
    color: 'white',
    marginBottom: 15,
    fontFamily: 'Hauora',
    lineHeight: 25,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  summaryText: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'Hauora',
    lineHeight: 25,
  },
  summaryIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  verifiedText: {
    fontSize: 25,
    color: '#32FF87',
    fontFamily: 'Hauora',
    lineHeight: 25,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 0,
  },
    calendarContainer: {
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  calendarItem: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 0,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  selectedCalendarItem: {
    backgroundColor: '#f0f0f0',
  },
  calendarNumber: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
  },
  selectedCalendarText: {
    color: '#007AFF',
  },
  calendarDay: {
    fontSize: 12,
    color: '#666',
    marginTop: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  filterText: {
    fontSize: 12,
    color: '#333',
    marginRight: 5,
  },
  filterArrow: {
    fontSize: 10,
    color: '#666',
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tasksCount: {
    fontSize: 14,
    color: '#666',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  actionIcon: {
    width: 14,
    height: 14,
    marginHorizontal: 2,
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  verificationSmall: {
    width: 16,
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
  },
});
