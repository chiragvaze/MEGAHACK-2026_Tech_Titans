import { useState } from "react";
import { fetchChatExplanation } from "../services/api";

export default function FloatingAIChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("Why was this trial recommended?");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onAsk(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Ask a question first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const asked = question.trim();
      const response = await fetchChatExplanation({ question: asked });

      setMessages((prev) => [...prev, { question: asked, answer: response.answer }]);
      setQuestion("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Chatbot request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[22rem] rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">AI Chat Assistant</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              Close
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500">
                Ask anything about trial matching. For detailed reasoning, generate matches and select a trial in Match Dashboard.
              </p>
            ) : (
              messages.map((item, index) => (
                <article key={`${item.question}-${index}`} className="space-y-1 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">You: {item.question}</p>
                  <p className="text-sm text-slate-800">AI: {item.answer}</p>
                </article>
              ))
            )}
          </div>

          <form onSubmit={onAsk} className="border-t border-slate-200 p-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask trial match question"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-700"
        >
          Open AI Chat
        </button>
      )}
    </div>
  );
}
