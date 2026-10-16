import { request } from "@utils/networking"

// Thưởng tích lũy / phiếu trả thưởng áp trên đơn (API mini app gọi qua API web DMS, giống app sale)

const parseList = async (res) => {
  const json = await res.json()
  if (!json?.result) throw new Error(json?.message || "Không lấy được dữ liệu")
  try {
    const list = JSON.parse(json.message || "[]")
    return Array.isArray(list) ? list : []
  } catch (e) {
    return []
  }
}

// sanpham: [{ id, ma, soluong, dongia }] (đơn giá sau chiết khấu, giống lúc áp khuyến mãi)
export const tinhTichLuy = (userId, sanpham, ngaydh, dhId = "") =>
  request("POST", "donhang/tinhTichLuy", { userId: String(userId), sanpham: JSON.stringify(sanpham), ngaydh, dhId }).then(parseList)

export const getTraThuong = (userId, ngaydh, dhId = "") =>
  request("POST", "donhang/getTraThuong", { userId: String(userId), ngaydh, dhId }).then(parseList)
