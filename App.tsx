import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";
import { AgentActionLogger } from './components/AgentActionLogger';

export default function App() {
  const treasuryConfig = {
    treasury: process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS,
  };

  return (
    <AbstraxionProvider config={treasuryConfig}>
      <View style={styles.container}>
        <AgentActionLogger />
        <StatusBar style="auto" />
      </View>
    </AbstraxionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
