import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/clerk-expo";

import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/utils/cache";

// Prevent splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            {/* Layout groups */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            {/* Auth pages */}
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>

          <AuthHandler />

          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AuthHandler() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/auth/check-admin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
        });

        const { isAdmin } = await response.json();

        if (isAdmin) {
          router.replace("/(admin)");
        } else {
          router.replace("/(tabs)");
        }
      } catch (err) {
        console.error("Error checking admin:", err);
        router.replace("/(tabs)"); // Fallback to user dashboard
      }
    };

    if (isSignedIn !== undefined && !hasNavigated) {
      setHasNavigated(true);

      if (isSignedIn) {
        checkAdmin();
      } else {
        router.replace("/auth");
      }
    }
  }, [isSignedIn]);

  return null;
}
