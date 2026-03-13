import OpenAI from "openai";

function getGroqClient() {
  const apiKey = String(process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });
}

function toList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  return String(value || "").trim();
}

export async function generateTrialExplanation(patient, trial) {
  const groq = getGroqClient();

  const prompt = `
Explain why the following clinical trial is suitable for the patient.

Patient:
Age: ${patient?.age ?? "Unknown"}
Condition: ${toList(patient?.conditions) || "Unknown"}
Location: ${patient?.location || "Unknown"}

Clinical Trial:
Title: ${trial?.title || "Unknown"}
Condition: ${trial?.condition || "Unknown"}
Phase: ${trial?.phase || "Unknown"}
Intervention: ${trial?.intervention || "Not specified"}

Generate a short explanation (3-4 sentences) explaining why this trial matches the patient.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  return String(response?.choices?.[0]?.message?.content || "").trim();
}
