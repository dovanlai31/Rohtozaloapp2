import store from "../../store"
import { formatCurrency } from "@utils/networking"
import {
  Box,
  Card,
  Link,
  SkeletonBlock,
  SkeletonText,
  Text,
  Title,
  useStore,
  zmp,
  zmpready,
} from "zmp-framework/react"

const Product = (item) => {
  let {
    loading,
    ten,
    id,
    description,
    thumbnail,
    style,
    dongia,
    donvi,
    title,
    HinhAnh,
    HinhAnh1,
    HinhAnh2,
    ma,
    qcThung,
    mota,
    chidinh,
    huongdan,
    thanhphan,
    mucduyet,
    CusInfo,
    showToast,
  } = item

  const onClickAddGH = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    const product = {
      id,
      ten,
      dongia,
      donvi,
      HinhAnh,
      HinhAnh1,
      HinhAnh2,
      ma,
      qcThung,
      mota,
      chidinh,
      huongdan,
      thanhphan,
      soluong: 1,
    }
    try {
      const result = await store.dispatch("SetAddGioHang", product)
      if (result) {
        showToast
          ? showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")
          : zmp.toast.show({
              text: "Đã thêm vào giỏ hàng!",
              position: "top",
              closeTimeout: 1500,
            })
      }
    } catch (err) {
      showToast
        ? showToast("Lỗi khi thêm giỏ hàng", "danger", 1500, "top")
        : zmp.toast.show({
            text: "Lỗi khi thêm giỏ hàng",
            position: "top",
            closeTimeout: 1500,
          })
    }
  }

  if (loading) {
    return (
      <Box style={style} mx="0" my="2" className="post">
        <Card inset className="!p-0 overflow-hidden rounded-2xl">
          <div className="flex flex-row items-center gap-3 p-3">
            <SkeletonBlock
              width={88}
              height={88}
              effect="fade"
              className="rounded-xl flex-shrink-0"
            />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonText effect="fade"></SkeletonText>
              <SkeletonText effect="fade"></SkeletonText>
              <SkeletonText effect="fade"></SkeletonText>
            </div>
          </div>
        </Card>
      </Box>
    )
  }

  console.log("loading san pham", item)
  return (
    <Box style={style} mx="0" my="2" className="post w-full">
      <Card
        inset
        className="!p-0 overflow-hidden rounded-2lg w-full border border-[#e8edf2]"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}
      >
        <Link
          onClick={() => {
            zmpready(() => {
              store.dispatch("SetCurentProduct", {
                id,
                title: ten,
                thumbnail: HinhAnh,
                dongia,
                HinhAnh,
                HinhAnh1,
                HinhAnh2,
                ten,
                donvi,
                ma,
                qcThung,
                mota,
                chidinh,
                huongdan,
                thanhphan,
              })
            })
            zmp.views.main.router.navigate("/detail/?id=" + id)
          }}
          noLinkClass
        >
          <div className="flex flex-row items-center gap-3 p-3 relative">
            {/* Hình ảnh bên trái */}
            <div
              className="w-[90px] h-[90px] flex-shrink-0 bg-[#f0f4f8] 
            rounded-2xl flex items-center justify-center p-[10px] overflow-hidden"
            >
              <img
                src={HinhAnh}
                alt={ten}
                className="w-full h-full object-contain "
              />
            </div>

            {/* Nội dung bên phải */}
            <div className="flex flex-col flex-1 gap-1 pr-10">
              <span className="font-bold text-sm leading-snug text-gray-800 line-clamp-2">
                {ten}
              </span>

              {/* Badge đơn vị */}
              {donvi && (
                <span
                  className="inline-block self-start text-[11px] font-extrabold
                text-primary bg-[#D5E6F5] rounded-full px-[10px] py-[2px]"
                >
                  {donvi}
                </span>
              )}

              {/* Giá */}
              {CusInfo?.active !== "0" ? (
                <span className="text-[15px] font-bold text-[#e5232a] mt-[2px]">
                  {formatCurrency(dongia, true) + "đ"}
                </span>
              ) : (
                <span className="text-[15px] font-bold text-[#e5232a] mt-[2px]">
                  Liên hệ
                </span>
              )}
            </div>

            {/* Nút + tròn đỏ góc phải dưới */}
            <div
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#e5232a] flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: "0 3px 8px rgba(229,35,42,0.4)" }}
              onClick={onClickAddGH}
            >
              <span className="text-white text-[22px] leading-none select-none ">
                +
              </span>
            </div>
          </div>
        </Link>
      </Card>
    </Box>
  )
}

export default Product
