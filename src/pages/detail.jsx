import { useEffect, useRef, useState } from "react"
import {
  Box,
  Page,
  useStore,
  zmp,
} from "zmp-framework/react"
import { getAppInfo, openChat, openShareSheet } from "zmp-sdk/apis"

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
import RelatedProducts from "@components/Detail/RelatedProducts"
import KhuyenMaiSP from "@components/Detail/KhuyenMai"

const Detail = ({ zmproute, showToast }) => {
  const toast = useRef(null)
  const topToast = useRef(null)

  const [soluong, setSoluongsp] = useState(1)
  const [list_sp_tt, setlist_sp_tt] = useState([])
  const [listKM, setListKM] = useState([]) // khuyến mãi áp dụng khi mua sản phẩm này
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
      // Sản phẩm liên quan: cùng nhãn hàng / ngành hàng (không chặn việc tải chi tiết nếu lỗi)
      request("POST", "khachhang/getSPLienQuan", { userId: queryString.userId, spId: queryString.spId, top: 12 })
        .then((r) => r.json())
        .then((r) => {
          const p = r?.result ? JSON.parse(r.message || "[]") : []
          setlist_sp_tt(Array.isArray(p) ? p : [])
        })
        .catch(() => setlist_sp_tt([]))

      request("POST", "khuyenmai/getKMTheoSP", { userId: queryString.userId, spId: queryString.spId })
        .then((r) => r.json())
        .then((r) => {
          const p = r?.result ? JSON.parse(r.message || "[]") : []
          setListKM(Array.isArray(p) ? p : [])
        })
        .catch(() => setListKM([]))

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
          const router = zmp.views.current?.router || zmp.views.main.router
          router.back()
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
      className="detail-page bg-slate-50"
    >
      <ImageBanner
        Product={Product}
        loading={loading}
        onBack={() => {
          store.dispatch("SetCurentProduct", {})
          setProduct({})
        }}
      />

      {/* Tên, giá */}
      <div className="mx-3 -mt-3 relative rounded-2xl border border-[#E3EBF6] bg-white">
        <ProductInfo Product={Product} loading={loading} CusInfo={CusInfo} />
      </div>

      {/* Khuyến mãi áp dụng khi mua sản phẩm (ẩn nếu không có) */}
      {listKM.length > 0 && (
        <div className="mx-3 mt-3 rounded-2xl border border-[#E3EBF6] bg-white">
          <KhuyenMaiSP key={Product?.id || ""} list={listKM} />
        </div>
      )}

      {/* Mô tả / Chi tiết / Hướng dẫn */}
      <div className="mx-3 mt-3 rounded-2xl border border-[#E3EBF6] bg-white">
        <ProductTabs Product={Product} />
      </div>

      <div className="mx-3 mt-3 rounded-2xl border border-[#E3EBF6] bg-white">
        <RelatedProducts
          list_sp_tt={list_sp_tt}
          onProductClick={(sp) => {
            // tải đầy đủ thông tin (mô tả, hướng dẫn...) và danh sách liên quan của sản phẩm vừa chọn
            setProduct(sp)
            getInfoProduct(sp.id || sp.pk_seq)
            document.getElementById("topSection")?.scrollIntoView({ behavior: "smooth" })
          }}
        />
      </div>

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

