import { useEffect, useMemo, useState } from "react"
import { Page, useStore, zmp } from "zmp-framework/react"
import { MdArrowDownward, MdArrowUpward, MdStars } from "react-icons/md"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { EmptyState, StatusBadge } from "@components/ui"
import { request } from "@utils/networking"
import { validateString } from "@utils/util"

const formatPoints = (value) => new Intl.NumberFormat("vi-VN").format(Math.abs(Number(value) || 0))

const resolvePointValue = (item) => {
  const found = [item?.DIEM, item?.TONGDIEM, item?.TONGGIATRI, item?.GIATRI].find(
    (v) => v !== undefined && v !== null && v !== ""
  )
  const num = Number(found || 0)
  return Number.isNaN(num) ? 0 : num
}

const resolveTitle = (item) =>
  item?.GHICHU || item?.TIEUDE || item?.NOIDUNG || item?.DIENGIAI || item?.TEN || `Giao dịch #${item?.MADH || ""}`

// Ngày giờ theo giờ máy (không lệch múi giờ với chuỗi "yyyy-mm-dd HH:mm:ss" / ISO không có Z)
const parseDate = (raw) => {
  const m = String(raw || "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0))
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}
const pad = (n) => String(n).padStart(2, "0")
const dateOf = (item) => parseDate(item?.NGAYTAO || item?.NGAYDH || item?.ngaytao || item?.ngaydh)
const timeText = (d) => (d ? `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : "")
const monthKey = (d) => (d ? `Tháng ${d.getMonth() + 1}/${d.getFullYear()}` : "Khác")

// Trạng thái đơn đổi quà (nếu có)
const statusTone = (text) => {
  const t = String(text || "").toLowerCase()
  if (t.includes("hủy") || t.includes("huỷ")) return "danger"
  if (t.includes("hoàn thành")) return "success"
  if (t.includes("giao")) return "info"
  return "warning"
}

const LichSuTichDiem = ({ zmproute }) => {
  const [listHistory, setListHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const CusInfo = useStore("getCusInfo")

  useEffect(() => {
    setLoading(true)
    request("POST", "khachhang/getListDonQatang", {
      userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
      dhId: "",
      trangthai: "",
      tungay: "",
      denngay: "",
    })
      .then((r) => r.json())
      .then((r) => {
        const p = r?.result ? JSON.parse(r.message || "[]") : []
        setListHistory(Array.isArray(p) ? p : [])
      })
      .catch((e) => {
        console.log("Error get point history", e)
        setListHistory([])
      })
      .finally(() => setLoading(false))
  }, [zmproute?.url])

  const totalPoints = useMemo(() => listHistory.reduce((sum, item) => sum + resolvePointValue(item), 0), [listHistory])

  // Gom theo tháng, mới nhất lên đầu
  const groups = useMemo(() => {
    const sorted = [...listHistory].sort((a, b) => (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0))
    const map = new Map()
    sorted.forEach((item) => {
      const k = monthKey(dateOf(item))
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(item)
    })
    return [...map.entries()]
  }, [listHistory])

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#f5f7fb]"
    >
      <HeaderBack slot="fixed" title="Lịch sử điểm" />

      <div className="flex flex-col gap-3 px-4 pb-10 pt-3">
        {/* Tổng quan */}
        <div className="flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white px-4 py-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fdf3e6] text-[#c26a00]">
            <MdStars size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-slate-500">Tổng điểm</div>
            <div className="text-[22px] font-bold leading-tight tabular-nums text-slate-800">
              {formatPoints(totalPoints)} <span className="text-[13px] font-semibold text-slate-500">điểm</span>
            </div>
          </div>
          <div className="shrink-0 text-right text-[12px] text-slate-500">
            {listHistory.length} giao dịch
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : listHistory.length === 0 ? (
          <EmptyState
            icon={<MdStars size={28} />}
            title="Chưa có lịch sử điểm"
            desc="Điểm tích được và điểm đã dùng sẽ hiển thị tại đây"
          />
        ) : (
          groups.map(([thang, items]) => (
            <div key={thang}>
              <div className="mb-1.5 px-1 text-[12px] font-semibold text-slate-500">{thang}</div>
              <div className="divide-y divide-[#edf0f5] overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
                {items.map((item, index) => {
                  const points = resolvePointValue(item)
                  const tru = points < 0
                  return (
                    <div key={item?.MADH || item?.id || index} className="flex items-center gap-3 px-3.5 py-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          tru ? "bg-[#fdeeee] text-[#c23a3a]" : "bg-[#e9f6f1] text-[#1f8a4c]"
                        }`}
                      >
                        {tru ? <MdArrowDownward size={18} /> : <MdArrowUpward size={18} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-[14px] font-medium leading-snug text-slate-700">{resolveTitle(item)}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
                          <span>{timeText(dateOf(item))}</span>
                          {item?.MADH ? <span>#{item.MADH}</span> : null}
                        </div>
                        {item?.Trangthai && (
                          <StatusBadge tone={statusTone(item.Trangthai)} className="mt-1">
                            {item.Trangthai}
                          </StatusBadge>
                        )}
                      </div>
                      <span className={`shrink-0 text-[15px] font-bold tabular-nums ${tru ? "text-[#c23a3a]" : "text-[#1f8a4c]"}`}>
                        {tru ? "-" : "+"}
                        {formatPoints(points)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </Page>
  )
}

export default LichSuTichDiem
