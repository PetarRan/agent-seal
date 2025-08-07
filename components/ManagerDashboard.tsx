import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.headerRight}>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>J</Text>
            </View>
            <Text style={styles.date}>August 9 2025</Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Text style={styles.settingsButton}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting and Summary */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>Good morning, Jessica.</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            You have ✨ 4 agents doing ✅ 6 tasks.
          </Text>
          <Text style={styles.verificationText}>
            All your agents have been 🌱 verified
          </Text>
        </View>
        <View style={styles.currentDay}>
          <Text style={styles.currentDayText}>Mon</Text>
          <View style={styles.currentDayDot} />
        </View>
      </View>

      {/* Tasks Section */}
      <View style={styles.tasksContainer}>
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          {getDateRange().map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                date.getDate() === 9 && styles.selectedDate,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dateNumber,
                date.getDate() === 9 && styles.selectedDateText,
              ]}>
                {date.getDate()}
              </Text>
              <Text style={[
                styles.dateDay,
                date.getDate() === 9 && styles.selectedDateText,
              ]}>
                {getDayName(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <View style={styles.filterItem}>
            <Text style={styles.filterText}>All agents</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterText}>All actions</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterText}>All status</Text>
            <Text style={styles.filterArrow}>▼</Text>
          </View>
        </View>

        {/* Tasks Header */}
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>Tasks</Text>
          <Text style={styles.tasksCount}>{agentActions.length} tasks</Text>
        </View>

        {/* Tasks List */}
        <ScrollView style={styles.tasksList}>
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
                  <View style={styles.agentIcon}>
                    <Text style={styles.agentIconText}>🤖</Text>
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={styles.agentName}>OpenAI Agent</Text>
                    <Text style={styles.taskDescription}>
                      {action.actionMetadata.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.taskRight}>
                  <Text style={styles.taskTime}>
                    {formatTimeAgo(action.timestamp)}
                  </Text>
                  <View style={styles.verificationIcon}>
                    <Text style={styles.verificationIconText}>🌱</Text>
                  </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  settingsButton: {
    fontSize: 24,
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  summary: {
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  verificationText: {
    fontSize: 14,
    color: '#34C759',
  },
  currentDay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  currentDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 10,
  },
  tasksContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateItem: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedDate: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'white',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedDateText: {
    color: '#007AFF',
  },
  dateDay: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
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
    paddingHorizontal: 20,
    marginBottom: 15,
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
  agentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentIconText: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  verificationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationIconText: {
    fontSize: 12,
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
});
