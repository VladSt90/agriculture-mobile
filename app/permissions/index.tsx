// app/permissions/index.tsx
import { Camera, PermissionStatus } from "expo-camera";
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const PermissionsScreen = () => {
  const router = useRouter();

  // useEffect(() => {
  //   requestCameraPermissions();
  // }, []);

  // useFocusEffect(() => {
  //   requestCameraPermissions();
  // });

  const navigateFurther = () => router.replace("/imagesets-list");

  // const openExpoGoSettings = () => {
  //   IntentLauncher.startActivityAsync(
  //     IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
  //     {
  //       data: "package:host.exp.exponent",
  //     }
  //   );
  // };

  const requestCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === PermissionStatus.GRANTED) {
      navigateFurther();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Please allow access to the camera to use this application.
      </Text>
      {/* <View style={styles.buttonContainer}>
        <Button title="Open App Settings" onPress={openExpoGoSettings} />
      </View> */}
      <View style={styles.buttonContainer}>
        <Button
          title="Request permission again"
          onPress={requestCameraPermissions}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PermissionsScreen;
