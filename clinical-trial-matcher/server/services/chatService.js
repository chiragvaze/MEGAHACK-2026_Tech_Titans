import {
  generateRecommendationExplanation,
  generateChatExplanationResponse
} from "../../ai-services/explanation-engine/explain.js";

export async function explainTrialMatchInChat({
  question,
  patient,
  trial,
  matchingResult,
  matchExplanation
}) {
  if (!question || !String(question).trim()) {
    const error = new Error("question is required.");
    error.statusCode = 400;
    throw error;
  }

  const hasContext =
    patient && typeof patient === "object" &&
    trial && typeof trial === "object" &&
    matchingResult && typeof matchingResult === "object";

  const baseExplanation = hasContext
    ? (matchExplanation || (await generateRecommendationExplanation({
      patient,
      trial,
      matchingResult
    })))
    : "Context not selected yet. Generate matches and choose a trial for detailed explanation.";

  let answer;
  try {
    answer = await generateChatExplanationResponse({
      question,
      patient,
      trial,
      matchingResult,
      matchExplanation: baseExplanation
    });
  } catch (_error) {
    if (hasContext) {
      answer = `${baseExplanation} (Live AI refinement is temporarily unavailable; this is a fallback explanation.)`;
    } else {
      answer = "I can help explain trial recommendations. First, generate matches and select a trial in Match Dashboard, then ask your question again.";
    }
  }

  return {
    question,
    matchExplanation: baseExplanation,
    answer
  };
}
