// Gom nhãn hàng từ danh mục trong store (jsonNHANHANG), bỏ trùng theo PK_SEQ
export const collectBrands = (categories) => {
  const map = new Map()
  ;(categories || []).forEach((c) => {
    let list = []
    try {
      list = JSON.parse(c?.jsonNHANHANG || "[]")
    } catch (e) {}
    ;(Array.isArray(list) ? list : []).forEach((b) => {
      if (b?.PK_SEQ && !map.has(b.PK_SEQ)) map.set(b.PK_SEQ, { id: b.PK_SEQ + "", ten: b.TEN || "", hinhAnh: b.HINHANH || "" })
    })
  })
  return Array.from(map.values())
}
