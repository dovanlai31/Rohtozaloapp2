import { ConvertOpacity } from "@utils/ConvertOpacity"
import store from "../../store"
import { formatCurrency } from "@utils/networking"
import { FaMinus } from "react-icons/fa"
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
import Color from "@components/common/Color"
import { FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react"

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
  const [soluong, setSoluong] = useState(0)


  const Giohangx = store.getters.getGioHang.value || []
  useEffect(() => {
    console.log("Giohang in Product: ", Giohangx)
    if (Giohangx&& Giohangx.length > 0  ) {
      const foundItem = Giohangx.find((it) => it.id === id)
      if (foundItem) {
        setSoluong(foundItem.soluong)
      }
    }else {
      setSoluong(0)
    }
    console.log("Giohang changed: ", Giohangx)
    // Reload the page when Giohang changes
    //window.location.reload();
  },  [ JSON.stringify(Giohangx)])




  const onClickAddGH = async (soluong) => {
    console.log("them vao gio hang: ", soluong)
    // e.stopPropagation()
    // e.preventDefault()
    if (soluong <= 0) {
      //xoa sp ra giohang
      store.dispatch("remoteItemGioHang", id)
      setSoluong(0)
      return
    }
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
      soluong: soluong || 1,
    }
    try {
      const result = await store.dispatch("SetAddGioHang", product)
      if (result) {
        if (soluong === 0) {
          showToast
            ? showToast("Đã xóa khỏi giỏ hàng", "success", 1000, "top")
            : zmp.toast.show({
              text: "Đã xóa khỏi giỏ hàng!",
              position: "top",
              closeTimeout: 1500,
            })
        } else {
          showToast
            ? showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")
            : zmp.toast.show({
              text: "Đã thêm vào giỏ hàng!",
              position: "top",
              closeTimeout: 1500,
            })
        }
        setSoluong(soluong)
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
          // onClick={() => {
          //   zmpready(() => {
          //     store.dispatch("SetCurentProduct", {
          //       id,
          //       title: ten,
          //       thumbnail: HinhAnh,
          //       dongia,
          //       HinhAnh,
          //       HinhAnh1,
          //       HinhAnh2,
          //       ten,
          //       donvi,
          //       ma,
          //       qcThung,
          //       mota,
          //       chidinh,
          //       huongdan,
          //       thanhphan,
          //     })
          //   })
          //   zmp.views.main.router.navigate("/detail/?id=" + id)
          // }}
          noLinkClass
        >
          <div className="flex flex-row items-center gap-3 p-3 relative">
            {/* Hình ảnh bên trái */}
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
              }}>
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
            </Link>

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
            {soluong == 0 ? <div
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#e5232a] flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: "0 3px 8px rgba(229,35,42,0.4)" }}
              onClick={() => onClickAddGH(soluong + 1)}
            >
              <span className="text-white text-[22px] leading-none select-none ">
                +
              </span>
            </div> :
              <Box className=" m-0  p-0  flex justify-end p-2 pt-0 ">
                <div className="flex items-center  border border-[#E0E0E0] p-0 rounded-md">
                  <button
                    className=" flex items-center justify-center p-2 w-8 h-8 "
                    onClick={() => {
                      let a = soluong - 1
                      onClickAddGH(a < 0 ? 0 : a)
                    }}
                  >
                    <FaMinus
                      size={12}
                      color={ConvertOpacity(Color.textAPPDefault, 0.4)}
                    />
                  </button>
                  <div className="w-12 h-8 m-0 px-1 text-center  border-[#E0E0E0] border border-y-0 flex items-center justify-center">
                    <Text size="xlarge" className=" text-center ">
                      {" "}
                      {soluong}{" "}
                    </Text>
                  </div>
                  <button
                    className=" flex items-center justify-center  p-2 w-8 h-8 "
                    onClick={() => {
                      let a = soluong + 1
                      onClickAddGH(a)
                    }}
                  >
                    <FaPlus
                      size={12}
                      color={ConvertOpacity(Color.textAPPDefault, 0.4)}
                    />
                  </button>
                </div>
              </Box>}
          </div>
        </Link>
      </Card>
    </Box>
  )
}

export default Product
