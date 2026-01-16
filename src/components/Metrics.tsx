"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { usePaymentStore } from "@/src/store/usePaymentStore";

function AnimatedNumber({ value }: { value: number }) {
  // useSpring creates the smooth "roll" transition between values
  const spring = useSpring(value, { mass: 0.5, stiffness: 100, damping: 15 });
  const display = useTransform(spring, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function Metrics() {
  const stats = usePaymentStore((state) => state.LiveStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Total Payments"
        value={stats.totalCount}
        color="text-blue-500"
        isCurrency={false}
        suffix=""
      />
      <MetricCard
        title="Total Volume"
        value={stats.totalVolume}
        isCurrency={true}
        color="text-emerald-500"
        suffix=""
      />
      <MetricCard
        title="Success Rate"
        value={stats.totalSuccess / (stats.totalCount || 1) * 100}
        suffix="%"
        isCurrency={false}
        color="text-purple-500"
      />    
      <MetricCard
        title="Avg. Payment Size"
        value={stats.totalVolume / (stats.totalCount || 1)}
        isCurrency={true}
        color="text-orange-500"
        suffix=""
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  isCurrency,
  suffix = "",
  color,
}: {
  title: string;
  value: number;
  isCurrency: boolean;
  suffix: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
        {title}
      </p>
      <div className={`text-3xl font-bold mt-2 ${color}`}>
        {isCurrency && "$"}
        <AnimatedNumber value={value} />
        {suffix}
      </div>
    </div>
  );
}
