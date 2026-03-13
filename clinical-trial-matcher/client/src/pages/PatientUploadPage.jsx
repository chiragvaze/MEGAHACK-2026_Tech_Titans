import { useMemo, useState } from "react";
import { createPatient, uploadPatientFile } from "../services/api";
import {
  hasIdentifiableKeys,
  normalizePatient,
  parsePatientUploadFile
} from "../utils/patientUploadParsers";

const EMPTY_FORM = {
  patientId: "",
  age: "",
  gender: "",
  conditions: "",
  medications: "",
  location: ""
};

export default function PatientUploadPage() {
  const [mode, setMode] = useState("bulk");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewPatients, setPreviewPatients] = useState([]);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const previewRows = useMemo(() => previewPatients.slice(0, 10), [previewPatients]);

  function onFormChange(event) {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  async function onFileChange(event) {
    const file = event.target.files?.[0];
    setError("");
    setMessage("");

    if (!file) {
      setSelectedFile(null);
      setPreviewPatients([]);
      return;
    }

    try {
      const parsed = await parsePatientUploadFile(file);
      if (hasIdentifiableKeys(parsed)) {
        throw new Error("Identifiable columns detected. Remove name, phone, email, and similar fields.");
      }

      setSelectedFile(file);
      setPreviewPatients(parsed);
    } catch (parseError) {
      setSelectedFile(null);
      setPreviewPatients([]);
      setError(parseError.message || "Failed to parse file.");
    }
  }

  async function submitManualEntry(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload = normalizePatient(formState);
      await createPatient(payload);
      setMessage("Patient record created successfully.");
      setFormState(EMPTY_FORM);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to create patient record.");
    } finally {
      setLoading(false);
    }
  }

  async function submitFileUpload() {
    if (!selectedFile) {
      setError("Select a CSV or JSON file first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await uploadPatientFile(selectedFile);
      setMessage(`Uploaded ${response.count} patient records successfully.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to upload patient file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Patient Upload Workspace</h2>
            <p className="mt-1 text-sm text-slate-600">Bulk upload or manually add anonymized patient profiles.</p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                mode === "bulk" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
            >
              Bulk Upload
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                mode === "manual" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
            >
              Manual Entry
            </button>
          </div>
        </div>
      </section>

      {mode === "bulk" ? (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <article className="card-surface p-6">
            <h3 className="text-lg font-semibold">Bulk File Upload</h3>
            <p className="mt-1 text-sm text-slate-600">Accepted formats: CSV and JSON. Upload one file at a time.</p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-brand-500">
              <input type="file" accept=".csv,.json" onChange={onFileChange} className="hidden" />
              <p className="text-sm font-semibold text-slate-700">Choose CSV/JSON file</p>
              <p className="mt-1 text-xs text-slate-500">No personal identifiers allowed</p>
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Selected File</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedFile?.name || "None"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Parsed Records</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{previewPatients.length}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={submitFileUpload}
              disabled={loading}
              className="mt-4 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Patients"}
            </button>
          </article>

          <article className="card-surface p-6">
            <h3 className="text-lg font-semibold">Parsed Data Preview</h3>
            <p className="mt-1 text-sm text-slate-600">Showing the first 10 parsed records before upload.</p>

            {previewRows.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                No parsed records yet.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="px-2 py-2">patientId</th>
                      <th className="px-2 py-2">age</th>
                      <th className="px-2 py-2">conditions</th>
                      <th className="px-2 py-2">location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.map((patient, index) => (
                      <tr key={`${patient.patientId}-${index}`}>
                        <td className="px-2 py-2 font-semibold">{patient.patientId}</td>
                        <td className="px-2 py-2">{patient.age}</td>
                        <td className="px-2 py-2">{patient.conditions.join(", ")}</td>
                        <td className="px-2 py-2">{patient.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      ) : (
        <section className="card-surface p-6">
          <h3 className="text-lg font-semibold">Manual Patient Entry</h3>
          <p className="mt-1 text-sm text-slate-600">Create one anonymized patient profile manually.</p>

          <form onSubmit={submitManualEntry} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input
              name="patientId"
              placeholder="Patient ID"
              value={formState.patientId}
              onChange={onFormChange}
              required
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={formState.age}
              onChange={onFormChange}
              required
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              name="gender"
              placeholder="Gender"
              value={formState.gender}
              onChange={onFormChange}
              required
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              name="location"
              placeholder="Location"
              value={formState.location}
              onChange={onFormChange}
              required
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            />
            <input
              name="conditions"
              placeholder="Conditions (comma-separated)"
              value={formState.conditions}
              onChange={onFormChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 md:col-span-2"
            />
            <input
              name="medications"
              placeholder="Medications (comma-separated)"
              value={formState.medications}
              onChange={onFormChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 md:col-span-2 xl:col-span-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60 md:col-span-2 xl:col-span-3"
            >
              {loading ? "Saving..." : "Save Patient"}
            </button>
          </form>
        </section>
      )}

      {message ? <p className="text-sm font-medium text-green-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
    </div>
  );
}
