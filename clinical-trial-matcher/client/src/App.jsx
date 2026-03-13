import { useState } from "react";
import PatientUploadPage from "./pages/PatientUploadPage";
import TrialDatabasePage from "./pages/TrialDatabasePage";
import MatchResultsDashboardPage from "./pages/MatchResultsDashboardPage";
import AppLayout from "./components/AppLayout";
import FloatingAIChatbot from "./components/FloatingAIChatbot";

export default function App() {
  const [activePage, setActivePage] = useState("patients");

  const tabs = [
    { id: "patients", label: "Patient Upload" },
    { id: "trials", label: "Trial Database" },
    { id: "results", label: "Match Dashboard" }
  ];

  return (
    <AppLayout>
      <div className="card-surface mb-6 inline-flex flex-wrap gap-2 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActivePage(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activePage === tab.id
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activePage === "patients" ? <PatientUploadPage /> : null}
      {activePage === "trials" ? <TrialDatabasePage /> : null}
      {activePage === "results" ? <MatchResultsDashboardPage /> : null}

      <FloatingAIChatbot />
    </AppLayout>
  );
}
