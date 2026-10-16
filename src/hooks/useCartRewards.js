import { useEffect, useMemo, useState } from "react"
import { zmp } from "zmp-framework/react"
import { getTraThuong, tinhTichLuy } from "../services/rewardService"

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

const ymd = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const showDialog = (msg) =>
  zmp.dialog.create({ title: "Thông báo", content: '<div class="dialog-text">' + msg + "</div>", buttons: [{ text: "Đóng" }] }).open()

// Tiền thưởng tích lũy áp trên đơn của 1 chương trình (giống app sale: tienConDuocAp ?? thuong)
export const tienTichLuy = (tl) => num(tl?.tienConDuocAp ?? tl?.thuong)
// Chương trình đã áp hết tiền thưởng thì không chọn được nữa
export const tlChonDuoc = (tl) => tl?.tienConDuocAp === undefined || tl?.tienConDuocAp === null || num(tl.tienConDuocAp) > 0

// Loại trả thưởng: 1 trả quà (đính kèm đơn), 3 cấn tiền (trừ vào đơn), 5 quy đổi sản phẩm
export const LOAI_TRA_THUONG = {
  1: { label: "Trả quà", tone: "warning" },
  3: { label: "Cấn tiền", tone: "success" },
  5: { label: "Quy đổi", tone: "info" },
}

/**
 * Thưởng tích lũy (TinhThuongTichLuyTrenDon_App) và phiếu trả thưởng (getTrathuongByKH) trên đơn giỏ hàng.
 * Giỏ hàng thay đổi thì bỏ các lựa chọn (giống app sale tính lại khi đổi sản phẩm).
 */
export const useCartRewards = (CusInfo, Giohangx, dhId = "") => {
  const khId = CusInfo?.KHACHHANG_fk

  const [tlList, setTlList] = useState([])
  const [tlChon, setTlChon] = useState([])
  const [loadingTL, setLoadingTL] = useState(false)
  const [showTL, setShowTL] = useState(false)

  const [ttList, setTtList] = useState([])
  const [ttChon, setTtChon] = useState([]) // [{ trathuongId, loaitrathuong, scheme, tientrathuong?, sanpham? }]
  const [loadingTT, setLoadingTT] = useState(false)
  const [showTT, setShowTT] = useState(false)

  const cartKey = (Giohangx || []).map((s) => `${s.id}:${s.soluong}`).join(",")
  useEffect(() => {
    setTlChon([])
    setTtChon([])
    setTlList([])
  }, [cartKey])

  const tienTL = useMemo(() => tlChon.reduce((t, x) => t + tienTichLuy(x), 0), [tlChon])
  const tienCanTru = useMemo(
    () => ttChon.reduce((t, x) => t + (x.loaitrathuong == 3 ? num(x.tientrathuong) : 0), 0),
    [ttChon]
  )

  const moTichLuy = async () => {
    if (!khId) return showDialog("Vui lòng đồng bộ thông tin khách hàng")
    const sanpham = (Giohangx || [])
      .filter((s) => s.id && !s.Scheme && num(s.soluong) > 0)
      .map((s) => ({
        id: s.id,
        ma: s.ma,
        soluong: s.soluong,
        dongia: s.dongia * (1 - ((s.chietkhauKM ?? 0) / 100.0 + (s.nhomCkGam ?? 0) / 100.0)),
      }))
    if (!sanpham.length) return showDialog("Giỏ hàng chưa có sản phẩm")
    setLoadingTL(true)
    try {
      const list = await tinhTichLuy(khId, sanpham, ymd(), dhId)
      if (!list.length) return showDialog("Không có thưởng tích lũy nào áp dụng cho đơn hàng này")
      // giữ lựa chọn cũ theo chương trình + kỳ
      const key = (x) => `${x.thuongtl_fk}_${x.tuNgay}_${x.denNgay}`
      const da = new Set(tlChon.map(key))
      setTlList(list.map((x) => ({ ...x, isselect: da.has(key(x)) })))
      setShowTL(true)
    } catch (e) {
      showDialog(e.message || "Không tính được thưởng tích lũy")
    } finally {
      setLoadingTL(false)
    }
  }

  const moTraThuong = async () => {
    if (!khId) return showDialog("Vui lòng đồng bộ thông tin khách hàng")
    setLoadingTT(true)
    try {
      const list = (await getTraThuong(khId, ymd(), dhId)).filter(
        // trả quà / quy đổi phải có danh sách sản phẩm
        (x) => !(x.loaitrathuong == 1 || x.loaitrathuong == 5) || (x.listChitiet || []).length > 0
      )
      if (!list.length) return showDialog("Bạn chưa có phiếu trả thưởng nào dùng được cho đơn hàng")
      setTtList(list)
      setShowTT(true)
    } catch (e) {
      showDialog(e.message || "Không lấy được phiếu trả thưởng")
    } finally {
      setLoadingTT(false)
    }
  }

  const boTichLuy = (tl) => setTlChon((l) => l.filter((x) => x !== tl))
  const boTraThuong = (tt) => setTtChon((l) => l.filter((x) => x !== tt))

  // Dữ liệu gửi kèm khi lưu đơn (giống saveDonHang app sale)
  const savePayload = () => {
    const dsTichluyStr = tlChon
      .map((x) => x.duyetkm_fk ?? x.duyetKm_fk)
      .filter((id) => id != null && id != 0)
      .join(",")
    const strTraThuong = ttChon
      .map((x) => {
        if (x.loaitrathuong == 1 || x.loaitrathuong == 5) {
          const sp = (x.sanpham || []).map((s) => `${s.sanpham_fk}@${s.soluong}@${s.dongia}`).join("|")
          return `${x.loaitrathuong}_${x.trathuongId}_0_${sp}`
        }
        return `${x.loaitrathuong}_${x.trathuongId}_${x.tientrathuong}`
      })
      .join(";")
    return {
      dsTichluyStr,
      dsTichluyStr_JSON: tlChon.length ? encodeURIComponent(JSON.stringify(tlChon)) : "",
      strTraThuong,
    }
  }

  return {
    tlList,
    tlChon,
    setTlChon,
    loadingTL,
    showTL,
    setShowTL,
    moTichLuy,
    boTichLuy,
    tienTL,

    ttList,
    ttChon,
    setTtChon,
    loadingTT,
    showTT,
    setShowTT,
    moTraThuong,
    boTraThuong,
    tienCanTru,

    tienThuong: tienTL + tienCanTru,
    savePayload,
  }
}
