import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Activity, Lock, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, register, authError } = useAuth();
  const navigate = useNavigate();

  const pageTitle = useMemo(
    () => (mode === "login" ? "Sign in to your account" : "Create clinician account"),
    [mode]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "register" && name.trim().length < 2) {
      setLocalError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    setLocalError("");

    const result =
      mode === "login"
        ? await login({ email, password })
        : await register({ name, email, password, role });

    setSubmitting(false);

    if (result?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Activity className="text-blue-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{pageTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">Access is limited to doctors and clinical researchers</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              mode === "register" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Register
          </button>
        </div>

        {(localError || authError) && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Dr. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                required={mode === "register"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="doctor@clinic.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="role">
                User Type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
              >
                <option value="doctor">Doctor</option>
                <option value="clinical_researcher">Clinical Researcher</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-slate-600">
              <input type="checkbox" className="mr-2 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg flex justify-center items-center shadow-md shadow-blue-500/30 transition-transform active:scale-95 gap-2 mt-4"
          >
            {mode === "login" ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Use your verified institution email to keep patient workflows secure.
        </p>
      </div>
    </div>
  );
}
