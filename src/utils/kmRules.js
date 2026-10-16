// Quy tắc trả khuyến mãi theo dữ liệu API web (api/XLKhuyenmai/Apkhuyenmai), làm giống app sale (RohtoSalesup/modules/Sales)

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

// Sản phẩm trả còn tồn (API không trả tồn kho thì coi như còn)
export const conTon = (sp) => sp?.tonkho === undefined || sp?.tonkho === null || num(sp.tonkho) > 0

// Tổng số lượng được hưởng của một dòng trả sản phẩm
export const quotaOf = (tkm, pro) => num(tkm?.tongluong) * num(pro?.sosuat)

/**
 * Dòng trả cho phép người dùng chọn sản phẩm theo giá trị tối đa (mở bảng chọn quà):
 *  - IS_TRASP_HanMucTien = 1: quà theo hạn mức tiền (HanMucTien × số suất)
 *  - istratienbysanpham = 1: trả tiền bằng sản phẩm (tongtien × số suất)
 *  - tongdiem > 0: đổi theo điểm
 * Trả về null nếu không phải loại chọn quà.
 */
export const chooserInfo = (tkm, pro) => {
  const sosuat = Math.max(1, num(pro?.sosuat))
  if (tkm?.IS_TRASP_HanMucTien == 1)
    return { kind: "hanmuc", max: num(tkm.HanMucTien) * sosuat, price: (sp) => num(sp.gia ?? sp.dongia), unit: "₫" }
  if (tkm?.istratienbysanpham == 1)
    return { kind: "tien", max: num(tkm.tongtien) * sosuat, price: (sp) => num(sp.dongia ?? sp.gia), unit: "₫" }
  if (num(tkm?.tongdiem) > 0) return { kind: "diem", max: num(tkm.tongdiem), price: (sp) => num(sp.diem), unit: "điểm" }
  return null
}

// "Bất kỳ trong" có cho chọn sản phẩm: người dùng tự chia tổng số lượng được hưởng cho các sản phẩm
export const chiaSoLuong = (tkm, pro) =>
  (tkm?.loai == 3 || tkm?.loai == 5) && tkm?.hinhthuc == 2 && pro?.chonSp == 1 && !chooserInfo(tkm, pro)

// Dòng trả bằng sản phẩm (không cộng tiền khuyến mãi vào tổng)
export const traBangSanPham = (tkm, pro) => tkm?.loai == 3 || tkm?.loai == 5 || !!chooserInfo(tkm, pro)
