"use client";
import { usePaymentStore } from "@/src/store/usePaymentStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import ChartWrapper from "./ChartWrapper";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function MethodDistribution() {
  const byMethod = usePaymentStore((state) => state.graphStats.byMethod);

  const data = Object.entries(byMethod)
    .map(([name, value]) => ({
      name: name.replace("_", " "), // "APPLE_PAY" -> "APPLE PAY"
      value,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-100 flex flex-col">
      <h3 className="font-bold text-slate-700 mb-2">Payment Methods</h3>
      <div className="grow">
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
                animationDuration={500}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={48} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
}
