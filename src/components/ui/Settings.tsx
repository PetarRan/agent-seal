import React, { useEffect, useRef, useState } from 'react';
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
import { AgentActionLogger } from '../features/AgentActionLogger';

interface SettingsProps {
  onClose: () => void;
  walletAddress: string;
  onLogout: () => void;
  onRefresh?: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export const Settings: React.FC<SettingsProps> = ({ onClose, walletAddress, onLogout, onRefresh }) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [showZKTLSLogger, setShowZKTLSLogger] = useState(false);

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

  const truncateWalletAddress = (address: string) => {
    if (!address) return 'Not connected';
    if (address.length <= 20) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
  };

  const handleLogout = () => {
    // In real app, this would handle logout logic
    console.log('Logout pressed');
    handleClose();
    onLogout(); // Return to splash screen
  };

  const handleDeleteAccount = () => {
    // In real app, this would handle account deletion
    console.log('Delete account pressed');
    handleClose();
  };

  const handleZKTLSLogger = () => {
    setShowZKTLSLogger(true);
  };

  const handleCloseZKTLSLogger = () => {
    setShowZKTLSLogger(false);
    // Refresh the dashboard to show new actions
    if (onRefresh) {
      onRefresh();
    }
  };

  if (showZKTLSLogger) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.zktlsHeader}>
          <TouchableOpacity onPress={handleCloseZKTLSLogger}>
            <Text style={styles.backButton}>← Back to Settings</Text>
          </TouchableOpacity>
          <Text style={styles.zktlsTitle}>Xion zkTLS Logger</Text>
        </View>
        <AgentActionLogger agentId="test_agent_001" />
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={require('../../../assets/media/profile.png')} style={styles.profileImage} />
          <Text style={styles.walletAddress}>
            {truncateWalletAddress(walletAddress)}
          </Text>
        </View>

        {/* Settings Options */}
        <ScrollView style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Appearance</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Wallet</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>App icon</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Language</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>App info</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          {/* Developer Options */}
          <View style={styles.developerSection}>
            <Text style={styles.sectionTitle}>Developer Options</Text>
            <TouchableOpacity style={styles.optionItem} onPress={handleZKTLSLogger}>
              <Text style={styles.optionText}>Xion zkTLS Logger</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
              <Text style={styles.dangerText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleDeleteAccount}>
              <Text style={styles.dangerText}>Delete account</Text>
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
  container: {
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Hauora',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  walletAddress: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Hauora',
    textDecorationLine: 'underline',
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
  dangerZone: {
    marginTop: 20,
  },
  dangerText: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'Hauora',
  },
});
