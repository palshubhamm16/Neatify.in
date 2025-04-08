import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

// Access environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const SignInScreen = () => {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkAdminStatus = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { isAdmin, type, location } = await response.json();
      console.log("✅ Admin check response:", { isAdmin, type, location });

      if (isAdmin) {
        await SecureStore.setItemAsync("admin_type", type || "");
        await SecureStore.setItemAsync("admin_location", location || "");

        const storedType = await SecureStore.getItemAsync("admin_type");
        const storedLocation = await SecureStore.getItemAsync("admin_location");
        console.log("📦 Confirmed stored admin_type:", storedType);
        console.log("📦 Confirmed stored admin_location:", storedLocation);

        return true;
      }

      return false;
    } catch (err) {
      console.error("❌ Error checking admin status:", err);
      throw err;
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      if (!signIn) throw new Error("Sign-in instance is undefined.");

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // ✅ Store email
        await SecureStore.setItemAsync("user_email", email);
        console.log("✅ Stored user_email:", email);

        // 🔍 Check admin status
        try {
          const isAdmin = await checkAdminStatus(email);
          if (isAdmin) {
            router.replace("./(admin)");
          } else {
            router.replace("./(tabs)");
          }
        } catch (adminErr) {
          setError("Admin setup incomplete. Please contact support.");
          console.error("❌ Admin setup error:", adminErr);
        }
      } else {
        console.log("Sign-in incomplete:", result);
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("❌ Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleSignIn} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./sign-up")} style={styles.signUpButton}>
        <Text style={styles.signUpText}>No account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: "red", marginBottom: 10 },
  button: { backgroundColor: "#555", padding: 12, alignItems: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  signUpButton: { marginTop: 15, alignItems: "center" },
  signUpText: { color: "blue", fontSize: 16, fontWeight: "500" },
});
