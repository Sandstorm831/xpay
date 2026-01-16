"use client";
import { useEffect } from "react";
import { usePaymentStore } from "@/src/store/usePaymentStore";
import Metrics from "./Metrics";

export default function Dashboard() {
  const connect = usePaymentStore((s) => s.connect);
  const disconnect = usePaymentStore((s) => s.disconnect);

  useEffect(() => {
    connect();

    // This return function runs when the component UNMOUNTS
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* All your components go here */}
      <Metrics />
    </div>
  );
}
