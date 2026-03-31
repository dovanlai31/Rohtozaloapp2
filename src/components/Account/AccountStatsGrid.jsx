import { formatCurrency } from "@utils/networking"
import { orderCountParts } from "@utils/accountHelpers"
import { BiSolidPackage } from "react-icons/bi"
import { FaShoppingBag, FaWallet } from "react-icons/fa"
import { Link } from "zmp-framework/react"

export default function AccountStatsGrid({ soLuongDonHang, dataDoanhSo }) {
  const [sl0, sl1] = orderCountParts(soLuongDonHang)
  const tongTien = dataDoanhSo?.[0] ? formatCurrency(dataDoanhSo[0].doanhthu) : 0

  return (
    <div className="mx-4 mb-3 flex gap-3">
      <Link
        href={`/listdonhang/?trangthai=0&sl=${sl0}`}
        noLinkClass
        className="flex-1"
      >
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-2 py-3.5 text-center shadow-sm">
          <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <FaShoppingBag className="text-lg text-rose-500" />
          </div>
          <div className="text-lg font-bold text-rose-600">{sl0}</div>
          <div className="mt-0.5 text-xs text-gray-500">Đơn hàng</div>
        </div>
      </Link>
      <Link
        href={`/listdonhang/?trangthai=1&sl=${sl1}`}
        noLinkClass
        className="flex-1"
      >
        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-2 py-3.5 text-center shadow-sm">
          <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <BiSolidPackage className="text-xl text-primary" />
          </div>
          <div className="text-lg font-bold text-slate-900">{sl1}</div>
          <div className="mt-0.5 text-xs text-gray-500">Sản phẩm</div>
        </div>
      </Link>
      <div className="flex-1">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-2 py-3.5 text-center shadow-sm">
          <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <FaWallet className="text-lg text-primary" />
          </div>
          <div className="text-lg font-bold text-primary">{tongTien}</div>
          <div className="mt-0.5 text-xs text-gray-500">Tổng tiền</div>
        </div>
      </div>
    </div>
  )
}
