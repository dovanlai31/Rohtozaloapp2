import LoadingSpinner from "@components/LoadingSpinner"
import PosmHeader from "@components/Posm/PosmHeader"
import { formatCurrency } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useState } from "react"
import { Box, Page, Text, useStore, zmp } from "zmp-framework/react"
import { getPhieuTraThuongDetail } from "../services/posmService"
import { RewardStatusPill, rewardValueText } from "./phieutrathuong"

const InfoRow = ({ label, value }) =>
  value || value === 0 ? (
    <div className="flex items-start justify-between gap-3 border-t border-[#edf0f5] py-2 text-[13px]">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right text-slate-700" style={{ overflowWrap: "anywhere" }}>
        {value}
      </span>
    </div>
  ) : null

// Màn chỉ xem, không có thao tác
const PhieuTraThuongDetail = ({ zmproute }) => {
  const id = zmproute?.query?.id
  const CusInfo = useStore("getCusInfo")
  const userId = validateString(CusInfo?.KHACHHANG_fk + "", true)

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    getPhieuTraThuongDetail(userId, id)
      .then(setItem)
      .catch((e) => {
        console.log("Error getPhieuTraThuongDetail", e)
        setError(e.message || "")
        setItem(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const chiTiet = item?.chiTiet || []

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-slate-50"
    >
      <PosmHeader title="Chi tiết phiếu" />

      <Box mx="4" mt="3" pb="8" className="flex flex-col gap-3">
        {loading && <LoadingSpinner />}

        {!loading && !item && (
          <Box className="min-h-[45vh] flex items-center justify-center">
            <Text className="text-sm text-slate-400">{error || "Không tìm thấy phiếu trả thưởng"}</Text>
          </Box>
        )}

        {!loading && item && (
          <>
            {/* Thông tin phiếu */}
            <div className="rounded-xl border border-[#E3EBF6] bg-white px-4 pb-2 pt-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[15px] font-semibold leading-snug text-slate-800">{item.chuongTrinh}</div>
                <RewardStatusPill item={item} />
              </div>
              <div className="mb-2 mt-0.5 text-xs text-slate-500">
                {[item.maChuongTrinh, item.soPhieu].filter(Boolean).join(" · ")}
              </div>
              <div className="mb-2 text-[22px] font-bold tabular-nums text-[#e5232a]">{rewardValueText(item)}</div>
              <InfoRow label="Thời gian chương trình" value={item.ky} />
              <InfoRow label="Hình thức trả" value={item.hinhThuc} />
              <InfoRow label="Ngày trả" value={item.ngayTra} />
              <InfoRow label="Đơn hàng cấn trừ" value={item.donHang} />
              <InfoRow label="Ghi chú" value={item.ghiChu} />
            </div>

            {/* Chi tiết trả thưởng */}
            {chiTiet.length > 0 && (
              <div className="rounded-xl border border-[#E3EBF6] bg-white px-4 py-3">
                <div className="mb-1 text-[14px] font-bold text-slate-800">Chi tiết trả thưởng</div>
                {chiTiet.map((ct, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 border-t border-[#edf0f5] py-2.5 first:border-t-0">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium leading-snug text-slate-800" style={{ overflowWrap: "anywhere" }}>
                        {ct.tenSp || ct.ghiChu || "Tiền thưởng"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {[ct.maSp, Number(ct.soLuong) > 0 ? `SL: ${formatCurrency(ct.soLuong, true)}` : ""]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                    {Number(ct.soTien) > 0 && (
                      <span className="shrink-0 text-[13px] font-semibold tabular-nums text-slate-700">
                        {formatCurrency(ct.soTien, true)} ₫
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Box>
    </Page>
  )
}

export default PhieuTraThuongDetail
