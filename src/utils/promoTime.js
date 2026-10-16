// Tính trạng thái thời gian của chương trình khuyến mãi (dùng chung cho danh sách và chi tiết)

const DAY = 86400000
export const SAP_HET_HAN = 7 // còn <= 7 ngày coi là sắp hết hạn

// Đọc ngày dạng yyyy-mm-dd hoặc dd/mm/yyyy (lấy 0h theo giờ máy)
export const parseDate = (s) => {
  if (!s) return null
  const str = String(s).trim()
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3])
  m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (m) return new Date(+m[3], +m[2] - 1, +m[1])
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export const fmtDate = (d) =>
  d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}` : ""

// Số ngày còn lại, % thời gian đã qua, mức độ gấp (normal | soon | ended)
export const timeInfo = (tuNgay, denNgay) => {
  const start = parseDate(tuNgay)
  const end = parseDate(denNgay)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!end) return { start, end, daysLeft: null, progress: 0, level: "normal" }
  const daysLeft = Math.round((end - today) / DAY)
  const total = start ? Math.max(1, Math.round((end - start) / DAY) + 1) : 1
  const passed = start ? Math.round((today - start) / DAY) + 1 : 0
  const progress = Math.min(100, Math.max(0, (passed / total) * 100))
  const level = daysLeft < 0 ? "ended" : daysLeft <= SAP_HET_HAN ? "soon" : "normal"
  return { start, end, daysLeft, progress, level }
}

// Màu theo mức độ gấp
export const LEVEL = {
  normal: { stub: "bg-[#eef4fb] text-primary", bar: "bg-primary", badge: "bg-[#e3f4ea] text-[#1f7a45]", label: "Đang diễn ra" },
  soon: { stub: "bg-[#fff4e5] text-[#c26a00]", bar: "bg-[#f0a020]", badge: "bg-[#fdf1dc] text-[#9a5a00]", label: "Sắp hết hạn" },
  ended: { stub: "bg-[#f1f5f9] text-slate-400", bar: "bg-slate-300", badge: "bg-[#f1f5f9] text-slate-500", label: "Đã kết thúc" },
}

export const daysLeftText = (daysLeft) =>
  daysLeft === null ? "" : daysLeft < 0 ? "Đã hết hạn" : daysLeft === 0 ? "Kết thúc hôm nay" : `Còn ${daysLeft} ngày`
