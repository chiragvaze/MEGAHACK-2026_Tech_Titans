import BehaviorData from "../models/BehaviorData.js";
import User from "../models/User.js";
import { analyzeDrift } from "../services/driftDetection.js";
import { predictStabilityIn30Days } from "../services/prediction.js";

const toNumber = (value) => Number(value || 0);

export const predictRisk = async (req, res, next) => {
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

    const behaviorEntries = await BehaviorData.find({ userId: req.userId })
      .sort({ timestamp: 1 })
      .limit(120)
      .lean();

    if (!behaviorEntries.length) {
      return res.status(200).json({
        predictedStability: 100,
        trend: "Stable",
        forecastSeries: [
          { point: "Now", stability: 100 },
          { point: "+30d", stability: 100 }
        ]
      });
    }

    const stabilityHistory = behaviorEntries.map((entry) => {
      const currentVector = [
        toNumber(entry.typingSpeed),
        toNumber(entry.avgKeyDelay),
        toNumber(entry.mouseSpeed),
        toNumber(entry.clickLatency)
      ];

      return analyzeDrift({ baselineVector, currentVector }).stabilityScore;
    });

    const prediction = predictStabilityIn30Days(stabilityHistory);

    return res.json(prediction);
  } catch (error) {
    next(error);
  }
};
