// Danh sách mã thông báo đã đọc, lưu trên máy người dùng (dùng chung cho trang Thông báo và số trên ô Thông báo ở trang chủ)
const READ_KEY = "thongbaoDaDoc"

export const docDaDoc = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]"))
  } catch (e) {
    return new Set()
  }
}

export const luuDaDoc = (set) => {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...set].slice(-300)))
  } catch (e) {}
}

// Số thông báo chưa đọc trong danh sách
export const demChuaDoc = (list) => {
  const daDoc = docDaDoc()
  return (list || []).filter((tb) => !daDoc.has(tb.PK_SEQ)).length
}
