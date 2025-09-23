import axios from "axios"
import { useState } from "react"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://127.0.0.1:8000/login", {
                username,
                password,
            })
            setMessage(`✅ Logged in! Token: ${res.data.access_token.slice(0, 15)}...`)
            setUsername("")
            setPassword("")
        } catch (err) {
            setMessage("Login failed: " + (err.response?.data?.detail || err.message))
        }
    }
    
    return (
        <form
            onSubmit={handleLogin}
            className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
        >
            <h2 className="text-2xl font-bold text-center">Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded p-2"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded p-2"
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                Login
            </button>

            {message && <p className="text-center mt-2">{message}</p>}
        </form>
    )
}