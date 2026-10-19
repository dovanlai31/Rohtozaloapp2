import React, { useEffect, useState } from "react"
import { MdCardGiftcard, MdLocalOffer, MdLock, MdPhoneIphone, MdShoppingCart, MdStars } from "react-icons/md"
import logoMain from "../../static/images/logoRohto.png"

type IProps = {
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  closeAlert: () => void
  signup: () => void
}

const LOI_ICH = [
  { icon: MdShoppingCart, title: "Đặt hàng nhanh", desc: "Xem giá theo cửa hàng, đặt đơn mọi lúc" },
  { icon: MdLocalOffer, title: "Khuyến mãi riêng", desc: "Tự động áp chương trình phù hợp đơn hàng" },
  { icon: MdStars, title: "Tích lũy & thưởng", desc: "Theo dõi doanh số, nhận thưởng trên đơn" },
  { icon: MdCardGiftcard, title: "Đổi quà", desc: "Dùng xu / điểm để đổi quà hấp dẫn" },
]

/**
 * Màn hình chào khi tài khoản Zalo chưa liên kết với cửa hàng trên hệ thống Rohto.
 * Toàn màn hình, hiện dần từ dưới lên; "Đồng bộ" gọi signup, "Để sau" gọi closeAlert.
 */
const AlertNoUser: React.FC<IProps> = ({ isVisible, signup, closeAlert }) => {
  const [mounted, setMounted] = useState(isVisible)
  const [show, setShow] = useState(false)

  // giữ phần tử thêm một nhịp để chạy hiệu ứng ẩn
  useEffect(() => {
    if (isVisible) {
      setMounted(true)
      const t = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(t)
    }
    setShow(false)
    const t = setTimeout(() => setMounted(false), 300)
    return () => clearTimeout(t)
  }, [isVisible])

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 z-[13000] flex flex-col bg-[#f5f8fc]"
      style={{ opacity: show ? 1 : 0, transition: "opacity 300ms ease" }}
      role="dialog"
      aria-modal="true"
      aria-label="Chào mừng đến với Rohto"
    >
      {/* Phần trên: nền xanh nhạt, logo, lời chào */}
      <div
        className="relative overflow-hidden px-6 pb-10 text-center"
        style={{
          paddingTop: "calc(var(--safe-top, 0px) + 64px)",
          background: "linear-gradient(180deg, #e6f0fa 0%, #f5f8fc 100%)",
        }}
      >
        {/* vòng tròn trang trí mờ */}
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#005daa] opacity-[0.06]" />
        <span className="pointer-events-none absolute -left-20 top-24 h-44 w-44 rounded-full bg-[#005daa] opacity-[0.05]" />

        <div
          className="relative mx-auto flex w-[230px] max-w-full items-center justify-center rounded-3xl bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,93,170,0.18)]"
          style={{
            transform: show ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
            transition: "transform 500ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <img src={logoMain} alt="Rohto" className="h-auto w-full object-contain" />
        </div>

        <div
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(10px)",
            transition: "all 500ms ease 120ms",
          }}
        >
          <div className="relative mt-6 text-[22px] font-bold leading-tight text-slate-800">Chào mừng đến với Rohto</div>
          <div className="relative mx-auto mt-2 max-w-[300px] text-[14px] leading-relaxed text-slate-500">
            Liên kết tài khoản Zalo với cửa hàng của bạn để bắt đầu đặt hàng và nhận ưu đãi.
          </div>
        </div>
      </div>

      {/* Lợi ích */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {LOI_ICH.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="rounded-2xl border border-[#E3EBF6] bg-white p-3.5"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0)" : "translateY(14px)",
                transition: `all 450ms ease ${220 + i * 70}ms`,
              }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf2fb] text-[#005daa]">
                <Icon size={19} />
              </span>
              <div className="mt-2 text-[14px] font-semibold text-slate-700">{title}</div>
              <div className="mt-0.5 text-[12px] leading-snug text-slate-500">{desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-white px-3.5 py-3 text-[12px] leading-snug text-slate-500">
          <MdLock size={16} className="mt-[1px] shrink-0 text-slate-400" />
          Số điện thoại chỉ dùng để tìm và liên kết đúng cửa hàng của bạn trên hệ thống Rohto.
        </div>
      </div>

      {/* Nút */}
      <div className="px-5 pt-4" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
        <button
          type="button"
          onClick={() => signup()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#005daa] py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(0,93,170,0.25)] active:opacity-85"
        >
          <MdPhoneIphone size={19} />
          Đồng bộ qua số điện thoại
        </button>
        <button
          type="button"
          onClick={() => closeAlert()}
          className="mt-2 w-full border-0 bg-transparent py-2.5 text-[14px] font-medium text-slate-500"
        >
          Để sau
        </button>
      </div>
    </div>
  )
}

export default AlertNoUser
