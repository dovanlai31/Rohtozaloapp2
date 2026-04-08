import { useState, useRef, useEffect } from "react"
import { zmp } from "zmp-framework/react"
import store from "../store"
import { cartService } from "../services/cartService"
import {
  calculateTotals,
  getDuplicatesInCart,
  mergeDuplicateCartItems,
  prepareOrderPayload,
  checkMissingPromoProducts,
  formatPromotionData
} from "../utils/cartHelper"

export const useCart = (CusInfo) => {
  const Giohangx = store.getters.getGioHang.value || []
  const refres = store.getters.refres.value || false

  const [Giohang, updateGiohang] = useState(Giohangx)
  const [TongTien, updateTongTien] = useState(0)
  const [datakm, updateDatakm] = useState([])
  const [loading, updateLoading] = useState(false)
  const [appKm, updateAppKm] = useState(true)
  const [TongtieKm, updateTongtieKm] = useState(0)
  const [ViewMore, updateViewMore] = useState(false)
  const [SanPhamSuDung, setSanPhamSuDung] = useState("")
  const [dieuchinh, setdieuchinh] = useState(0)
  const [isShowModalKm, setIsShowModalKm] = useState(false)
  const dialog = useRef(null)

  useEffect(() => {
    tinhtien()
    updateViewMore(false)
    let listsp = Giohangx.filter((item) => item.Scheme == "" || !item.Scheme)
    updateGiohang(listsp)
  }, [Giohangx, refres, datakm?.length])

  useEffect(() => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">Lưu đơn hàng thành công</div>',
      buttons: [
        {
          text: "Ok",
          onClick() {
            updateGiohang([])
            zmp.toolbar.show("#main-nav")
            store.dispatch("remoteAllGioHang")
          },
        },
      ],
    })
  }, [])

  const openDialog = () => {
    if (dialog.current) {
      dialog.current.open()
    }
  }

  const showDialog = (msg) => {
    const tempDialog = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [{ text: "Đóng" }],
    })
    tempDialog.open()
  }

  const tinhtien = () => {
    const totals = calculateTotals(Giohangx, datakm)
    updateTongTien(totals.tongTien)
    updateLoading(false)
    updateTongtieKm(totals.tongTieKm)
    setdieuchinh(0)
  }

  const handleDeleteAll = () => {
    zmp.dialog.create({
      title: "Xóa sản phẩm",
      content: "Bạn muốn xóa toàn bộ sản phẩm lên đơn ?",
      buttons: [
        { text: "Hủy", onClick() { } },
        {
          text: "Xóa",
          onClick() {
            updateGiohang([])
            store.dispatch("remoteAllGioHang")
            setTimeout(() => {
              zmp.toolbar.show("#main-nav")
            }, 200)
          },
        },
      ],
    }).open()
  }

  const backHome = () => {
    zmp.toolbar.show("#main-nav")
    zmp.tab.show("#view-main")
    zmp.views.main.router.navigate("/", { animate: true, transition: "zmp-cover-v" })
  }

  const updateItemKM = (item) => {
    let listkm = [...datakm]
    let index = listkm.findIndex((x) => x.id == item.id)
    listkm[index] = item
    updateDatakm(listkm)
  }

  // --- API LOGIC --- //

  const applyPromotionsAPI = async (ctkmSort = [], currentDieuChinh) => {
    updateLoading(true)
    const listsp = Giohangx.map((s) => ({
      spId: s.id,
      soluong: s.soluong,
      vat: s.vat,
      thung: 0,
      id: s.id,
      dongia: (s.dongia * (1 - (((s.chietkhauKM ?? 0) / 100.0 + (s.nhomCkGam ?? 0) / 100.0)))),
      ma: s.ma,
    }))

    if (listsp.length <= 0) {
      updateLoading(false)
      if (currentDieuChinh === 0) showDialog("Giỏ hàng chưa có sản phẩm để áp dụng khuyến mãi!")
      return
    }

    if (!appKm) {
      onClickLuu("")
      return
    }

    if (currentDieuChinh === 0) {
      updateDatakm([])
      setSanPhamSuDung("")
    }

    const donhang = {
      id: "",
      nppId: CusInfo?.nppId || "",
      kbhId: "",
      khoId: "100000",
      ngaydh: new Date().toISOString().split("T")[0],
      khId: CusInfo?.KHACHHANG_fk || "",
      loai: "0",
    }

    const params = {
      userId: String(CusInfo?.KHACHHANG_fk),
      sanpham: JSON.stringify(listsp),
      dieuchinh: currentDieuChinh + "",
      ctkmSort: JSON.stringify(ctkmSort),
      donhang: JSON.stringify(donhang),
    }

    try {
      const data = await cartService.applyPromotion(params)
      if (data && data.status == "1") {
        if (data.data.length == 0) {
          if (currentDieuChinh === 0) onClickLuu("")
        } else {

          const rawPromos = JSON.parse(data.data)
         // console.log("applyPromotion response", rawPromos)

          const { promotions, SanPhamSuDung: newSPSD, chuoiSort } = formatPromotionData(rawPromos, currentDieuChinh, Giohangx, store)

          console.log("Formatted promotions", promotions)
          if (currentDieuChinh === 0) {
            setdieuchinh(1)
            applyPromotionsAPI(chuoiSort, 1)
          } else {
            setSanPhamSuDung(newSPSD)
            updateDatakm(promotions)
            updateAppKm(false)
            updateLoading(false)
          }
        }
      } else {
        if (currentDieuChinh === 0) onClickLuu("")
      }
    } catch (error) {
      updateLoading(false)
    }
  }

  const Appkm = () => applyPromotionsAPI([], 0)

  const onClickDangnhap = () => {
    const duplicates = getDuplicatesInCart(Giohangx)
    if (duplicates.length > 0) {
      zmp.dialog.create({
        title: "ROHTO - Thông báo",
        content: "Có sản phẩm trùng, bạn muốn cộng dồn số lượng trước khi lên đơn không?",
        buttons: [
          { text: "Không", onClick() { } },
          {
            text: "Cộng dồn",
            onClick() {
              const merged = mergeDuplicateCartItems(Giohangx, duplicates)
              store.dispatch("AddAllGioHang", merged)
              updateGiohang(merged)
            },
          },
        ],
      }).open()
    } else {
      Appkm()
    }
  }

  const onClickLuu = async (number) => {
    const missingPromoCheck = checkMissingPromoProducts(datakm)
    if (missingPromoCheck !== "") {
      showDialog("Bạn chưa chọn sản phẩm trả khuyến mãi!" + missingPromoCheck)
      updateLoading(false)
      return
    }

    updateLoading(true)
    const payload = prepareOrderPayload(Giohangx, datakm, number, CusInfo, SanPhamSuDung)

    try {
      const p = await cartService.createOrder(payload)
      updateLoading(false)
      if (p) {
        showDialog(p[0]?.MSG)
        if (p[0]?.RESULT == 1) {
          updateGiohang([])
          store.dispatch("remoteAllGioHang")
          updateDatakm([])
          backHome()
        }
      }
    } catch (error) {
      updateLoading(false)
    }
  }

  return {
    Giohang,
    TongTien,
    datakm,
    loading,
    appKm,
    TongtieKm,
    ViewMore,
    isShowModalKm,

    // Actions
    updateGiohang,
    updateViewMore,
    updateAppKm,
    updateDatakm,
    setIsShowModalKm,
    tinhtien,
    handleDeleteAll,
    backHome,
    onClickDangnhap,
    updateItemKM
  }
}
