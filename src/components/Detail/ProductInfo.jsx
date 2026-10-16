import { SkeletonBlock } from "zmp-framework/react"
import { formatCurrency } from "@utils/networking"

const ProductInfo = ({ Product, loading, CusInfo }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <SkeletonBlock height="22px" width="80%" borderRadius="6px" effect="wave" />
        <SkeletonBlock height="20px" width="40%" borderRadius="6px" effect="wave" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="text-[17px] font-semibold leading-snug text-slate-800" style={{ overflowWrap: "anywhere" }}>
        {Product?.ten || "Tên sản phẩm"}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {Product?.ma && (
          <span className="rounded-md bg-[#f1f5fa] px-2 py-0.5 text-[11px] text-slate-500">Mã: {Product.ma}</span>
        )}
        {Product?.donvi && (
          <span className="rounded-md bg-[#f1f5fa] px-2 py-0.5 text-[11px] text-slate-500">{Product.donvi}</span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        {CusInfo?.active !== "0" ? (
          <>
            <span className="text-[22px] font-bold tabular-nums text-[#e5232a]">
              {formatCurrency(Product?.dongia || 0, true)}đ
            </span>
            {Product?.donvi && <span className="text-[13px] text-slate-500">/ {Product.donvi}</span>}
          </>
        ) : (
          <span className="text-[18px] font-bold text-[#e5232a]">Liên hệ</span>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
