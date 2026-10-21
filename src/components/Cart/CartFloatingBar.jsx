import { formatCurrency } from "@utils/networking"
import { goToCartTab } from "@utils/navigation"
import { useMemo } from "react"
import { MdChevronRight } from "react-icons/md"
import { TiShoppingCart } from "react-icons/ti"
import { useStore } from "zmp-framework/react"

// Số lượng + tổng tiền giỏ hàng (theo dõi cả gioHangVer: đổi số lượng chỉ sửa phần tử trong mảng)
export const useCartSummary = () => {
  const ListGiohang = useStore("getGioHang")
  const gioHangVer = useStore("gioHangVer")
  const CusInfo = useStore("getCusInfo")
  const count = useMemo(
    () => (ListGiohang || []).reduce((sum, it) => sum + (Number(it?.soluong) > 0 ? Number(it.soluong) : 1), 0),
    [ListGiohang, gioHangVer]
  )
  const total = useMemo(
    () => (ListGiohang || []).reduce((sum, it) => sum + (Number(it?.dongia) || 0) * (Number(it?.soluong) || 1), 0),
    [ListGiohang, gioHangVer]
  )
  const canBuy = CusInfo?.active !== "0"
  return { count, total, canBuy, visible: canBuy && count > 0 }
}

// Chiều cao cần chừa ở cuối trang khi thanh giỏ hàng nổi đang hiện
export const CART_BAR_SPACE = 110

// Thanh giỏ hàng nổi ở đáy trang (tìm kiếm, danh mục...): bấm để sang tab Giỏ hàng
const CartFloatingBar = () => {
  const { count, total, visible } = useCartSummary()
  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 z-[999] w-full px-3 pt-2"
      style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))" }}
    >
      <button
        type="button"
        onClick={goToCartTab}
        className="flex w-full items-center gap-3 rounded-2xl border-0 bg-primary px-4 py-3 text-white shadow-[0_6px_16px_rgba(0,93,170,0.35)] active:opacity-90"
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
          <TiShoppingCart size={20} />
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#e5232a] px-1 text-[10px] font-bold leading-[18px]">
            {count > 99 ? "99+" : count}
          </span>
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[11px] text-white/80">{count} sản phẩm trong giỏ</span>
          <span className="block text-[15px] font-bold tabular-nums">{formatCurrency(total, true)}đ</span>
        </span>
        <span className="flex items-center gap-0.5 text-[13px] font-semibold">
          Xem giỏ hàng <MdChevronRight size={18} />
        </span>
      </button>
    </div>
  )
}

export default CartFloatingBar
