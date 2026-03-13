import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PatientUploadPage from "./pages/PatientUploadPage";
import TrialDatabasePage from "./pages/TrialDatabasePage";
import MatchResultsDashboardPage from "./pages/MatchResultsDashboardPage";
import AppLayout from "./components/AppLayout";
import FloatingAIChatbot from "./components/FloatingAIChatbot";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Simple Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Checking secure session...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardApp = () => {
  const [activePage, setActivePage] = useState("results");
  const { user, logout } = useAuth();

  const tabs = [
    { id: "patients", label: "Patient Upload" },
    { id: "trials", label: "Trial Database" },
    { id: "results", label: "Match Dashboard" }
  ];

  return (
    <AppLayout>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed In</p>
          <p className="text-sm text-slate-800">
            {user?.name} ({user?.role === "clinical_researcher" ? "Clinical Researcher" : "Doctor"})
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </div>

      <div className="card-surface mb-6 inline-flex flex-wrap gap-2 p-2 relative z-10 w-full rounded-2xl shadow-sm border border-slate-100 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActivePage(tab.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activePage === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activePage === "patients" ? <PatientUploadPage /> : null}
        {activePage === "trials" ? <TrialDatabasePage /> : null}
        {activePage === "results" ? <MatchResultsDashboardPage /> : null}
      </div>

      <FloatingAIChatbot />
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
