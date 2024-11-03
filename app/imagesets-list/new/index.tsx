import { ImagesetsContext } from "@/contexts/ImageSets.context";
import ImageSet from "@/models/ImageSet";
import { saveImageSet } from "@/utils/ImageSet.utils";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NewImageSetScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { imageSets } = useContext(ImagesetsContext);

  const handleStartCapture = async () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      // Check for duplicate title
      if (imageSets.map((imageSet) => imageSet.title).includes(trimmedTitle)) {
        Alert.alert(
          "Duplicate Title",
          "An image set with this title already exists. Please choose a different title."
        );
        return;
      }

      try {
        // Create a new ImageSet instance
        const newImageSet = new ImageSet({
          title: trimmedTitle,
          description: description.trim(),
          startTime: new Date(),
        });

        // Save the ImageSet to the filesystem
        await saveImageSet(newImageSet);

        // Navigate to capturing screen, passing the title instead of folderPath
        router.push({
          pathname: "/imagesets-list/new/capturing-imageset-images",
          params: { imageSetJson: newImageSet.toJSON() },
        });
      } catch (error) {
        console.error("Error creating image set:", error);
        Alert.alert(
          "Error",
          "An error occurred while creating the image set. Please try again."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[
          styles.captureButton,
          title.trim() ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        onPress={handleStartCapture}
        disabled={!title.trim()}
      >
        <Text style={styles.buttonText}>Start Capture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewImageSetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
  },
  captureButton: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#6200EE",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
