import { explainTrialMatchInChat } from "../services/chatService.js";

export async function chatExplain(req, res, next) {
  try {
    const { question, patient, trial, matchingResult, matchExplanation } = req.body || {};

    const response = await explainTrialMatchInChat({
      question,
      patient,
      trial,
      matchingResult,
      matchExplanation
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}
