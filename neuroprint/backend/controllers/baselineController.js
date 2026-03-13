import User from "../models/User.js";

const average = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const normalizeSession = (session) => ({
  typingSpeed: Number(session.typingSpeed || 0),
  avgKeyDelay: Number(session.avgKeyDelay || 0),
  mouseSpeed: Number(session.mouseSpeed || 0),
  clickLatency: Number(session.clickLatency || 0)
});

export const createBaselineProfile = async (req, res, next) => {
  try {
    const { sessions, typingSpeed, avgKeyDelay, mouseSpeed, clickLatency } = req.body;

    let normalizedSessions = [];

    if (Array.isArray(sessions) && sessions.length > 0) {
      normalizedSessions = sessions.map(normalizeSession);
    } else {
      normalizedSessions = [
        normalizeSession({ typingSpeed, avgKeyDelay, mouseSpeed, clickLatency })
      ];
    }

    const baselineProfile = {
      typingSpeed: average(normalizedSessions.map((item) => item.typingSpeed)),
      avgKeyDelay: average(normalizedSessions.map((item) => item.avgKeyDelay)),
      mouseSpeed: average(normalizedSessions.map((item) => item.mouseSpeed)),
      clickLatency: average(normalizedSessions.map((item) => item.clickLatency))
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { baselineProfile },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({
      message: "Baseline profile created",
      baselineProfile: user.baselineProfile,
      user
    });
  } catch (error) {
    next(error);
  }
};
