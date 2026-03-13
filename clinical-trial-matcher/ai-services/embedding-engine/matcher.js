const EMBEDDING_MODEL = "embed-english-v3.0";
const COHERE_EMBED_URL = "https://api.cohere.com/v1/embed";

function dotProduct(a = [], b = []) {
  let sum = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
}

function magnitude(v = []) {
  return Math.sqrt(v.reduce((acc, value) => acc + value * value, 0));
}

export function cosineSimilarity(vectorA = [], vectorB = []) {
  const magA = magnitude(vectorA);
  const magB = magnitude(vectorB);

  if (!magA || !magB) return 0;
  return dotProduct(vectorA, vectorB) / (magA * magB);
}

function buildPatientProfileText(patient = {}) {
  const age = Number.isFinite(Number(patient.age)) ? `Age: ${Number(patient.age)}.` : "";
  const gender = patient.gender ? `Gender: ${String(patient.gender).trim()}.` : "";
  const conditions = Array.isArray(patient.conditions)
    ? `Conditions: ${patient.conditions.join(", ")}.`
    : "Conditions: none.";
  const medications = Array.isArray(patient.medications)
    ? `Medications: ${patient.medications.join(", ")}.`
    : "Medications: none.";
  const location = patient.location ? `Location: ${String(patient.location).trim()}.` : "";

  return [age, gender, conditions, medications, location].filter(Boolean).join(" ");
}

function buildTrialConditionText(trial = {}) {
  const condition = trial.condition ? `Condition: ${trial.condition}.` : "";
  const inclusion = trial.inclusionCriteria ? `Inclusion: ${trial.inclusionCriteria}.` : "";
  const exclusion = trial.exclusionCriteria ? `Exclusion: ${trial.exclusionCriteria}.` : "";
  const phase = trial.phase ? `Phase: ${trial.phase}.` : "";
  const location = trial.location ? `Location: ${trial.location}.` : "";

  return [condition, inclusion, exclusion, phase, location].filter(Boolean).join(" ");
}

function clampToUnitInterval(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export async function matchPatientToTrialByEmbedding(patient, trial) {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    throw new Error("COHERE_API_KEY is not configured.");
  }

  const patientText = buildPatientProfileText(patient);
  const trialText = buildTrialConditionText(trial);

  if (!patientText || !trialText) {
    throw new Error("Unable to build embedding text for patient or trial.");
  }

  const response = await fetch(COHERE_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input_type: "search_document",
      texts: [patientText, trialText]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Cohere API request failed: ${response.status} ${details}`);
  }

  const embedResponse = await response.json();

  const vectors = embedResponse?.embeddings || embedResponse?.embeddings_by_type?.float;
  if (!Array.isArray(vectors) || vectors.length < 2) {
    throw new Error("Cohere embedding response is invalid.");
  }

  const rawSimilarity = cosineSimilarity(vectors[0], vectors[1]);
  const similarityScore = clampToUnitInterval(rawSimilarity);

  return {
    trialId: trial.trialId || trial._id || "unknown",
    similarityScore
  };
}
