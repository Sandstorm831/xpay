"use client";

import { ReactNode, useEffect, useState } from "react";

export default function ChartWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // This ONLY runs once the component is in the browser
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 1. Server-side / Initial Client-side: Show the pulse
  if (!mounted)
    return <div className="animate-pulse bg-slate-100 rounded-lg h-full w-full" />;

  // 2. Client-side after hydration: Show the Chart
  return <>{children}</>;
}
