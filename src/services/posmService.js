import { request } from "@utils/networking"




// Lý do không quét được QR (giống LYDO_KHONG_QUET của app sale)
export const LYDO_KHONG_QUET = [
  "Thu tủ",
  "QR code bị mờ",
  "QR Code bị che lấp",
  "QR Code bị hư hỏng",
  "Tủ bị mất",
  "Khách hàng đóng cửa",
  "Khác",
]

// Kết quả kiểm tra QR từ server (ketQua):
// 0 = QR không khớp tài sản, 1 = QR không tồn tại, 2 = Mã QR mới (gán cho tài sản khi lưu),
// 3 = Hợp lệ, 4 = QR đã gán cho tài sản của khách hàng khác
export const isQRHopLe = (ketQua) => ketQua === "2" || ketQua === "3"

// Trạng thái POSM trong LUU_KT_POSM
export const TRANGTHAI_POSM_TEXT = { 0: "Bình thường", 1: "Hư hỏng", 2: "Đã mất" }

const callApi = async (api, body) => {
  const response = await (await request("POST", api, body)).json()
  if (!response?.result) {
    throw new Error(response?.message || "Lỗi hệ thống, vui lòng thử lại")
  }
  return response
}

const parseList = (message) => {
  try {
    const p = JSON.parse(message || "[]")
    return Array.isArray(p) ? p : []
  } catch (e) {
    return []
  }
}

/* --------------------------------- POSM --------------------------------- */

// Số liệu cho khung Quản lý POSM ở trang Tài khoản
export const getPosmSummary = async (userId) => {
  const [posm, traThuong] = await Promise.all([
    callApi("posm/getSummary", { userId: userId + "" }).then((res) => parseList(res.message)[0]),
    getTraThuongSummary(userId).catch(() => ({ chuaTra: 0 })),
  ])
  return {
    tongPosm: Number(posm?.tongPosm || 0),
    chuaKiemTra: Number(posm?.chuaKiemTra || 0),
    phieuChuaTra: traThuong.chuaTra,
  }
}

// Danh sách POSM đang đặt tại shop (truyền uploadCtId để lấy 1 POSM)
// Mỗi dòng: { uploadCtId, uploadPosmId, spId, maSp, name, mataisan, requireQR, requireImage,
//             daKtToday, lydo, ngayKtCuoi }
export const getListPosm = async (userId, uploadCtId = "") => {
  const res = await callApi("posm/getListPosm", { userId: userId + "", uploadCtId: uploadCtId + "" })
  return parseList(res.message).map((x) => ({ ...x, uploadCtId: x.uploadCtId + "" }))
}

// Lịch sử kiểm tra POSM của KH (30 lần gần nhất)
export const getPosmHistory = async (userId) => {
  const res = await callApi("posm/getHistory", { userId: userId + "" })
  return parseList(res.message)
}

// Kiểm tra QR vừa quét (server tự giải mã QR). Trả về { ketQua, msg }
export const checkPosmQR = async (userId, uploadCtId, qr) => {
  const res = await callApi("posm/checkQR", { userId: userId + "", uploadCtId: uploadCtId + "", qr })
  const [row] = parseList(res.message)
  return { ketQua: String(row?.ketQua ?? ""), msg: row?.msg || "" }
}

// Lưu kết quả kiểm tra; image: base64 jpeg
export const savePosmCheck = async ({ userId, uploadCtId, qr = "", lydo = "", ghichu = "", image = "" }) => {
  await callApi("posm/saveCheck", {
    userId: userId + "",
    uploadCtId: uploadCtId + "",
    qr,
    lydo,
    ghichu,
    image,
  })
  return true
}


/* ------------------------- Phiếu trả thưởng ------------------------- */
// API: TraThuongKHController (dữ liệu bảng trathuong của web DMS, chỉ phiếu đã duyệt)

const fmtYmd = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s || ""
}

// Chuẩn hoá 1 phiếu từ API về dạng màn hình đang dùng
const mapPhieu = (x) => ({
  ...x,
  id: x.id + "",
  ky: x.tuNgay || x.denNgay ? `${fmtYmd(x.tuNgay)} - ${fmtYmd(x.denNgay)}` : "",
  giaTri: Number(x.giaTri) || 0,
  giaTriHang: "",
  daTra: Number(x.daTra) || 0,
  daDuyet: Number(x.daDuyet) || 0,
  trangThaiTra: Number(x.trangThaiTra) || 0,
})

// Số phiếu chưa trả xong (trang Tài khoản)
export const getTraThuongSummary = async (userId) => {
  const res = await callApi("trathuong/getSummary", { userId: userId + "" })
  const [row] = parseList(res.message)
  return {
    tongPhieu: Number(row?.tongPhieu || 0),
    chuaTra: Number(row?.chuaTra || 0),
  }
}

// trangthai: "" tất cả | "0" chưa trả | "1" trả 1 phần | "2" đã trả
export const getListPhieuTraThuong = async (userId, trangthai = "", tungay = "", denngay = "") => {
  const res = await callApi("trathuong/getList", {
    userId: userId + "",
    trangthai,
    tungay,
    denngay,
    pageNumber: 1,
    pageSize: 200,
  })
  return parseList(res.message).map(mapPhieu)
}

// Chi tiết phiếu: thông tin phiếu + danh sách trả (chiTiet) + đơn hàng đã cấn trừ (donHang)
export const getPhieuTraThuongDetail = async (userId, id) => {
  const res = await callApi("trathuong/getDetail", { userId: userId + "", id: id + "" })
  const data = JSON.parse(res.message || "{}")
  const [phieu] = Array.isArray(data.phieu) ? data.phieu : []
  if (!phieu) return null
  return { ...mapPhieu(phieu), chiTiet: data.chiTiet || [], donHang: data.donHang || "" }
}
