import { useEffect, useState } from "react"
import { Sheet } from "zmp-ui"
import { MdArrowDownward, MdArrowUpward, MdCheck, MdVerticalAlignTop } from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import { Button } from "@components/ui"
import { useHideMainNav } from "../../hooks/useHideMainNav"

const money = (n) => `${formatCurrency(Number(n) || 0, true)} ₫`

// Nhóm "ontop": trong cùng một nhóm chỉ được chọn 1 chương trình (giống app sale)
const ontopKey = (p) => {
  const g = p?.nhomOntopKhuyenMaiFk
  return g === undefined || g === null || g === "" || g == 0 ? null : String(g)
}

// Mặc định chọn tất cả, riêng nhóm ontop chỉ giữ chương trình đứng đầu
const initSelection = (list) => {
  const seen = {}
  return list.map((p) => {
    const g = ontopKey(p)
    p = { ...p, trakhuyenmai: (p.trakhuyenmai || []).map((t) => ({ ...t })) }
    if (!g) return { ...p, boChon: false }
    const keep = !seen[g]
    seen[g] = true
    return { ...p, boChon: !keep }
  })
}

/**
 * Bảng xếp thứ tự ưu tiên khuyến mãi (luồng thủ công).
 * promotions: danh sách chương trình thỏa điều kiện (bước dieuchinh = 0), đã xếp mặc định theo giá trị.
 * onConfirm(list): list theo thứ tự người dùng xếp, mỗi phần tử có boChon = true nếu bỏ chọn.
 */
