const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

function requireObject(value, fieldName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    const error = new Error(`${fieldName} must be an object.`);
    error.statusCode = 400;
    throw error;
  }
}

function cleanText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildFallbackExplanation({ patient, trial, matchingResult, reason }) {
  const score = Number(matchingResult?.finalScore);
  const pct = Number.isFinite(score) ? Math.round(score * 100) : null;

  const age = Number(patient?.age);
  const minAge = Number(trial?.minAge);
  const maxAge = Number(trial?.maxAge);
  const ageText =
    Number.isFinite(age) && Number.isFinite(minAge) && Number.isFinite(maxAge)
      ? `Age ${age} was checked against trial range ${minAge}-${maxAge}`
      : "Age compatibility was checked against the trial range";

  const primaryCondition = Array.isArray(patient?.conditions) && patient.conditions.length
    ? patient.conditions[0]
    : null;
  const conditionText = primaryCondition
    ? `primary condition (${primaryCondition}) aligns with ${trial?.condition || "the target trial condition"}`
    : `conditions were compared with ${trial?.condition || "the target trial condition"}`;

  const scoreText = pct === null ? "" : ` Current match score is ${pct}%.`;
  const note = reason ? ` (${reason})` : "";

  return `${trial?.title || "This trial"} was recommended because ${ageText.toLowerCase()} and the ${conditionText}.${scoreText}${note}`.trim();
}

export async function generateRecommendationExplanation({
  patient,
  trial,
  matchingResult
}) {
  requireObject(patient, "patient");
  requireObject(trial, "trial");
  requireObject(matchingResult, "matchingResult");

  const apiKey = process.env.OPENAI_API_KEY;
  const fallback = buildFallbackExplanation({
    patient,
    trial,
    matchingResult,
    reason: "AI explanation fallback"
  });

  if (!apiKey) {
    return fallback;
  }

  const promptPayload = {
    patient,
    trialCriteria: {
      trialId: trial.trialId,
      title: trial.title,
      condition: trial.condition,
      minAge: trial.minAge,
      maxAge: trial.maxAge,
      inclusionCriteria: trial.inclusionCriteria,
      exclusionCriteria: trial.exclusionCriteria,
      parsedEligibility: trial.parsedEligibility || {}
    },
    matchingResult
  };

  try {
    const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a clinical trial recommendation explainer. Generate one concise explanation in plain English, 1-3 sentences, highlighting why the trial was recommended using age fit, condition fit, and exclusion checks. Do not invent patient facts."
          },
          {
            role: "user",
            content: `Generate explanation for this recommendation data: ${JSON.stringify(promptPayload)}`
          }
        ]
      })
    });

    if (!response.ok) {
      return buildFallbackExplanation({
        patient,
        trial,
        matchingResult,
        reason: `OpenAI unavailable (${response.status})`
      });
    }

    const data = await response.json();
    const explanation = cleanText(data?.choices?.[0]?.message?.content);

    if (!explanation) {
      return fallback;
    }

    return explanation;
  } catch (_error) {
    return fallback;
  }
}

export async function generateChatExplanationResponse({
  question,
  patient,
  trial,
  matchingResult,
  matchExplanation
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const hasContext =
    patient && typeof patient === "object" &&
    trial && typeof trial === "object" &&
    matchingResult && typeof matchingResult === "object";

  const contextPayload = hasContext
    ? { patient, trial, matchingResult }
    : { note: "No trial context was provided by the UI." };

  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that explains clinical trial matching decisions in simple language. Keep responses factual, concise, and grounded in provided data. If context is missing, clearly ask the user to generate matches and select a trial first."
        },
        {
          role: "user",
          content: `User question: ${question}\n\nExisting match explanation: ${matchExplanation || "Not available."}\n\nMatching context: ${JSON.stringify({
            hasContext,
            context: contextPayload
          })}`
        }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`OpenAI API request failed: ${response.status} ${details}`);
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();
  const answer = cleanText(data?.choices?.[0]?.message?.content);

  if (!answer) {
    const error = new Error("Failed to generate chatbot answer.");
    error.statusCode = 500;
    throw error;
  }

  return answer;
}
