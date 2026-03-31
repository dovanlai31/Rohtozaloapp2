import { useEffect, useRef, useState } from "react"
import {
  Box,
  Page,
  useStore,
  zmp,
} from "zmp-framework/react"
import { getAppInfo, openShareSheet } from "zmp-sdk/apis"

import { getAPI, request } from "@utils/networking"
import { validateString } from "@utils/util"
import store from "../store"
import "../styles/app.scss"
import "../styles/swiper.css"
import withOverlay from "@components/HOC/withOverlay"
import config from "../config"

import ImageBanner from "@components/Detail/ImageBanner"
import ProductInfo from "@components/Detail/ProductInfo"
import ProductTabs from "@components/Detail/ProductTabs"
import DetailFooter from "@components/Detail/DetailFooter"
import KhuyenMai from "@components/Detail/KhuyenMai"
import RelatedProducts from "@components/Detail/RelatedProducts"

const Detail = ({ zmproute, showToast }) => {
  const toast = useRef(null)
  const topToast = useRef(null)

  const [soluong, setSoluongsp] = useState(1)
  const [list_sp_tt, setlist_sp_tt] = useState([])
  const [Product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)

  const CusInfo = useStore("getCusInfo")

  useEffect(() => {
    setLoading(true)
    const timeOut = setTimeout(() => {
      getInfoProduct(zmproute.query.id)
    }, 500)

    return () => {
      clearTimeout(timeOut)
    }
  }, [])

  const getInfoProduct = async (id) => {
    let queryString = {
      userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
      spId: validateString(id + "", true),
      idchungloai: "",
      loai: "2",
    }
    try {
      const response = await (
        await request("POST", "khachhang/getListSP", {}, queryString)
      ).json()

      if (response) {
        let p = JSON.parse(response.message)
        setlist_sp_tt(p)
      } else {
        setlist_sp_tt([])
      }

      const { data, error } = await getAPI(
        "khachhang/getSpDetail",
        "POST",
        {},
        queryString
      )

      if (!data.result || error) {
        showToast("Lỗi truy xuất sản phẩm", "info")
      }

      setProduct(JSON.parse(data.content)[0])
    } catch (error) {
      console.log("Error request api x ", error)
    } finally {
      setLoading(false)
    }
  }

  const onClickAddGH = async () => {
    let p = { ...Product, soluong }

    try {
      const result = await store.dispatch("SetAddGioHang", p)
      if (result) {
        showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")

        setTimeout(() => {
          zmp.views.main.router.back()
        }, 500)
      }
    } catch (err) {
      showToast("Lỗi khi thêm giỏ hàng", "danger", 1500, "top")
    }
  }

  const onPageBeforeOut = () => {
    if (toast.current) {
      toast.current.close()
      toast.current.destroy()
    }
    if (topToast.current) {
      topToast.current.close()
      topToast.current.destroy()
    }
  }

  const openChatScreen = async () => {
    try {
      await openChat({
        type: "oa",
        id: config.OA_ID,
        message: "Xin Chào",
      })
    } catch (error) {
      console.log("Open chat error: ", error)
    }
  }

  const openShareWindow = (img, tensp, idsp) => {
    getAppInfo({})
      .then(({ appUrl }) => {
        openShareSheet({
          type: "zmp_deep_link",
          data: {
            thumbnail: img,
            title: tensp,
            path: appUrl + `/detail/?id=${idsp}`,
          },
          success: (data) => { },
          fail: (err) => {
            console.log(err)
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      onPageBeforeOut={onPageBeforeOut}
      style={{ background: "#f5f6f8" }}
      className="detail-page"
    >
      <ImageBanner
        Product={Product}
        loading={loading}
        onBack={() => {
          store.dispatch("SetCurentProduct", {})
          setProduct({})
        }}
      />

      {/* Khối nội dung chính (1 khối trắng liền mạch) */}
      <div style={{ background: "#fff", marginTop: 8 }}>
        <ProductInfo Product={Product} loading={loading} CusInfo={CusInfo} />
      </div>

      <div style={{ background: "#fff", marginTop: 8 }}>
        <ProductTabs Product={Product} />
      </div>

      <KhuyenMai />

      <RelatedProducts 
        list_sp_tt={list_sp_tt}
        onProductClick={(sp) => {
          let x = { ...sp };
          x.title = sp.ten;
          x.HinhAnh = sp.HinhAnh;
          setProduct(sp);
          document.getElementById("topSection")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Spacer để không bị footer che */}
      <Box noSpace style={{ width: "100%", height: 160 }} />

      <DetailFooter
        Product={Product}
        CusInfo={CusInfo}
        loading={loading}
        soluong={soluong}
        onChangeSL={setSoluongsp}
        onAddToCart={onClickAddGH}
        onChat={openChatScreen}
      />
    </Page>
  )
}

export default withOverlay(Detail)

