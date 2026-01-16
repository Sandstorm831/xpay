export type PaymentMethod =
  | "CARD"
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "KLARNA"
  | "AFTERPAY"
  | "PAYPAL"
  | "CARD_INSTALLMENT";

export type CountryCode = "US" | "GB" | "CA" | "AU" | "AE" | "DE" | "IN";
export type CurrencyCode =
  | "USD"
  | "GBP"
  | "CAD"
  | "AUD"
  | "AED"
  | "EUR"
  | "INR";

export interface PaymentEvent {
  eventId: string;
  timestamp: string;
  country: CountryCode;
  currency: CurrencyCode;
  amount: number;
  paymentMethod: PaymentMethod;
  source: "web" | "mobile" | "api";
  status: "success" | "failed";
}

export interface DashboardStats {
  totalVolume: number;
  totalCount: number;
  totalSuccess: number;
}

export interface GraphStats{
  byCountry: Partial<Record<CountryCode, number>>;
  byMethod: Partial<Record<PaymentMethod, number>>;
}

export interface ConnectionEvent {
    type: string;
    mode: "normal" | "high_traffic" | "country_focus" | "payment_spike" | "chaos";
}