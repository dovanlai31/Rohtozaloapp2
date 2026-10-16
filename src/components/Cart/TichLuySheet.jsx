import { useEffect, useState } from "react"
import { Sheet } from "zmp-ui"
import { MdCheck, MdDateRange } from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import { Button } from "@components/ui"
import { useHideMainNav } from "../../hooks/useHideMainNav"
import { tienTichLuy, tlChonDuoc } from "../../hooks/useCartRewards"

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
const money = (n) => `${formatCurrency(num(n), true)} ₫`
const pct = (n) => `${num(n).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`
const dmy = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s || ""
}

const Stat = ({ label, value, strong }) => (
  <div className="min-w-0">
    <div className="truncate text-[10px] text-slate-500">{label}</div>
    <div className={`truncate text-[12px] font-semibold tabular-nums ${strong || "text-slate-700"}`}>{value}</div>
  </div>
)

// Thanh tỷ lệ đạt / khoán, tô vùng mức thưởng đạt được (giống app sale)
const Progress = ({ item }) => {
  const value = num(item.giaTriXetMuc)
  const tu = num(item.tuMuc)
  const den = num(item.denMuc)
  const max = Math.max(100, value, den)
  const w = (v) => `${Math.min(100, (v / max) * 100)}%`
  return (
    <div className="mt-2.5">
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="text-slate-500">Tỷ lệ đạt / khoán</span>
        <span className="text-[13px] font-bold tabular-nums text-primary">{pct(value)}</span>
      </div>
      <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-[#edf1f7]">
        {den > tu && <div className="absolute inset-y-0 bg-[#cfe7d9]" style={{ left: w(tu), width: w(den - tu) }} />}
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: w(value) }} />
      </div>
      {(tu > 0 || den > 0) && (
        <div className="mt-0.5 text-[10px] text-slate-400">
          Mức thưởng {pct(tu)} – {pct(den)}
          {num(item.phanVuot) > 0 ? ` · vượt ${pct(item.phanVuot)}` : ""}
        </div>
      )}
    </div>
  )
}

/** Bảng chọn thưởng tích lũy áp vào đơn (TinhThuongTichLuyTrenDon_App) */
const TichLuySheet = ({ visible, list, onClose, onApply }) => {
  const [items, setItems] = useState([])
  useHideMainNav(visible)
  useEffect(() => {
    if (visible) setItems((list || []).map((x) => ({ ...x })))
  }, [visible, list])

  const toggle = (i) => {
    if (!tlChonDuoc(items[i])) return
    setItems(items.map((x, j) => (j === i ? { ...x, isselect: !x.isselect } : x)))
  }
  const chonDuoc = items.filter(tlChonDuoc)
  const tatCa = chonDuoc.length > 0 && chonDuoc.every((x) => x.isselect)
  const toggleAll = () => setItems(items.map((x) => (tlChonDuoc(x) ? { ...x, isselect: !tatCa } : x)))
  const chon = items.filter((x) => x.isselect)
  const tong = chon.reduce((t, x) => t + tienTichLuy(x), 0)

  return (
    <Sheet visible={visible} onClose={onClose} mask handler swipeToClose title="Thưởng tích lũy trên đơn">
      <div className="flex flex-col px-4" style={{ maxHeight: "80vh" }}>
        <div className="mb-2 flex items-center justify-between text-[12px] text-slate-500">
          <span>{items.length} chương trình đạt mức thưởng</span>
          {chonDuoc.length > 1 && (
            <button type="button" onClick={toggleAll} className="w-auto border-0 bg-transparent p-0 text-[12px] font-semibold text-primary">
              {tatCa ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
          )}
        </div>

        <div className="-mx-4 flex-1 overflow-y-auto px-4">
          {items.map((item, i) => {
            const on = !!item.isselect
            const duoc = tlChonDuoc(item)
            return (
              <div
                key={`${item.thuongtl_fk}_${item.tuNgay}_${i}`}
                role="button"
                tabIndex={0}
                onClick={() => toggle(i)}
                className={`mb-2 rounded-xl border px-3 py-2.5 ${
                  on ? "border-primary bg-[#f7faff]" : "border-[#E3EBF6] bg-white"
                } ${duoc ? "" : "opacity-60"}`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      on ? "border-primary bg-primary text-white" : "border-[#c5d3e6] bg-white text-transparent"
                    }`}
                  >
                    <MdCheck size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold leading-snug text-slate-700">{item.dienGiai || item.diengiai || item.scheme}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400">
                      {item.scheme && <span>{item.scheme}</span>}
                      {item.tuNgay && (
                        <span className="flex items-center gap-0.5">
                          <MdDateRange size={12} /> {dmy(item.tuNgay)} – {dmy(item.denNgay)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Progress item={item} />

                <div className="mt-2 grid gap-2 rounded-lg bg-[#f7f9fc] px-2.5 py-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <Stat label="Doanh số khoán" value={money(item.doanhsokhoan)} />
                  <Stat label="Doanh số đạt" value={money(item.doanhsodat)} strong="text-primary" />
                  <Stat label="DT trước đơn này" value={money(item.doanhThuLichSu)} />
                  <Stat label="DT đơn hiện tại" value={money(item.doanhThuDonHienTai)} />
                </div>

                {(item.trakhuyenmai || []).map((km, k) => (
                  <div key={k} className="mt-1.5 flex items-start justify-between gap-2 text-[12px] text-slate-500">
                    <span className="min-w-0">• {km.diengiai}</span>
                    {num(km.tongtien) > 0 && <span className="shrink-0 font-semibold tabular-nums text-slate-700">{money(km.tongtien)}</span>}
                  </div>
                ))}

                <div className="mt-2 flex items-end justify-between gap-2 border-t border-dashed border-[#e3ebf6] pt-2">
                  <div className="text-[11px] text-slate-500">
                    <div>Thưởng được hưởng: {money(item.tongThuongDuocHuong ?? item.thuong)}</div>
                    {num(item.tongTienDaAp) > 0 && <div>Đã áp trên đơn khác: {money(item.tongTienDaAp)}</div>}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] text-slate-500">{duoc ? "Áp vào đơn này" : "Đã áp hết"}</div>
                    <div className="text-[15px] font-bold tabular-nums text-[#1f8a4c]">{money(tienTichLuy(item))}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-3 pt-2" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-slate-500">Đã chọn {chon.length} chương trình</div>
            <div className="text-[16px] font-bold tabular-nums text-[#1f8a4c]">-{money(tong)}</div>
          </div>
          <Button className="flex-1" onClick={() => onApply(chon)}>
            Áp dụng
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

export default TichLuySheet
