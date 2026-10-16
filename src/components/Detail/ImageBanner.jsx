import { Icon, Link, SkeletonBlock, Swiper, SwiperSlide } from "zmp-framework/react"
import Image from "@components/Image"

const ImageBanner = ({ Product, loading, onBack }) => {
  const images = [Product?.HinhAnh, Product?.HinhAnh1, Product?.HinhAnh2].filter(
    // HinhAnh1/2 ngắn hơn 60 ký tự là link ảnh mặc định "chụp ảnh" của hệ thống
    (src, i) => src && (i === 0 || src.length > 59)
  )

  return (
    <div id="topSection" className="relative bg-white">
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

      {/* Nút quay lại */}
      <div className="absolute left-3 z-10" style={{ top: "calc(var(--safe-top) + 8px)" }}>
        <Link
          back
          onClick={onBack}
          className="!flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.15)]"
        >
          <Icon color="#334155" size={20} zmp="zi-chevron-left-header"></Icon>
        </Link>
      </div>
    </div>
  )
}

export default ImageBanner
