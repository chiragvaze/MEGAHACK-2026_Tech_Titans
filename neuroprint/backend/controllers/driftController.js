import User from "../models/User.js";
import { analyzeDrift } from "../services/driftDetection.js";

const toNumber = (value) => Number(value || 0);

export const analyzeUserDrift = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("baselineProfile");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const baselineVector = [
      toNumber(user.baselineProfile?.typingSpeed),
      toNumber(user.baselineProfile?.avgKeyDelay),
      toNumber(user.baselineProfile?.mouseSpeed),
      toNumber(user.baselineProfile?.clickLatency)
    ];

    const hasBaseline = baselineVector.some((value) => value > 0);

    if (!hasBaseline) {
      return res.status(400).json({ message: "Baseline profile not initialized" });
    }

    const currentVector = [
      toNumber(req.body.typingSpeed),
      toNumber(req.body.avgKeyDelay),
      toNumber(req.body.mouseSpeed),
      toNumber(req.body.clickLatency)
    ];

    const hasCurrentData = currentVector.some((value) => value > 0);

    if (!hasCurrentData) {
      return res.status(400).json({ message: "Current behavioral metrics are required" });
    }

    const analysis = analyzeDrift({ baselineVector, currentVector });

    return res.json(analysis);
  } catch (error) {
    next(error);
  }
};
