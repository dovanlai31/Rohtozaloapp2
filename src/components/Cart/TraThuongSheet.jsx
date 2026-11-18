import { useEffect, useState } from "react"
import { zmp } from "zmp-framework/react"
import { Sheet } from "zmp-ui"
import { MdCheck } from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import { Button, QtyStepper, StatusBadge } from "@components/ui"
import { useHideMainNav } from "../../hooks/useHideMainNav"
import { LOAI_TRA_THUONG, laQuaChon, laTruTien, tienChietKhau } from "../../hooks/useCartRewards"

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
const money = (n) => `${formatCurrency(num(n), true)} ₫`
const showDialog = (msg) =>
  zmp.dialog.create({ title: "Thông báo", content: '<div class="dialog-text">' + msg + "</div>", buttons: [{ text: "Đóng" }] }).open()

/**
 * Bảng chọn phiếu trả thưởng dùng cho đơn (giống ViewTraThuong app sale):
 *  - Trả quà (1): tặng kèm toàn bộ sản phẩm của phiếu; "Bất kỳ trong" (hinhthuc_sp 2): khách chọn SP, tổng SL <= tongluong
 *  - Cấn tiền (3): trừ vào đơn, tối đa bằng số tiền đơn còn lại
 *  - Quy đổi (5): chọn sản phẩm, tổng giá trị không vượt số tiền của phiếu
 *  - Chiết khấu (7): % trên tổng đơn; CK theo SP (8): % trên thành tiền các SP của phiếu có trong đơn (quy ra tiền trừ đơn)
 * tongDon: tổng tiền đơn (sau khuyến mãi, thưởng tích lũy) để giới hạn tiền trừ; dongHang: dòng hàng để tính loại 8.
 */
