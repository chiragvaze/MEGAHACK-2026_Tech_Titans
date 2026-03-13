import Patient from "../models/Patient.js";
import mongoose from "mongoose";
import {
  createPatientMemory,
  createPatientsMemory,
  getPatientByIdMemory
} from "./devMemoryStore.js";

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export async function createPatient(patientPayload) {
  if (!isDbConnected()) {
    return createPatientMemory(patientPayload);
  }

  const patient = await Patient.create(patientPayload);
  return patient;
}

export async function createPatients(patientPayloadList) {
  if (!isDbConnected()) {
    return createPatientsMemory(patientPayloadList);
  }

  const patients = await Patient.insertMany(patientPayloadList, { ordered: false });
  return patients;
}

export async function getPatientById(id) {
  if (!isDbConnected()) {
    return getPatientByIdMemory(id);
  }

  const byPatientId = await Patient.findOne({ patientId: id }).lean();
  if (byPatientId) return byPatientId;

  // Fallback allows lookup by Mongo _id while preserving :id route.
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Patient.findById(id).lean();
  }

  return null;
}
