import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { AgentAction } from '../types/agent';

interface AgentActionDetailProps {
  action: AgentAction;
  onClose: () => void;
  onAcknowledge: () => void;
  onFlagIssue: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export const AgentActionDetail: React.FC<AgentActionDetailProps> = ({
  action,
  onClose,
  onAcknowledge,
  onFlagIssue,
}) => {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateHash = (hash: string) => {
    if (hash.length <= 20) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.agentInfo}>
            <View style={styles.agentIcon}>
              <Text style={styles.agentIconText}>🤖</Text>
            </View>
            <Text style={styles.agentName}>OpenAI Agent</Text>
          </View>
          <View style={styles.verificationStatus}>
            <Text style={styles.verificationIcon}>🌱</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {/* Timestamp Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={styles.sectionTitle}>Timestamp</Text>
            </View>
            <Text style={styles.sectionValue}>
              {formatTimestamp(action.timestamp)}
            </Text>
          </View>

          {/* Action Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIndicator, styles.greenIndicator]} />
              <Text style={styles.sectionTitle}>Action summary</Text>
            </View>
            <Text style={styles.sectionValue}>
              {action.actionMetadata.description}
            </Text>
          </View>

          {/* Blockchain Hash Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIndicator, styles.purpleIndicator]} />
              <Text style={styles.sectionTitle}>Blockchain hash</Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.sectionValue, styles.hashValue]}>
                {truncateHash(action.blockchainTxHash || '')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIndicator, styles.greenIndicator]} />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>No note</Text>
              <TouchableOpacity style={styles.addNoteButton}>
                <Text style={styles.addNoteText}>Add a note</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Action Details */}
          {action.actionMetadata.location && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, styles.blueIndicator]} />
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              <Text style={styles.sectionValue}>
                {action.actionMetadata.location.address}
              </Text>
              <Text style={styles.locationCoords}>
                {action.actionMetadata.location.latitude.toFixed(4)}, {action.actionMetadata.location.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          {action.actionMetadata.taskId && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, styles.orangeIndicator]} />
                <Text style={styles.sectionTitle}>Task ID</Text>
              </View>
              <Text style={styles.sectionValue}>
                {action.actionMetadata.taskId}
              </Text>
            </View>
          )}

          {/* Action Type */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIndicator, styles.cyanIndicator]} />
              <Text style={styles.sectionTitle}>Action Type</Text>
            </View>
            <Text style={styles.sectionValue}>
              {action.actionType.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIndicator, styles.statusIndicator]} />
              <Text style={styles.sectionTitle}>Status</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, styles[`status${action.status}`]]} />
              <Text style={styles.sectionValue}>
                {action.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.flagButton} onPress={onFlagIssue}>
            <Text style={styles.flagButtonText}>Flag issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acknowledgeButton} onPress={onAcknowledge}>
            <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  verificationStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    backgroundColor: '#007AFF',
    marginRight: 12,
    borderRadius: 2,
  },
  greenIndicator: {
    backgroundColor: '#34C759',
  },
  purpleIndicator: {
    backgroundColor: '#AF52DE',
  },
  blueIndicator: {
    backgroundColor: '#007AFF',
  },
  orangeIndicator: {
    backgroundColor: '#FF9500',
  },
  cyanIndicator: {
    backgroundColor: '#5AC8FA',
  },
  statusIndicator: {
    backgroundColor: '#FF3B30',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  sectionValue: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
  },
  hashValue: {
    textDecorationLine: 'underline',
    color: '#007AFF',
  },
  notesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notesText: {
    fontSize: 16,
    color: 'white',
  },
  addNoteButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addNoteText: {
    fontSize: 14,
    color: 'white',
  },
  locationCoords: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statuscompleted: {
    backgroundColor: '#34C759',
  },
  statuspending: {
    backgroundColor: '#FF9500',
  },
  statusfailed: {
    backgroundColor: '#FF3B30',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  flagButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  flagButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  acknowledgeButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  acknowledgeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
