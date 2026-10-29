import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tick = { fill: "var(--color-muted)", fontSize: 12 };

const burden = [
  { name: "Lines of code", value: 30, tone: "gold" },
  { name: "Commits", value: 20, tone: "gold" },
  { name: "Pull requests", value: 23, tone: "gold" },
  { name: "Tasks finished", value: 21, tone: "gold" },
  { name: "Time to merge", value: 49, tone: "hot" },
  { name: "Review comments", value: 35, tone: "hot" },
  { name: "Time reviewing AI", value: 91, tone: "hot" },
  { name: "Software shipped", value: 0, tone: "mute" },
];

const agents = [
  { name: "March", share: 17 },
  { name: "September", share: 40 },
];

const tipStyle = {
  background: "var(--color-paper)",
  border: "none",
  borderRadius: 12,
  color: "var(--color-ink)",
};

export function BurdenChart() {
  return (
    <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={burden} layout="vertical" margin={{ left: 4, right: 12, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-line)" />
          <XAxis type="number" tick={tick} axisLine={false} tickLine={false} unit="%" />
          <YAxis type="category" dataKey="name" width={118} tick={tick} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "var(--color-soft)" }}
            contentStyle={tipStyle}
            formatter={(value) => [`+${value ?? 0}%`, "Change"]}
          />
          <Bar dataKey="value" radius={6} barSize={14} isAnimationActive>
            {burden.map((row) => (
              <Cell
                key={row.name}
                fill={
                  row.tone === "hot"
                    ? "var(--color-cinnabar)"
                    : row.tone === "mute"
                      ? "var(--color-line)"
                      : "var(--color-gold)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AgentChart() {
  return (
    <div className="h-48 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={agents} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-line)" />
          <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} unit="%" domain={[0, 50]} />
          <Tooltip
            cursor={{ fill: "var(--color-soft)" }}
            contentStyle={tipStyle}
            formatter={(value) => [`${value ?? 0}%`, "Agent-started PRs"]}
          />
          <Bar dataKey="share" fill="var(--color-gold)" radius={8} barSize={42} isAnimationActive />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
