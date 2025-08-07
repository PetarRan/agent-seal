import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion-react-native';
import { ManagerDashboard } from '../features/ManagerDashboard';
import { SplashScreen } from './SplashScreen';

export const MainApp: React.FC = () => {
  const { data: account, isConnected, login } = useAbstraxionAccount();
  const { client: signingClient } = useAbstraxionSigningClient();
  const [showSplash, setShowSplash] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'abstraxion' | 'demo' | 'none'>('none');

  // Check authentication status
  useEffect(() => {
    if (hasAuthenticated && (isConnected || account || authMode === 'demo')) {
      console.log('User authenticated and connected:', {
        isConnected,
        hasAccount: !!account,
        hasSigningClient: !!signingClient,
        authMode
      });
      setShowSplash(false);
    } else {
      console.log('Showing splash screen - user not authenticated');
      setShowSplash(true);
    }
  }, [hasAuthenticated, isConnected, account, signingClient, authMode]);

  const enableDemoMode = () => {
    console.log('Enabling demo mode');
    setAuthMode('demo');
    setHasAuthenticated(true);
    setShowSplash(false);
    Alert.alert(
      'Demo Mode Active',
      'You are now in demo mode. You can test the zkTLS features with simulated blockchain data.',
      [{ text: 'OK' }]
    );
  };

  const handleContinueWithWallet = async () => {
    try {
      setIsConnecting(true);
      console.log('Attempting to connect wallet with Abstraxion...');
      
      // Try to login with Abstraxion
      await login();
      
      // Wait for connection to establish
      setTimeout(() => {
        setIsConnecting(false);
        if (isConnected || account) {
          console.log('Successfully connected to wallet via Abstraxion');
          setAuthMode('abstraxion');
          setHasAuthenticated(true);
          setShowSplash(false);
        } else {
          console.log('Abstraxion connection failed, offering demo mode');
          Alert.alert(
            'Connection Issue',
            'Unable to connect to Xion blockchain. Would you like to try demo mode instead?',
            [
              { text: 'Try Demo Mode', onPress: () => enableDemoMode() },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      }, 3000);
      
    } catch (error) {
      setIsConnecting(false);
      console.error('Failed to connect wallet:', error);
      
      // More comprehensive error detection
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Error message:', errorMessage);
      
      // Check for various Abstraxion SDK errors
      if (errorMessage.includes('salt length') || 
          errorMessage.includes('keypair') || 
          errorMessage.includes('libsodium') ||
          errorMessage.includes('unknown module') ||
          errorMessage.includes('granter')) {
        Alert.alert(
          'SDK Issue Detected',
          'The Abstraxion SDK is having issues. Would you like to try demo mode instead?',
          [
            { text: 'Try Demo Mode', onPress: () => enableDemoMode() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert(
          'Connection Error',
          'Failed to connect to wallet. Would you like to try demo mode instead?',
          [
            { text: 'Try Demo Mode', onPress: () => enableDemoMode() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    }
  };

  const handleSetupWallet = async () => {
    try {
      setIsConnecting(true);
      console.log('Setting up new wallet with Abstraxion...');
      
      // Try to login
      await login();
      
      // Wait for connection to establish
      setTimeout(() => {
        setIsConnecting(false);
        if (isConnected || account) {
          console.log('Successfully set up wallet via Abstraxion');
          setAuthMode('abstraxion');
          setHasAuthenticated(true);
          setShowSplash(false);
        } else {
          console.log('Setup failed, offering demo mode');
          Alert.alert(
            'Setup Failed',
            'Unable to set up wallet. Would you like to try demo mode instead?',
            [
              { text: 'Try Demo Mode', onPress: () => enableDemoMode() },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      }, 3000);
      
    } catch (error) {
      setIsConnecting(false);
      console.error('Failed to set up wallet:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Setup error message:', errorMessage);
      
      // More comprehensive error detection
      if (errorMessage.includes('salt length') || 
          errorMessage.includes('keypair') || 
          errorMessage.includes('libsodium') ||
          errorMessage.includes('unknown module') ||
          errorMessage.includes('granter')) {
        Alert.alert(
          'SDK Issue Detected',
          'The Abstraxion SDK is having issues. Would you like to try demo mode instead?',
          [
            { text: 'Try Demo Mode', onPress: () => enableDemoMode() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert(
          'Setup Error',
          'Failed to set up wallet. Would you like to try demo mode instead?',
          [
            { text: 'Try Demo Mode', onPress: () => enableDemoMode() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setHasAuthenticated(false);
    setAuthMode('none');
    setShowSplash(true);
  };

  if (showSplash) {
    return (
      <SplashScreen
        onContinueWithWallet={handleContinueWithWallet}
        onSetupWallet={handleSetupWallet}
        onDemoMode={enableDemoMode}
        isConnecting={isConnecting}
      />
    );
  }

  return (
    <ManagerDashboard
      onAgentActionPress={(action) => {
        console.log('Agent action pressed:', action);
      }}
      onLogout={handleLogout}
      authMode={authMode}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
