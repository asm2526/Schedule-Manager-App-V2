import axios from "axios";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://192.168.1.108:8000/login", {  // replace with your Mac's IP
        username,
        password,
      });
      setMessage("✅ Logged in! Token: " + res.data.access_token.slice(0, 12) + "...");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const detail = error.response?.data?.detail;
            setMessage("❌ " + (detail || error.message || "Unknown error"));
        } else {
            setMessage("❌ An unexpected error occurred");
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 6 },
  message: { marginTop: 20, textAlign: "center" },
});
