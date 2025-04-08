import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import googleLogo from "../assets/images/google.png";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface SocialLoginButtonProps {
  strategy: "oauth_google" | "oauth_facebook" | "oauth_apple";
  label: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ strategy, label }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy });
  const { getToken } = useAuth();
  const router = useRouter();

  const buttonIcon = () => {
    if (strategy === "oauth_facebook") {
      return <Ionicons name="logo-facebook" size={24} color="white" />;
    } else if (strategy === "oauth_google") {
      return <Image source={googleLogo} style={styles.socialIcon} resizeMode="contain" />;
    } else if (strategy === "oauth_apple") {
      return <Ionicons name="logo-apple" size={24} color="white" />;
    }
    return null;
  };

  const getVectorIcon = () => {
    switch (strategy) {
      case "oauth_google":
        return "google";
      case "oauth_facebook":
        return "facebook";
      case "oauth_apple":
        return "apple";
      default:
        return "envelope";
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/dashboard"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });

        // Wait for the JWT token and capture it
        const token = await getToken();
        if (!token) throw new Error("Could not fetch token after login");

        // Log the token to the console for use in debugging or future needs
        console.log("Captured Clerk JWT Token:", token);

        // Proceed to router logic based on user type
        router.replace("./(tabs)");  // You can modify this if needed (e.g., based on admin status)
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      alert("Login Failed: " + (err instanceof Error ? err.message : "An error occurred."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogin}
      disabled={isLoading}
      style={[styles.button, { backgroundColor: getButtonColor(strategy) }]}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {buttonIcon() ?? (
            <Icon name={getVectorIcon()} size={24} color="white" style={styles.icon} />
          )}
          <Text style={styles.buttonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const getButtonColor = (strategy: string) => {
  switch (strategy) {
    case "oauth_google":
      return "#4285F4";
    case "oauth_facebook":
      return "#3b5998";
    case "oauth_apple":
      return "#000";
    default:
      return "#555";
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    marginVertical: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});

export default SocialLoginButton;
