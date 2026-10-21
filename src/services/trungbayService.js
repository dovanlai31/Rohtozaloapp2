import { request } from "@utils/networking"

// Trạng thái duyệt đăng ký trưng bày (DKTRUNGBAY_KHACHHANG.istradeduyet)
export const DUYET_TRUNGBAY = {
  0: { text: "Chờ duyệt", tone: "warning" },
  1: { text: "Đã duyệt", tone: "success" },
  2: { text: "Không duyệt", tone: "danger" },
}

const parseJson = (s) => {
  try {
    const p = JSON.parse(s || "[]")
    return Array.isArray(p) ? p : []
  } catch (e) {
    return []
  }
}

const callApi = async (api, body, errMsg) => {
  const response = await (await request("POST", api, body)).json()
  if (!response?.result) throw new Error(response?.message || errMsg)
  return response
}

// Chương trình trưng bày KH đã đăng ký, đang trong thời gian trưng bày
// Mỗi dòng: { id, SCHEME, TenChuongTrinh, TuNgay, DenNgay (yyyy-mm-dd), SoSuat, istradeduyet,
//             DAI, RONG, CAO, NgayDangKy, SoLanChup, LanChupCuoi (yyyy-mm-dd hh:mm),
//             images: [url], tieuChi: [{ nhan, soluong, phantram }] }
export const getCttbDaDangKy = async (userId) => {
  const response = await callApi(
    "trungbay/getCttbDaDangKy",
    { userId: userId + "" },
    "Không lấy được dữ liệu trưng bày"
  )
  return parseJson(response.message).map((r) => ({
    ...r,
    istradeduyet: Number(r.istradeduyet || 0),
    images: [r.Anh1, r.Anh2, r.Anh3, r.Anh4]
      .filter((f) => f && String(f).trim())
      .map((f) => (r.urlAnh || "") + f),
    tieuChi: parseJson(r.tieuChi),
  }))
}

// Đăng ký đã được duyệt thì KH mới được chụp ảnh trưng bày
export const duocChupAnh = (item) => Number(item?.istradeduyet) === 1

// Lịch sử chụp ảnh của KH cho 1 chương trình
// Mỗi dòng: { ThoiDiem (yyyy-mm-dd hh:mm), tuMiniApp, images: [url] }
export const getAnhChupTrungBay = async (userId, cttbId) => {
  const response = await callApi(
    "trungbay/getAnhChup",
    { userId: userId + "", cttbId: cttbId + "" },
    "Không lấy được lịch sử chụp ảnh"
  )
  return parseJson(response.message).map((r) => ({
    ...r,
    images: [r.Anh1, r.Anh2].filter((f) => f && String(f).trim()).map((f) => (r.urlAnh || "") + f),
  }))
}

// KH chụp 2 ảnh trưng bày (base64 jpeg)
export const chupAnhTrungBay = ({ userId, cttbId, image1, image2 }) =>
  callApi(
    "trungbay/chupAnh",
    { userId: userId + "", cttbId: cttbId + "", image1, image2 },
    "Lưu ảnh trưng bày thất bại"
  )

// yyyy-mm-dd[ hh:mm] -> dd/mm/yyyy[ hh:mm]
export const toDMY = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(.*)$/.exec(s || "")
  return m ? `${m[3]}/${m[2]}/${m[1]}${m[4]}` : s || ""
}
