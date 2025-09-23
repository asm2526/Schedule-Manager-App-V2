import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import axios from "axios";

export default function ForgotPasswordScreen() {
    const[step, setStep] = useState(1); //step 1 request code step 2 confirm reset
    const[email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
}

// Step 1; request a reset code
const requestCode = async () => {
    try {
        await axios.post("http://192.168.1.108:8000/forgot-password-request-email", { email });
        setMessage("Reset code has been sent to your email");
        setStep(2);
    } catch (err)
};