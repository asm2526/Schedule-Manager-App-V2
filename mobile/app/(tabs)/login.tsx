import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../../constants/api"; // Your backend base URL

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handles login button press
  const handleLogin = async () => {
    try {
      // Log the request details (for debugging in Metro console)
      console.log("Sending login request to:", `${API_URL}/login`);
      console.log("Payload:", { username, password });

      // Call the backend /login endpoint
      const res = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      console.log("Login response:", res.data);

      // Extract token from response
      const token = res.data.access_token;

      // Save token in AsyncStorage so the user stays logged in
      await AsyncStorage.setItem("authToken", token);

      // Clear inputs
      setUsername("");
      setPassword("");

      // Show success message
      setMessage("Login successful. Token saved.");
    } catch (error: unknown) {
      console.log("Login error:", error); // Always log to see full error details

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setMessage("Error: " + (detail || error.message || "Unknown error"));
      } else {
        setMessage("Unexpected error logging in");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

// Styles for the login screen
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 6 },
  message: { marginTop: 20, textAlign: "center" },
});
