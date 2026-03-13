import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Activity, Lock, UserPlus, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

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
    () => (mode === "login" ? "Welcome back" : "Create your account"),
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
    if (result?.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex font-sans relative overflow-hidden">
      {/* ═══ Left decorative panel ═══ */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 bg-grid">
        {/* Ambient orbs */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-teal/[0.04] blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-0 h-[300px] w-[300px] rounded-full bg-accent-indigo/[0.04] blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <img src="/logo.png" alt="Clinical Trial Matcher" className="w-11 h-11 object-contain" />
            <span className="text-lg font-bold text-gradient">Clinical Trial Matcher</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white/90 leading-tight mb-6">
            AI-Powered{' '}
            <span className="text-gradient-hero">Clinical Trial</span>{' '}
            Intelligence
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            Matching patients to lifesaving trials with deep semantic analysis and explainable AI reasoning.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: ShieldCheck, text: "HIPAA Compliant & Zero PII Exposure" },
            { icon: Lock, text: "End-to-end encrypted patient data" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-sm text-slate-500">
              <item.icon className="w-4 h-4 text-accent-teal/60 flex-shrink-0" />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Right login form ═══ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-16 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-accent-teal/[0.03] blur-3xl" />
        </div>

        {/* Back to home */}
        <div className="w-full max-w-sm mb-8 relative z-10">
          <button onClick={() => navigate('/')} className="btn-ghost text-xs flex items-center gap-1.5 text-slate-500 hover:text-slate-300">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </button>
        </div>

        <div className="w-full max-w-sm relative z-10 animate-fadeInUp">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100">{pageTitle}</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              {mode === "login" 
                ? "Sign in to access your clinical dashboard."
                : "Register to start matching patients to trials."
              }
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl p-1" style={{ background: 'rgba(6, 10, 19, 0.6)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
            {[
              { id: "login", label: "Sign In" },
              { id: "register", label: "Register" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  mode === tab.id
                    ? "bg-accent-teal/10 text-accent-teal border border-accent-teal/15"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(localError || authError) && (
            <div className="mb-5 rounded-xl border border-accent-rose/20 bg-accent-rose/5 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-rose mt-1.5 flex-shrink-0" />
              {localError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="name">Full Name</label>
                <input id="name" type="text" placeholder="Dr. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} className="input-dark" required={mode === "register"} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="email">Email Address</label>
              <input id="email" type="email" placeholder="doctor@clinic.org" value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark" required />
            </div>
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="input-dark">
                  <option value="doctor">Doctor</option>
                  <option value="clinical_researcher">Clinical Researcher</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-700 bg-dark-800 text-accent-teal focus:ring-accent-teal/20 w-3.5 h-3.5" />
                Remember me
              </label>
              <a href="#" className="text-xs font-medium text-accent-teal/70 hover:text-accent-teal transition-colors">Forgot password?</a>
            </div>

            <button type="submit" disabled={submitting} className="w-full btn-glow flex justify-center items-center gap-2 mt-2 py-3.5">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                <Lock className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {submitting ? "Authenticating..." : mode === "login" ? "Sign In Securely" : "Create Account"}
            </button>
          </form>

          <div className="section-divider mt-8 mb-6" />

          <p className="text-center text-xs text-slate-600">
            Protected by enterprise-grade encryption.<br />
            Use your verified institution email.
          </p>
        </div>
      </div>
    </div>
  );
}
