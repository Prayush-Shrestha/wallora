export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(num);
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
