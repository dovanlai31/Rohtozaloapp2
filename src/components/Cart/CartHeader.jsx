import AppHeader from "@components/Header/AppHeader"
import { FaBasketShopping } from "react-icons/fa6"

const CartHeader = ({ cartLength, CusInfo }) => {
  return (
    <AppHeader
      title="Giỏ hàng"
      icon={<FaBasketShopping />}
      right={<span className="shrink-0 text-xs text-slate-500">{cartLength} sản phẩm</span>}
    />
  )
}

CartHeader.displayName = "zmp-navbar"
export default CartHeader
