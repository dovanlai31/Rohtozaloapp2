import { formatCurrency } from "@utils/networking"
import { orderCountParts } from "@utils/accountHelpers"
import { Link } from "zmp-framework/react"

// Hàng số liệu nhanh: đơn chờ xác nhận / đã xác nhận / doanh số tháng
export default function AccountStatsGrid({ soLuongDonHang, dataDoanhSo }) {
  const [sl0, sl1] = orderCountParts(soLuongDonHang)
  const doanhSoThang = dataDoanhSo?.[0] ? formatCurrency(dataDoanhSo[0].doanhthu, true) : "0"

  const Cell = ({ value, label, href, tone = "text-primary" }) => {
    const inner = (
      <div className="px-1 py-3 text-center">
        <div className={`truncate text-[17px] font-bold tabular-nums ${tone}`}>{value}</div>
        <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
      </div>
    )
    return href ? (
      <Link href={href} noLinkClass className="block min-w-0 flex-1 active:bg-[#f7faff]">
        {inner}
      </Link>
    ) : (
      <div className="min-w-0 flex-1">{inner}</div>
    )
  }

  return (
    <div className="mx-4 mb-3 flex divide-x divide-[#edf0f5] overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
      <Cell value={sl0} label="Chờ xác nhận" href={`/listdonhang/?trangthai=0&sl=${sl0}`} tone="text-[#c26a00]" />
      <Cell value={sl1} label="Đã xác nhận" href={`/listdonhang/?trangthai=1&sl=${sl1}`} />
      <Cell value={`${doanhSoThang}đ`} label="Doanh số tháng" href="/doanhsodetail/?loai=0" tone="text-slate-700" />
    </div>
  )
}
