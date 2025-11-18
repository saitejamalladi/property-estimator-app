/**
 * Weight normalization utilities for the property estimator
 * Converts raw weights to normalized values and calculates percentages
 */

/**
 * Normalizes weights to the [0, 1] range by dividing each weight by the sum of all weights
 * @param weights - Raw weights object (any positive numbers)
 * @returns Normalized weights where sum equals 1.0
 */
export function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
  if (sum === 0) return weights; // Avoid division by zero, return original weights

  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    normalized[key] = value / sum;
  }
  return normalized;
}

/**
 * Calculates percentage distribution from raw weights
 * @param weights - Raw weights object (any positive numbers)
 * @returns Percentage values rounded to 2 decimal places
 */
export function calculatePercentages(weights: Record<string, number>): Record<string, number> {
  const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
  if (sum === 0) return weights; // Avoid division by zero, return original weights

  const percentages: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    percentages[key] = Math.round((value / sum) * 100 * 100) / 100; // Round to 2 decimals
  }
  return percentages;
}