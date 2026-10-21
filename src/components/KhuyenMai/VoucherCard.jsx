import { useState } from "react"
import { MdCardGiftcard, MdChevronRight, MdEvent, MdLocalOffer, MdStorefront } from "react-icons/md"
import imgKhuyenMai from "@static/images/khuyenmai.png"
import imgGift from "@static/images/gift.png"
import { LEVEL, daysLeftText, fmtDate, timeInfo } from "@utils/promoTime"
import "../../styles/promo-motion.css"

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

const num = (v) => Number(v) || 0

// 50000 -> "50K", 1500000 -> "1,5TR"
const shortMoney = (v) =>
  v >= 1e6
    ? `${String(+(v / 1e6).toFixed(1)).replace(".", ",")}TR`
    : v >= 1e3
    ? `${Math.round(v / 1e3)}K`
    : `${v}đ`

const fullMoney = (v) => `${Math.round(v).toLocaleString("vi-VN")}đ`

/**
 * Ưu đãi chính của chương trình (từ các cột tóm tắt của getListKM) để hiện ở cuống phiếu.
 * Trả null nếu không có dữ liệu (cuống phiếu dùng ảnh như cũ).
 */
export const uuDaiOf = (km) => {
  const prefix = num(km.soMucTra) > 1 ? "Đến" : "Giảm"
  if (num(km.traCK) > 0) return { prefix, value: `${+num(km.traCK).toFixed(2)}%` }
  if (num(km.traTien) > 0) return { prefix, value: shortMoney(num(km.traTien)) }
  if (num(km.traSP) > 0) return { prefix: "Tặng", value: num(km.traLuong) > 0 ? `${num(km.traLuong)} SP` : "SP" }
  return null
}

// Điều kiện áp dụng ngắn gọn: "Đơn từ 1.000.000đ · 5 sản phẩm áp dụng"
export const dieuKienOf = (km) => {
  const parts = []
  if (num(km.dkTien) > 0) parts.push(`Đơn từ ${fullMoney(num(km.dkTien))}`)
  else if (num(km.dkLuong) > 0) parts.push(`Mua từ ${num(km.dkLuong)} sản phẩm`)
  if (num(km.dkSoSP) > 0) parts.push(`${num(km.dkSoSP)} sản phẩm áp dụng`)
  return parts.join(" · ")
}

/**
 * Thẻ dạng phiếu giảm giá: cuống trái (ưu đãi chính, không có thì ảnh) + đường răng cưa + nội dung.
 * compact: bản gọn cho dải trượt ngang ở trang chủ (tên tối đa 2 dòng, không có dòng ngày).
 */
const VoucherCard = ({ km, compact = false }) => {
  const type = PROMO_TYPES.find((t) => t.key === loaiOf(km)) || PROMO_TYPES[0]
  const t = timeInfo(km.TUNGAY, km.DENNGAY)
  const lv = LEVEL[t.level]
  const title = km.diengiai && km.scheme !== km.diengiai ? km.diengiai : km.scheme
  const subtitle = km.diengiai && km.scheme !== km.diengiai ? km.scheme : type.label
  const uuDai = uuDaiOf(km)
  const dieuKien = dieuKienOf(km)
  const badge =
    t.level === "soon" ? { cls: lv.badge, text: daysLeftText(t.daysLeft) } : { cls: lv.badge, text: lv.label }

  return (
    <div
      className={`promo-press relative flex overflow-hidden rounded-xl border border-[#E3EBF6] bg-white active:bg-[#f7faff] ${
        compact ? "h-full" : ""
      }`}
    >
      {/* Cuống phiếu (có ưu đãi thì có vệt sáng lướt qua định kỳ) */}
      <div
        className={`flex shrink-0 flex-col items-center justify-center px-1 py-3 text-center ${compact ? "w-[68px]" : "w-[78px]"} ${lv.stub} ${
          uuDai && t.level !== "ended" ? "promo-shine" : ""
        }`}
      >
        {uuDai ? (
          <>
            <span className="text-[10px] font-semibold uppercase leading-none opacity-80">{uuDai.prefix}</span>
            <span
              className={`promo-pop mt-1 font-bold leading-tight tabular-nums ${
                uuDai.value.length > 5 ? "text-[15px]" : "text-[20px]"
              }`}
            >
              {uuDai.value}
            </span>
          </>
        ) : (
          <ProgramImage src={km.HinhAnh} loai={type.key} />
        )}
        {uuDai ? null : t.daysLeft === null ? null : t.daysLeft === 0 ? (
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
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}
              >
                {t.level === "soon" && <span className="promo-dot" />}
                {badge.text}
              </span>
            )}
          </div>
          <div
            className={`text-[14px] leading-snug text-slate-700 ${compact ? "line-clamp-2" : ""}`}
            style={{ overflowWrap: "anywhere" }}
          >
            {title}
          </div>
          {dieuKien && !compact && (
            <div className="mt-1 text-[12px] text-slate-500">{dieuKien}</div>
          )}
          {t.end && !compact && (
            <>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                <MdEvent size={12} />
                {fmtDate(t.start)} - {fmtDate(t.end)}
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#edf0f5]">
                <div className={`promo-bar h-full rounded-full ${lv.bar}`} style={{ width: `${t.progress}%` }} />
              </div>
            </>
          )}
          {t.end && compact && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#edf0f5]">
              <div className={`promo-bar h-full rounded-full ${lv.bar}`} style={{ width: `${t.progress}%` }} />
            </div>
          )}
        </div>
        {!compact && <MdChevronRight size={18} className="shrink-0 text-[#b6c2d3]" />}
      </div>
    </div>
  )
}

export default VoucherCard
