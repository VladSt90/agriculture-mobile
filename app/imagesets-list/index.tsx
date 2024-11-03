import { ImagesetsContext } from "@/contexts/ImageSets.context";
import ImageSet from "@/models/ImageSet";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ImageSetsListScreen = () => {
  const { imageSets, refreshImagesSets } = useContext(ImagesetsContext);
  const router = useRouter();
  useFocusEffect(() => {
    refreshImagesSets();
  });

  const handleItemPress = (imageSet: ImageSet) => {
    router.push({
      pathname: "/imageset-details",
      params: { imageSetJson: imageSet.toJSON() },
    });
  };

  const renderItem = ({ item }: { item: ImageSet }) => (
    <TouchableOpacity
      style={styles.imageSetItem}
      onPress={() => handleItemPress(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const handleNavigate = () => {
    router.push({
      pathname: "./new",
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imageSets}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Image Sets Found</Text>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={handleNavigate}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ImageSetsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  imageSetItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200EE",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
