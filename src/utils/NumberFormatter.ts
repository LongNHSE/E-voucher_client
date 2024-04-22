export function formatNumber(number: any): string {
  // Convert discount to a number before formatting
  const discountNumber = parseFloat(number);
  return discountNumber.toLocaleString("vi-VN"); // Format for Vietnamese locale
}
