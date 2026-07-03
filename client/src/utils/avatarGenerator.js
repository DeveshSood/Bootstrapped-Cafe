/**
 * Deterministic avatar generator — creates a colored SVG circle with user initials.
 * Same name always produces the same color. No external API required.
 */

const AVATAR_COLORS = [
  '#C8512D', '#2C5530', '#6B5B52', '#D4693F', '#3A7042', '#8B6F47',
  '#5C7A3D', '#B85C3A', '#4A6B5C', '#7D5A50', '#6B8E5A', '#A0522D',
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
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
