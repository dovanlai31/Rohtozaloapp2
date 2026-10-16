import { Link } from "zmp-framework/react"
import { MdSearch, MdShoppingCart } from "react-icons/md"
import { EmptyState } from "@components/ui"

const CartEmpty = () => {
  return (
    <div className="px-4 pt-16">
      <div className="rounded-xl border border-[#E3EBF6] bg-white">
        <EmptyState
          icon={<MdShoppingCart size={26} />}
          title="Giỏ hàng đang trống"
          desc="Tìm và thêm sản phẩm để bắt đầu đặt hàng."
          action={
            <Link
              href="/search"
              noLinkClass
              className="!flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-[14px] font-semibold text-white"
            >
              <MdSearch size={18} /> Tìm sản phẩm
            </Link>
          }
        />
      </div>
    </div>
  )
}

export default CartEmpty
