import { Link, SkeletonBlock, useStore, zmp } from "zmp-framework/react"

import { getAPI, request, requestWithAbortController } from "@utils/networking"
import store from "../../store"
import Category from "./Category"
import { Swiper } from "zmp-ui"
import { validateString } from "@utils/util"
import { showToast } from "zmp-sdk"

const Banner = (props) => {
  const Banners = useStore("Banners")
  const { user, cusInfo } = props

  const handleClickBanner = async (bn) => {
    try {
      //  href={`/tichluydetail?loai=2&item=${km.pk_seq}&index=${km.originalIndex}`}
      console.log("Click banner: ", bn)
      let queryString = {
        userId: cusInfo?.KHACHHANG_fk,
        spId: "",
        idchungloai: '',
        ctkmid: bn.ctkmid ? bn.ctkmid : "",
        loai: 3,
        lastId: "",
      }
      //getdata api
      try {
        const response = await (
          await request(
            "POST",
            "khachhang/getListSP",
            {
              userId: cusInfo?.KHACHHANG_fk,
              spId: "",
              idchungloai: '',
              ctkmid: bn.ctkmid ? bn.ctkmid : "",
              loai: 3,
              lastId: "",

            },
            queryString
          )
        ).json()
        if (response) {
          console.log('Check__', response);
          let data = JSON.parse(response.message)
          console.log("/khachhang/getListSpSearch: ", data)
          data = data.filter(it => it.dongia > 0)
          console.log("/khachhang/getListSpSearch 2: ", data)
          //DK mua: có 2 loại
          // loại 1: bắt buộc nhập số lượng => tongluong, tongtien trong bang DIEUKIENKHUYENMAI ko co gia tri
          // loại 2: Bất kì trong : co 2 hình thức
          // hình thức 1: tền. cột tong tiền có gia tri
          // hinh thức 2: sl, cột sl có giá tri
          // DK Tar:
          // có 3 loai: bang trakm
          // loại 1: tổng tiền , cột tông tiền có giá tri
          // loai 2: chiết khấu, cột chietkhau co gia tri
          // loai 3: san pham , có 2 hình thức
          // hinh thức 1: bắt buộc nhập soluong (3 côt kia ko gia tri)
          // hình thức 2: bất kì trong (tổng lượng có gia tri)
          // phép toán 2 or, 1 là and
          //ex "[{\"PHEPTOAN\":1,\"DIENGIAI\":\"Đơn hàng 1050K + tặng 1 Remos IR cream 70g hoặc 1 Extra Deep Heat - tặng thêm 2 
          // vitamin\",\"TONGLUONG\":1050000,\"TONGTIEN\":1050000.00,\"LOAI\":2}]"
          if (data && data.length > 0) {
            let dieukien = JSON.parse(data[0].json_spkm)
            if (dieukien.length > 0) {
              console.log("dieukien", dieukien)
              let loaikm = dieukien[0].LOAI

              if (loaikm == 1 || loaikm == 2) {// tiền
                if (dieukien[0].TONGTIEN > 1) {
                  //alert("Điều kiện khuyến mãi: " + dieukien[0].TONGTIEN)

                  let p = data[0]
                  console.log("spmua", p)
                  p.soluong = Math.ceil((dieukien[0].TONGTIEN || 0) / p.dongia);
                  // alert(p.soluong)
                  console.log("spmua", p)
                  store.dispatch("SetAddGioHang", p)
                  // showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")

                }


              } else if (dieukien[0].TONGLUONG > 0) {// số lượng

                let p = data[0]
                console.log("spmua", p)
                p.soluong = dieukien[0].TONGLUONG;

                store.dispatch("SetAddGioHang", p)
                //showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")



              }
              zmp.tab.show("#view-giohang")
              // setTimeout(() => {
              //   zmp.tab.show("#view-giohang")
              // }, 150)
            }


          }


        }
      } catch (error) {
        console.log("Error request api x ", error)
        //setListData([])
      } finally {
        //setLoading(false)
      }
      // return zmp.views.main.router.navigate(
      //   `/tichluydetail?loai=2&item=${bn.pk_seq}&index=${bn.originalIndex}`
      // )

      // ben nay ko tích xu
      // const { data, error } = await getAPI(
      //   "banner/tichXu",
      //   "POST",
      //   {
      //     id: validateString(bn.pk_seq + "", true),
      //     userId: validateString(cusInfo.KHACHHANG_fk + "", true),
      //   },
      //   {}
      // )
      // if (error) {
      //   console.error(data.message)
      // } else {

      //   store.dispatch("setCusInfo", {
      //     ...cusInfo,
      //     xu: Number(cusInfo?.xu) + Number(data.content),
      //   })
      //   console.log('banner/tichXu',data.message)
      // }
    } catch (ex) {
      console.error(ex)
    }
  }

  if (Banners && Banners.length > 0) {
    return (
      <Swiper
        dots={false}
        id="swiper"
        duration={6000}
        loop={true}
        effect={"fade"}
        slidesPerView="auto"
        autoplay={true}
        className="categories"
      >
        {Banners.map((bn, index) => (
          <Swiper.Slide key={index + ""}>
            <Link
              style={{
                width: "100%",
                height: "100%",
              }}
              onClick={() => handleClickBanner(bn)}
            >
              <Category
                url={bn.HinhAnh}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
          </Swiper.Slide>
        ))}
      </Swiper>
    )
  }

  return (
    <SkeletonBlock
      effect="wave"
      width="100%"
      style={{ height: "170px", borderRadius: 24 }}
    />
  )
}

export default Banner
