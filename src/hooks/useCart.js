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
  const [showWheel, setShowWheel] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [maxSpins, setMaxSpins] = useState(0);
  const [targetPrize, setTargetPrize] = useState([]);
  const [kmDangQuay, setKmDangQuay] = useState(null)

  // Danh sách phần thưởng (từ ảnh của bạn)
  // const prizes = [
  //   { id: 1, name: '30% OFF', value: 30, weight: 10 },
  //   { id: 2, name: '20% OFF', value: 20, weight: 10 },
  //   { id: 3, name: '15% OFF', value: 15, weight: 10 },
  //   { id: 4, name: '10% OFF', value: 10, weight: 10 },
  //   { id: 5, name: 'Try Again!', value: 0, weight: 30 },
  //   { id: 6, name: 'Hand Locker 1', value: 'gift', weight: 10 },
  //   { id: 7, name: '10% OFF', value: 10, weight: 10 },
  //   { id: 8, name: '7% OFF', value: 7, weight: 10 },
  // ];

  // 👈 Set trước phần thưởng muốn trúng (ví dụ: 20% OFF)
  // const targetPrize = getRandomPrize(prizes);


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


  function getRandomPrize(prizes) {
    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);

    const rand = Math.floor(Math.random() * totalWeight) + 1;

    let cumulative = 0;

    for (let i = 0; i < prizes.length; i++) {
      cumulative += prizes[i].weight;
      if (rand <= cumulative) {
        return i;
      }
    }

    return prizes.length - 1;
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
    console.log("🚀 ~ file: useCart.js:82 ~ tinhtien ~ totals:", totals)
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
          console.log("applyPromotion response22 ", rawPromos)

          const { promotions, SanPhamSuDung: newSPSD, chuoiSort, prizes } = formatPromotionData(rawPromos, currentDieuChinh, Giohangx, store, [])

          console.log("Formatted promotions", promotions, newSPSD, chuoiSort, prizes)

          if (currentDieuChinh == 0) {
            setdieuchinh(1)
            applyPromotionsAPI(chuoiSort, 1)
          } else {
            setSanPhamSuDung(newSPSD)
            updateDatakm(promotions)
            updateAppKm(false)
            updateLoading(false)
            // setMaxSpins(prizes[0]?.SOLUOTQUAY || 0) // Ví dụ: giới hạn quay 2 lần
            // if (prizes && prizes.length > 0) {
            //   let a = []
            //   prizes.map((item) => {
            //     let kq = getRandomPrize(prizes)
            //     a.push(kq)
            //   })
            //   setTargetPrize(a) // Set phần thưởng trúng trước khi mở modal

            // }
            // setPrizes(prizes)
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
      showDialog(missingPromoCheck)
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

  const handleSpinEnd = async (prize) => {
    console.log('Trúng thưởng:', prize);
    setShowWheel(false);
    let x = kmDangQuay
    x.ketqua_vongquay = prize
    updateItemKM(x)
    setKmDangQuay(null)
    setTimeout(() => {
         tinhtien()
    }, 1000);
 

    // Gửi kết quả lên server
    const payload = {
      khId: CusInfo?.KHACHHANG_fk || "",
      ctkmId: x.id,
      ctkm: JSON.stringify(x),
      ketquaJson: JSON.stringify(prize),
    }

    try {
      const p = await cartService.LogKmQuay(payload)
      console.log("LogKmQuay response:", p)


    } catch (error) {

    }

  };
  const handleShowvongQuay = (tkm, item) => {
    console.log("🚀 ~ file: useCart.js:263 ~ handleShowvongQuay ~ value:", tkm, item)

    let prizes = []
    if (tkm.spTra_vongquay.length > 0) {
      tkm.spTra_vongquay = typeof tkm.spTra_vongquay === 'string' ? JSON.parse(tkm.spTra_vongquay) : tkm.spTra_vongquay
      let prizesForTkm = []
      tkm.spTra_vongquay.map((sp, j) => {
        prizesForTkm.push({ ...sp, name: sp.traDIENGIAI, value: sp.chietKhau, weight: sp.TYLETRUNGTHUONG })
        //return sp
      })
      tkm.prizes = prizesForTkm
      prizes = prizesForTkm
    }
    console.log("🚀 ~ file: useCart.js:288 ~ handleShowvongQuay ~ prizes:", prizes)
    if (prizes.length > 0) {
      setMaxSpins(prizes[0]?.SOLUOTQUAY || 0) // Ví dụ: giới hạn quay 2 lần
      if (prizes && prizes.length > 0) {
        let a = []
        prizes.map((item) => {
          let kq = getRandomPrize(prizes)
          a.push(kq)
        })
        setTargetPrize(a) // Set phần thưởng trúng trước khi mở modal

      }
      setPrizes(prizes)
      setShowWheel(true)
      setKmDangQuay(item)
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
    showWheel,
    prizes,
    targetPrize,
    maxSpins, // Ví dụ: giới hạn quay 2 lần

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
    updateItemKM,

    setShowWheel,
    handleSpinEnd,
    handleShowvongQuay

  }
}
