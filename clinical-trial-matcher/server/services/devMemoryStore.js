const memoryPatients = new Map();
const memoryTrials = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toMongoDuplicateError(message) {
  const error = new Error(message);
  error.code = 11000;
  return error;
}

export function createPatientMemory(payload) {
  const key = String(payload.patientId || "").trim();
  if (memoryPatients.has(key)) {
    throw toMongoDuplicateError("patientId already exists.");
  }

  const record = {
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString()
  };

  memoryPatients.set(key, record);
  return clone(record);
}

export function createPatientsMemory(payloadList = []) {
  return payloadList.map((payload) => createPatientMemory(payload));
}

export function getPatientByIdMemory(id) {
  const key = String(id || "").trim();
  if (!key) return null;

  const found = memoryPatients.get(key);
  return found ? clone(found) : null;
}

export function createTrialMemory(payload) {
  const key = String(payload.trialId || "").trim();
  if (memoryTrials.has(key)) {
    throw toMongoDuplicateError("trialId already exists.");
  }

  const record = {
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  memoryTrials.set(key, record);
  return clone(record);
}

export function importTrialsMemory(payloadList = []) {
  return payloadList.map((payload) => createTrialMemory(payload));
}

function matchesFilter(value, query) {
  if (!query) return true;
  return String(value || "").toLowerCase().includes(String(query).toLowerCase());
}

export function getAllTrialsMemory(filters = {}) {
  const items = Array.from(memoryTrials.values());

  const filtered = items.filter((trial) => {
    return (
      matchesFilter(trial.condition, filters.condition) &&
      matchesFilter(trial.location, filters.location) &&
      matchesFilter(trial.phase, filters.phase)
    );
  });

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return clone(filtered);
}

export function getTrialByIdMemory(id) {
  const key = String(id || "").trim();
  if (!key) return null;

  const found = memoryTrials.get(key);
  return found ? clone(found) : null;
}

export function updateTrialParsedEligibilityMemory(id, parsedRules, sourceText) {
  const key = String(id || "").trim();
  if (!memoryTrials.has(key)) return null;

  const existing = memoryTrials.get(key);
  const updated = {
    ...existing,
    parsedEligibility: {
      ageRange: parsedRules.ageRange,
      requiredConditions: parsedRules.requiredConditions,
      excludedConditions: parsedRules.excludedConditions,
      sourceText,
      parsedAt: new Date().toISOString()
    },
    updatedAt: new Date().toISOString()
  };

  memoryTrials.set(key, updated);
  return clone(updated);
}
