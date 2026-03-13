import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrialRankingChart({ recommendations }) {
  const rankingData = recommendations.map((item, index) => ({
    rank: index + 1,
    trialId: item.trialId,
    score: item.score
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Trial Ranking Trend</h3>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={rankingData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rank" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#0f6e55" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
