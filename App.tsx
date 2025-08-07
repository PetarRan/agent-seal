import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";
import { MainApp } from './src/components/ui/MainApp';

// Global error handler for Abstraxion SDK issues
const handleGlobalError = (error: Error, isFatal?: boolean) => {
  console.error('Global error caught:', error);
  
  // Check if it's an Abstraxion SDK error
  const errorMessage = error.message || error.toString();
  if (errorMessage.includes('salt length') || 
      errorMessage.includes('keypair') || 
      errorMessage.includes('libsodium') ||
      errorMessage.includes('unknown module') ||
      errorMessage.includes('granter')) {
    
    Alert.alert(
      'SDK Issue Detected',
      'The Abstraxion SDK is having issues. The app will continue in demo mode.',
      [{ text: 'OK' }]
    );
  }
};

export default function App() {
  const treasuryConfig = {
    treasury: process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS || '',
    rpcUrl: process.env.EXPO_PUBLIC_RPC_ENDPOINT || 'https://xion-testnet-rpc.burnt.com',
    restUrl: process.env.EXPO_PUBLIC_REST_ENDPOINT || 'https://xion-testnet-api.burnt.com',
  };

  return (
    <AbstraxionProvider config={treasuryConfig}>
      <View style={styles.container}>
        <MainApp />
        <StatusBar style="light" />
      </View>
    </AbstraxionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
