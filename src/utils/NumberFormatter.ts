export function formatNumber(number: any): string {
  if (number !== undefined && number !== null) {
    const parts = number.toFixed(0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  }
  return "N/A";
}
