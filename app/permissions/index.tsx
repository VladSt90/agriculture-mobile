// app/permissions/index.tsx
import { Camera } from 'expo-camera';
import * as IntentLauncher from 'expo-intent-launcher';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const PermissionsScreen = () => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const openExpoGoSettings = () => {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
      {
        data: 'package:host.exp.exponent',
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Permission Status</Text>
      <Text>Camera: {cameraPermission ? 'Granted' : 'Denied'}</Text>
      {!cameraPermission && (
        <Text style={styles.message}>
          Please allow access to the camera in your device settings to use this application.
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Open App Settings" onPress={openExpoGoSettings} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PermissionsScreen;
