import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#17a27e", "#f59e0b"];

export default function EligibilityDistributionChart({ recommendations }) {
  const eligibleCount = recommendations.filter((item) => item.score >= 70).length;
  const reviewCount = Math.max(0, recommendations.length - eligibleCount);

  const data = [
    { name: "Likely Eligible", value: eligibleCount },
    { name: "Needs Review", value: reviewCount }
  ];

  return (
    <div className="card-surface p-6">
      <h3 className="text-lg font-semibold">Eligibility Distribution</h3>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={95} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
