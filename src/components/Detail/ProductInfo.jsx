import { SkeletonBlock } from "zmp-framework/react"
import { formatCurrency } from "@utils/networking"

const ProductInfo = ({ Product, loading, CusInfo }) => {
  return (
    <>
      {!loading && (
        <div className="px-4 pt-4 pb-[14px]">
          <p className="m-0 font-bold text-[16px] text-[#1a1a1a] leading-[1.4]">
            {Product?.ten || "Tên sản phẩm"}
          </p>
          {CusInfo?.active !== "0" && (
            <div className="flex items-baseline gap-[6px] mt-2">
              <span className="font-bold text-[20px] text-[#2d5bb9]">
                {formatCurrency(Product.dongia, true)} VNĐ
              </span>
              {Product.donvi && (
                <span className="text-[14px] text-[#999] font-normal">/ {Product.donvi}</span>
              )}
            </div>
          )}
        </div>
      )}
      {loading && (
        <div className="p-4 flex flex-col gap-2">
          <SkeletonBlock height="22px" width="80%" borderRadius="6px" effect="wave" />
          <SkeletonBlock height="20px" width="40%" borderRadius="6px" effect="wave" />
        </div>
      )}
    </>
  )
}

export default ProductInfo
