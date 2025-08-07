import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Switch,
  SafeAreaView
} from 'react-native';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { useXionRealIntegration } from '../../services/xion/xionRealIntegration';
import { AgentAction } from '../../types/agent/agent';

interface AgentActionLoggerProps {
  agentId?: string;
}

export const AgentActionLogger: React.FC<AgentActionLoggerProps> = ({ agentId = 'demo_agent_001' }) => {
  const { data: account, isConnected } = useAbstraxionAccount();
  const { logActionToXion, queryActionsFromXion, verifyActionOnXion, getXionStatus, agentAddress } = useXionRealIntegration();
  
  const [actionType, setActionType] = useState<'task_completion' | 'location_visit' | 'form_submit' | 'verification'>('task_completion');
  const [description, setDescription] = useState('');
  const [taskId, setTaskId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [formData, setFormData] = useState('');
  const [enablePrivacy, setEnablePrivacy] = useState(true);
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [xionStatus, setXionStatus] = useState<any>(null);

  // Determine if we can log actions
  const canLogActions = isConnected || agentId === 'demo_agent_001';

  // Load status once when component mounts
  useEffect(() => {
    const loadStatus = async () => {
      try {
        if (agentId === 'demo_agent_001') {
          setXionStatus({
            connected: true,
            chainId: 'xion-testnet-1',
            balance: '1000 ustars',
            demo: true
          });
        } else if (isConnected) {
          const status = await getXionStatus();
          setXionStatus(status);
        } else {
          setXionStatus({
            connected: false,
            error: 'Not connected to Xion'
          });
        }
      } catch (error) {
        console.error('Failed to get Xion status:', error);
        setXionStatus({
          connected: false,
          error: 'Failed to connect to Xion'
        });
      }
    };

    loadStatus();
  }, [agentId, isConnected]);

  // Load history once when component mounts
  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (agentId === 'demo_agent_001') {
          const demoHistory = [
            {
              agentId: 'demo_agent_001',
              timestamp: Date.now() - 1000 * 60 * 30,
              actionType: 'task_completion',
              metadata: {
                description: 'Demo task completed',
                taskId: 'demo_task_001'
              },
              xionTxHash: `demo_tx_${Date.now() - 1000 * 60 * 30}_demo`,
              verified: true,
              demo: true
            }
          ];
          setActionHistory(demoHistory);
        } else {
          const history = await queryActionsFromXion(agentId);
          setActionHistory(history);
        }
      } catch (error) {
        console.error('Failed to load action history:', error);
      }
    };

    loadHistory();
  }, [agentId]);

  const handleLogAction = async () => {
    if (!canLogActions) {
      Alert.alert('Error', 'Please connect to Xion blockchain first');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setIsLogging(true);

    try {
      const metadata: any = {
        description: description.trim(),
        taskId: taskId.trim() || undefined,
        location: (latitude && longitude) ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: address.trim() || undefined
        } : undefined,
        formData: formData.trim() ? JSON.parse(formData) : undefined,
        privacyEnabled: enablePrivacy
      };

      let txHash: string;
      if (agentId === 'demo_agent_001') {
        txHash = `demo_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      } else {
        txHash = await logActionToXion(agentId, actionType, metadata);
      }
      
      Alert.alert(
        'Success', 
        `Action logged ${agentId === 'demo_agent_001' ? '(Demo Mode)' : 'to Xion blockchain'}!\nTransaction Hash: ${txHash}`,
        [{ text: 'OK', onPress: () => clearForm() }]
      );

      const newAction = {
        agentId,
        timestamp: Date.now(),
        actionType,
        metadata,
        xionTxHash: txHash,
        verified: false,
        demo: agentId === 'demo_agent_001'
      };
      
      setActionHistory(prev => [newAction, ...prev]);

    } catch (error) {
      Alert.alert('Error', `Failed to log action: ${error}`);
    } finally {
      setIsLogging(false);
    }
  };

  const clearForm = () => {
    setDescription('');
    setTaskId('');
    setLatitude('');
    setLongitude('');
    setAddress('');
    setFormData('');
    setActionType('task_completion');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>zkTLS Action Logger</Text>
        
        {/* Connection Status */}
        <View style={styles.statusSection}>
          <View style={styles.connectionStatus}>
            <Text style={styles.statusLabel}>Connection Status:</Text>
            <Text style={[styles.statusText, canLogActions ? styles.connected : styles.disconnected]}>
              {agentId === 'demo_agent_001' ? 'Demo Mode Active' : (isConnected ? 'Connected to Xion' : 'Disconnected')}
            </Text>
          </View>

          {canLogActions && (
            <Text style={styles.addressText}>Agent: {agentAddress || account?.bech32Address || agentId}</Text>
          )}

          <View style={styles.xionStatus}>
            <Text style={styles.statusLabel}>Xion Status:</Text>
            <Text style={styles.statusText}>
              {xionStatus?.demo
                ? 'Demo Mode - Using simulated blockchain data'
                : xionStatus?.error
                  ? xionStatus.error
                  : `Chain: ${xionStatus?.chainId} | Balance: ${xionStatus?.balance || 'N/A'}`
              }
            </Text>
          </View>
        </View>

        {/* Action Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Log New Action</Text>
          
          {/* Action Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Action Type:</Text>
            <View style={styles.pickerContainer}>
              {(['task_completion', 'location_visit', 'form_submit', 'verification'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.pickerOption, actionType === type && styles.pickerOptionSelected]}
                  onPress={() => setActionType(type)}
                >
                  <Text style={[styles.pickerOptionText, actionType === type && styles.pickerOptionTextSelected]}>
                    {type.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *:</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the action..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Task ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task ID (optional):</Text>
            <TextInput
              style={styles.textInput}
              value={taskId}
              onChangeText={setTaskId}
              placeholder="Enter task ID..."
              placeholderTextColor="#666"
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location (optional):</Text>
            <View style={styles.locationInputs}>
              <TextInput
                style={[styles.textInput, styles.halfInput]}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.textInput, styles.halfInput]}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Address (optional)"
              placeholderTextColor="#666"
            />
          </View>

          {/* Form Data */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Form Data (JSON, optional):</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData}
              onChangeText={setFormData}
              placeholder='{"key": "value"}'
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Privacy Toggle */}
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Enable zkTLS Privacy:</Text>
              <Switch
                value={enablePrivacy}
                onValueChange={setEnablePrivacy}
                trackColor={{ false: '#333', true: '#4CAF50' }}
                thumbColor={enablePrivacy ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Log Button */}
          <TouchableOpacity
            style={[styles.logButton, !canLogActions && styles.logButtonDisabled]}
            onPress={handleLogAction}
            disabled={!canLogActions || isLogging}
          >
            <Text style={styles.logButtonText}>
              {isLogging ? 'Logging...' : `Log Action ${agentId === 'demo_agent_001' ? '(Demo)' : ''}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Action History</Text>
          {actionHistory.length === 0 ? (
            <Text style={styles.noHistoryText}>No actions logged yet</Text>
          ) : (
            actionHistory.map((action, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyType}>{action.actionType.toUpperCase()}</Text>
                  <Text style={styles.historyTime}>
                    {new Date(action.timestamp).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.historyDescription}>{action.metadata.description}</Text>
                <Text style={styles.historyHash}>Tx: {action.xionTxHash}</Text>
                {action.demo && <Text style={styles.demoBadge}>DEMO</Text>}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  statusSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    color: '#999',
    fontSize: 14,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  connected: {
    color: '#4CAF50',
  },
  disconnected: {
    color: '#FF3B30',
  },
  addressText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 8,
  },
  xionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  locationInputs: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerOptionSelected: {
    backgroundColor: '#4CAF50',
  },
  pickerOptionText: {
    color: 'white',
    fontSize: 12,
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logButtonDisabled: {
    backgroundColor: '#666',
  },
  logButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  noHistoryText: {
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  historyItem: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  historyTime: {
    color: '#999',
    fontSize: 12,
  },
  historyDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  historyHash: {
    color: '#999',
    fontSize: 12,
  },
  demoBadge: {
    color: '#FFA500',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});