const KmSortSheet = ({ visible, promotions, onClose, onConfirm }) => {
  const [list, setList] = useState([])
  useHideMainNav(visible)

  useEffect(() => {
    if (visible) setList(initSelection(promotions || []))
  }, [visible, promotions])

  const move = (from, to) => {
    if (to < 0 || to >= list.length || from === to) return
    const next = list.slice()
    const [m] = next.splice(from, 1)
    next.splice(to, 0, m)
    setList(next)
  }

  const toggle = (idx) => {
    const p = list[idx]
    const g = ontopKey(p)
    if (!g) {
      setList(list.map((x, i) => (i === idx ? { ...x, boChon: !x.boChon } : x)))
      return
    }
    if (!p.boChon) return // trong nhóm ontop luôn phải có 1 chương trình được chọn
    setList(list.map((x) => (ontopKey(x) === g ? { ...x, boChon: x !== p } : x)))
  }

  // Chọn phương án trả trong 1 chương trình (giống chonTraKM app sale):
  // dòng AND (pheptoan = 1) luôn áp dụng; chọn 1 dòng OR thì bỏ các dòng OR khác (cùng mức nếu có tumuc/denmuc)
  const toggleTkm = (idx, k) => {
    const p = list[idx]
    const t = p.trakhuyenmai[k]
    if (t.pheptoan == 1 || t.chontkm) return
    const coMuc = t.tumuc !== undefined && t.denmuc !== undefined
    const trakhuyenmai = p.trakhuyenmai.map((x, j) => {
      if (j === k) return { ...x, chontkm: true }
      if (x.pheptoan == 1) return x
      if (coMuc && (x.tumuc != t.tumuc || x.denmuc != t.denmuc)) return x
      return { ...x, chontkm: false }
    })
    setList(list.map((x, i) => (i === idx ? { ...x, trakhuyenmai } : x)))
  }

  const soChon = list.filter((p) => !p.boChon).length

  const arrowBtn =
    "flex h-7 w-7 items-center justify-center rounded-full border border-[#d5e2f2] bg-white p-0 text-primary disabled:opacity-30"

  return (
    <Sheet visible={visible} onClose={onClose} mask handler swipeToClose title="Thứ tự ưu tiên khuyến mãi">
      <div className="flex flex-col px-4" style={{ maxHeight: "78vh" }}>
        <div className="mb-2 text-[12px] leading-snug text-slate-500">
          Chương trình ở trên được ưu tiên áp dụng trước. Dùng mũi tên để đổi thứ tự, bấm vào ô chọn để bỏ chương
          trình không muốn áp dụng.
        </div>

        <div className="-mx-4 flex-1 overflow-y-auto px-4">
          {list.map((p, idx) => {
            const on = !p.boChon
            const g = ontopKey(p)
            const traList = p.trakhuyenmai || []
            const coOr = traList.length > 1 && traList.some((t) => t.pheptoan != 1)
            return (
              <div
                key={p.id || p.scheme || idx}
                className={`mb-2 rounded-xl border px-3 py-2.5 ${
                  on ? "border-[#cfe0f5] bg-white" : "border-[#edf0f5] bg-[#f7f9fc]"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    aria-label={on ? "Bỏ chọn khuyến mãi" : "Chọn khuyến mãi"}
                    onClick={() => toggle(idx)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border p-0 ${
                      on ? "border-primary bg-primary text-white" : "border-[#c5d3e6] bg-white text-transparent"
                    }`}
                  >
                    <MdCheck size={14} />
                  </button>

                  <div className={`min-w-0 flex-1 ${on ? "" : "opacity-60"}`}>
                    <div className="flex items-start gap-1.5">
                      <span className="mt-[1px] shrink-0 rounded bg-[#e7effa] px-1.5 text-[11px] font-bold tabular-nums text-primary">
                        {idx + 1}
                      </span>
                      <span className="text-[13px] font-semibold leading-snug text-slate-700" style={{ overflowWrap: "anywhere" }}>
                        {p.diengiai || p.scheme}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400">
                      <span>{p.scheme}</span>
                      {g && <span className="rounded bg-[#fdf1dc] px-1.5 text-[#9a5a00]">Chỉ chọn 1 trong nhóm</span>}
                    </div>
                    {coOr && <div className="mt-1 text-[11px] text-slate-400">Chọn 1 phương án trả:</div>}
                    {traList.map((t, k) =>
                      coOr && t.pheptoan != 1 ? (
                        <button
                          key={k}
                          type="button"
                          onClick={() => toggleTkm(idx, k)}
                          className={`mt-1 flex w-full items-start gap-2 rounded-lg border px-2 py-1.5 text-left ${
                            t.chontkm ? "border-primary bg-[#f3f8fd]" : "border-[#e3ebf6] bg-white"
                          }`}
                        >
                          <span
                            className={`mt-[2px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                              t.chontkm ? "border-primary" : "border-[#c5d3e6]"
                            }`}
                          >
                            {t.chontkm && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </span>
                          <span className="min-w-0 text-[12px] leading-snug text-slate-600">{t.diengiai}</span>
                        </button>
                      ) : (
                        <div key={k} className="mt-1 text-[12px] leading-snug text-slate-500">
                          • {t.diengiai}
                          {coOr && <span className="ml-1 text-[10px] font-semibold text-primary">(luôn áp dụng)</span>}
                        </div>
                      )
                    )}
                    {Number(p.tongtienTungkm) > 0 && (
                      <div className="mt-1 text-[12px] text-slate-500">
                        Giá trị ước tính <b className="tabular-nums text-[#1f8a4c]">{money(p.tongtienTungkm)}</b>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" aria-label="Lên đầu" disabled={idx === 0} onClick={() => move(idx, 0)} className={arrowBtn}>
                      <MdVerticalAlignTop size={15} />
                    </button>
                    <button type="button" aria-label="Lên" disabled={idx === 0} onClick={() => move(idx, idx - 1)} className={arrowBtn}>
                      <MdArrowUpward size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Xuống"
                      disabled={idx === list.length - 1}
                      onClick={() => move(idx, idx + 1)}
                      className={arrowBtn}
                    >
                      <MdArrowDownward size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-2 pt-2" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
          <Button variant="ghost" className="flex-1" onClick={() => setList(initSelection(promotions || []))}>
            Mặc định
          </Button>
          <Button className="flex-[2]" onClick={() => onConfirm(list)}>
            Tính khuyến mãi ({soChon}/{list.length})
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

export default KmSortSheet
