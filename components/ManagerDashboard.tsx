import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { AgentAction } from '../types/agent';
import { AgentActionDetail } from './AgentActionDetail';
import { Settings } from './Settings';
import { useBlockchainEvents } from '../services/blockchainEventService';

interface ManagerDashboardProps {
  onAgentActionPress: (action: AgentAction) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onAgentActionPress }) => {
  const { data: account } = useAbstraxionAccount();
  const { fetchAgentActions, getAgents } = useBlockchainEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showActionDetail, setShowActionDetail] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [agents, setAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Fetch data from blockchain
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Use mock data for now to avoid blockchain issues
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
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array to prevent infinite loops

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
      
      {/* Background Image */}
      <Image source={require('../assets/homebg.png')} style={styles.backgroundImage} resizeMode="cover" />
      
      {/* Top Section - Dark Background */}
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Image source={require('../assets/profile.png')} style={styles.profileImage} />
          </TouchableOpacity>
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
              <Image source={require('../assets/aigen.png')} style={styles.summaryIcon} />
              <Text style={styles.summaryText}> 4 agents doing </Text>
              <Image source={require('../assets/check.png')} style={styles.summaryIcon} />
              <Text style={styles.summaryText}> 6 tasks. All your</Text>
            </View>
            <View style={styles.verificationRow}>
              <Text style={styles.summaryText}>agents have been </Text>
              <Image source={require('../assets/verifiedbig.png')} style={styles.verifiedIcon} />
              <Text style={styles.verifiedText}> verified</Text>
            </View>
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
                  <Image source={require('../assets/openai.png')} style={styles.agentLogo} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.agentName}>OpenAI Agent</Text>
                    <View style={styles.actionRow}>
                      <Text style={styles.actionText}>Sent an </Text>
                      <Image source={require('../assets/email.png')} style={styles.actionIcon} />
                      <Text style={styles.actionText}> email</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.taskRight}>
                  <Text style={styles.taskTime}>
                    {formatTimeAgo(action.timestamp)}
                  </Text>
                  <Image source={require('../assets/verifiedsmall.png')} style={styles.verificationSmall} />
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
          walletAddress={account?.bech32Address || ''}
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  topSection: {
    flex: 0.45,
    paddingTop: 60,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Hauora',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
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
    flex: 1,
    paddingHorizontal: 20,
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
    flex: 0.55,
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
