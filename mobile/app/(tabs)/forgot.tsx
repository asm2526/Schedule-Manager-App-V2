import axios from "axios";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1); // Step 1 = request code, Step 2 = confirm reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Request a reset code
  const requestCode = async () => {
    try {
      await axios.post("http:/10.36.226.109:8000/forgot-password-request-email", { email }); // 👈 replace with your Mac’s IP or backend URL
      setMessage("✅ Reset code sent to your email");
      setStep(2);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage("❌ " + (err.response?.data?.detail || err.message));
      } else {
        setMessage("❌ An unexpected error occurred");
      }
    }
  };

  // Step 2: Confirm code + reset password
  const resetPassword = async () => {
    try {
      await axios.post("http://10.36.226.109:8000/forgot-password-confirm-email", {
        email,
        code,
        new_password: newPassword,
      });
      setMessage("✅ Password reset successful! You can now log in.");
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage("❌ " + (err.response?.data?.detail || err.message));
      } else {
        setMessage("❌ An unexpected error occurred");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Request Code" onPress={requestCode} />
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter code from email"
            value={code}
            onChangeText={setCode}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button title="Reset Password" onPress={resetPassword} />
        </>
      )}

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 6 },
  message: { marginTop: 20, textAlign: "center" },
});
