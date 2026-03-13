import { evaluateEligibility } from "../services/ruleEngine.js";
import { runSemanticMatch } from "../services/semanticMatchingService.js";
import { rankTrialsForPatient } from "../services/rankingEngine.js";
import { generateRecommendationExplanation } from "../../ai-services/explanation-engine/explain.js";

export async function runRuleCheck(req, res, next) {
  try {
    const { patient, trial } = req.body || {};
    const evaluation = evaluateEligibility(patient, trial);
    return res.status(200).json(evaluation);
  } catch (error) {
    return next(error);
  }
}

export async function runSemanticCheck(req, res, next) {
  try {
    const { patient, trial } = req.body || {};
    const evaluation = await runSemanticMatch(patient, trial);
    return res.status(200).json(evaluation);
  } catch (error) {
    return next(error);
  }
}

export async function runRecommendations(req, res, next) {
  try {
    const { patient, trials, matchingScores } = req.body || {};
    const recommendations = await rankTrialsForPatient({
      patient,
      trials,
      matchingScores
    });

    return res.status(200).json({ recommendations });
  } catch (error) {
    return next(error);
  }
}

export async function runMatchExplanation(req, res, next) {
  try {
    const { patient, trial, matchingResult } = req.body || {};

    const explanation = await generateRecommendationExplanation({
      patient,
      trial,
      matchingResult
    });

    return res.status(200).json({ explanation });
  } catch (error) {
    return next(error);
  }
}
