function toLowerList(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean);
}

function getTrialRequiredConditions(trial = {}) {
  if (Array.isArray(trial?.parsedEligibility?.requiredConditions)) {
    return trial.parsedEligibility.requiredConditions;
  }

  return trial.requiredConditions || [];
}

function getTrialExcludedConditions(trial = {}) {
  if (Array.isArray(trial?.parsedEligibility?.excludedConditions)) {
    return trial.parsedEligibility.excludedConditions;
  }

  return trial.excludedConditions || [];
}

function getTrialAgeRange(trial = {}) {
  if (Array.isArray(trial?.parsedEligibility?.ageRange) && trial.parsedEligibility.ageRange.length === 2) {
    return [Number(trial.parsedEligibility.ageRange[0]), Number(trial.parsedEligibility.ageRange[1])];
  }

  return [Number(trial.minAge), Number(trial.maxAge)];
}

function validateInput(patient, trial) {
  if (!patient || typeof patient !== "object") {
    const error = new Error("patient object is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!trial || typeof trial !== "object") {
    const error = new Error("trial object is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isFinite(Number(patient.age))) {
    const error = new Error("patient.age must be a valid number.");
    error.statusCode = 400;
    throw error;
  }
}

export function evaluateEligibility(patient, trial) {
  const { eligible, reasons } = evaluateEligibilityWithScore(patient, trial);

  return {
    eligible,
    reasons
  };
}

export function evaluateEligibilityWithScore(patient, trial) {
  validateInput(patient, trial);

  const reasons = [];
  let eligible = true;
  let passedChecks = 0;
  const totalChecks = 3;

  const [minAge, maxAge] = getTrialAgeRange(trial);
  const age = Number(patient.age);

  if (Number.isFinite(minAge) && Number.isFinite(maxAge) && age >= minAge && age <= maxAge) {
    reasons.push("Age within range");
    passedChecks += 1;
  } else {
    eligible = false;
    reasons.push("Age outside eligible range");
  }

  const patientConditions = toLowerList(patient.conditions);
  const requiredConditions = toLowerList(getTrialRequiredConditions(trial));
  const excludedConditions = toLowerList(getTrialExcludedConditions(trial));

  let hasAllRequired = true;
  for (const required of requiredConditions) {
    if (!patientConditions.includes(required)) {
      hasAllRequired = false;
      break;
    }
  }

  if (hasAllRequired) {
    reasons.push("Required condition present");
    passedChecks += 1;
  } else {
    eligible = false;
    reasons.push("Missing required condition");
  }

  const hasExcluded = excludedConditions.some((excluded) => patientConditions.includes(excluded));

  if (!hasExcluded) {
    reasons.push("No excluded conditions detected");
    passedChecks += 1;
  } else {
    eligible = false;
    reasons.push("Excluded condition detected");
  }

  return {
    eligible,
    reasons,
    ruleScore: passedChecks / totalChecks
  };
}
