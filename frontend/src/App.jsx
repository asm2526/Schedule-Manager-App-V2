import { useState } from "react"
import LoginPage from "./LoginPage"
import RegisterPage from "./RegisterPage"

function App() {
  const [page, setPage] = useState("register") // default: show register page

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation bar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-center gap-6">
        <button
          onClick={() => setPage("register")}
          className={`font-semibold hover:underline ${page === "register" ? "underline" : ""}`}
        >
          Register
        </button>
        <button
          onClick={() => setPage("login")}
          className={`font-semibold hover:underline ${page === "login" ? "underline" : ""}`}
        >
          Login
        </button>
      </nav>

      {/* Page content */}
      <main className="flex items-center justify-center p-6">
        {page === "register" && <RegisterPage />}
        {page === "login" && <LoginPage />}
      </main>
    </div>
  )
}

export default App
