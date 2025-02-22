import { useWeb3 } from "../context/Web3Provider";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const languages = ["Rust", "Python", "Go", "JavaScript", "PHP", "C++"];
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

export default function Voting() {
  const { votes, voteForLanguage, fetchingVotes, voted, loading } = useWeb3();

  const data = languages.map((lang, index) => ({
    name: lang,
    value: votes[lang] || 0,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vote for the Best Language</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => voteForLanguage(lang)}
            disabled={loading}
            className={`p-2 transition-all duration-150 ease-out border rounded ${
              loading || voted ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Voting..." : `Vote ${lang}`}
          </button>
        ))}
      </div>
      <div className="mt-12 flex flex-col md:flex-row items-center w-full">
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/2 h-[350px] flex justify-center items-center">
          {fetchingVotes ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <PieChart width={400} height={380}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>

        <div className="mt-6 grid md:grid-cols-1 grid-cols-2 gap-2 md:gap-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="md:text-xl text-lg font-mono">
                {entry.name}: {entry.value} votes
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
