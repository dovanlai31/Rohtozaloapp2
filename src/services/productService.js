import { request } from "@utils/networking"

const parseList = (message) => {
  try {
    const p = JSON.parse(message || "[]")
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

/**
 * Danh sách sản phẩm (khachhang/searchSP) cho trang chủ.
 * sort: goiy (sản phẩm chọn hiển thị trên app trước) | new | priceAsc | priceDesc
 * loc: "km" = chỉ sản phẩm đang có khuyến mãi
 * Mỗi dòng có thêm coKM (1 = đang có khuyến mãi), kmCK (% chiết khấu cao nhất)
 */
export const getProducts = async ({ userId, sort = "goiy", loc = "", nhanhangId = "", pageSize = 8 }) => {
  const res = await callApi(
    "khachhang/searchSP",
    {
      userId: (userId || "") + "",
      keyword: "",
      nhanhangId: (nhanhangId || "") + "",
      ctkmid: "",
      lastId: "",
      pageNumber: 1,
      pageSize,
      sort,
      loc,
    },
    "Không tải được sản phẩm"
  )
  return { list: parseList(res.message), total: Number(res.content) || 0 }
}

// Sản phẩm KH đã đặt gần đây: thêm slLanTruoc (số lượng lần đặt gần nhất), soLanMua, ngayMua (yyyy-mm-dd)
export const getSPMuaLai = async (userId, top = 12) => {
  if (!userId) return []
  const res = await callApi(
    "khachhang/getSPMuaLai",
    { userId: userId + "", top },
    "Không tải được sản phẩm mua lại"
  )
  return parseList(res.message)
}
