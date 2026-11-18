import { useEffect, useMemo, useRef, useState } from "react"
import { useStore, zmp } from "zmp-framework/react"
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

// Loại trả thưởng: 1 trả quà (đính kèm đơn; hinhthuc_sp = 2 khách chọn SP), 3 cấn tiền (trừ vào đơn),
// 5 quy đổi sản phẩm, 7 chiết khấu % trên tổng đơn, 8 chiết khấu % theo sản phẩm (phiếu E-learning / vòng quay)
export const LOAI_TRA_THUONG = {
  1: { label: "Trả quà", tone: "warning" },
  3: { label: "Cấn tiền", tone: "success" },
  5: { label: "Quy đổi", tone: "info" },
  7: { label: "Chiết khấu", tone: "success" },
  8: { label: "CK theo SP", tone: "success" },
}

// Phiếu được quy ra tiền trừ vào đơn
export const laTruTien = (loai) => [3, 7, 8].includes(Number(loai))
// Phiếu quà cho khách chọn sản phẩm ("Bất kỳ trong", tổng số lượng <= tongluong)
export const laQuaChon = (ct) => Number(ct?.loaitrathuong) === 1 && Number(ct?.hinhthuc_sp) === 2

// Tiền giảm của phiếu chiết khấu (giống tinhTienChietKhau app sale):
// 7 = % x tổng đơn; 8 = tổng (% x thành tiền các sản phẩm của phiếu có trong đơn)
export const tienChietKhau = (ct, tongDon, dongHang) => {
  if (Number(ct?.loaitrathuong) === 7) return Math.round((num(ct.chietkhau) * num(tongDon)) / 100)
  if (Number(ct?.loaitrathuong) === 8) {
    const ckMa = {}
    const ckId = {}
    ;(ct.listChitiet || []).forEach((i) => {
      if (i.masp) ckMa[String(i.masp)] = num(i.chietkhau)
      if (i.sanpham_fk != null) ckId[String(i.sanpham_fk)] = num(i.chietkhau)
    })
    return Math.round(
      (dongHang || []).reduce((t, d) => t + ((ckMa[d.masp] ?? ckId[d.sanpham_fk] ?? 0) * d.thanhtien) / 100, 0)
    )
  }
  return 0
}

// Dòng trả thưởng của đơn (getThongTinDonHang.TraThuong) -> lựa chọn phiếu trong giỏ (cùng dạng TraThuongSheet.onApply)
const phieuCuaDon = (rows) => {
  const theoPhieu = new Map()
  ;(rows || []).forEach((r) => {
    const id = r.trathuongId
    if (!id) return
    if (!theoPhieu.has(id)) {
      theoPhieu.set(id, {
        scheme: r.sophieu || String(id),
        loaitrathuong: Number(r.loaitrathuong) || 3,
        hinhthuc_sp: Number(r.hinhthuc_sp) || 1,
        trathuongId: id,
        tientrathuong: 0,
        sanpham: [],
      })
    }
    const p = theoPhieu.get(id)
    if (r.sanpham_fk && num(r.soluong) > 0) {
      p.sanpham.push({ sanpham_fk: r.sanpham_fk, masp: r.masp, tensp: r.tensp, soluong: num(r.soluong), dongia: num(r.dongia) })
    } else p.tientrathuong += num(r.tonggiatri)
  })

  const ds = []
  theoPhieu.forEach(({ hinhthuc_sp, tientrathuong, sanpham, ...p }) => {
    if (p.loaitrathuong == 1 || p.loaitrathuong == 5) {
      // quà / quy đổi: giữ sản phẩm + số lượng đã chọn (quà "Bất kỳ trong" mở lại sheet với số lượng cũ)
      if (sanpham.length) ds.push({ ...p, sanpham, ...(p.loaitrathuong == 1 && hinhthuc_sp === 2 ? { quaChon: true } : {}) })
    } else if (tientrathuong > 0) {
      // cấn tiền / chiết khấu: số tiền đã trừ trên đơn
      ds.push({ ...p, tientrathuong })
    }
  })
  return ds
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

  // Phiếu trả thưởng đã áp trên đơn đang sửa (capnhatdonhang -> setDhDangSua)
  const ttDangSua = useStore("ttDangSua")
  const daDoiPhieu = useRef(false) // khách đã tự chọn / bỏ phiếu: không tự chọn lại phiếu của đơn
  useEffect(() => {
    daDoiPhieu.current = false
  }, [dhId])

  const cartKey = (Giohangx || []).map((s) => `${s.id}:${s.soluong}`).join(",")
  useEffect(() => {
    setTlChon([])
    setTlList([])
    setTtChon(dhId && !daDoiPhieu.current ? phieuCuaDon(ttDangSua) : [])
  }, [cartKey, dhId, ttDangSua])

  const tienTL = useMemo(() => tlChon.reduce((t, x) => t + tienTichLuy(x), 0), [tlChon])
  const tienCanTru = useMemo(
    () => ttChon.reduce((t, x) => t + (laTruTien(x.loaitrathuong) ? num(x.tientrathuong) : 0), 0),
    [ttChon]
  )

  // Dòng hàng bán trong đơn (bỏ dòng khuyến mãi) để tính phiếu chiết khấu theo sản phẩm
  const dongHang = useMemo(
    () =>
      (Giohangx || [])
        .filter((s) => s.id && !s.Scheme && num(s.soluong) > 0)
        .map((s) => ({
          masp: String(s.ma ?? ""),
          sanpham_fk: String(s.id),
          thanhtien: num(s.soluong) * num(s.dongia) * (1 - (num(s.chietkhauKM) + num(s.nhomCkGam)) / 100.0),
        })),
    [cartKey]
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
        // trả quà / quy đổi / chiết khấu theo SP phải có danh sách sản phẩm
        (x) => ![1, 5, 8].includes(Number(x.loaitrathuong)) || (x.listChitiet || []).length > 0
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
  const boTraThuong = (tt) => {
    daDoiPhieu.current = true
    setTtChon((l) => l.filter((x) => x !== tt))
  }
  const chonTraThuong = (list) => {
    daDoiPhieu.current = true
    setTtChon(list)
  }

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
        // chiết khấu (7, 8) quy ra tiền, gửi như cấn tiền (giống app sale)
        return `3_${x.trathuongId}_${x.tientrathuong}`
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
    setTtChon: chonTraThuong,
    loadingTT,
    showTT,
    setShowTT,
    moTraThuong,
    boTraThuong,
    tienCanTru,
    dongHang,

    tienThuong: tienTL + tienCanTru,
    savePayload,
  }
}
