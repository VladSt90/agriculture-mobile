import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible

const App = () => {
  const router = useRouter();

  useEffect(() => {
    const checkPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      await SplashScreen.hideAsync();
      if (status === "granted") {
        router.replace("./imagesets-list");
      } else {
        router.replace("./permissions");
      }
    };
    checkPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the App!</Text>
      <Text style={styles.loadingText}>Checking permissions...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Background color for the canvas
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
});

export default App;
