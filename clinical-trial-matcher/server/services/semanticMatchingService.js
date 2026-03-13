import { matchPatientToTrialByEmbedding } from "../../ai-services/embedding-engine/matcher.js";
import { evaluateEligibilityWithScore } from "./ruleEngine.js";

function roundScore(value) {
  return Number(value.toFixed(4));
}

export async function runSemanticMatch(patient, trial) {
  const ruleEvaluation = evaluateEligibilityWithScore(patient, trial);
  const embeddingMatch = await matchPatientToTrialByEmbedding(patient, trial);

  const ruleScore = ruleEvaluation.ruleScore;
  const similarityScore = embeddingMatch.similarityScore;
  const finalScore = (ruleScore * 0.6) + (similarityScore * 0.4);

  return {
    trialId: embeddingMatch.trialId,
    eligible: ruleEvaluation.eligible,
    reasons: ruleEvaluation.reasons,
    ruleScore: roundScore(ruleScore),
    similarityScore: roundScore(similarityScore),
    finalScore: roundScore(finalScore)
  };
}
