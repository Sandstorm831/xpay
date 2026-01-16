// Rates relative to 1 USD (Static for the assignment)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  GBP: 0.78,
  CAD: 1.35,
  AUD: 1.52,
  AED: 3.67,
  EUR: 0.92,
  INR: 83.0,
};

/**
 * Converts any amount to USD
 * Formula: Amount / Rate
 */
export const convertToUSD = (amount: number, currency: string): number => {
  const rate = EXCHANGE_RATES[currency] || 1;
  return amount / rate;
};