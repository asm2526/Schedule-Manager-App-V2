import axios from "axios";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../../constants/api"; // central place for your backend URL

export default function ForgotPasswordScreen() {
  // Track the current step in the flow (1 = request code, 2 = enter code + new password)
  const [step, setStep] = useState(1);

  // Form fields
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Feedback message shown to user
  const [message, setMessage] = useState("");

  // Step 1: Request a reset code to be sent to email
  const requestCode = async () => {
    try {
      await axios.post(`${API_URL}/forgot-password-request-email`, { email });
      setMessage("A reset code has been sent to your email.");
      setStep(2); // move to the next step
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Show error from backend if available, otherwise generic error
        setMessage(err.response?.data?.detail || err.message || "Error requesting code");
      } else {
        setMessage("Unexpected error requesting reset code");
      }
    }
  };

  // Step 2: Submit the code and new password
  const resetPassword = async () => {
    try {
      await axios.post(`${API_URL}/forgot-password-confirm-email`, {
        email,
        code,
        new_password: newPassword,
      });
      setMessage("Password reset successful. You can now log in with your new password.");
      // Reset form and return to first step
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.detail || err.message || "Error resetting password");
      } else {
        setMessage("Unexpected error resetting password");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {/* Step 1: Ask for email */}
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title="Request Reset Code" onPress={requestCode} />
        </>
      )}

      {/* Step 2: Ask for reset code and new password */}
      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter reset code"
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button title="Reset Password" onPress={resetPassword} />
        </>
      )}

      {/* Feedback message */}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
  },
});
