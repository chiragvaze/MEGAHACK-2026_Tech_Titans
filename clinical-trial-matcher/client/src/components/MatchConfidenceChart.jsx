import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function MatchConfidenceChart({ recommendations }) {
  const chartData = recommendations.map((item) => ({
    trialId: item.trialId,
    confidence: item.score
  }));

  return (
    <div className="card-surface p-6">
      <h3 className="text-lg font-semibold">Match Confidence Scores</h3>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trialId" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="confidence" fill="#17a27e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
