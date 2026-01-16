// src/store/usePaymentStore.ts
import { create } from "zustand";
import { PaymentEvent, DashboardStats } from "../types/payment";

interface PaymentState {
  events: PaymentEvent[];
  stats: DashboardStats;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

// 1. Temporary buffer (Lives outside of React state to prevent re-renders)
let eventBuffer: PaymentEvent[] = [];
let eventSource: EventSource | null = null;
let flushInterval: NodeJS.Timeout | null = null; // Track the interval

export const usePaymentStore = create<PaymentState>((set, get) => ({
  events: [],
  isConnected: false,
  stats: {
    totalVolume: 0,
    totalCount: 0,
    byCountry: {},
    byMethod: {},
  },

  connect: () => {
    if (eventSource) return;

    eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}/events?email=${process.env.NEXT_PUBLIC_EMAIL}`
    );

    eventSource.onopen = () => set({ isConnected: true });

    eventSource.onmessage = (event) => {
      const data: PaymentEvent = JSON.parse(event.data);
      eventBuffer.push(data); // Push to high-speed buffer
    };

    eventSource.onerror = () => {
      console.error("SSE Connection Failed");
      get().disconnect();
    };

    // Clear any existing interval before starting a new one
    if (flushInterval) clearInterval(flushInterval);

    // 2. THE FLUSH: Periodically move buffer to state (every 100ms)
    flushInterval = setInterval(() => {
      if (eventBuffer.length === 0) return;

      const newEvents = [...eventBuffer];
      eventBuffer = []; // Clear buffer

      set((state) => {
        // Update Stats in a single pass for performance
        const updatedStats = { ...state.stats };

        newEvents.forEach((evt) => {
          updatedStats.totalCount += 1;
          updatedStats.totalVolume += evt.amount;
          updatedStats.byCountry[evt.country] =
            (updatedStats.byCountry[evt.country] || 0) + 1;
          updatedStats.byMethod[evt.paymentMethod] =
            (updatedStats.byMethod[evt.paymentMethod] || 0) + 1;
        });

        return {
          // Keep only last 1000 events for virtualization
          events: [...newEvents.reverse(), ...state.events].slice(0, 1000),
          stats: updatedStats,
        };
      });
    }, 100);

    // Store interval cleanup if needed
  },

  disconnect: () => {
    // 1. Close SSE Connection
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    // 2. Clear the Interval (The fix!)
    if (flushInterval) {
      clearInterval(flushInterval);
      flushInterval = null;
    }

    // 3. Reset UI State
    set({ isConnected: false });

    // Optional: Clear the buffer so old data doesn't pop up on reconnect
    eventBuffer = [];
  },
}));
