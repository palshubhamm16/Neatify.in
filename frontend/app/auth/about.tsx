import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AboutScreen() {
  const navigation = useNavigation();


    React.useLayoutEffect(() => {
      navigation.setOptions({
        title: "About Us", // This is the title of the current screen
        headerBackTitle: "Back", // Change the back button text to "Back"
      });
    }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About Neatify</Text>
      <Text style={styles.text}>
        Neatify is a community-driven cleanup platform that helps neighborhoods stay
        clean and organized. Users can report messes, view cleanup efforts, and contribute
        to a neater city.
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
    fontSize: 24,
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
