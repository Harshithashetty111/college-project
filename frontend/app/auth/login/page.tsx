"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("doctor_id", data.doctor_id);
      localStorage.setItem("doctor_name", data.name);
      localStorage.setItem("doctor_email", data.email);

      window.location.href = "/dashboard";
    } catch {
      setMessage("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block w-1/2 relative">
        <img
          src="/doctors-team.png"
          alt="Doctors"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-10 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Glaucoma XAI Doctor Portal
          </h1>
          <p className="text-sm opacity-90">
            AI-powered glaucoma detection & explainable diagnosis
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Doctor Login
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white"
            />

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white"
            />

            {message && (
              <p className="text-sm text-red-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
