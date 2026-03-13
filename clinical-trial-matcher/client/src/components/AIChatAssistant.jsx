import { useState } from "react";
import { fetchChatExplanation } from "../services/api";

const SUGGESTED_QUESTIONS = [
  "Why was this trial recommended?",
  "Is age the main reason this trial matched?",
  "Which exclusion criteria were checked?",
  "What would make this patient ineligible?"
];

export default function AIChatAssistant({
  patient,
  trial,
  matchingResult,
  matchExplanation
}) {
  const [question, setQuestion] = useState("Why was this trial recommended?");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion(askedQuestion) {
    setError("");

    if (!trial || !matchingResult) {
      setError("Select a recommended trial first to start chat.");
      return;
    }

    if (!askedQuestion.trim()) {
      setError("Ask a question to continue.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchChatExplanation({
        question: askedQuestion,
        patient,
        trial,
        matchingResult,
        matchExplanation
      });

      setMessages((prev) => [
        ...prev,
        {
          question: askedQuestion,
          answer: response.answer,
          base: response.matchExplanation
        }
      ]);
      setQuestion("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to get chatbot response.");
    } finally {
      setLoading(false);
    }
  }

  async function askAssistant(event) {
    event.preventDefault();
    const askedQuestion = question.trim();
    await askQuestion(askedQuestion);
  }

  return (
    <section className="card-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">AI Chat Assistant</h3>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          OpenAI Chat
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-600">
        Ask context-aware questions like: "Why was Trial A recommended?"
      </p>

      <form onSubmit={askAssistant} className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about the selected trial match"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setQuestion(item);
              askQuestion(item);
            }}
            disabled={loading}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700 disabled:opacity-60"
          >
            {item}
          </button>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-4 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No chat yet. Select a recommended trial and ask a question.
          </div>
        ) : (
          messages.map((item, index) => (
            <article key={`${item.question}-${index}`} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">You: {item.question}</p>
              <p className="text-sm text-slate-700">AI: {item.answer}</p>
              <p className="text-xs text-slate-500">Base explanation: {item.base}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
