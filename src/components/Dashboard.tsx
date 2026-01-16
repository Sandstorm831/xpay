'use client';
import { useEffect } from 'react';
import { usePaymentStore } from '@/src/store/usePaymentStore';
import Metrics from './Metrics';
import LiveTable from './LiveTable';
import CountryDistribution from './CountryDistribution';
import MethodDistribution from './MethodDistribution';

export default function Dashboard() {
  const connect = usePaymentStore((state) => state.connect);
  const disconnect = usePaymentStore((state) => state.disconnect);
  const isConnected = usePaymentStore((state) => state.connectionStatus);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payments Command Center</h1>
            <p className="text-slate-500 text-sm">Real-time transaction monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-slate-600">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* 1. Top Row: Counters */}
        <Metrics />

        {/* 2. Middle Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CountryDistribution />
          <MethodDistribution />
        </div>

        {/* 3. Bottom Row: Table */}
        <div className="w-full">
          <LiveTable />
        </div>
      </div>
    </main>
  );
}