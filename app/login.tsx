import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Pressable,
  TextInput,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    console.log("Login attempt with email:", email);

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      console.log("Calling login function...");
      await login(email, password);
      console.log("Login successful!");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", `Invalid email or password: ${error}`);
    }
  };

  const isDark = colorScheme === "dark";
  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jewellery Booking</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          style={[styles.button, isLoading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.demoCard}>
        <Text style={styles.demoText}>Demo Credentials:</Text>
        <Text style={styles.demoText}>Email: admin@jeweller.com</Text>
        <Text style={styles.demoText}>Password: any</Text>
      </View>
    </View>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 70,
      paddingVertical: 20,
      backgroundColor: isDark ? "#111827" : "#ffffff",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
      color: isDark ? "#ffffff" : "#1f2937",
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 40,
      color: isDark ? "#9ca3af" : "#6b7280",
    },
    card: {
      marginBottom: 32,
      padding: 24,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
      color: isDark ? "#ffffff" : "#374151",
    },
    input: {
      width: "100%",
      padding: 12,
      borderWidth: 1,
      borderRadius: 6,
      backgroundColor: isDark ? "#374151" : "#ffffff",
      borderColor: isDark ? "#4b5563" : "#d1d5db",
      color: isDark ? "#ffffff" : "#111827",
      fontSize: 16,
    },
    button: {
      backgroundColor: "#3b82f6",
      padding: 16,
      borderRadius: 6,
      alignItems: "center",
    },
    buttonDisabled: {
      backgroundColor: "#9ca3af",
    },
    buttonText: {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: 16,
    },
    demoCard: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      borderColor: isDark ? "#374151" : "#e5e7eb",
    },
    demoText: {
      fontSize: 14,
      color: isDark ? "#9ca3af" : "#6b7280",
      marginBottom: 4,
    },
  });
}
