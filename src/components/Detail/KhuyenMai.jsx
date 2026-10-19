import { useState } from "react"
import { Link } from "zmp-framework/react"
import { MdLocalOffer } from "react-icons/md"
import VoucherCard, { promoHref } from "@components/KhuyenMai/VoucherCard"
import { SectionTitle } from "@components/ui"
import store from "../../store"

const HIEN_SAN = 3

/** Các chương trình khuyến mãi đang chạy có sản phẩm này trong điều kiện mua (trang chi tiết sản phẩm) */
const KhuyenMai = ({ list = [] }) => {
  const [xemHet, setXemHet] = useState(false)
  if (!list.length) return null

  // Trang chi tiết khuyến mãi đọc thông tin chương trình theo vị trí trong ListKM
  const ListKM = store.getters.ListKM?.value || []
  const indexOf = (km) => ListKM.findIndex((x) => x.pk_seq == km.pk_seq)
  const hien = xemHet ? list : list.slice(0, HIEN_SAN)

  return (
    <div className="p-4">
      <SectionTitle
        icon={<MdLocalOffer size={16} className="text-[#e5232a]" />}
        right={<span className="text-xs text-slate-500">{list.length} chương trình</span>}
      >
        Khuyến mãi khi mua sản phẩm này
      </SectionTitle>
      <div className="flex flex-col gap-2">
        {hien.map((km) => (
          <Link key={km.pk_seq} href={promoHref(km, indexOf(km))} animate noLinkClass className="block w-full">
            <VoucherCard km={km} compact />
          </Link>
        ))}
      </div>
      {list.length > HIEN_SAN && (
        <button
          type="button"
          onClick={() => setXemHet((v) => !v)}
          className="mt-2 w-full border-0 bg-transparent py-1.5 text-[13px] font-semibold text-primary"
        >
          {xemHet ? "Thu gọn" : `Xem thêm ${list.length - HIEN_SAN} chương trình`}
        </button>
      )}
    </div>
  )
}

export default KhuyenMai
