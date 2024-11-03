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
          </Stack>
        </ImagesetsProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}
