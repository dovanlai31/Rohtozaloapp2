import { useEffect, useRef } from "react"
import { Icon, Link, SkeletonBlock, Swiper, SwiperSlide } from "zmp-framework/react"
import Image from "@components/Image"

const BAR = "calc(var(--safe-top) + 52px)" // thanh trên cùng (ngang cụm nút ••• ✕ của Zalo)
const SHRINK = 220 // cuộn hết khoảng này thì ảnh thu nhỏ tối đa

/**
 * Ảnh sản phẩm ở đầu trang chi tiết, có hiệu ứng khi cuộn:
 *  - Ảnh thu nhỏ, mờ dần và trôi chậm hơn nội dung (parallax).
 *  - Gần cuộn hết ảnh thì thanh trên cùng hiện dần: ảnh nhỏ + tên sản phẩm; nút quay lại luôn cố định.
 * Hiệu ứng đổi transform / opacity trực tiếp qua ref (không setState) để cuộn mượt.
 * Phải đặt làm con trực tiếp của nội dung trang (thanh sticky chỉ dính trong phần tử cha).
 */
const ImageBanner = ({ Product, loading, onBack }) => {
  const rootRef = useRef(null)
  const imgRef = useRef(null)
  const barBgRef = useRef(null)
  const miniRef = useRef(null)

  const images = [Product?.HinhAnh, Product?.HinhAnh1, Product?.HinhAnh2].filter(
    // HinhAnh1/2 ngắn hơn 60 ký tự là link ảnh mặc định "chụp ảnh" của hệ thống
    (src, i) => src && (i === 0 || src.length > 59)
  )
  const ten = Product?.title || Product?.ten || ""

  useEffect(() => {
    const scroller = rootRef.current?.closest(".page-content")
    if (!scroller) return
    let frame = 0
    let last = -1
    const apply = () => {
      frame = 0
      const y = Math.max(0, scroller.scrollTop)
      if (Math.abs(y - last) < 0.5) return
      last = y
      const p = Math.min(1, y / SHRINK) // tiến độ thu nhỏ ảnh
      const q = Math.min(1, Math.max(0, (y - SHRINK * 0.6) / (SHRINK * 0.4))) // tiến độ hiện thanh trên
      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(0, ${Math.min(y, SHRINK) * 0.45}px, 0) scale(${1 - 0.38 * p})`
        imgRef.current.style.opacity = String(1 - 0.65 * p)
      }
      if (barBgRef.current) barBgRef.current.style.opacity = String(q)
      if (miniRef.current) {
        miniRef.current.style.opacity = String(q)
        miniRef.current.style.transform = `translate3d(0, ${(1 - q) * 8}px, 0)`
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
      {/* Thanh trên cùng: dính cố định, nằm đè lên ảnh (margin âm bằng chiều cao) */}
      <div ref={rootRef} className="sticky top-0 z-30" style={{ height: BAR, marginBottom: `calc(-1 * ${BAR})` }}>
        <div
          ref={barBgRef}
          className="absolute inset-0 border-b border-[#e6ebf2] bg-white"
          style={{ opacity: 0, willChange: "opacity" }}
        />
        <div className="relative flex h-full items-end gap-2.5 pb-2 pl-3 pr-[104px]">
          <Link
            back
            onClick={onBack}
            className="!flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.15)]"
          >
            <Icon color="#334155" size={20} zmp="zi-chevron-left-header"></Icon>
          </Link>
          <div
            ref={miniRef}
            className="pointer-events-none flex min-w-0 flex-1 items-center gap-2"
            style={{ opacity: 0, willChange: "opacity, transform" }}
            aria-hidden="true"
          >
            {images[0] && (
              <img src={images[0]} alt="" className="h-8 w-8 shrink-0 rounded-md border border-[#E3EBF6] bg-white object-contain" />
            )}
            <span className="truncate text-[14px] font-semibold text-slate-800">{ten}</span>
          </div>
        </div>
      </div>

      {/* Ảnh sản phẩm */}
      <div id="topSection" className="relative overflow-hidden bg-white">
        <div ref={imgRef} style={{ transformOrigin: "center 60%", willChange: "transform, opacity" }}>
          {!loading && (
            <Swiper pagination={images.length > 1}>
              {images.map((src, i) => (
                <SwiperSlide key={i}>
                  <div className="flex h-[300px] items-center justify-center px-6 pb-6 pt-[calc(var(--safe-top)+36px)]">
                    <Image
                      src={src}
                      alt="Hình ảnh sản phẩm"
                      style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#fff" }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {loading && (
            <div className="flex h-[300px] items-center justify-center pt-[calc(var(--safe-top)+36px)]">
              <SkeletonBlock height="220px" width="220px" borderRadius="16px" effect="wave" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ImageBanner
