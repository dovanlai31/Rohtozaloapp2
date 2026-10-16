import { useState } from "react"
import { MdCardGiftcard, MdChevronRight, MdEvent, MdLocalOffer, MdStorefront } from "react-icons/md"
import imgKhuyenMai from "@static/images/khuyenmai.png"
import imgGift from "@static/images/gift.png"
import { LEVEL, fmtDate, timeInfo } from "@utils/promoTime"

// Loại chương trình (loaict: 0/null khuyến mãi, 2 tích lũy, 1 trưng bày)
export const PROMO_TYPES = [
  { key: "km", label: "Khuyến mãi", Icon: MdLocalOffer, color: "text-[#e5232a]" },
  { key: "tichluy", label: "Tích lũy", Icon: MdCardGiftcard, color: "text-[#d9860b]" },
  { key: "trungbay", label: "Trưng bày", Icon: MdStorefront, color: "text-[#1f8a5c]" },
]

export const loaiOf = (km) => (km.loaict == 2 ? "tichluy" : km.loaict == 1 ? "trungbay" : "km")

export const promoHref = (km, index) => `/tichluydetail?loai=2&item=${km.pk_seq}&index=${index}`

const hasRealImage = (src) => !!src && !/NOIMAGEGESO/i.test(src)

// Ảnh mặc định theo loại chương trình
const DEFAULT_IMG = { km: imgKhuyenMai, tichluy: imgGift, trungbay: imgKhuyenMai }

// Ảnh chương trình: không có ảnh hoặc ảnh lỗi thì dùng ảnh mặc định
const ProgramImage = ({ src, loai }) => {
  const [error, setError] = useState(false)
  const fallback = DEFAULT_IMG[loai] || imgKhuyenMai
  const useReal = hasRealImage(src) && !error
  return (
    <img
      src={useReal ? src : fallback}
      alt=""
      loading="lazy"
      onError={() => setError(true)}
      className="mb-1 h-9 w-9 rounded-md object-contain"
    />
  )
}

/**
 * Thẻ dạng phiếu giảm giá: cuống trái (ảnh / số ngày còn lại) + đường răng cưa + nội dung.
 * compact: bản gọn cho dải trượt ngang ở trang chủ (tên tối đa 2 dòng, không có dòng ngày).
 */
const VoucherCard = ({ km, compact = false }) => {
  const type = PROMO_TYPES.find((t) => t.key === loaiOf(km)) || PROMO_TYPES[0]
  const t = timeInfo(km.TUNGAY, km.DENNGAY)
  const lv = LEVEL[t.level]
  const title = km.diengiai && km.scheme !== km.diengiai ? km.diengiai : km.scheme
  const subtitle = km.diengiai && km.scheme !== km.diengiai ? km.scheme : type.label

  return (
    <div
      className={`relative flex overflow-hidden rounded-xl border border-[#E3EBF6] bg-white active:bg-[#f7faff] ${
        compact ? "h-full" : ""
      }`}
    >
      {/* Cuống phiếu */}
      <div
        className={`flex shrink-0 flex-col items-center justify-center px-1 py-3 text-center ${compact ? "w-[68px]" : "w-[78px]"} ${lv.stub}`}
      >
        <ProgramImage src={km.HinhAnh} loai={type.key} />
        {t.daysLeft === null ? null : t.daysLeft === 0 ? (
          <span className="text-[12px] font-bold leading-tight">Hôm nay</span>
        ) : t.daysLeft > 0 ? (
          <>
            <span className="text-[10px] leading-none opacity-80">Còn</span>
            <span className="text-[18px] font-bold leading-tight tabular-nums">{t.daysLeft}</span>
            <span className="text-[10px] leading-none opacity-80">ngày</span>
          </>
        ) : (
          <span className="text-[11px] font-semibold leading-tight">Hết hạn</span>
        )}
      </div>

      {/* Đường răng cưa ngăn cách cuống phiếu */}
      <div className="relative w-0">
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full border border-[#E3EBF6] bg-slate-50" />
        <span className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full border border-[#E3EBF6] bg-slate-50" />
        <span className="absolute inset-y-3 left-0 border-l border-dashed border-[#d5dde8]" />
      </div>

      {/* Nội dung */}
      <div className="flex min-w-0 flex-1 items-center gap-1 py-3 pl-3.5 pr-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-slate-500">{subtitle}</span>
            {!compact && (
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${lv.badge}`}>{lv.label}</span>
            )}
          </div>
          <div
            className={`text-[14px] leading-snug text-slate-700 ${compact ? "line-clamp-2" : ""}`}
            style={{ overflowWrap: "anywhere" }}
          >
            {title}
          </div>
          {t.end && !compact && (
            <>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                <MdEvent size={12} />
                {fmtDate(t.start)} - {fmtDate(t.end)}
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#edf0f5]">
                <div className={`h-full rounded-full ${lv.bar}`} style={{ width: `${t.progress}%` }} />
              </div>
            </>
          )}
          {t.end && compact && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#edf0f5]">
              <div className={`h-full rounded-full ${lv.bar}`} style={{ width: `${t.progress}%` }} />
            </div>
          )}
        </div>
        {!compact && <MdChevronRight size={18} className="shrink-0 text-[#b6c2d3]" />}
      </div>
    </div>
  )
}

export default VoucherCard