const TraThuongSheet = ({ visible, list, daChon, tongDon, dongHang, onClose, onApply }) => {
  const [chon, setChon] = useState({}) // pk_seq -> true
  const [qd, setQd] = useState({}) // pk_seq -> [{...sp, soluong}]
  useHideMainNav(visible)

  useEffect(() => {
    if (!visible) return
    const c = {}
    const q = {}
    ;(daChon || []).forEach((x) => {
      c[x.trathuongId] = true
      if (x.loaitrathuong == 5 || x.quaChon) q[x.trathuongId] = x.sanpham
    })
    setChon(c)
    setQd(q)
  }, [visible])

  // Sản phẩm khách tự chọn số lượng: quy đổi (có đơn giá) hoặc quà chọn "Bất kỳ trong"
  const spQuyDoi = (ct) =>
    qd[ct.pk_seq] ||
    (ct.listChitiet || []).filter((s) => laQuaChon(ct) || num(s.dongia) > 0).map((s) => ({ ...s, soluong: 0 }))
  const tongQuyDoi = (ct) => spQuyDoi(ct).reduce((t, s) => t + num(s.soluong) * num(s.dongia), 0)
  const tongSLChon = (ct) => spQuyDoi(ct).reduce((t, s) => t + num(s.soluong), 0)

  const doiSoLuong = (ct, idx, v) => {
    const list = spQuyDoi(ct).map((s) => ({ ...s }))
    const sp = list[idx]
    let val = Math.max(0, Number(v) || 0)
    if (sp.tonkho !== undefined && sp.tonkho !== null && val > num(sp.tonkho)) {
      showDialog(`Sản phẩm ${sp.tensp} chỉ còn ${num(sp.tonkho)}`)
      val = num(sp.tonkho)
    }
    sp.soluong = val
    if (laQuaChon(ct)) {
      if (list.reduce((t, s) => t + num(s.soluong), 0) > num(ct.tongluong)) {
        showDialog(`Phiếu chỉ được chọn tối đa ${num(ct.tongluong)} sản phẩm`)
        return
      }
    } else if (list.reduce((t, s) => t + num(s.soluong) * num(s.dongia), 0) > num(ct.tongtien)) {
      showDialog("Giá trị sản phẩm quy đổi vượt quá số tiền của phiếu")
      return
    }
    setQd({ ...qd, [ct.pk_seq]: list })
  }

  // Phiếu trừ tiền (cấn tiền, chiết khấu) lần lượt theo thứ tự phiếu, mỗi phiếu tối đa bằng tiền đơn còn lại
  const canTien = {}
  let conLai = num(tongDon)
  ;(list || []).forEach((ct) => {
    if (laTruTien(ct.loaitrathuong) && chon[ct.pk_seq]) {
      const giaTri = ct.loaitrathuong == 3 ? num(ct.tongtien) : tienChietKhau(ct, tongDon, dongHang)
      canTien[ct.pk_seq] = Math.max(0, Math.min(giaTri, conLai))
      conLai -= canTien[ct.pk_seq]
    }
  })
  const tongCan = Object.values(canTien).reduce((t, v) => t + v, 0)
  const soChon = Object.keys(chon).filter((k) => chon[k]).length

  const apDung = () => {
    const result = []
    for (const ct of list || []) {
      if (!chon[ct.pk_seq]) continue
      if (laQuaChon(ct)) {
        const sp = spQuyDoi(ct).filter((s) => num(s.soluong) > 0)
        if (!sp.length) return showDialog(`Phiếu ${ct.scheme}: vui lòng chọn sản phẩm quà tặng`)
        result.push({ scheme: ct.scheme, loaitrathuong: 1, trathuongId: ct.pk_seq, quaChon: true, sanpham: sp })
      } else if (ct.loaitrathuong == 1) {
        result.push({
          scheme: ct.scheme,
          loaitrathuong: 1,
          trathuongId: ct.pk_seq,
          sanpham: (ct.listChitiet || []).map((s) => ({ ...s, soluong: s.soluongtra })),
        })
      } else if (laTruTien(ct.loaitrathuong)) {
        if (canTien[ct.pk_seq] <= 0)
          return showDialog(
            ct.loaitrathuong == 8
              ? `Phiếu ${ct.scheme}: đơn hàng chưa có sản phẩm được chiết khấu`
              : `Phiếu ${ct.scheme}: đơn hàng không còn tiền để trừ`
          )
        result.push({
          scheme: ct.scheme,
          loaitrathuong: Number(ct.loaitrathuong),
          trathuongId: ct.pk_seq,
          tientrathuong: canTien[ct.pk_seq],
        })
      } else if (ct.loaitrathuong == 5) {
        const sp = spQuyDoi(ct).filter((s) => num(s.soluong) > 0)
        if (!sp.length) return showDialog(`Phiếu ${ct.scheme}: vui lòng chọn sản phẩm quy đổi`)
        result.push({ scheme: ct.scheme, loaitrathuong: 5, trathuongId: ct.pk_seq, sanpham: sp })
      }
    }
    onApply(result)
  }

  return (
    <Sheet visible={visible} onClose={onClose} mask handler swipeToClose title="Phiếu trả thưởng">
      <div className="flex flex-col px-4" style={{ maxHeight: "80vh" }}>
        <div className="mb-2 text-[12px] text-slate-500">
          Tổng tiền đơn: <b className="tabular-nums text-slate-700">{money(tongDon)}</b>
        </div>

        <div className="-mx-4 flex-1 overflow-y-auto px-4">
          {(list || []).map((ct) => {
            const on = !!chon[ct.pk_seq]
            const loai = LOAI_TRA_THUONG[ct.loaitrathuong] || { label: "Trả thưởng", tone: "neutral" }
            const tongQD = ct.loaitrathuong == 5 ? tongQuyDoi(ct) : 0
            return (
              <div
                key={ct.pk_seq}
                className={`mb-2 rounded-xl border px-3 py-2.5 ${on ? "border-primary bg-[#f7faff]" : "border-[#E3EBF6] bg-white"}`}
              >
                <button
                  type="button"
                  onClick={() => setChon({ ...chon, [ct.pk_seq]: !on })}
                  className="flex w-full items-start gap-2.5 border-0 bg-transparent p-0 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      on ? "border-primary bg-primary text-white" : "border-[#c5d3e6] bg-white text-transparent"
                    }`}
                  >
                    <MdCheck size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-semibold leading-snug text-slate-700">
                        {ct.tencttt || ct.scheme}
                      </span>
                      <StatusBadge tone={loai.tone}>{loai.label}</StatusBadge>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">
                      {[ct.scheme, ct.sophieu].filter(Boolean).join(" · ")}
                    </span>
                    <span className="mt-1.5 flex items-center justify-between text-[12px] text-slate-500">
                      {ct.loaitrathuong == 7 ? (
                        <span>
                          Chiết khấu <b className="tabular-nums text-slate-700">{num(ct.chietkhau)}%</b> trên tổng đơn
                        </span>
                      ) : ct.loaitrathuong == 8 ? (
                        <span>Chiết khấu theo từng sản phẩm</span>
                      ) : laQuaChon(ct) ? (
                        <span>
                          Chọn tối đa <b className="tabular-nums text-slate-700">{num(ct.tongluong)}</b> sản phẩm quà tặng
                        </span>
                      ) : (
                        <span>
                          Giá trị phiếu <b className="tabular-nums text-slate-700">{money(ct.tongtien)}</b>
                        </span>
                      )}
                      {num(ct.tiendadung) > 0 && <span>Đã dùng {money(ct.tiendadung)}</span>}
                    </span>
                  </span>
                </button>

                {/* Chiết khấu (7, 8): tiền được trừ vào đơn */}
                {(ct.loaitrathuong == 7 || ct.loaitrathuong == 8) && (
                  <div className="ml-7 mt-1.5 flex flex-col gap-0.5">
                    {ct.loaitrathuong == 8 &&
                      (ct.listChitiet || []).map((s, k) => (
                        <div key={k} className="flex items-start justify-between gap-2 text-[12px] text-slate-500">
                          <span className="min-w-0">🏷️ {s.tensp}</span>
                          <span className="shrink-0 font-semibold tabular-nums text-slate-700">-{num(s.chietkhau)}%</span>
                        </div>
                      ))}
                    {on && (
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-slate-500">Trừ vào đơn</span>
                        <span className="font-bold tabular-nums text-[#1f8a4c]">-{money(canTien[ct.pk_seq])}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quà chọn "Bất kỳ trong": khách chọn sản phẩm, tổng số lượng <= tongluong */}
                {laQuaChon(ct) && on && (
                  <div className="ml-7 mt-2">
                    <div className="text-[11px] text-slate-500">
                      Đã chọn {tongSLChon(ct)}/{num(ct.tongluong)} sản phẩm
                    </div>
                    {spQuyDoi(ct).map((s, k) => (
                      <div key={s.sanpham_fk || k} className="flex items-center justify-between gap-2 border-b border-[#edf0f5] py-2 last:border-0">
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium leading-snug text-slate-700">🎁 {s.tensp}</div>
                          <div className="text-[11px] text-slate-400">
                            {s.masp}
                            {s.tonkho !== undefined && s.tonkho !== null ? ` · Tồn ${formatCurrency(s.tonkho, true)}` : ""}
                          </div>
                        </div>
                        <QtyStepper value={num(s.soluong)} min={0} onChange={(v) => doiSoLuong(ct, k, v)} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Trả quà: xem danh sách quà tặng kèm */}
                {ct.loaitrathuong == 1 && !laQuaChon(ct) && (
                  <div className="ml-7 mt-1.5 flex flex-col gap-0.5">
                    {(ct.listChitiet || []).map((s, k) => (
                      <div key={k} className="flex items-start justify-between gap-2 text-[12px] text-slate-500">
                        <span className="min-w-0">🎁 {s.tensp}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-slate-700">× {num(s.soluongtra)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cấn tiền (chiết khấu hiện ở khối riêng phía trên) */}
                {ct.loaitrathuong == 3 && on && (
                  <div className="ml-7 mt-1.5 flex items-center justify-between text-[12px]">
                    <span className="text-slate-500">Cấn trừ vào đơn</span>
                    <span className="font-bold tabular-nums text-[#1f8a4c]">-{money(canTien[ct.pk_seq])}</span>
                  </div>
                )}

                {/* Quy đổi: chọn sản phẩm theo giá trị phiếu */}
                {ct.loaitrathuong == 5 && on && (
                  <div className="ml-7 mt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Đã quy đổi {money(tongQD)}</span>
                      <span>Còn {money(num(ct.tongtien) - tongQD)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#edf1f7]">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${num(ct.tongtien) > 0 ? Math.min(100, (tongQD * 100) / num(ct.tongtien)) : 0}%` }}
                      />
                    </div>
                    {spQuyDoi(ct).map((s, k) => (
                      <div key={s.sanpham_fk || k} className="flex items-center justify-between gap-2 border-b border-[#edf0f5] py-2 last:border-0">
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium leading-snug text-slate-700">{s.tensp}</div>
                          <div className="text-[11px] text-slate-400">
                            {s.masp} · {money(s.dongia)}
                            {s.tonkho !== undefined && s.tonkho !== null ? ` · Tồn ${formatCurrency(s.tonkho, true)}` : ""}
                          </div>
                        </div>
                        <QtyStepper value={num(s.soluong)} min={0} onChange={(v) => doiSoLuong(ct, k, v)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-3 pt-2" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-slate-500">Đã chọn {soChon} phiếu</div>
            <div className="text-[16px] font-bold tabular-nums text-[#1f8a4c]">{tongCan > 0 ? `-${money(tongCan)}` : "—"}</div>
          </div>
          <Button className="flex-1" onClick={apDung}>
            Áp dụng
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

export default TraThuongSheet
