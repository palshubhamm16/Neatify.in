import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  // Update the header title and back button title here using navigation.setOptions
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "ToS", // This is the title of the current screen
      headerBackTitle: "Back", // Change the back button text to "Back"
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Terms of Service</Text>
      <Text style={styles.text}>
        By using Neatify, you agree to our terms. This includes respecting community
        guidelines, not misusing features, and accepting our data policies. Please
        read everything carefully before continuing to use the app.
      </Text>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
