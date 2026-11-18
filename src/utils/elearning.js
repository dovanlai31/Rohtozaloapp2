import { formatCurrency } from "@utils/networking"

// File bài học / ảnh câu hỏi: web lưu đường dẫn tương đối (/BAI-HOC/x.pptx, /CAU-HOI/x.png) dưới thư mục ảnh của DMS
export const FILE_ROOT = "https://dms.rohto.com.vn:7999/AnhChupPDA"

export const linkFile = (path) => {
  const s = String(path || "").trim()
  if (!s) return ""
  if (/^https?:\/\//i.test(s)) return s
  return encodeURI(`${FILE_ROOT}/${s.replace(/^\/+/, "")}`)
}

export const youtubeId = (url) => {
  const s = String(url || "")
  const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : ""
}

export const duoiFile = (name) => (String(name || "").split("?")[0].match(/\.([a-z0-9]+)$/i)?.[1] || "").toLowerCase()

export const laVideo = (name) => ["mp4", "mov", "m4v", "webm"].includes(duoiFile(name))
export const laAnh = (name) => ["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(duoiFile(name))

// File Office xem qua trình xem online của Microsoft; pdf / file khác mở thẳng link
export const linkXemFile = (url) =>
  ["ppt", "pptx", "doc", "docx", "xls", "xlsx"].includes(duoiFile(url))
    ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
    : url

const money = (n) => `${formatCurrency(Number(n) || 0, true)}đ`

// Phiếu trả thưởng E-learning (TRATHUONG.LOAITRATHUONG): 1 quà, 3 cấn tiền, 5 quy đổi SP, 7 chiết khấu %, 8 chiết khấu theo SP
export const moTaPhieuThuong = (p) => {
  switch (Number(p?.loai)) {
    case 3:
      return `Cấn trừ ${money(p.tongtien)} trên đơn hàng`
    case 5:
      return `Quy đổi sản phẩm trị giá ${money(p.tongtien)}`
    case 1:
      return Number(p.hinhthuc_sp) === 2
        ? `Quà tặng chọn tối đa ${p.tongluong || 0} SP trong: ${p.sanpham}`
        : `Quà tặng: ${p.sanpham}`
    case 7:
      return `Chiết khấu ${p.chietkhau || 0}% trên tổng đơn hàng`
    case 8:
      return `Chiết khấu theo sản phẩm: ${p.sanpham}`
    default:
      return p?.tenloai || ""
  }
}

// Trạng thái thẻ bài kiểm tra trên danh sách
export const trangThaiBai = (b) => {
  const conLuot = Number(b.soLanDaLam) < Number(b.soLanToiDa)
  if (Number(b.dat) === 1) {
    if (Number(b.luotQuay) > 0 || Number(b.choChonQua) > 0) return { key: "quay", label: "Có lượt quay", tone: "warning" }
    return { key: "dat", label: "Đã đạt", tone: "success" }
  }
  if (Number(b.conHan) !== 1) return { key: "het", label: "Hết hạn", tone: "neutral" }
  if (!conLuot) return { key: "hetluot", label: "Hết lượt", tone: "danger" }
  if (Number(b.soLanDaLam) > 0) return { key: "chuadat", label: "Chưa đạt", tone: "danger" }
  return { key: "moi", label: "Chưa làm", tone: "info" }
}

// Thời gian "yyyy-MM-dd HH:mm" -> "dd/MM/yyyy HH:mm"
export const fmtNgay = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}))?/)
  return m ? `${m[3]}/${m[2]}/${m[1]}${m[4] ? " " + m[4] : ""}` : s || ""
}
