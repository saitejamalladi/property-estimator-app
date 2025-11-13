/**
 * Utility functions for generating dynamic category colors
 */

/**
 * Generates a stable HSL color for a category based on its metricId.
 * Uses hashing to ensure deterministic colors that persist across sessions.
 */
export function getCategoryColor(metricId: string): string {
  // Hash the metricId to get a number
  let hash = 0;
  for (let i = 0; i < metricId.length; i++) {
    hash = metricId.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate light HSL color
  const hue = Math.abs(hash % 360);
  const saturation = 35; // Low saturation for pastel
  const lightness = 94;  // High lightness for light background

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Returns contrasting text and border colors for light backgrounds.
 * Returns dark text and subtle border.
 */
export function getTextAndBorder(): { text: string; border: string } {
  // For light backgrounds, use dark text and subtle border
  return {
    text: '#111827', // Dark gray text
    border: 'hsla(0, 0%, 0%, 0.12)', // Subtle dark border
  };
}