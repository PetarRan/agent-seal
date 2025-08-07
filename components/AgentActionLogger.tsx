import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { useAgentActionLogging } from '../services/agentActionService';
import { AgentAction } from '../types/agent';

export const AgentActionLogger: React.FC = () => {
  const { data: account, isConnected, login, logout } = useAbstraxionAccount();
  const { logAction, verifyAction, isConnected: isActionConnected, agentAddress } = useAgentActionLogging();
  
  const [agentId, setAgentId] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [actionType, setActionType] = useState<AgentAction['actionType']>('task_completion');
  const [isLogging, setIsLogging] = useState(false);
  const [actionHistory, setActionHistory] = useState<AgentAction[]>([]);

  const handleLogin = async () => {
    try {
      await login();
      Alert.alert('Success', 'Agent logged in successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to login agent');
    }
  };

  const handleLogAction = async () => {
    if (!agentId.trim()) {
      Alert.alert('Error', 'Please enter an Agent ID');
      return;
    }

    if (!actionDescription.trim()) {
      Alert.alert('Error', 'Please enter an action description');
      return;
    }

    setIsLogging(true);
    try {
      const metadata = {
        description: actionDescription,
        taskId: `task_${Date.now()}`,
      };

      const txHash = await logAction(agentId, actionType, metadata);
      
      Alert.alert(
        'Success',
        `Action logged to blockchain!\nTransaction Hash: ${txHash}`
      );

      // Clear form
      setActionDescription('');
      
      // Update action history
      const actionService = require('../services/agentActionService').AgentActionService.getInstance();
      setActionHistory(actionService.getAgentActionHistory(agentId));
      
    } catch (error) {
      Alert.alert('Error', `Failed to log action: ${error}`);
    } finally {
      setIsLogging(false);
    }
  };

  const handleLocationVisit = async () => {
    if (!agentId.trim()) {
      Alert.alert('Error', 'Please enter an Agent ID');
      return;
    }

    setIsLogging(true);
    try {
      // Simulate getting location (in real app, use expo-location)
      const mockLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      };

      const metadata = {
        description: 'Agent visited location',
        location: mockLocation,
      };

      const txHash = await logAction(agentId, 'location_visit', metadata);
      
      Alert.alert(
        'Success',
        `Location visit logged to blockchain!\nTransaction Hash: ${txHash}`
      );
      
    } catch (error) {
      Alert.alert('Error', `Failed to log location visit: ${error}`);
    } finally {
      setIsLogging(false);
    }
  };

  const handleFormSubmit = async () => {
    if (!agentId.trim()) {
      Alert.alert('Error', 'Please enter an Agent ID');
      return;
    }

    setIsLogging(true);
    try {
      const mockFormData = {
        field1: 'value1',
        field2: 'value2',
        timestamp: Date.now()
      };

      const metadata = {
        description: 'Agent submitted form',
        formData: mockFormData,
      };

      const txHash = await logAction(agentId, 'form_submit', metadata);
      
      Alert.alert(
        'Success',
        `Form submission logged to blockchain!\nTransaction Hash: ${txHash}`
      );
      
    } catch (error) {
      Alert.alert('Error', `Failed to log form submission: ${error}`);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agent Action Logger</Text>
      
      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Connection Status:</Text>
        <Text style={[styles.statusText, { color: isConnected ? 'green' : 'red' }]}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        {account && (
          <Text style={styles.addressText}>Address: {account.bech32Address}</Text>
        )}
      </View>

      {/* Login/Logout */}
      <View style={styles.buttonContainer}>
        {!isConnected ? (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login Agent</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
            <Text style={styles.buttonText}>Logout Agent</Text>
          </TouchableOpacity>
        )}
      </View>

      {isConnected && (
        <>
          {/* Agent ID Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Agent ID:</Text>
            <TextInput
              style={styles.input}
              value={agentId}
              onChangeText={setAgentId}
              placeholder="Enter Agent ID"
            />
          </View>

          {/* Action Type Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Action Type:</Text>
            <View style={styles.actionTypeContainer}>
              {(['task_completion', 'location_visit', 'form_submit', 'verification'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.actionTypeButton,
                    actionType === type && styles.actionTypeButtonActive
                  ]}
                  onPress={() => setActionType(type)}
                >
                  <Text style={[
                    styles.actionTypeText,
                    actionType === type && styles.actionTypeTextActive
                  ]}>
                    {type.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Action Description:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={actionDescription}
              onChangeText={setActionDescription}
              placeholder="Describe the action..."
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.actionButton]}
              onPress={handleLogAction}
              disabled={isLogging}
            >
              <Text style={styles.buttonText}>
                {isLogging ? 'Logging...' : 'Log Action'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.actionButton]}
              onPress={handleLocationVisit}
              disabled={isLogging}
            >
              <Text style={styles.buttonText}>
                {isLogging ? 'Logging...' : 'Log Location Visit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.actionButton]}
              onPress={handleFormSubmit}
              disabled={isLogging}
            >
              <Text style={styles.buttonText}>
                {isLogging ? 'Logging...' : 'Log Form Submit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action History */}
          {actionHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Actions:</Text>
              {actionHistory.slice(-5).map((action, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    {action.actionType}: {action.actionMetadata.description}
                  </Text>
                  <Text style={styles.historyTimestamp}>
                    {new Date(action.timestamp).toLocaleString()}
                  </Text>
                  {action.blockchainTxHash && (
                    <Text style={styles.txHash}>
                      TX: {action.blockchainTxHash}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionTypeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  actionTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  actionTypeText: {
    fontSize: 12,
    color: '#333',
  },
  actionTypeTextActive: {
    color: 'white',
  },
  actionButtonsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#34C759',
  },
  historyContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  txHash: {
    fontSize: 10,
    color: '#007AFF',
    marginTop: 2,
    fontFamily: 'monospace',
  },
});
