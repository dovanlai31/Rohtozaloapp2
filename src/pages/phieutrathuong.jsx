import LoadingSpinner from "@components/LoadingSpinner"
import { PillTabs } from "@components/ui"
import PosmHeader from "@components/Posm/PosmHeader"
import { formatCurrency } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useMemo, useState } from "react"
import { FaChevronRight } from "react-icons/fa"
import { Box, Page, Text, useStore, zmp } from "zmp-framework/react"
import { getListPhieuTraThuong } from "../services/posmService"

const STATUS_FILTERS = [
  { key: "", label: "Tất cả" },
  { key: "0", label: "Chưa trả" },
  { key: "1", label: "Đã trả" },
]

const PERIOD_FILTERS = [
  { key: 12, label: "12 tháng gần nhất" },
  { key: 6, label: "6 tháng gần nhất" },
  { key: 3, label: "3 tháng gần nhất" },
]

const toYmd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export const rewardValueText = (item) =>
  item?.giaTriHang ? item.giaTriHang : `${formatCurrency(item?.giaTri ?? 0, true)} ₫`

// trangThaiTra: 0 chưa trả, 1 trả 1 phần, 2 đã trả (trathuong.trangthaihoantat)
const STATUS_STYLE = {
  0: ["Chưa trả", "bg-[#fdf1dc] text-[#9a5a00]"],
  1: ["Trả 1 phần", "bg-[#e7effa] text-primary"],
  2: ["Đã trả", "bg-[#e3f4ea] text-[#1f7a45]"],
}

// Phiếu chưa được duyệt trên web
export const isChoDuyet = (item) => item?.daDuyet !== undefined && Number(item.daDuyet) !== 1

export const RewardStatusPill = ({ item }) => {
  const st = Number(item?.trangThaiTra ?? (Number(item?.daTra) === 1 ? 2 : 0))
  const [label, cls] = isChoDuyet(item)
    ? ["Chờ duyệt", "bg-[#f1f5f9] text-slate-500"]
    : STATUS_STYLE[st] || STATUS_STYLE[0]
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{label}</span>
}

const formatMoney = (n) => `${formatCurrency(n || 0, true)} ₫`
const sumMoney = (arr) => arr.reduce((s, x) => s + (Number(x.giaTri) || 0), 0)

const PhieuTraThuong = () => {
  const CusInfo = useStore("getCusInfo")
  const userId = validateString(CusInfo?.KHACHHANG_fk + "", true)
  const isSynced = !!CusInfo?.KHACHHANG_fk && CusInfo?.KHACHHANG_fk !== 0

  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [months, setMonths] = useState(12)

  // Tải theo khoảng thời gian, lọc trạng thái phía client để khối tóm tắt luôn đủ số liệu
  useEffect(() => {
    if (!isSynced) return
    const den = new Date()
    const tu = new Date()
    tu.setMonth(tu.getMonth() - months)
    setLoading(true)
    getListPhieuTraThuong(userId, "", toYmd(tu), toYmd(den))
      .then(setAll)
      .catch((e) => {
        console.log("Error getListPhieuTraThuong", e)
        setAll([])
      })
      .finally(() => setLoading(false))
  }, [months])

  const list = useMemo(
    () => all.filter((x) => statusFilter === "" || String(Number(x.daTra)) === statusFilter),
    [all, statusFilter]
  )
  const paidList = all.filter((x) => Number(x.daTra) === 1)
  const unpaidList = all.filter((x) => Number(x.daTra) !== 1)
  const countOf = (key) => (key === "" ? all.length : key === "1" ? paidList.length : unpaidList.length)

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#f5f7fb]"
    >
      <PosmHeader title="Phiếu trả thưởng" />

      {!isSynced ? (
        <Box className="min-h-[45vh] flex items-center justify-center px-6">
          <Text className="text-center text-sm text-slate-400">
            Chưa có dữ liệu, vui lòng đồng bộ qua số điện thoại
          </Text>
        </Box>
      ) : (
        <Box mx="4" mt="3" pb="8" className="flex flex-col gap-3">
          {/* Thẻ tổng quan */}
          <div className="rounded-xl border border-[#E3EBF6] bg-white px-4 py-3">
            <div className="truncate text-sm font-bold text-primary">
              KH: {CusInfo?.mafast ? `${CusInfo.mafast} - ` : ""}
              {CusInfo?.tenkh || ""}
            </div>
            <div className="my-2.5 h-px bg-[#edf0f5]" />
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Tổng thưởng {months} tháng</span>
              <span className="text-lg font-bold tabular-nums text-slate-800">{formatMoney(sumMoney(all))}</span>
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-slate-500">
              <span>
                Đã nhận ({paidList.length}):{" "}
                <b className="tabular-nums text-slate-700">{formatMoney(sumMoney(paidList))}</b>
              </span>
              <span>
                Chưa nhận ({unpaidList.length}):{" "}
                <b className="tabular-nums text-slate-700">{formatMoney(sumMoney(unpaidList))}</b>
              </span>
            </div>
          </div>

          {/* Lọc trạng thái */}
          <PillTabs
            tabs={STATUS_FILTERS.map((f) => ({ key: f.key, label: f.label, count: countOf(f.key) }))}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          {/* <select
              aria-label="Lọc thời gian"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="rounded-full border border-[#d6dce7] bg-white px-3 py-1.5 text-xs text-slate-700"
            >
              {PERIOD_FILTERS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select> */}

          {loading && <LoadingSpinner />}

          {!loading &&
            list.map((item) => {
              const paid = Number(item.daTra) === 1
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    zmp.views.current.router.navigate(`/phieutrathuongdetail/?id=${item.id}`, {
                      transition: "zmp-cover",
                      animate: true,
                    })
                  }
                  className="w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-left active:bg-[#f7faff]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[14px] font-semibold leading-snug text-slate-800">{item.chuongTrinh}</div>
                    <RewardStatusPill item={item} />
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {[item.ky, item.soPhieu].filter(Boolean).join(" · ")}
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <div className="text-xs text-slate-500">
                      <div>{item.hinhThuc}</div>
                      <div>
                        {isChoDuyet(item)
                          ? "Phiếu đang chờ duyệt"
                          : paid
                          ? `Ngày trả: ${item.ngayTra || "—"}`
                          : item.trangThaiTra === 1
                          ? "Đã trả một phần"
                          : "Chờ trả thưởng"}
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-[14px] font-bold tabular-nums text-slate-800">
                      {rewardValueText(item)}
                      <FaChevronRight size={10} className="text-[#b6c2d3]" />
                    </span>
                  </div>
                </button>
              )
            })}

          {!loading && !list.length && (
            <Box className="min-h-[30vh] flex items-center justify-center">
              <Text className="text-sm text-slate-400">Không có phiếu trả thưởng nào</Text>
            </Box>
          )}
        </Box>
      )}
    </Page>
  )
}

export default PhieuTraThuong
