import { formatCurrency } from "@utils/networking"
import { RiMessage2Fill } from "react-icons/ri"

const DetailFooter = ({ Product, CusInfo, loading, soluong, onChangeSL, onAddToCart, onChat }) => {
  if (loading || !CusInfo) return null

  if (CusInfo.active !== "0") {
    return (
      <div
        slot="fixed"
        className="fixed bottom-0 left-0 w-full z-[999] bg-white border-t border-[#e0e0e0] px-4 pt-2.5 pb-6 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      >
        {/* Đơn giá + bộ đếm */}
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <p className="m-0 mb-0.5 text-[13px] text-[#2d5bb9]">Đơn giá {formatCurrency(Product?.dongia || 0, true)} VNĐ</p>
            <p className="m-0 text-[14px] font-bold text-[#2d5bb9]">{formatCurrency((Product?.dongia || 0) * soluong, true)} VNĐ</p>
          </div>
          <div className="flex items-center border border-[#d0d0d0] rounded-md overflow-hidden h-9">
            <button
              onClick={() => onChangeSL((prev) => (prev > 1 ? prev - 1 : 1))}
              className="w-9 h-full bg-white border-none text-[18px] text-[#333] cursor-pointer flex items-center justify-center"
            >−</button>
            <span className="min-w-[36px] text-center text-[16px] font-bold text-[#1a1a1a] border-l border-r border-[#e0e0e0] h-full flex items-center justify-center">{soluong}</span>
            <button
              onClick={() => onChangeSL((prev) => prev + 1)}
              className="w-9 h-full bg-white border-none text-[18px] text-[#333] cursor-pointer flex items-center justify-center"
            >+</button>
          </div>
        </div>
        {/* Nút thêm vào giỏ */}
        <button
          onClick={onAddToCart}
          className="w-full py-[13px] bg-[#2d5bb9] text-white border-none rounded-lg text-[15px] font-bold cursor-pointer tracking-wide"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    )
  }

  return (
    <div
      slot="fixed"
      className="fixed bottom-0 left-0 w-full z-[999] bg-white border-t border-[#e0e0e0] px-4 pt-2.5 pb-6"
    >
      <button
        onClick={onChat}
        className="w-full py-[13px] bg-[#2d5bb9] text-white border-none rounded-lg text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2"
      >
        <RiMessage2Fill size={18} />
        Liên hệ qua Zalo
      </button>
    </div>
  )
}

export default DetailFooter
