import { useEffect, useState } from "react";
import { fetchPatientById } from "../services/api";

function FieldIcon({ type }) {
  if (type === "age") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  if (type === "condition") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 12h8" />
        <path d="M12 8v8" />
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

export default function PatientProfileCard({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatientProfile() {
      if (!patientId?.trim()) {
        setPatient(null);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetchPatientById(patientId.trim());
        setPatient(response?.patient || null);
      } catch (requestError) {
        setPatient(null);
        setError(requestError?.response?.data?.message || "Unable to load patient profile.");
      } finally {
        setLoading(false);
      }
    }

    loadPatientProfile();
  }, [patientId]);

  return (
    <section className="card-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Patient Profile</h3>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          Clinical Snapshot
        </span>
      </div>

      {!patientId?.trim() ? (
        <p className="mt-3 text-sm text-slate-500">Enter a patient ID to load patient details.</p>
      ) : null}

      {loading ? <p className="mt-3 text-sm text-slate-600">Loading patient profile...</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      {!loading && !error && patient ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Patient ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{patient.patientId}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <FieldIcon type="age" /> Age
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{patient.age}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2 xl:col-span-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <FieldIcon type="condition" /> Conditions
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {Array.isArray(patient.conditions) && patient.conditions.length
                ? patient.conditions.join(", ")
                : "Not provided"}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <FieldIcon type="location" /> Location
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{patient.location || "Not provided"}</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}