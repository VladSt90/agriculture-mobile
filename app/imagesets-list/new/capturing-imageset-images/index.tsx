import ImageSet from "@/models/ImageSet";
import { getImageSetFolderPath, updateImageSet } from "@/utils/ImageSet.utils";
import { CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CaptureImagesScreen = () => {
  const [imageCount, setImageCount] = useState(0);
  const isCapturingRef = useRef<boolean>(false);
  const router = useRouter();
  const { imageSetJson } = useLocalSearchParams<{ imageSetJson: string }>();
  const imageSetRef = useRef<ImageSet>();
  const imageSetFolderRef = useRef<string | undefined>();
  const photoLoopIntervalRef = useRef<NodeJS.Timeout>();

  const cameraRef = useRef<CameraView>(null);

  const takePicture = useCallback(async () => {
    console.log("takePicture called");
    if (cameraRef.current && isCapturingRef.current) {
      try {
        console.log("Attempting to capture photo...");
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          const fileName = `${
            imageSetFolderRef.current
          }/photo_${Date.now()}.jpg`;
          console.log("Photo captured, saving to:", fileName);
          await FileSystem.moveAsync({
            from: photo.uri,
            to: fileName,
          });
          console.log("Saved photo to:", fileName);
          setImageCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    } else {
      console.log("Camera is not ready or capturing has stopped.");
    }
  }, []);

  const onCameraReady = () => {
    console.log("Camera is ready.");
    const imageSet = ImageSet.fromJSON(imageSetJson);
    console.log("ImageSet loaded from JSON:", imageSet);
    imageSetRef.current = imageSet;
    imageSetFolderRef.current = getImageSetFolderPath(imageSet);
    console.log("ImageSet folder path set to:", imageSetFolderRef.current);

    isCapturingRef.current = true;
    console.log("Starting image capture loop...");
    photoLoopIntervalRef.current = setInterval(takePicture, 1000);

    return () => {
      console.log("Cleaning up interval and stopping capture.");
      isCapturingRef.current = false;
      clearInterval(photoLoopIntervalRef.current);
    };
  };

  const handleStopCapture = () => {
    console.log("Stop capture button pressed.");
    if (imageSetRef.current) {
      imageSetRef.current.endTime = new Date();
      console.log("Set ImageSet end time to:", imageSetRef.current.endTime);
      updateImageSet(imageSetRef.current);
      clearInterval(photoLoopIntervalRef.current);
    }

    isCapturingRef.current = false;
    console.log("Navigating back to image sets list and details.");
    router.dismissAll();
    router.push("/imagesets-list");
    router.push({ pathname: "/imageset-details", params: { imageSetJson } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterLabel}>Images Captured</Text>
        <Text style={styles.counter}>{imageCount}</Text>
      </View>

      <CameraView
        style={styles.camera}
        ref={cameraRef}
        onCameraReady={onCameraReady}
        onMountError={(event) => {
          console.error("Camera mount error:", event.message);
        }}
      />

      <TouchableOpacity style={styles.stopButton} onPress={handleStopCapture}>
        <Text style={styles.stopButtonText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CaptureImagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 16,
  },
  counterContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 14,
    color: "#fff",
    textTransform: "uppercase",
  },
  counter: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  camera: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 16,
  },
  stopButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
