import { orderCountParts } from "@utils/accountHelpers"
import { BiSolidPackage } from "react-icons/bi"
import { FaClipboard, FaLuggageCart } from "react-icons/fa"
import { Icon, Link } from "zmp-framework/react"

export default function AccountOrderSections({ soLuongDonHang, showPreorder }) {
  const [sl0, sl1, sl2] = orderCountParts(soLuongDonHang)

  return (
    <>
      <div className="mx-4 mb-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 px-4">
        <div className="border-b border-[#F2F2F2] py-3">
          <span className="text-base font-extrabold text-primary">Quản lý đơn</span>
        </div>
        <Link
          href={`/listdonhang/?trangthai=0&sl=${sl0}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
          className="block"
        >
          <div className="flex items-center gap-3 border-b border-[#F2F2F2] px-3 py-3 active:bg-gray-50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
              <FaLuggageCart size={20} />
            </span>
            <span className="min-w-0 flex-1 text-sm text-slate-800">
              Đơn chờ xác nhận
            </span>
            <span className="shrink-0 text-base font-semibold text-primary">
              {sl0}
            </span>
            <Icon zmp="zi-chevron-right" className="shrink-0 text-primary" />
          </div>
        </Link>
        <Link
          href={`/listdonhang/?trangthai=1&sl=${sl1}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
          className="block"
        >
          <div className="flex items-center gap-3 px-3 py-3 active:bg-gray-50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
              <BiSolidPackage size={20} />
            </span>
            <span className="min-w-0 flex-1 text-sm text-slate-800">
              Đơn đã xác nhận
            </span>
            <span className="shrink-0 text-base font-semibold text-primary">
              {sl1}
            </span>
            <Icon zmp="zi-chevron-right" className="shrink-0 text-primary" />
          </div>
        </Link>
      </div>

      {showPreorder && (
        <div className="mx-4 mb-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-[#F2F2F2] px-4 py-3">
            <span className="text-base font-extrabold text-primary">
              Quản lý đơn đặt hàng
            </span>
          </div>
          <Link
            href={`/kiemtradondathang/?sl=${sl2}`}
            animate
            transition="zmp-cover-v"
            noLinkClass
            className="block"
          >
            <div className="flex items-center gap-3 px-3 py-3 active:bg-gray-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
                <FaClipboard size={20} />
              </span>
              <span className="min-w-0 flex-1 text-sm text-slate-800">
                Kiểm tra đơn đặt hàng
              </span>
              <span className="shrink-0 text-base font-semibold text-primary">
                {sl2}
              </span>
              <Icon zmp="zi-chevron-right" className="shrink-0 text-primary" />
            </div>
          </Link>
        </div>
      )}
    </>
  )
}
