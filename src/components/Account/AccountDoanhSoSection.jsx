import { formatCurrency } from "@utils/networking"
import { Icon, Link } from "zmp-framework/react"

export default function AccountDoanhSoSection({ dataDoanhSo }) {
  const thang = dataDoanhSo?.[0]
  const nam = dataDoanhSo?.[1]

  return (
    <div className="mx-4 mb-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 px-4">
      <div className=" pb-1 pt-3.5">
        <span className="text-base font-extrabold text-primary">Doanh số</span>
      </div>
      <Link animate noLinkClass href="/doanhsodetail/?loai=0" className="block">
        <div className="flex items-center gap-2 border-b border-[#F2F2F2]  py-3 active:bg-gray-50">
          <span className="flex-1 text-sm text-slate-800">
            Doanh số tháng
            {thang?.Column1}
          </span>
          <span className="shrink-0 text-right text-base font-semibold text-primary">
            {thang ? formatCurrency(thang.doanhthu, true) : formatCurrency(0, true)}{" "}
            đ
          </span>
          <Icon zmp="zi-chevron-right" className="shrink-0 text-primary" />
        </div>
      </Link>
      <Link animate noLinkClass href="/doanhsodetail/?loai=1" className="block">
        <div className="flex items-center gap-2  py-3 active:bg-gray-50">
          <span className="flex-1 text-sm text-slate-800">
            Doanh số năm
            {nam?.Column1}
          </span>
          <span className="shrink-0 text-right text-base font-semibold text-primary">
            {nam ? formatCurrency(nam.doanhthu, true) : formatCurrency(0, true)} đ
          </span>
          <Icon zmp="zi-chevron-right" className="shrink-0 text-primary" />
        </div>
      </Link>
    </div>
  )
}
