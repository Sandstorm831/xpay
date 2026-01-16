'use client';
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { usePaymentStore } from '@/src/store/usePaymentStore';

export default function LiveTable() {
  const events = usePaymentStore((state) => state.events);
  const parentRef = useRef<HTMLDivElement>(null);

  // The Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Height of each row in pixels
    overscan: 5, // Number of rows to render outside the visible area for smoothness
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Live Transactions</h3>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
          Showing last {events.length}
        </span>
      </div>

      {/* Scrollable Container */}
      <div
        ref={parentRef}
        className="h-125 overflow-auto scrollbar-hide"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const event = events[virtualRow.index];
            return (
              <div
                key={event.eventId} // Use eventId for stable tracking
                className="absolute top-0 left-0 w-full border-b border-slate-50"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex items-center justify-between px-6 h-full hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-slate-400">{event.eventId}</span>
                    <span className="font-medium text-slate-700">{event.paymentMethod}</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {event.currency} {(event.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {event.country} • {new Date(event.timestamp).toUTCString  ()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}