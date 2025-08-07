import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { AgentAction } from '../../types/agent/agent';

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
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    // Slide down animation
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

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
      <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.agentInfo}>
            <Image source={require('../../../assets/icons/openai_white.png')} style={styles.agentIcon} />
            <Text style={styles.agentName}>OpenAI Agent</Text>
          </View>
          <Image source={require('../../../assets/icons/verifiedsmall.png')} style={styles.verificationIcon} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
      </Animated.View>
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
    backgroundColor: '#0C0F11',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.6,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
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
    width: 24,
    height: 24,
    borderRadius: 20,
    marginRight: 12,
  },
  agentName: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Hauora',
  },
  verificationIcon: {
    width: 16,
    height: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  sectionValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addNoteButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addNoteText: {
    fontSize: 12,
    color: 'white',
  },
  locationCoords: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  flagButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  flagButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
  acknowledgeButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  acknowledgeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0C0F11',
  },
});
