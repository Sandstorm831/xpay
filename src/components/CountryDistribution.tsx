"use client";
import { usePaymentStore } from "@/src/store/usePaymentStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ChartWrapper from "./ChartWrapper";

export default function CountryDistribution() {
  const byCountry = usePaymentStore((state) => state.graphStats.byCountry);
//   console.log("byCountry = ", byCountry);
  // Transform { IN: 10, US: 5 } into [{ name: 'India', value: 10 }]
  const data = Object.entries(byCountry)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Keep highest at the top
//   console.log("data = ", data);
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-100">
      <h3 className="font-bold text-slate-700 mb-2">Volume by Country</h3>
      <div className="h-full w-full pb-6">
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 30, bottom: 20 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
}
