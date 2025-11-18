import type { Config } from './types';

export const DEFAULT_CONFIG: Config = {
  aggregation: {
    basePoints: 50,
    formula: "Final = basePoints * product(1 + (m_i - 1) * w_i)"
  },
  weights: {
    schools: 4,
    public_transport: 1,
    groceries: 3,
    house_quality: 12
  },
  metrics: {
    schools: {
      label: "Schools",
      options: [
        { id: "excellent_10m", label: "4★ within 10 min", value: 1.5 },
        { id: "good_15m", label: "3★ within 15 min", value: 1.2 },
        { id: "acceptable", label: "2★ or farther", value: 1.0 },
        { id: "none", label: "No acceptable school", value: 0.75, gateFail: true }
      ]
    },
    public_transport: {
      label: "Public Transport",
      options: [
        { id: "high_freq_10m", label: "High frequency ≤ 10 min", value: 1.4 },
        { id: "standard_20m", label: "Standard ≤ 20 min", value: 1.2 },
        { id: "limited_far", label: "Limited / farther", value: 1.0 },
        { id: "none_20m", label: "None within 20 min", value: 0.75, gateFail: true }
      ]
    },
    groceries: {
      label: "Major Supermarkets",
      options: [
        { id: "le_5m", label: "≤ 5 min", value: 1.5 },
        { id: "le_10m", label: "≤ 10 min", value: 1.2 },
        { id: "le_15m", label: "≤ 15 min", value: 1.0 },
        { id: "gt_20m", label: "> 20 min", value: 0.75, gateFail: true }
      ]
    },
    house_quality: {
      label: "House Quality (Age/Condition)",
      options: [
        { id: "brand_new", label: "Brand New", value: 1.3 },
        { id: "le_8y", label: "≤ 8 years old", value: 1.15 },
        { id: "8_to_15y", label: "8–15 years old", value: 1.0 },
        { id: "gt_15y_poor", label: "> 15 years (poor)", value: 0.75, gateFail: true }
      ]
    }
  }
};