import type { Config } from './types';

export const DEFAULT_CONFIG: Config = {
  aggregation: {
    basePoints: 50,
    formula: "Final = basePoints * product(1 + (m_i - 1) * w_i)"
  },
  metrics: {
    primary_school: {
      label: "Primary School in Zone",
      weight: 7,
      options: [
        { id: "4_star", label: "4★ rating", value: 1.5 },
        { id: "3_star", label: "3★ rating", value: 1.0, default: true },
        { id: "2_star", label: "2★ rating", value: 0.75, gateFail: true }
      ]
    },
    public_transport: {
      label: "Public Transport with Parking",
      weight: 5,
      options: [
        { id: "within_suburb_10m", label: "Within suburb or ≤ 10 min", value: 1.5 },
        { id: "neighbour_20m", label: "Neighbour suburbs or ≤ 20 min", value: 1.0, default: true },
        { id: "none_20m", label: "No public transport within 20 min", value: 0.75, gateFail: true }
      ]
    },
    house_quality: {
      label: "House Quality",
      weight: 4,
      options: [
        { id: "brand_new", label: "Brand New", value: 1.5 },
        { id: "within_8_years", label: "Within 8 years old", value: 1.0, default: true },
        { id: "8_15_years", label: "8-15 years old", value: 0.8 },
        { id: "over_15_years", label: "More than 15 years old", value: 0.75, gateFail: true }
      ]
    },
    property_price: {
      label: "Property Price",
      weight: 5,
      options: [
        { id: "below_budget", label: "Below Budget", value: 1.5 },
        { id: "within_budget", label: "Within Budget", value: 1.0, default: true },
        { id: "above_budget", label: "Far Above the Budget", value: 0.8, gateFail: true }
      ]
    },
    family_proximity: {
      label: "Close to Family",
      weight: 3,
      options: [
        { id: "within_30m", label: "Within 30 mins", value: 1.5 },
        { id: "within_1h", label: "Within 1 hour", value: 1.0, default: true },
        { id: "within_2h", label: "Within 2 hours", value: 0.8 },
        { id: "over_2h", label: "More than 2 hours", value: 0.75, gateFail: true }
      ]
    },
    supermarket: {
      label: "Supermarket (Coles/Aldi/IGA/Woolworths)",
      weight: 3,
      options: [
        { id: "within_5m", label: "Within 5 mins", value: 1.25 },
        { id: "within_15m", label: "Within 15 mins", value: 1.0, default: true },
        { id: "over_20m", label: "More than 20 mins", value: 0.8, gateFail: true }
      ]
    },
    indian_groceries: {
      label: "Indian Groceries",
      weight: 3,
      options: [
        { id: "within_15m", label: "Within 15 mins", value: 1.5 },
        { id: "within_30m", label: "Within 30 mins", value: 1.0, default: true },
        { id: "over_45m", label: "More than 45 mins", value: 0.8, gateFail: true }
      ]
    },
    safety_environment: {
      label: "Safety & Environment",
      weight: 3,
      options: [
        { id: "very_safe", label: "Very Safe", value: 1.2 },
        { id: "safe", label: "Safe", value: 1.0, default: true },
        { id: "not_safe", label: "Not Safe", value: 0.8, gateFail: true }
      ]
    },
    health_services: {
      label: "Health & Services",
      weight: 3,
      options: [
        { id: "within_10m", label: "Within 10 mins", value: 1.5 },
        { id: "within_20m", label: "Within 20 mins", value: 1.0, default: true },
        { id: "over_30m", label: "More than 30 mins", value: 0.8, gateFail: true }
      ]
    },
    amenities: {
      label: "Amenities (Shopping Malls, Pools, Recreation)",
      weight: 3,
      options: [
        { id: "within_15m", label: "Within 15 mins", value: 1.5 },
        { id: "within_30m", label: "Within 30 mins", value: 1.0, default: true },
        { id: "over_45m", label: "More than 45 mins", value: 0.8, gateFail: true }
      ]
    },
    stores: {
      label: "Stores (OfficeWorks, Bunnings, JB HiFi, Costco)",
      weight: 2,
      options: [
        { id: "within_20m", label: "Within 20 mins", value: 1.2 },
        { id: "within_30m", label: "Within 30 mins", value: 1.0, default: true },
        { id: "over_1h", label: "More than 1 hour", value: 0.8, gateFail: true }
      ]
    },
    indian_restaurants: {
      label: "Indian Restaurants",
      weight: 3,
      options: [
        { id: "within_15m", label: "Within 15 mins", value: 1.3 },
        { id: "within_30m", label: "Within 30 mins", value: 1.0, default: true },
        { id: "over_45m", label: "More than 45 mins", value: 0.8, gateFail: true }
      ]
    },
    hindu_temples: {
      label: "Hindu Temples",
      weight: 3,
      options: [
        { id: "within_15m", label: "Within 15 mins", value: 1.25 },
        { id: "within_30m", label: "Within 30 mins", value: 1.0, default: true },
        { id: "over_1h", label: "More than 1 hour", value: 0.75 }
      ]
    },
    private_schools: {
      label: "Private Schools",
      weight: 2,
      options: [
        { id: "within_20m", label: "Within 20 mins", value: 1.2 },
        { id: "within_30m", label: "Within 30 mins", value: 1.0, default: true },
        { id: "over_30m", label: "More than 30 mins", value: 0.8 }
      ]
    },
    indian_community: {
      label: "Indian Community",
      weight: 2,
      options: [
        { id: "decent", label: "Decent", value: 1.5 },
        { id: "very_high", label: "Very High", value: 1.0, default: true },
        { id: "very_low", label: "Very Low or No Community", value: 0.8, gateFail: true }
      ]
    }
  }
};