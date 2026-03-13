export default function RecommendedTrialsList({
  recommendations,
  selectedTrialId,
  onSelectTrial,
  explanationByTrial,
  explanationLoading
}) {
  if (!recommendations.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Recommended Trials List</h3>
        <p className="mt-3 text-sm text-slate-500">Run matching to see recommendations.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Recommended Trials List</h3>
      <div className="mt-4 space-y-3">
        {recommendations.map((item) => {
          const isSelected = selectedTrialId === item.trialId;
          const explanation = explanationByTrial[item.trialId];

          return (
            <article
              key={item.trialId}
              className={`rounded-xl border p-4 ${
                isSelected ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Trial ID</p>
                  <p className="font-semibold text-slate-900">{item.trialId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Score</p>
                  <p className="text-xl font-bold text-brand-700">{item.score}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTrial(item.trialId)}
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {isSelected ? "Selected" : "View Explanation"}
                </button>
                {explanationLoading && isSelected ? (
                  <span className="text-xs text-slate-500">Generating explanation...</span>
                ) : null}
              </div>

              {explanation ? <p className="mt-3 text-sm text-slate-700">{explanation}</p> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
