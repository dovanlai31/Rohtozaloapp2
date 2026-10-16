import { zmp } from "zmp-framework/react"
import { FaChevronRight } from "react-icons/fa"
import { MdDateRange } from "react-icons/md"
import { StatusBadge } from "@components/ui"
import { formatCurrency, request } from "@utils/networking"

// Danh sách chương trình tích lũy của KH. type: "1" đang tham gia, "2" đã kết thúc
export const getTichLuyList = (khId, type) =>
  request("POST", "khuyenmai/getCTTLKH_List", { userId: String(khId), type })
    .then((r) => r.json())
    .then((r) => (r?.result && r?.message ? JSON.parse(r.message) : []))
    .catch((e) => {
      console.log("Lỗi getCTTLKH_List", e)
      return []
    })

const money = (n) => `${formatCurrency(Number(n) || 0, true)} ₫`

// "yyyy-mm-dd" (hoặc có giờ) -> "dd/mm/yyyy"
const dmy = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s || ""
}

// Số ngày còn lại tính cả ngày cuối
const daysLeft = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const end = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((end - today) / 86400000)
}

const statusOf = (item, ended) => {
  const pct = Number(item.PhanTram) || 0
  if (pct >= 100) return ["success", "Đã đạt"]
  if (ended) return ["neutral", "Chưa đạt"]
  const d = daysLeft(item.DenNgay)
  if (d !== null && d <= 7) return ["warning", d <= 0 ? "Hết hạn hôm nay" : `Còn ${d} ngày`]
  return ["info", d !== null ? `Còn ${d} ngày` : "Đang diễn ra"]
}

// Thẻ một chương trình tích lũy: tiến độ, cam kết / đã thực hiện, mở trang chi tiết
const TichLuyProgramCard = ({ item, ended }) => {
  const pct = Math.max(0, Number(item.PhanTram) || 0)
  const target = Number(item.DoanhSoDangKy) || 0
  const done = Number(item.DoanhThuDat) || 0
  const remain = Math.max(0, target - done)
  const reached = pct >= 100
  const [tone, label] = statusOf(item, ended)

  return (
    <button
      type="button"
      onClick={() =>
        zmp.views.current.router.navigate(`/PageTichLuyDetail/?pk_seq=${item.CTTL_FK}`, {
          transition: "zmp-cover",
          animate: true,
        })
      }
      className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-left active:bg-[#f7faff]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 text-[14px] font-semibold leading-snug text-slate-800">{item.TenChuongTrinh}</div>
        <StatusBadge tone={tone}>{label}</StatusBadge>
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
        <MdDateRange size={13} className="shrink-0 text-slate-400" />
        {dmy(item.TuNgay)} – {dmy(item.DenNgay)}
      </div>

      {/* Tiến độ */}
      <div className="mt-3 flex items-baseline justify-between text-xs">
        <span className="text-slate-500">Tiến độ</span>
        <span className={`font-bold tabular-nums ${reached ? "text-[#1f7a45]" : "text-primary"}`}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#edf1f7]">
        <div
          className={`h-full rounded-full ${reached ? "bg-[#2e9e5b]" : "bg-primary"}`}
          style={{ width: `${Math.min(100, pct)}%`, transition: "width 400ms ease-out" }}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[#f7f9fc] px-3 py-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500">Cam kết</div>
          <div className="truncate text-[13px] font-semibold tabular-nums text-slate-700">{money(target)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500">Đã thực hiện</div>
          <div className="truncate text-[13px] font-semibold tabular-nums text-slate-700">{money(done)}</div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <span className={reached ? "font-semibold text-[#1f7a45]" : "text-slate-500"}>
          {reached ? "Đã đạt mục tiêu cam kết" : target > 0 ? (
            <>
              {ended ? "Còn thiếu" : "Cần thêm"} <b className="tabular-nums text-slate-700">{money(remain)}</b>
            </>
          ) : (
            "Chưa có doanh số cam kết"
          )}
        </span>
        <span className="flex shrink-0 items-center gap-1 font-semibold text-primary">
          Chi tiết <FaChevronRight size={9} />
        </span>
      </div>
    </button>
  )
}

export default TichLuyProgramCard
