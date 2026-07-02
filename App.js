import { useFonts } from "expo-font";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // npx expo install @expo/vector-icons (usually pre-installed with expo)

import AppNavigator from "./src/features/app-navigator";
import GalleryScreen from "./src/components/footer/gallery";
import PlannerScreen from "./src/components/footer/planner";

export default function App() {
  const [loaded] = useFonts({
    "Nunito-Regular": require("./src/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Medium": require("./src/assets/fonts/Nunito-Medium.ttf"),
    "Nunito-SemiBold": require("./src/assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("./src/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("./src/assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-Black": require("./src/assets/fonts/Nunito-Black.ttf"),
    "Nunito-Light": require("./src/assets/fonts/Nunito-Light.ttf"),
    "Nunito-ExtraLight": require("./src/assets/fonts/Nunito-ExtraLight.ttf"),
  });

  // which tab is active — "Memberships" is the default
  const [activeTab, setActiveTab] = useState("Memberships");

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      {/* Main content area swaps based on the active tab */}
      <View style={styles.content}>
        {activeTab === "Memberships" ? (
          <AppNavigator />
        ) : activeTab === "gallery" ? (
          <GalleryScreen />
        ) : (
          <PlannerScreen />
        )}
      </View>

      {/* Fixed footer tab bar — each button's background flips dark/light based on active tab */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === "Memberships" ? "#055075" : "#0e63a9" },
          ]}
          onPress={() => setActiveTab("Memberships")}
          activeOpacity={0.7}
        >
          <Ionicons name="card" size={26} color="#fff" />
          <Text style={styles.tabLabel}>MEMBERSHIPS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === "gallery" ? "#055075" : "#0e63a9" },
          ]}
          onPress={() => setActiveTab("gallery")}
          activeOpacity={0.7}
        >
          <Ionicons name="image" size={26} color="#fff" />
          <Text style={styles.tabLabel}>GALLERY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === "planner" ? "#055075" : "#0e63a9" },
          ]}
          onPress={() => setActiveTab("planner")}
          activeOpacity={0.7}
        >
          <Ionicons name="barbell" size={26} color="#fff" />
          <Text style={styles.tabLabel}>WORKOUT PLANNER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    // no shared background here — each tabButton sets its own equal-width segment
  },
  tabButton: {
    flex: 1, // each tab takes an equal share of the footer width
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 18, // extra padding for home-indicator area on iOS
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontFamily: "Nunito-Bold",
    color: "#fff",
    letterSpacing: 0.3,
    textAlign: "center",
  },
});