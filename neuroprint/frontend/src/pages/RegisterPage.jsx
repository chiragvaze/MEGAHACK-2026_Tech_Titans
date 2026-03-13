import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(form);
      localStorage.setItem("neuroprint_token", data.token);
      localStorage.setItem("neuroprint_user", JSON.stringify(data.user));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-ink">Create NeuroPrint Account</h1>
        <p className="mt-2 text-sm text-slate-500">Start tracking cognitive drift with secure biometrics.</p>

        <div className="mt-6 space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
            required
          />
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-sky-700">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
