import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import TextInput from "@/components/Forms/TextInput";

const CompleteYourAccountScreen = () => {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, setError, setValue } = useForm({
    defaultValues: {
      full_name: "",
      username: "",
    },
  });

  const onSubmit = async (data: any) => {
    const { full_name, username } = data;

    try {
      setIsLoading(true);
      await user?.update({
        username: username,
        firstName: full_name.split(" ")[0],
        lastName: full_name.split(" ")[1],
        unsafeMetadata: {
          onboarding_completed: true,
        },
      });

      await user?.reload();

      return router.push("/(tabs)");
    } catch (error: any) {
      if (error.message === "That username is taken. Please try another.") {
        return setError("username", { message: "Username is already taken" });
      }

      return setError("full_name", { message: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      return;
    }

    setValue("full_name", user?.fullName || "");
    setValue("username", user?.username || "");
  }, [isLoaded, user]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 40, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.headingContainer}>
        <Text style={styles.label}>Complete your account</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          control={control}
          placeholder="Enter your full name"
          label="Full Name"
          required
          name="full_name"
        />

        <TextInput
          control={control}
          placeholder="Enter your username"
          label="Username"
          required
          name="username"
        />

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : null}
            <Text style={styles.buttonText}>
              {isLoading ? "Loading..." : "Complete Account"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CompleteYourAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Corrected the typo "balck" to "black"
    padding: 20,
    gap: 20,
  },
  headingContainer: {
    width: "100%",
    gap: 5,
  },
  label: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginTop: 40,
    gap: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "black",
    fontWeight: "600", // Semi-bold font weight
    fontFamily: Platform.OS === "ios" ? "SanFrancisco" : "Roboto",
  },
});
