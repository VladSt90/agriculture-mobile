import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible

const App = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setAccessGranted(true);
      } else {
        setAccessGranted(false);
      }
    };
    checkPermissions();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (accessGranted) {
      // Navigate to the imagesets-list screen if access is granted
      router.push('./imagesets-list');
    } else {
      // Navigate to the permissions screen if access is not granted
      router.push('./permissions');
    }
    // Hide the splash screen once the navigation is done
    await SplashScreen.hideAsync();
  }, [accessGranted]);

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.welcomeText}>Welcome to the App!</Text>
      <Text style={styles.loadingText}>Checking permissions...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for the canvas
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
});

export default App;
