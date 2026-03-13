import { Router } from "express";
import {
	runRuleCheck,
	runSemanticCheck,
	runRecommendations,
	runMatchExplanation
} from "../controllers/matchController.js";

const router = Router();

router.post("/rule-check", runRuleCheck);
router.post("/semantic", runSemanticCheck);
router.post("/recommendations", runRecommendations);
router.post("/explanation", runMatchExplanation);

export default router;
