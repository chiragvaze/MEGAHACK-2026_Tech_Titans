import { parseAndStoreTrialCriteria } from "../services/criteriaParsingService.js";
import { generateTrialExplanation } from "../services/groqService.js";

export async function parseCriteria(req, res, next) {
  try {
    const { trialId, criteriaText } = req.body || {};
    const result = await parseAndStoreTrialCriteria({ trialId, criteriaText });

    return res.status(200).json({
      trialId: result.trial.trialId,
      parsedRules: result.parsedRules,
      trial: result.trial
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      error.statusCode = 500;
      error.message = "AI returned malformed JSON.";
    }
    return next(error);
  }
}

export async function explainMatch(req, res, next) {
  try {
    const { patient, trial } = req.body || {};

    if (!patient || typeof patient !== "object") {
      return res.status(400).json({ message: "patient is required and must be an object." });
    }

    if (!trial || typeof trial !== "object") {
      return res.status(400).json({ message: "trial is required and must be an object." });
    }

    let explanation;

    try {
      explanation = await generateTrialExplanation(patient, trial);
      if (!explanation) {
        throw new Error("Empty explanation returned from Groq.");
      }
    } catch (_err) {
      explanation = "Trial recommended based on rule engine matching age and condition.";
    }

    return res.status(200).json({ explanation });
  } catch (error) {
    return next(error);
  }
}
