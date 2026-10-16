import { useEffect, useState } from "react"
import { MdClose, MdDateRange } from "react-icons/md"
import { Sheet } from "zmp-ui"
import { Button } from "@components/ui"

// Ngày dạng "yyyy-mm-dd" theo giờ máy (không dùng toISOString để tránh lệch múi giờ)
const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const dmy = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ""
}

// Các mốc chọn nhanh
const PRESETS = [
  { key: "all", label: "Tất cả" },
  { key: "7", label: "7 ngày" },
  { key: "30", label: "30 ngày" },
  { key: "month", label: "Tháng này" },
  { key: "lastmonth", label: "Tháng trước" },
]

const rangeOf = (key) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (key === "7" || key === "30") {
    const from = new Date(today)
    from.setDate(from.getDate() - (Number(key) - 1))
    return { from: ymd(from), to: ymd(today) }
  }
  if (key === "month") return { from: ymd(new Date(today.getFullYear(), today.getMonth(), 1)), to: ymd(today) }
  if (key === "lastmonth")
    return {
      from: ymd(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
      to: ymd(new Date(today.getFullYear(), today.getMonth(), 0)),
    }
  return { from: "", to: "" }
}

const dateInputStyle = { border: "none", boxShadow: "none", borderRadius: 0, padding: 0, background: "transparent", outline: "none" }

/**
 * Bộ lọc thời gian: chip chọn nhanh + "Tùy chọn" mở bảng chọn từ ngày – đến ngày.
 * value: { from: "yyyy-mm-dd" | "", to: "yyyy-mm-dd" | "" }
 */
const DateRangeFilter = ({ value, onChange, className = "" }) => {
  const [preset, setPreset] = useState(value?.from || value?.to ? "custom" : "all")
  const [sheet, setSheet] = useState(false)
  const [draft, setDraft] = useState({ from: value?.from || "", to: value?.to || "" })

  // Đồng bộ khi giá trị được đặt từ ngoài (vd. mở từ trang Doanh số)
  useEffect(() => {
    if ((value?.from || value?.to) && preset === "all") setPreset("custom")
  }, [value?.from, value?.to])

  const pick = (key) => {
    setPreset(key)
    onChange(rangeOf(key))
  }

  const openCustom = () => {
    setDraft({ from: value?.from || "", to: value?.to || "" })
    setSheet(true)
  }

  const applyCustom = () => {
    let { from, to } = draft
    if (from && to && from > to) [from, to] = [to, from]
    setPreset(from || to ? "custom" : "all")
    onChange({ from, to })
    setSheet(false)
  }

  const chip = (active) =>
    `w-auto shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
      active ? "border-primary bg-primary text-white" : "border-[#d5e2f2] bg-white text-slate-600"
    }`

  const customLabel = preset === "custom" ? [dmy(value?.from) || "…", dmy(value?.to) || "…"].join(" – ") : "Tùy chọn"

  return (
    <>
      <div className={`flex gap-1.5 overflow-x-auto p-2 ${className}`}>
        {PRESETS.map((p) => (
          <button key={p.key} type="button" onClick={() => pick(p.key)} className={chip(preset === p.key)}>
            {p.label}
          </button>
        ))}
        <span className={`${chip(preset === "custom")} flex items-center gap-1 !pr-1.5`}>
          <button type="button" onClick={openCustom} className="flex w-auto items-center gap-1 border-0 bg-transparent p-0 text-inherit">
            <MdDateRange size={14} />
            {customLabel}
          </button>
          {preset === "custom" && (
            <button
              type="button"
              aria-label="Bỏ lọc thời gian"
              onClick={() => pick("all")}
              className="flex h-5 w-5 items-center justify-center rounded-full border-0 bg-white/25 p-0 text-inherit"
            >
              <MdClose size={12} />
            </button>
          )}
        </span>
      </div>

      <Sheet visible={sheet} onClose={() => setSheet(false)} mask handler swipeToClose title="Chọn khoảng thời gian">
        <div className="flex flex-col gap-3 px-4 pb-5">
          {[
            ["from", "Từ ngày"],
            ["to", "Đến ngày"],
          ].map(([k, label]) => (
            <label key={k} className="block">
              <span className="mb-1 block text-[12px] text-slate-500">{label}</span>
              <span className="flex h-11 items-center rounded-xl border border-[#E3EBF6] bg-[#f5f7fb] px-3 focus-within:border-primary focus-within:bg-white">
                <input
                  type="date"
                  value={draft[k]}
                  onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                  className="h-full w-full text-[14px] text-slate-700"
                  style={dateInputStyle}
                />
              </span>
            </label>
          ))}
          <div className="mt-1 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setDraft({ from: "", to: "" })}>
              Xoá
            </Button>
            <Button className="flex-1" onClick={applyCustom}>
              Áp dụng
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  )
}

export default DateRangeFilter
