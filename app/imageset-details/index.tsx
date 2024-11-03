import ImageSet from "@/models/ImageSet";
import { getImageSetFolderPath } from "@/utils/ImageSet.utils";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const ImageSetDetailsScreen = () => {
  const { imageSetJson } = useLocalSearchParams<{ imageSetJson: string }>();
  const [imageSet] = useState<ImageSet>(() => ImageSet.fromJSON(imageSetJson));
  const [imageUris, setImageUris] = useState<string[]>([]);

  useEffect(() => {
    const folderPath = getImageSetFolderPath(imageSet);

    const fetchImageSetDetails = async () => {
      const images = await FileSystem.readDirectoryAsync(folderPath);
      const imagePaths = images
        .filter((file) => file.endsWith(".jpg") || file.endsWith(".png"))
        .map((file) => `${folderPath}/${file}`);
      setImageUris(imagePaths);
    };
    fetchImageSetDetails();
  }, []);

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  if (!imageSet) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ImageSet not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{imageSet.title}</Text>
      <Text style={styles.description}>{imageSet.description}</Text>
      <Text style={styles.time}>
        Start Time: {imageSet.startTime.toLocaleString()}
      </Text>
      {imageSet.endTime && (
        <Text style={styles.time}>
          End Time: {imageSet.endTime.toLocaleString()}
        </Text>
      )}
      <FlatList
        data={imageUris}
        renderItem={renderImage}
        keyExtractor={(item) => item}
        numColumns={3}
        contentContainerStyle={styles.gallery}
      />
    </View>
  );
};

export default ImageSetDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  gallery: {
    marginTop: 16,
  },
  image: {
    width: "30%",
    aspectRatio: 1,
    margin: "1.5%",
    borderRadius: 8,
  },
});
