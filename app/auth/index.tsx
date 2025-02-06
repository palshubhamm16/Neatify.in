import SocialLoginButton from "@/components/SocialLoginButton";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = () => {
  const insets = useSafeAreaInsets(); // Using SafeAreaInsets to adjust for notches or device safe areas

  useWarmUpBrowser();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.headingContainer]}>
        <Text style={styles.label}>Neatify</Text>
      </View>

      <View style={styles.flexGrowArea} />

      <View style={[styles.blackDiv, { paddingBottom: insets.bottom }]}>
        <View style={styles.socialButtonsContainer}>
          <SocialLoginButton strategy="apple" />
          <SocialLoginButton strategy="google" />
          <SocialLoginButton strategy="facebook" />
        </View>
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center", // Ensures the entire content is vertically centered
    alignItems: "center",
    padding: 0,
    gap: 20,
  },
  headingContainer: {
    width: "100%",
    gap: 5,
    alignItems: "center",
    justifyContent: "center", // Vertically centers the content inside
    flex: 1, // Takes up all available space, ensuring centering happens
  },
  label: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0000FF",
  },
  description: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  flexGrowArea: {
    flex: 1,
  },
  blackDiv: {
    backgroundColor: "black",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    width: "100%",
  },
  socialButtonsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 35,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 8,
  },
});
