import {
  Box,
  Icon,
  Link,
  SkeletonBlock,
  Swiper,
  SwiperSlide,
} from "zmp-framework/react"
import Image from "@components/Image"

const ImageBanner = ({ Product, loading, onBack }) => {
  return (
    <Box m="0" p="0" mb={5} id="topSection" className="banner_page_detai2">
      {!loading && (
        <Swiper>
          <SwiperSlide>
            <Box m="0" p="0" className="banner_page_detai">
              <Image
                className="image-card2"
                src={Product?.HinhAnh}
                style={{ height: 280, backgroundColor: "#fff", objectFit: "contain" }}
                alt="Hình ảnh sản phẩm"
              />
            </Box>
          </SwiperSlide>
          {Product?.HinhAnh1 && Product?.HinhAnh1.length > 59 && (
            <SwiperSlide>
              <Box m="0" p="0" className="banner_page_detai">
                <Image
                  className="image-card2"
                  src={Product?.HinhAnh1}
                  style={{ height: 280, backgroundColor: "#fff", objectFit: "contain" }}
                />
              </Box>
            </SwiperSlide>
          )}
          {Product?.HinhAnh2 && Product?.HinhAnh2.length > 59 && (
            <SwiperSlide>
              <Box m="0" p="0" className="banner_page_detai">
                <Image
                  className="image-card2"
                  src={Product?.HinhAnh2}
                  style={{ height: 280, backgroundColor: "#fff", objectFit: "contain" }}
                />
              </Box>
            </SwiperSlide>
          )}
        </Swiper>
      )}
      {loading && (
        <SkeletonBlock
          height="310px"
          width="247px"
          effect="wave"
          className="banner_page_detai"
        />
      )}
      {/* Nút back */}
      <div style={{ position: "absolute", top: 40, left: 16, zIndex: 10 }}>
        <Link
          back
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.2)"
          }}
        >
          <Icon style={{ color: "white" }} size={24} zmp="zi-chevron-left-header"></Icon>
        </Link>
      </div>
    </Box>
  )
}

export default ImageBanner
