import { request } from "@utils/networking"

// E-learning cho khách hàng: mọi API gọi qua 1 endpoint chung của backend mini app (elearning/call),
// backend chuyển sang service sale (WebServiceReact.asmx, các hàm ELN_*). Kết quả service: { ok, msg, data }.
// Thêm API mới chỉ cần khai báo hàm ở service sale rồi gọi callEln ở đây.

const callEln = async (userId, method, data = {}) => {
  const res = await (await request("POST", "elearning/call", { userId: String(userId), method, data })).json()
  if (!res?.result) throw new Error(res?.message || "Không kết nối được máy chủ, vui lòng thử lại")
  let kq
  try {
    kq = JSON.parse(res.message || "{}")
  } catch (e) {
    throw new Error(res.message || "Dữ liệu trả về không hợp lệ")
  }
  if (Number(kq?.ok) !== 1) throw new Error(kq?.msg || "Lỗi hệ thống, vui lòng thử lại")
  return kq.data
}

// { baiKiemTra: [...], baiHoc: [...] }
export const getDanhSachHoc = (khId) => callEln(khId, "ELN_ZMP_DanhSach", { khId })

// Nội dung bài học: { BaiHocID, TenBaiHoc, MoTa, DuongDan, Files: { Loai1, Loai2, Loai3 } }
export const getBaiHoc = (khId, baiHocId) => callEln(khId, "ELN_ZMP_BaiHoc", { khId, baiHocId: String(baiHocId) })

export const hocXong = (khId, baiHocId) => callEln(khId, "ELN_ZMP_HocXong", { khId, baiHocId: String(baiHocId) })

// [{ id, noiDung, loai ("1" một đáp án), hinhAnh, linkUrl, dapAn: [{ id, noiDung }] }]
export const getCauHoi = (khId, baiTapId) => callEln(khId, "ELN_ZMP_CauHoi", { khId, baiTapId: String(baiTapId) })

// cauHoi: danh sách câu hỏi; chon: { [cauHoiId]: [dapAnId] }. Chuỗi gửi lên giống app sale (BaitapKiemtra_save)
export const nopBai = (khId, baiTapId, cauHoi, chon) => {
  const chuoiCauTraLoi = cauHoi.map((q) => `${q.id}_${(chon[q.id] || []).join(",")}`).join(";")
  const chuoiDapAn = cauHoi.map((q) => `${q.id}_${(q.dapAn || []).map((a) => a.id).join("_")}`).join(";")
  return callEln(khId, "ELN_ZMP_NopBai", { khId, baiTapId: String(baiTapId), chuoiCauTraLoi, chuoiDapAn })
}

// Vòng quay may mắn (dùng chung hàm với app sale; userId nhân viên do backend đặt = 0)
// { loaiThuong, laVongQuay, dat, soLuot, daQuay, conLai, dsO: [{ id, thutu, diengiai }], choChon: [...], dsPhieu: [...] }
export const getThongTinThuong = (khId, baiTapId) =>
  callEln(khId, "ELN_VongQuay_ThongTin", { userId: "0", baiTapId: String(baiTapId), khId })

// { ketQuaId, viTri, thutu, diengiai, choChon, dsTrakm, dsPhieu, conLai }
export const quayThuong = (khId, baiTapId) =>
  callEln(khId, "ELN_VongQuay_Quay", { userId: "0", baiTapId: String(baiTapId), khId })

// { dsPhieu }
export const chonQua = (khId, baiTapId, ketQuaId, trakmId) =>
  callEln(khId, "ELN_VongQuay_ChonThuong", {
    userId: "0",
    baiTapId: String(baiTapId),
    khId,
    ketQuaId: String(ketQuaId),
    trakmId: String(trakmId),
  })
