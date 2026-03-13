import { useMemo, useState } from "react";
import {
  fetchAllTrials,
  fetchMatchExplanation,
  fetchRecommendations
} from "../services/api";
import RecommendedTrialsList from "../components/RecommendedTrialsList";
import MatchConfidenceChart from "../components/MatchConfidenceChart";
import TrialRankingChart from "../components/TrialRankingChart";
import EligibilityDistributionChart from "../components/EligibilityDistributionChart";
import AIChatAssistant from "../components/AIChatAssistant";
import PatientProfileCard from "../components/PatientProfileCard";

const DEFAULT_PATIENT = {
  patientId: "",
  age: "",
  gender: "",
  conditions: "",
  medications: "",
  location: ""
};

function toList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePatient(patientForm) {
  return {
    patientId: patientForm.patientId,
    age: Number(patientForm.age),
    gender: patientForm.gender,
    conditions: toList(patientForm.conditions),
    medications: toList(patientForm.medications),
    location: patientForm.location
  };
}

export default function MatchResultsDashboardPage() {
  const [patientForm, setPatientForm] = useState(DEFAULT_PATIENT);
  const [geoFilter, setGeoFilter] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [trialsCache, setTrialsCache] = useState([]);
  const [selectedTrialId, setSelectedTrialId] = useState("");
  const [explanationByTrial, setExplanationByTrial] = useState({});
  const [loading, setLoading] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [error, setError] = useState("");

  const bestScore = useMemo(() => {
    if (!recommendations.length) return 0;
    return recommendations[0].score;
  }, [recommendations]);

  const selectedTrial = useMemo(
    () => trialsCache.find((item) => item.trialId === selectedTrialId) || null,
    [selectedTrialId, trialsCache]
  );

  const selectedMatchingResult = useMemo(() => {
    const item = recommendations.find((entry) => entry.trialId === selectedTrialId);
    if (!item) return null;

    return {
      eligible: item.score >= 70,
      finalScore: item.score / 100,
      reasons: [
        "Age within range",
        "Required condition present",
        "No exclusion conditions detected"
      ]
    };
  }, [recommendations, selectedTrialId]);

  function onPatientChange(event) {
    const { name, value } = event.target;
    setPatientForm((prev) => ({ ...prev, [name]: value }));
  }

  function filterTrialsByLocation(trials) {
    if (!geoFilter.trim()) return trials;

    const query = geoFilter.toLowerCase();
    return trials.filter((trial) => String(trial.location || "").toLowerCase().includes(query));
  }

  async function generateRecommendations() {
    setLoading(true);
    setError("");

    try {
      const patient = normalizePatient(patientForm);
      const trialsResponse = await fetchAllTrials({});
      const trials = filterTrialsByLocation(trialsResponse.trials || []);

      if (!trials.length) {
        throw new Error("No trials found for the selected geographic filter.");
      }

      const recommendationsResponse = await fetchRecommendations({
        patient,
        trials
      });

      setTrialsCache(trials);
      setRecommendations(recommendationsResponse.recommendations || []);
      setSelectedTrialId("");
      setExplanationByTrial({});
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to generate recommendations.");
    } finally {
      setLoading(false);
    }
  }

  async function loadExplanation(trialId) {
    setSelectedTrialId(trialId);

    if (explanationByTrial[trialId]) {
      return;
    }

    setExplanationLoading(true);
    setError("");

    try {
      const trial = trialsCache.find((item) => item.trialId === trialId);
      const matchingResult = recommendations.find((item) => item.trialId === trialId);
      const patient = normalizePatient(patientForm);

      if (!trial || !matchingResult) {
        throw new Error("Unable to find trial details for explanation.");
      }

      const response = await fetchMatchExplanation({
        patient,
        trial,
        matchingResult: {
          eligible: matchingResult.score >= 70,
          finalScore: matchingResult.score / 100,
          reasons: [
            "Age within range",
            "Required condition present",
            "No exclusion conditions detected"
          ]
        }
      });

      setExplanationByTrial((prev) => ({
        ...prev,
        [trialId]: response.explanation
      }));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Failed to generate explanation.");
    } finally {
      setExplanationLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-slate-900">Match Results Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Generate trial recommendations, inspect confidence scores, and view AI explanation for each ranked trial.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input
            name="patientId"
            placeholder="Patient ID (e.g., PAT-3001)"
            value={patientForm.patientId}
            onChange={onPatientChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={patientForm.age}
            onChange={onPatientChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          />
          <input
            name="gender"
            placeholder="Gender"
            value={patientForm.gender}
            onChange={onPatientChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          />
          <input
            name="location"
            placeholder="Patient Location"
            value={patientForm.location}
            onChange={onPatientChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          />
          <input
            name="conditions"
            placeholder="Conditions (comma-separated)"
            value={patientForm.conditions}
            onChange={onPatientChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 md:col-span-2"
          />
          <input
            name="medications"
            placeholder="Medications (comma-separated)"
            value={patientForm.medications}
            onChange={onPatientChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 md:col-span-1"
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={geoFilter}
            onChange={(event) => setGeoFilter(event.target.value)}
            placeholder="Geographic Filter (e.g., Mumbai, India)"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          />
          <button
            type="button"
            onClick={generateRecommendations}
            disabled={loading}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Matches"}
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4">
          <p className="text-sm text-slate-500">Match Confidence Score</p>
          <p className="mt-1 text-3xl font-bold text-brand-700">{bestScore}</p>
        </div>

        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      </section>

      <AIChatAssistant
        patient={normalizePatient(patientForm)}
        trial={selectedTrial}
        matchingResult={selectedMatchingResult}
        matchExplanation={selectedTrialId ? explanationByTrial[selectedTrialId] : ""}
      />

      <PatientProfileCard patientId={patientForm.patientId} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecommendedTrialsList
          recommendations={recommendations}
          selectedTrialId={selectedTrialId}
          onSelectTrial={loadExplanation}
          explanationByTrial={explanationByTrial}
          explanationLoading={explanationLoading}
        />
        <MatchConfidenceChart recommendations={recommendations} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TrialRankingChart recommendations={recommendations} />
        <EligibilityDistributionChart recommendations={recommendations} />
      </div>
    </div>
  );
}
