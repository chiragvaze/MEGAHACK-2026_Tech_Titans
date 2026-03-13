import { Router } from "express";
import { parseCriteria, explainMatch } from "../controllers/aiController.js";

const router = Router();

router.post("/parse-criteria", parseCriteria);
router.post("/explain-match", explainMatch);

export default router;
