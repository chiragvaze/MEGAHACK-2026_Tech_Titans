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

export async function generateRecommendationExplanation({
  patient,
  trial,
  matchingResult
}) {
  requireObject(patient, "patient");
  requireObject(trial, "trial");
  requireObject(matchingResult, "matchingResult");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
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
    const details = await response.text();
    const error = new Error(`OpenAI API request failed: ${response.status} ${details}`);
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();
  const explanation = cleanText(data?.choices?.[0]?.message?.content);

  if (!explanation) {
    const error = new Error("Failed to generate explanation.");
    error.statusCode = 500;
    throw error;
  }

  return explanation;
}
