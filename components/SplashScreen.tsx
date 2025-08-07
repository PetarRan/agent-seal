import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SplashScreenProps {
  onContinueWithWallet: () => void;
  onSetupWallet: () => void;
}

// SVG Logo Component - Using your actual logo
const AgentSealLogo: React.FC = () => (
  <Svg width="50" height="52" viewBox="0 0 50 52" fill="none">
    <Path d="M29.1551 0.866725C29.0812 0.922134 29.0258 1.27306 29.0258 1.60552C29.0258 3.61874 27.8253 7.18343 26.4585 9.27053C24.2052 12.7244 21.0468 15.0885 17.2051 16.2521L16.0045 16.6031L25.6089 16.5661C34.8992 16.5107 35.2502 16.4923 36.5061 16.1044C40.6618 14.8115 44.3004 11.9302 46.092 8.49479C47.2925 6.20452 48.4377 1.79022 48.0129 1.03295C47.8651 0.774375 46.8862 0.737435 38.5563 0.737435C33.4586 0.737435 29.2105 0.792845 29.1551 0.866725Z" fill="white"/>
    <Path d="M41.2899 17.3049C40.9205 17.9883 39.646 20.2047 38.5009 22.2179C32.8491 31.9885 32.2027 33.4476 32.0365 36.9754C31.7963 41.8145 33.2555 45.6008 36.6909 49.0362C38.6117 50.9571 39.5906 51.5851 39.997 51.1603C40.588 50.5323 49.158 35.701 49.158 35.2946C49.158 35.1284 48.567 34.5374 47.8282 33.9833C45.1131 31.9146 43.026 28.8856 42.0287 25.5795C41.5854 24.1388 41.53 23.5847 41.5115 21.3314C41.493 19.3551 41.5854 18.4501 41.844 17.4896C42.0287 16.7878 42.1395 16.1783 42.0841 16.1413C42.0287 16.0859 41.6777 16.6031 41.2899 17.3049Z" fill="white"/>
    <Path d="M6.10473 16.991C3.81447 17.268 0.748466 18.2839 0.194369 18.9488C0.0466096 19.1335 0.674586 20.3525 2.81709 24.0465C4.36856 26.7246 5.93851 29.4027 6.3079 30.0122C6.6773 30.6217 7.50845 32.0993 8.15489 33.2814C8.80134 34.482 9.42932 35.4609 9.54013 35.4609C9.66942 35.4609 10.2974 35.2207 10.9438 34.9068C12.994 33.9648 14.8041 33.5769 17.3898 33.54C21.7487 33.503 25.3873 34.9252 28.638 37.9543C29.3029 38.5638 29.7831 38.9332 29.7277 38.767C29.5984 38.4345 24.2606 29.1996 22.3398 26.0043C20.4743 22.8644 18.8859 21.0359 16.7803 19.5952C13.9914 17.6928 9.46626 16.5846 6.10473 16.991Z" fill="white"/>
  </Svg>
);

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onContinueWithWallet,
  onSetupWallet,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation for background
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Black Background */}
      <View style={styles.blackBackground} />
      
      {/* Animated Background Image */}
      <Animated.Image
        source={require('../assets/bg.png')}
        style={[
          styles.backgroundImage,
          {
            opacity: fadeAnim,
          }
        ]}
        resizeMode="cover"
      />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Top Section - Logo and Title */}
        <View style={styles.topSection}>
          <View style={styles.brandingContainer}>
            <AgentSealLogo />
            <Text style={styles.appName}>AgentSeal</Text>
          </View>
        </View>

        {/* Bottom Section - Action Buttons */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onContinueWithWallet}>
              <Text style={styles.primaryButtonText}>Continue with wallet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={onSetupWallet}>
              <Text style={styles.secondaryButtonText}>Set up a wallet with XION</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    width: '100%',
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Hauora',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 34, // Safe area for home indicator
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Hauora',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Hauora',
  },
});
