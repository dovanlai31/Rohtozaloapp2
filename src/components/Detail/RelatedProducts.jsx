import { Swiper, SwiperSlide } from "zmp-framework/react"

const RelatedProducts = ({ list_sp_tt, onProductClick }) => {
  return (
    <div className="bg-white mt-[8px] p-4">
      <p className="m-0 mb-3 font-bold text-[15px] text-[#1a1a1a]">Sản phẩm liên quan</p>
      {list_sp_tt && list_sp_tt.length > 0 ? (
        <Swiper slidesPerView={3} spaceBetween={12} loop={list_sp_tt.length > 3}>
          {list_sp_tt.map((sp, index) => (
            <SwiperSlide key={index + ""} style={{ width: "100px" }}>
              <div onClick={() => onProductClick(sp)}>
                <div style={{ backgroundImage: `url(${sp.HinhAnh})` }} className="w-full h-[80px] bg-contain bg-no-repeat bg-center" />
                <p className="m-[6px_0_0] text-[11px] leading-[1.3em] text-[#333] line-clamp-2 overflow-hidden break-words" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {sp.ten}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="py-2">
          <p className="m-0 text-[14px] text-[#999] text-center">Không có sản phẩm liên quan để hiển thị</p>
        </div>
      )}
    </div>
  )
}

export default RelatedProducts
