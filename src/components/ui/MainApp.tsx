import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion-react-native';
import { ManagerDashboard } from '../features/ManagerDashboard';
import { SplashScreen } from './SplashScreen';

export const MainApp: React.FC = () => {
  const { data: account, isConnected, login } = useAbstraxionAccount();
  const [showSplash, setShowSplash] = useState(!isConnected);

  const handleContinueWithWallet = async () => {
    // Temporarily bypass authentication for demo
    setShowSplash(false);
  };

  const handleSetupWallet = async () => {
    // Temporarily bypass authentication for demo
    setShowSplash(false);
  };

  const handleLogout = () => {
    setShowSplash(true);
  };

  if (showSplash) {
    return (
      <SplashScreen
        onContinueWithWallet={handleContinueWithWallet}
        onSetupWallet={handleSetupWallet}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ManagerDashboard 
        onAgentActionPress={(action) => console.log('Action pressed:', action)}
        onLogout={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
