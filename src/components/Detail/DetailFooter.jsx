import { formatCurrency } from "@utils/networking"
import { FaMinus, FaPlus } from "react-icons/fa"
import { MdAddShoppingCart } from "react-icons/md"
import { RiMessage2Fill } from "react-icons/ri"

const footerClass = "fixed bottom-0 left-0 z-[999] w-full border-t border-[#e6ebf2] bg-white px-4 pt-2.5"
const footerStyle = { paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))" }

const DetailFooter = ({ Product, CusInfo, loading, soluong, onChangeSL, onAddToCart, onChat }) => {
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
        <button
          type="button"
          onClick={onAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#e5232a] py-3 text-[15px] font-semibold text-white active:opacity-80"
        >
          <MdAddShoppingCart size={18} />
          Thêm vào giỏ hàng
        </button>
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
