/**
 * Deterministic avatar generator — creates a unique colored circle
 * with the user's initials, derived from their name.
 * 
 * No external API. Pure canvas. Same name always produces the same color.
 */

// Warm, muted palette that fits the cafe aesthetic
const AVATAR_COLORS = [
  '#C8512D', // terracotta
  '#2C5530', // forest green
  '#6B5B52', // espresso muted
  '#D4693F', // terracotta light
  '#3A7042', // forest green light
  '#8B6F47', // warm brown
  '#5C7A3D', // olive
  '#B85C3A', // burnt sienna
  '#4A6B5C', // sage
  '#7D5A50', // mocha
  '#6B8E5A', // moss
  '#A0522D', // sienna
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function generateAvatar(name, size = 128) {
  const colorIndex = hashCode(name || 'Guest') % AVATAR_COLORS.length;
  const bgColor = AVATAR_COLORS[colorIndex];
  const initials = getInitials(name);

  // Using SVG ensures perfect scaling, crispness, and flawless centering
  // dy="0.05em" gently nudges the uppercase letters for visual balance
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${bgColor}" />
      <text 
        x="51.5%" 
        y="48.5%" 
        font-family="'DM Sans', system-ui, sans-serif" 
        font-size="${size * 0.42}px" 
        font-weight="600" 
        fill="#FFFFFF" 
        text-anchor="middle" 
        dominant-baseline="central"
      >
        ${initials}
      </text>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export { getInitials, AVATAR_COLORS, hashCode };
