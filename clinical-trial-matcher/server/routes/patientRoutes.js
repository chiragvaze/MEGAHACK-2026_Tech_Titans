import { Router } from "express";
import multer from "multer";
import {
  createPatientRecord,
  uploadPatients,
  getPatientRecord
} from "../controllers/patientController.js";
import {
  validateAnonymizedPatientPayload,
  validateAnonymizedUploadPayload
} from "../middleware/anonymizationValidation.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/create", (_req, res) => {
  res.status(405).json({
    message: "Method not allowed. Use POST /api/patient/create with JSON payload."
  });
});

router.get("/upload", (_req, res) => {
  res.status(405).json({
    message: "Method not allowed. Use POST /api/patient/upload with multipart form-data."
  });
});

router.post("/create", validateAnonymizedPatientPayload, createPatientRecord);
router.post("/upload", upload.single("file"), validateAnonymizedUploadPayload, uploadPatients);
router.get("/:id", getPatientRecord);

export default router;
