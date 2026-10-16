import { formatCurrency } from "@utils/networking"
import { MenuGroup, MenuRow } from "@components/ui"
import { MdCalendarMonth, MdInsights } from "react-icons/md"

export default function AccountDoanhSoSection({ dataDoanhSo }) {
  const thang = dataDoanhSo?.[0]
  const nam = dataDoanhSo?.[1]

  return (
    <MenuGroup title="Doanh số" className="mx-4 mb-3">
      <MenuRow
        icon={<MdCalendarMonth size={18} />}
        label={`Doanh số tháng${thang?.Column1 ? " " + thang.Column1 : ""}`}
        value={`${formatCurrency(thang?.doanhthu ?? 0, true)}đ`}
        href="/doanhsodetail/?loai=0"
      />
      <MenuRow
        icon={<MdInsights size={18} />}
        label={`Doanh số năm${nam?.Column1 ? " " + nam.Column1 : ""}`}
        value={`${formatCurrency(nam?.doanhthu ?? 0, true)}đ`}
        href="/doanhsodetail/?loai=1"
      />
    </MenuGroup>
  )
}
