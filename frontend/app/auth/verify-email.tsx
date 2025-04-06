import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useSignUp, useSession } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signUp, setActive } = useSignUp();
  const { isLoaded } = useSession();
  const router = useRouter();

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      if (!signUp) throw new Error("Sign-up instance is undefined.");

      // Verify the OTP code entered by the user
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        const sessionId = result.createdSessionId;

        if (sessionId) {
          // ✅ Set the active session
          await setActive!({ session: sessionId });

          router.replace("./../(tabs)"); // Redirect to dashboard
        } else {
          throw new Error("No session created after verification.");
        }
      } else {
        throw new Error("Email verification failed. Please check the code.");
      }
    } catch (err) {
      console.error("Email Verification Error:", err);
      alert("Verification Failed: " + (err instanceof Error ? err.message : "An error occurred."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

      <TextInput
        placeholder="Enter OTP"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={handleVerifyEmail} style={styles.button} disabled={isLoading || !isLoaded}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#555", padding: 12, alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default VerifyEmail;
