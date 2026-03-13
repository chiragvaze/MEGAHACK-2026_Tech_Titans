import { Router } from "express";
import biometricRoutes from "./biometricRoutes.js";
import authRoutes from "./authRoutes.js";
import behaviorRoutes from "./behaviorRoutes.js";
import baselineRoutes from "./baselineRoutes.js";
import driftRoutes from "./driftRoutes.js";
import predictRoutes from "./predictRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/behavior", behaviorRoutes);
router.use("/baseline", baselineRoutes);
router.use("/drift", driftRoutes);
router.use("/predict", predictRoutes);
router.use("/biometrics", biometricRoutes);

export default router;
