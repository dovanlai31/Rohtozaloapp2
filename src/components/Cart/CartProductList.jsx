import { Link } from "zmp-framework/react"
import { FaPlus } from "react-icons/fa"
import { MdDeleteOutline, MdShoppingBag } from "react-icons/md"
import CardItemRow from "@components/Cart/CardItemRow"
import { Button, SectionTitle } from "@components/ui"

const HIEN_SAN = 3 // số sản phẩm hiện sẵn, còn lại bấm "Xem thêm"

const CartProductList = ({ Giohang, ViewMore, updateViewMore, updateGiohang, updateAppKm, updateDatakm, tinhtien, handleDeleteAll }) => {
  const list = ViewMore ? Giohang : Giohang.slice(0, HIEN_SAN)

  return (
    <div>
      <SectionTitle
        icon={<MdShoppingBag size={16} />}
        right={
          <span className="flex shrink-0 items-center gap-1.5">
            {handleDeleteAll && (
              <button
                type="button"
                onClick={handleDeleteAll}
                className="flex w-auto items-center gap-1 rounded-full border-0 bg-transparent px-2 py-1.5 text-[12px] font-semibold text-slate-500"
              >
                <MdDeleteOutline size={15} /> Xoá tất cả
              </button>
            )}
            <Link
              href="/search"
              noLinkClass
              className="!flex items-center gap-1 rounded-full bg-[#e3edf8] px-3 py-1.5 text-[12px] font-semibold text-primary"
            >
              <FaPlus size={10} /> Thêm
            </Link>
          </span>
        }
      >
        Sản phẩm ({Giohang.length})
      </SectionTitle>

      <div className="divide-y divide-[#edf0f5] overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
        {list.map((item, index) => (
          <CardItemRow
            key={item.id || index}
            item={item}
            index={index}
            ViewMore={ViewMore}
            updateGiohang={(a) => {
              updateAppKm(true)
              updateGiohang(a)
            }}
            Refeshkm={() => {
              updateAppKm(true)
              updateDatakm([])
            }}
            tinhtien={() => tinhtien()}
            length={Giohang.length}
          />
        ))}
      </div>

      {!ViewMore && Giohang.length > HIEN_SAN && (
        <Button variant="ghost" full size="md" className="mt-2 !py-2.5 text-[13px] text-primary" onClick={() => updateViewMore(true)}>
          Xem thêm {Giohang.length - HIEN_SAN} sản phẩm
        </Button>
      )}
    </div>
  )
}

export default CartProductList
