/** @param {string} soLuongDonHang e.g. "3-5-1" */
export function orderCountParts(soLuongDonHang) {
  if (!soLuongDonHang || String(soLuongDonHang).length === 0) {
    return ["0", "0", "0"]
  }
  const p = String(soLuongDonHang).split("-")
  return [p[0] || "0", p[1] || "0", p[2] || "0"]
}
