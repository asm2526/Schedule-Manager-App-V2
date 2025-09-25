import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../../constants/api"; // Import central API URL

export default function RegisterScreen() {
  const [username, setUsername] = useState("");   // Track username input
  const [email, setEmail] = useState("");         // Track email input
  const [phone, setPhone] = useState("");         // Track phone number input
  const [password, setPassword] = useState("");   // Track password input
  const [message, setMessage] = useState("");     // Feedback message

  // Handles register button press
  const handleRegister = async () => {
    try {
      // Send registration request to FastAPI backend
      const res = await axios.post(`${API_URL}/register`, {
        username,
        email,
        phone,
        password,
      });

      // Show confirmation message with registered username
      setMessage(`Registered successfully as: ${res.data.username}`);

      // Immediately log the user in after registration
      const loginRes = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const token = loginRes.data.access_token;

      // Save token to AsyncStorage so user is logged in
      await AsyncStorage.setItem("authToken", token);

      // Update message to indicate success
      setMessage("Registered and logged in. Token saved.");

      // Clear input fields
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        setMessage(detail || error.message || "Error registering");
      } else {
        setMessage("Unexpected error registering");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} />

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

// Styling for the register screen
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 6 },
  message: { marginTop: 20, textAlign: "center" },
});
