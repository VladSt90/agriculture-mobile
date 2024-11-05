import ErrorBoundary from "@/components/ErrorBoundary";
import { ImagesetsProvider } from "@/contexts/ImageSets.context";
import { Stack } from "expo-router";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <PaperProvider>
        <ImagesetsProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="imagesets-list/index"
              options={{
                headerTitle: "Image Sets",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="imagesets-list/new/index"
              options={{
                headerTitle: "Create Image Set",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="imagesets-list/new/capturing-imageset-images/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="imageset-details/index"
              options={{
                headerTitle: "Image Set Details",
                headerTitleAlign: "center",
              }}
            />
          </Stack>
        </ImagesetsProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}
