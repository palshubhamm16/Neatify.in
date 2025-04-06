import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const EmailSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useSignUp();
  const router = useRouter();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      if (!signUp) throw new Error("Sign-up instance is undefined.");

      // Step 1: Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // Step 2: Create a new user
      await signUp.create({ emailAddress: email, password });

      // Step 3: Prepare for email address verification
      await signUp.prepareEmailAddressVerification();

      // Step 4: Redirect to email verification page
      router.push("/auth/verify-email");
    } catch (err) {
      console.error("Sign-up Error:", err);
      alert("Sign-up Failed: " + (err instanceof Error ? err.message : "An error occurred."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up with Email</Text>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
        secureTextEntry
      />
      <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#555", padding: 12, alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default EmailSignUp;