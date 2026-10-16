import { useEffect, useRef } from "react"
import HeaderHello from "./HeaderHello"
import SearchBox from "./SearchBox"

const GREETING_H = 56 // chiều cao hàng lời chào (cuộn hết hàng này thì header thu gọn hoàn toàn)
const TOP_BAR = "calc(var(--safe-top) + 44px)" // vùng trên cùng ngang cụm nút ••• ✕ của Zalo

/**
 * Header trang chủ thu gọn khi cuộn, mượt vì để trình duyệt tự cuộn (position: sticky):
 *  - Hàng trên cùng (vùng cụm nút Zalo) dính cố định, logo nhỏ hiện dần khi thu gọn.
 *  - Hàng lời chào + logo lớn cuộn đi tự nhiên, mờ dần.
 *  - Ô tìm kiếm dính ngay dưới hàng trên cùng (luôn giữ lại).
 * Không đổi chiều cao / bố cục khi cuộn; hiệu ứng chỉ đổi opacity / transform trực tiếp trên DOM
 * (qua ref, không setState) nên không render lại React mỗi khung hình.
 *
 * Phải đặt làm con trực tiếp của khối nội dung dài của trang (sticky chỉ dính trong phần tử cha).
 */
const HomeHeader = ({ CusInfo, user, logoMain }) => {
  const anchorRef = useRef(null)
  const smallLogoRef = useRef(null)
  const greetRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const scroller = anchorRef.current?.closest(".page-content")
    if (!scroller) return
    let frame = 0
    let last = -1
    const apply = () => {
      frame = 0
      const p = Math.min(1, Math.max(0, scroller.scrollTop / GREETING_H))
      if (Math.abs(p - last) < 0.005) return
      last = p
      if (smallLogoRef.current) {
        smallLogoRef.current.style.opacity = p
        smallLogoRef.current.style.transform = `translate3d(0, ${(1 - p) * 6}px, 0)`
      }
      if (greetRef.current) {
        greetRef.current.style.opacity = 1 - Math.min(1, p * 1.3)
        greetRef.current.style.transform = `translate3d(0, ${p * -6}px, 0) scale(${1 - p * 0.04})`
      }
      if (searchRef.current) {
        searchRef.current.style.boxShadow = p >= 1 ? "0 1px 0 #e6ebf2" : "none"
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    scroller.addEventListener("scroll", onScroll, { passive: true })
    apply()
    return () => {
      scroller.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      {/* Hàng trên cùng: dính cố định */}
      <div ref={anchorRef} className="sticky top-0 z-40 bg-white" style={{ height: TOP_BAR }}>
        <img
          ref={smallLogoRef}
          src={logoMain}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-4 h-6 w-auto object-contain"
          style={{ top: "calc(var(--safe-top) + 12px)", opacity: 0, willChange: "opacity, transform" }}
        />
      </div>

      {/* Lời chào + logo lớn: cuộn đi tự nhiên, mờ dần */}
      <div className="HeaderBoxHome bg-white px-4" style={{ height: GREETING_H }}>
        <div ref={greetRef} className="flex h-full items-center" style={{ transformOrigin: "left center", willChange: "opacity, transform" }}>
          <HeaderHello CusInfo={CusInfo} logoMain={logoMain} user={user} />
        </div>
      </div>

      {/* Ô tìm kiếm: dính ngay dưới hàng trên cùng */}
      <div ref={searchRef} className="sticky z-30 bg-white px-4 pb-2.5 pt-1.5" style={{ top: TOP_BAR, transition: "box-shadow 150ms" }}>
        <SearchBox />
      </div>
    </>
  )
}

export default HomeHeader
