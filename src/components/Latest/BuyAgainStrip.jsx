import { SectionTitle } from "@components/ui"
import { formatCurrency } from "@utils/networking"
import { flyToCart } from "@utils/flyToCart"
import { useEffect, useRef, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { MdReplay } from "react-icons/md"
import { useStore, zmp } from "zmp-framework/react"
import { getSPMuaLai } from "../../services/productService"
import store from "../../store"

// Đối tượng sản phẩm lưu trong giỏ (cùng dạng với Product.onClickAddGH)
const toCartItem = (p, soluong) => ({
  id: p.id,
  ten: p.ten,
  dongia: p.dongia,
  donvi: p.donvi,
  HinhAnh: p.HinhAnh,
  HinhAnh1: p.HinhAnh1,
  HinhAnh2: p.HinhAnh2,
  ma: p.ma,
  qcThung: p.qcThung,
  mota: p.mota,
  chidinh: p.chidinh,
  huongdan: p.huongdan,
  thanhphan: p.thanhphan,
  soluong,
})

const BuyAgainCard = ({ item, index }) => {
  const imgRef = useRef(null)
  const ListGiohang = useStore("getGioHang") || []
  const sl = Math.max(1, Number(item.slLanTruoc) || 1)
  const inCart = ListGiohang.find((g) => g.id == item.id)

  const add = async () => {
    const current = Number(inCart?.soluong) || 0
    flyToCart(imgRef.current)
    await store.dispatch("SetAddGioHang", toCartItem(item, current + sl))
    zmp.toast.show({ text: `Đã thêm ${sl} ${item.donvi || "sản phẩm"} vào giỏ`, position: "top", closeTimeout: 1500 })
  }

  const openDetail = () => {
    store.dispatch("SetCurentProduct", { ...item, title: item.ten, thumbnail: item.HinhAnh })
    const router = zmp.views.current?.router || zmp.views.main.router
    router.navigate("/detail/?id=" + item.id)
  }

  return (
    <div
      className="promo-enter flex w-[148px] shrink-0 flex-col rounded-xl border border-[#E3EBF6] bg-white p-2.5"
      style={{ "--i": index }}
    >
      <button
        type="button"
        onClick={openDetail}
        className="relative flex h-[84px] w-full items-center justify-center overflow-hidden rounded-lg !border-0 !bg-transparent !p-0"
      >
        {Number(item.coKM) === 1 && (
          <span className="absolute left-1 top-1 rounded-md bg-[#e5232a] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            {Number(item.kmCK) > 0 ? `-${+Number(item.kmCK).toFixed(1)}%` : "KM"}
          </span>
        )}
        <img ref={imgRef} src={item.HinhAnh} alt={item.ten} loading="lazy" className="h-full w-full object-contain" />
      </button>
      <button
        type="button"
        onClick={openDetail}
        className="mt-1.5 line-clamp-2 min-h-[34px] border-0 bg-transparent p-0 text-left text-[12px] font-medium leading-snug text-slate-700"
      >
        {item.ten}
      </button>
      <div className="mt-0.5 text-[11px] text-slate-500">
        Lần trước: <span className="font-semibold text-slate-600">{sl} {item.donvi}</span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-1 pt-1.5">
        <span className="min-w-0 truncate text-[13px] font-bold tabular-nums text-primary">
          {formatCurrency(item.dongia, true)}đ
        </span>
        <button
          type="button"
          aria-label={`Thêm ${sl} vào giỏ`}
          onClick={add}
          className="flex w-auto shrink-0 items-center gap-0.5 rounded-full border-0 bg-[#e5232a] px-2 py-1 text-[11px] font-bold text-white active:scale-95"
        >
          <FaPlus size={9} />
          {sl}
        </button>
      </div>
      {inCart && (
        <div className="mt-1 text-center text-[10px] text-[#1f7a45]">Trong giỏ: {inCart.soluong}</div>
      )}
    </div>
  )
}

// "Mua lại nhanh": sản phẩm KH đã đặt gần đây, bấm 1 lần thêm đúng số lượng lần trước vào giỏ
const BuyAgainStrip = () => {
  const CusInfo = useStore("getCusInfo")
  const refres = useStore("refres")
  const khId = CusInfo?.KHACHHANG_fk
  const canBuy = CusInfo?.active !== "0"
  const [list, setList] = useState([])

  useEffect(() => {
    if (!khId || !canBuy) return setList([])
    getSPMuaLai(khId)
      .then(setList)
      .catch((e) => {
        console.log("getSPMuaLai error", e)
        setList([])
      })
  }, [khId, canBuy, refres])

  if (!list.length) return null

  return (
    <div className="mt-4">
      <div className="px-4">
        <SectionTitle
          icon={<MdReplay size={16} />}
          right={<span className="shrink-0 text-[12px] text-slate-500">Đặt lại 1 chạm</span>}
        >
          Mua lại nhanh
        </SectionTitle>
      </div>
      <div
        className="flex gap-2.5 overflow-x-auto px-4 pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {list.map((item, i) => (
          <BuyAgainCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

export default BuyAgainStrip
