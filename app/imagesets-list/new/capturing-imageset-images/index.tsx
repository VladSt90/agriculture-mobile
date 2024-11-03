import ImageSet from "@/models/ImageSet";
import { getImageSetFolderPath, updateImageSet } from "@/utils/ImageSet.utils";
import { CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CaptureImagesScreen = () => {
  const [imageCount, setImageCount] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const isCapturingRef = useRef<Boolean>(false);
  const router = useRouter();
  const { imageSetJson } = useLocalSearchParams<{ imageSetJson: string }>();
  const imageSetRef = useRef<ImageSet>();
  const imageSetFolderRef = useRef<string | undefined>();

  const takePicturesLoop = async () => {
    console.log("takePicturesLoop start");
    if (cameraRef.current && isCapturingRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          const fileName = `${
            imageSetFolderRef.current
          }photo_${Date.now()}.jpg`;
          await FileSystem.moveAsync({
            from: photo.uri,
            to: fileName,
          });
          console.log("Saved photo to:", fileName);
          setImageCount((prevCount) => prevCount + 1); // Increment image count
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
    setTimeout(takePicturesLoop, 1000);
  };

  useEffect(() => {
    const imageSet = ImageSet.fromJSON(imageSetJson);
    console.log(imageSet);
    imageSetRef.current = imageSet;
    imageSetFolderRef.current = getImageSetFolderPath(imageSet);

    isCapturingRef.current = true;
    takePicturesLoop();

    return () => {
      isCapturingRef.current = false;
    };
  }, []);

  const handleStopCapture = () => {
    console.log("Stop button pressed. Navigating to save screen.");
    imageSetRef.current!.endTime = new Date();
    updateImageSet(imageSetRef.current!);

    isCapturingRef.current = false;
    router.dismissAll();
    router.push("/imagesets-list");
    router.push({ pathname: "/imageset-details", params: { imageSetJson } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterLabel}>images captured</Text>
        <Text style={styles.counter}>{imageCount}</Text>
      </View>

      <CameraView style={styles.camera} ref={cameraRef} />

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
    width: 200, // Set the width of CameraView to make it smaller
    height: 200, // Set the height of CameraView to make it smaller
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
