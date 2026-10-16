import { MdLocalOffer } from "react-icons/md"
import RowItemKMBanhang from "@components/Cart/RowItemKMBanhang"
import { SectionTitle } from "@components/ui"

const CartPromotionList = ({ datakm, appKm, setIsShowModalKm, updateGiohang, tinhtien, updateItemKM, handleShowvongQuay }) => {
  if (datakm.length > 0) {
    return (
      <div className="mt-4">
        <SectionTitle icon={<MdLocalOffer size={16} className="text-[#e5232a]" />}>Khuyến mãi áp dụng cho đơn</SectionTitle>
        <div className="overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
          {datakm.map((item, index) => (
            <RowItemKMBanhang
              setIsShowModalKm={setIsShowModalKm}
              key={index}
              item={item}
              index={index}
              length={datakm.length}
              updateGiohang={(a) => updateGiohang(a)}
              tinhtien={() => tinhtien()}
              updateItemKM={(km) => updateItemKM(km)}
              handleShowvongQuay={handleShowvongQuay}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!appKm) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-white px-3.5 py-3 text-[13px] text-slate-500">
        <MdLocalOffer size={16} className="shrink-0 text-slate-400" />
        Đơn hàng chưa có khuyến mãi áp dụng
      </div>
    )
  }

  return null
}

export default CartPromotionList
