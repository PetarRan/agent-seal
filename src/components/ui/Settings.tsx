import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { AgentActionLogger } from '../features/AgentActionLogger';

const { height: screenHeight } = Dimensions.get('window');

interface SettingsProps {
  onClose: () => void;
  walletAddress: string;
  onLogout: () => void;
  onRefresh: () => void;
  authMode?: 'abstraxion' | 'demo' | 'none';
}

export const Settings: React.FC<SettingsProps> = ({ 
  onClose, 
  walletAddress, 
  onLogout, 
  onRefresh,
  authMode = 'none'
}) => {
  const { data: account, isConnected } = useAbstraxionAccount();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [showZKTLSLogger, setShowZKTLSLogger] = useState(false);

  const truncateWalletAddress = (address: string) => {
    if (!address) return 'Not connected';
    if (address.length <= 20) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
  };

  const getConnectionStatus = () => {
    switch (authMode) {
      case 'abstraxion':
        return isConnected ? 'Connected to Xion' : 'Disconnected';
      case 'demo':
        return 'Demo Mode Active';
      default:
        return 'Disconnected';
    }
  };

  const getConnectionSubtext = () => {
    switch (authMode) {
      case 'abstraxion':
        return isConnected
          ? 'Ready to use zkTLS privacy features'
          : 'Connect to use zkTLS privacy features';
      case 'demo':
        return 'Using simulated blockchain data for testing';
      default:
        return 'Connect to use zkTLS privacy features';
    }
  };

  const isConnectedStatus = authMode === 'abstraxion' ? isConnected : authMode === 'demo';

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (showZKTLSLogger) {
    return (
      <View style={styles.loggerScreen}>
        <View style={styles.zktlsHeader}>
          <TouchableOpacity onPress={() => setShowZKTLSLogger(false)}>
            <Text style={styles.backButton}>← Back to Settings</Text>
          </TouchableOpacity>
          <Text style={styles.zktlsTitle}>Xion zkTLS Logger</Text>
        </View>
        <AgentActionLogger agentId={authMode === 'demo' ? 'demo_agent_001' : 'test_agent_001'} />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <ScrollView style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Appearance</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Notifications</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Privacy</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Security</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Help & Support</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>About</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* Developer Options */}
          <View style={styles.developerSection}>
            <Text style={styles.sectionTitle}>Developer Options</Text>
            <TouchableOpacity style={styles.optionItem} onPress={() => setShowZKTLSLogger(true)}>
              <Text style={styles.optionText}>Xion zkTLS Logger</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Connection Status */}
          <View style={styles.connectionSection}>
            <Text style={styles.sectionTitle}>Connection Status</Text>
            <View style={styles.connectionItem}>
              <View style={styles.connectionStatus}>
                <View style={[styles.connectionDot, isConnectedStatus ? styles.connectedDot : styles.disconnectedDot]} />
                <Text style={styles.connectionText}>
                  {getConnectionStatus()}
                </Text>
              </View>
              <Text style={styles.connectionSubtext}>
                {getConnectionSubtext()}
              </Text>
            </View>
          </View>

          {/* Wallet Info */}
          <View style={styles.walletSection}>
            <Text style={styles.sectionTitle}>Wallet Information</Text>
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Address:</Text>
              <Text style={styles.walletAddress}>{truncateWalletAddress(walletAddress)}</Text>
            </View>
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Network:</Text>
              <Text style={styles.walletNetwork}>
                {authMode === 'demo' ? 'Xion Testnet (Demo)' : 'Xion Testnet'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          {/* <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
              <Text style={styles.actionButtonText}>Refresh Data</Text>
              <Text style={styles.actionButtonSubtext}>Sync with blockchain</Text>
            </TouchableOpacity>
          </View> */}

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <TouchableOpacity style={styles.dangerButton} onPress={onLogout}>
              <Text style={styles.dangerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  modal: {
    backgroundColor: '#0C0F11',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.95,
    minHeight: screenHeight * 0.8,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#0C0F11',
  },
  loggerScreen: {
    flex: 5,
    backgroundColor: '#0C0F11',
  },
  zktlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    marginRight: 20,
  },
  zktlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Hauora',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#FFFFFF0D',
    borderRadius: 12,
  },
  optionText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Hauora',
  },
  optionArrow: {
    fontSize: 18,
    color: '#666',
  },
  developerSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Hauora',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  connectionSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  connectionItem: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF0D',
    borderRadius: 12,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  connectedDot: {
    backgroundColor: '#32FF87',
  },
  disconnectedDot: {
    backgroundColor: '#FF6666',
  },
  connectionText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Hauora',
  },
  connectionSubtext: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Hauora',
  },
  walletSection: {
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF0D',
    borderRadius: 12,
  },
  walletLabel: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Hauora',
  },
  walletAddress: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Hauora',
    textDecorationLine: 'underline',
  },
  walletNetwork: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Hauora',
  },
  actionsSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Hauora',
    fontWeight: 'bold',
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Hauora',
    marginTop: 4,
  },
  dangerZone: {
    marginTop: 20,
    marginBottom: 20,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Hauora',
  },
});
