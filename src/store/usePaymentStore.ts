// src/store/usePaymentStore.ts
import { create } from "zustand";
import {
  PaymentEvent,
  DashboardStats,
  ConnectionEvent,
  GraphStats,
} from "../types/payment";
import { convertToUSD } from "../lib/utils";

interface PaymentState {
  events: PaymentEvent[];
  LiveStats: DashboardStats;
  graphStats: GraphStats;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

// 1. Temporary buffer (Lives outside of React state to prevent re-renders)
let eventBuffer: PaymentEvent[] = [];
let graphBuffer: PaymentEvent[] = [];
let eventSource: EventSource | null = null;
let fastInterval: NodeJS.Timeout | null = null; // Track the interval
let graphInterval: NodeJS.Timeout | null = null; // Track the interval

export const usePaymentStore = create<PaymentState>((set, get) => ({
  events: [],
  isConnected: false,
  LiveStats: {
    totalVolume: 0,
    totalCount: 0,
    totalSuccess: 0,
  },
  graphStats: {
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
      const data: PaymentEvent | ConnectionEvent = JSON.parse(event.data);

      // check for initial response message
      if ("mode" in data) {
        console.log("Connection mode updated to:", data.mode);
        return; // Exit early so it doesn't hit the buffer
      }

      eventBuffer.push(data); // Push to high-speed buffer
    };

    eventSource.onerror = () => {
      console.error("SSE Connection Failed");
      get().disconnect();
    };

    // Clear any existing interval before starting a new one
    if (fastInterval) clearInterval(fastInterval);

    // 2. THE FLUSH: Periodically move buffer to state (every 100ms)
    fastInterval = setInterval(() => {
      if (eventBuffer.length === 0) return;

      const newEvents = [...eventBuffer];
      graphBuffer = [...graphBuffer, ...eventBuffer]
      eventBuffer = []; // Clear buffer

      set((state) => {
        // Update Stats in a single pass for performance
        const updatedStats = {
          ...state.LiveStats,
        };

        newEvents.forEach((evt) => {
        //   console.log(evt);
          updatedStats.totalCount += 1;
          const amountInUSD = convertToUSD(evt.amount, evt.currency);
          updatedStats.totalVolume += amountInUSD;
          updatedStats.totalSuccess += (evt.status === 'success' ? 1 : 0);
          if (evt.status === 'failed') console.log("failed event: ", evt)
        });

        return {
          // Keep only last 1000 events for virtualization
          events: [...newEvents.reverse(), ...state.events].slice(0, 1000),
          LiveStats: updatedStats,
        };
      });
    }, 100);

    // Clear any existing interval before starting a new one
    if (graphInterval) clearInterval(graphInterval);

    // 3. THE FLUSH: Periodically move graph buffer to state (every 2s)
    graphInterval = setInterval(() => {
      if (graphBuffer.length === 0) return;

      const newEvents = [...graphBuffer];
      graphBuffer = []; // Clear buffer

      set((state) => {
        // Update Stats in a single pass for performance
        const updatedStats = {
          byCountry: { ...state.graphStats.byCountry },
          byMethod: { ...state.graphStats.byMethod },
        };

        newEvents.forEach((evt) => {
          updatedStats.byCountry[evt.country] =
            (updatedStats.byCountry[evt.country] || 0) + 1;
          updatedStats.byMethod[evt.paymentMethod] =
            (updatedStats.byMethod[evt.paymentMethod] || 0) + 1;
        });

        return {
          graphStats: updatedStats,
        };
      });
    }, 2000);

    // Store interval cleanup if needed
  },

  disconnect: () => {
    // 1. Close SSE Connection
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    // 2. Clear the Intervals
    if (fastInterval) {
      clearInterval(fastInterval);
      fastInterval = null;
    }

    if (graphInterval) {
      clearInterval(graphInterval);
      graphInterval = null;
    }

    // 3. Reset UI State
    set({ isConnected: false });

    // Optional: Clear the buffer so old data doesn't pop up on reconnect
    eventBuffer = [];
  },
}));
