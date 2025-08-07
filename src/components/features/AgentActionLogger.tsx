import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Switch
} from 'react-native';
import { useXionRealIntegration } from '../../services/xion/xionRealIntegration';
import { AgentAction } from '../../types/agent/agent';

interface AgentActionLoggerProps {
  agentId: string;
}

export const AgentActionLogger: React.FC<AgentActionLoggerProps> = ({ agentId }) => {
  const { logActionToXion, queryActionsFromXion, verifyActionOnXion, getXionStatus, isConnected, agentAddress } = useXionRealIntegration();
  
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

  useEffect(() => {
    // Get Xion blockchain status
    const loadXionStatus = async () => {
      try {
        const status = await getXionStatus();
        setXionStatus(status);
      } catch (error) {
        console.error('Failed to get Xion status:', error);
      }
    };

    if (isConnected) {
      loadXionStatus();
    }
  }, [isConnected, getXionStatus]);

  const handleLogAction = async () => {
    if (!isConnected) {
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

      const txHash = await logActionToXion(agentId, actionType, metadata);
      
      Alert.alert(
        'Success', 
        `Action logged to Xion blockchain!\nTransaction Hash: ${txHash}`,
        [{ text: 'OK', onPress: () => clearForm() }]
      );

      // Add to action history
      const newAction = {
        agentId,
        timestamp: Date.now(),
        actionType,
        metadata,
        xionTxHash: txHash,
        verified: false
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
  };

  const verifyAction = async (action: any) => {
    try {
      const isValid = await verifyActionOnXion(action);
      Alert.alert(
        'Verification Result',
        isValid ? 'Action verified on Xion blockchain!' : 'Action verification failed'
      );
    } catch (error) {
      Alert.alert('Error', `Verification failed: ${error}`);
    }
  };

  const loadActionHistory = async () => {
    try {
      const actions = await queryActionsFromXion(agentId);
      setActionHistory(actions);
    } catch (error) {
      console.error('Failed to load action history:', error);
    }
  };

  const renderActionTypeInput = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Action Type:</Text>
      <View style={styles.buttonGroup}>
        {(['task_completion', 'location_visit', 'form_submit', 'verification'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, actionType === type && styles.typeButtonActive]}
            onPress={() => setActionType(type)}
          >
            <Text style={[styles.typeButtonText, actionType === type && styles.typeButtonTextActive]}>
              {type.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderLocationInputs = () => (
    actionType === 'location_visit' && (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location Details:</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Address (optional)"
          value={address}
          onChangeText={setAddress}
        />
      </View>
    )
  );

  const renderFormInputs = () => (
    actionType === 'form_submit' && (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Form Data (JSON):</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder='{"field1": "value1", "field2": "value2"}'
          value={formData}
          onChangeText={setFormData}
          multiline
          numberOfLines={4}
        />
      </View>
    )
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agent Action Logger</Text>
        <Text style={styles.subtitle}>Real Xion Blockchain Integration</Text>
        
        <View style={styles.connectionStatus}>
          <Text style={styles.statusLabel}>Connection Status:</Text>
          <Text style={[styles.statusText, isConnected ? styles.connected : styles.disconnected]}>
            {isConnected ? 'Connected to Xion' : 'Disconnected'}
          </Text>
        </View>

        {isConnected && (
          <Text style={styles.addressText}>Agent: {agentAddress}</Text>
        )}

        {xionStatus && (
          <View style={styles.xionStatus}>
            <Text style={styles.statusLabel}>Xion Status:</Text>
            <Text style={styles.statusText}>
              Chain: {xionStatus.chainId} | Balance: {xionStatus.balance || 'N/A'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.privacyConfig}>
        <Text style={styles.label}>Privacy Settings:</Text>
        <Switch
          value={enablePrivacy}
          onValueChange={setEnablePrivacy}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={enablePrivacy ? '#f5dd4b' : '#f4f3f4'}
        />
        <Text style={styles.privacyInfo}>
          {enablePrivacy 
            ? '✓ Privacy enabled - sensitive data will be hashed' 
            : '⚠ Privacy disabled - data may be exposed'
          }
        </Text>
      </View>

      {renderActionTypeInput()}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the action..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>

      {actionType === 'task_completion' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task ID (optional):</Text>
          <TextInput
            style={styles.input}
            placeholder="task_123"
            value={taskId}
            onChangeText={setTaskId}
          />
        </View>
      )}

      {renderLocationInputs()}
      {renderFormInputs()}

      <TouchableOpacity
        style={[styles.logButton, isLogging && styles.logButtonDisabled]}
        onPress={handleLogAction}
        disabled={isLogging || !isConnected}
      >
        <Text style={styles.logButtonText}>
          {isLogging ? 'Logging to Xion...' : 'Log Action to Xion Blockchain'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loadHistoryButton}
        onPress={loadActionHistory}
      >
        <Text style={styles.loadHistoryButtonText}>Load Action History from Xion</Text>
      </TouchableOpacity>

      {actionHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Actions:</Text>
          {actionHistory.map((action, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyActionType}>
                {action.actionType.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.historyDescription}>
                {action.metadata.description}
              </Text>
              <Text style={styles.historyTimestamp}>
                {new Date(action.timestamp).toLocaleString()}
              </Text>
              {action.xionTxHash && (
                <Text style={styles.historyTxHash}>
                  Xion TX: {action.xionTxHash.substring(0, 20)}...
                </Text>
              )}
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => verifyAction(action)}
              >
                <Text style={styles.verifyButtonText}>Verify on Xion</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  connected: {
    color: '#4CAF50',
  },
  disconnected: {
    color: '#F44336',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  xionStatus: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  privacyConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  privacyInfo: {
    fontSize: 12,
    color: '#1976d2',
    marginLeft: 10,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  logButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logButtonDisabled: {
    backgroundColor: '#ccc',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadHistoryButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadHistoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historySection: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  historyActionType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  historyDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  historyTxHash: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
