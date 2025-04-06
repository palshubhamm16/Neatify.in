import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const pathName = usePathname();

  // Debugging: Log authentication status and user metadata
  useEffect(() => {
    console.log("Auth Loaded:", authLoaded);
    console.log("User Loaded:", userLoaded);
    console.log("Is Signed In:", isSignedIn);
    console.log("User Data:", user);
    console.log("User Metadata:", user?.unsafeMetadata);
  }, [isSignedIn, user]);

  // Ensure auth and user data are fully loaded before rendering
  if (!authLoaded || !userLoaded) {
    return null; // Show nothing until authentication is fully loaded
  }

  // Handle redirect logic based on authentication status and onboarding completion
  if (isSignedIn) {
    if (user?.unsafeMetadata?.onboarding_completed !== true) {
      if (pathName !== "/auth/complete-your-account") {
        return <Redirect href="/auth/complete-your-account" />;
      }
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="complete-your-account" options={{ headerShown: false }} />
    </Stack>
  );
}
