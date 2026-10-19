import { useMemo } from "react"
import { useStore } from "zmp-framework/react"
import { formatCurrency } from "@utils/networking"
import { goToCartTab } from "@utils/navigation"
import { FaMinus, FaPlus } from "react-icons/fa"
import { MdAddShoppingCart } from "react-icons/md"
import { RiMessage2Fill } from "react-icons/ri"
import { TiShoppingCart } from "react-icons/ti"

const footerClass = "fixed bottom-0 left-0 z-[999] w-full border-t border-[#e6ebf2] bg-white px-4 pt-2.5"
const footerStyle = { paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))" }

const DetailFooter = ({ Product, CusInfo, loading, soluong, onChangeSL, onAddToCart, onChat }) => {
  const ListGiohang = useStore("getGioHang")
  // đếm giống icon giỏ hàng ở trang Tìm kiếm: tổng số lượng các sản phẩm trong giỏ
  const cartItemCount = useMemo(
    () => (ListGiohang || []).reduce((sum, it) => sum + (Number(it?.soluong) > 0 ? Number(it.soluong) : 1), 0),
    [ListGiohang]
  )

  if (loading || !CusInfo) return null

  if (CusInfo.active !== "0") {
    return (
      <div slot="fixed" className={footerClass} style={footerStyle}>
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Tạm tính</div>
            <div className="text-[17px] font-bold tabular-nums text-[#e5232a]">
              {formatCurrency((Product?.dongia || 0) * soluong, true)}đ
            </div>
          </div>
          <div className="flex items-center rounded-full border border-[#d5e2f2] bg-white">
            <button
              type="button"
              aria-label="Giảm số lượng"
              onClick={() => onChangeSL((prev) => (prev > 1 ? prev - 1 : 1))}
              className="flex h-9 w-9 items-center justify-center border-0 bg-transparent text-primary"
            >
              <FaMinus size={11} />
            </button>
            <span className="min-w-[32px] text-center text-[15px] font-semibold tabular-nums text-slate-800">
              {soluong}
            </span>
            <button
              type="button"
              aria-label="Tăng số lượng"
              onClick={() => onChangeSL((prev) => prev + 1)}
              className="flex h-9 w-9 items-center justify-center border-0 bg-transparent text-primary"
            >
              <FaPlus size={11} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Xem giỏ hàng"
            onClick={goToCartTab}
            className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-[#d5e2f2] bg-white text-primary active:opacity-80"
          >
            <TiShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#e5232a] px-1 text-[10px] font-semibold leading-none tabular-nums text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onAddToCart}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-[#e5232a] py-3 text-[15px] font-semibold text-white active:opacity-80"
          >
            <MdAddShoppingCart size={18} />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    )
  }

  return (
    <div slot="fixed" className={footerClass} style={footerStyle}>
      <button
        type="button"
        onClick={onChat}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-primary py-3 text-[15px] font-semibold text-white active:opacity-80"
      >
        <RiMessage2Fill size={18} />
        Liên hệ qua Zalo
      </button>
    </div>
  )
}

export default DetailFooter
