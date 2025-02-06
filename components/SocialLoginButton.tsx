import { useOAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import React, { useState } from "react";

const SocialLoginButton = ({
  strategy,
}: {
  strategy: "facebook" | "google" | "apple";
}) => {
  const getStrategy = () => {
    if (strategy === "facebook") {
      return "oauth_facebook";
    } else if (strategy === "google") {
      return "oauth_google";
    } else if (strategy === "apple") {
      return "oauth_apple";
    }
    return "oauth_facebook";
  };

  const { startOAuthFlow } = useOAuth({ strategy: getStrategy() });
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const buttonText = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (strategy === "facebook") {
      return "Continue with Facebook";
    } else if (strategy === "google") {
      return "Continue with Google";
    } else if (strategy === "apple") {
      return "Continue with Apple";
    }
  };

  const buttonIcon = () => {
    if (strategy === "facebook") {
      return <Ionicons name="logo-facebook" size={24} color="#1877F2" />;
    } else if (strategy === "google") {
      return (
        <Image
          source={require("../assets/images/google.png")}
          style={[styles.socialIcon, { resizeMode: "contain" }]} // Ensures the logo fits properly
        />
      );
    } else if (strategy === "apple") {
      return <Ionicons name="logo-apple" size={24} color="black" />;
    }
  };

  const onSocialLoginPress = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        await user?.reload();
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply custom styles based on the strategy (color changes)
  const containerStyle = [
    styles.container,
    (strategy === "facebook" || strategy === "google") && {
      backgroundColor: "#2B2b2e", // Apply #2B2b2e color for Facebook and Google buttons
    },
    strategy === "apple" && {
      backgroundColor: "white", // Set Apple button background to white
     
    },
  ];

  const buttonTextStyle = [
    styles.buttonText,
    (strategy === "facebook" || strategy === "google") && {
      color: "white", // Set text color to white for Facebook and Google buttons
    },
    strategy === "apple" && {
      color: "#black", // Set text color for Apple button to #2B2b2e
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onSocialLoginPress}
      disabled={isLoading}
    >
      <View style={styles.iconContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="black" style={styles.loader} />
        ) : (
          buttonIcon()
        )}
      </View>
      <Text style={buttonTextStyle}>{buttonText()}</Text>
    </TouchableOpacity>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 11,
    borderRadius: 16,
    flexDirection: "row", // Row direction
    alignItems: "center",
    marginBottom: 1,
    height: 50, // Set a fixed height for the button
  },
  buttonText: {
    marginLeft: -15, // Add left margin
    fontSize: 18,
    fontWeight: "500", // Semi-bold font weight
    fontFamily: Platform.OS === "ios" ? "SanFrancisco" : "Roboto", // Apply font family based on platform
    flex: 1, // This will take remaining space and center the text
    textAlign: "center", // Centers the text
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30, // Fixed width to maintain consistency
    height: 25, // Fixed height to maintain consistency
    marginLeft: 10,
    position: "relative", // Ensure ActivityIndicator does not disrupt layout
  },
  loader: {
    position: "absolute", // Keep loader centered in the icon container
  },
});
