/** "Kylian Mbappé" -> "K. Mbappé"; "Rodri" -> "Rodri"; handles "Kouadio Koné (Manu Koné)" -> "M. Koné" */
export function abbreviateName(fullName) {
  const parenMatch = fullName.match(/\(([^)]+)\)/);
  const base = (parenMatch ? parenMatch[1] : fullName).trim();
  const parts = base.split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}
