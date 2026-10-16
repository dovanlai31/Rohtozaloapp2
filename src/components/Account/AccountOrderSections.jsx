import { orderCountParts } from "@utils/accountHelpers"
import { MenuGroup, MenuRow } from "@components/ui"
import { BiSolidPackage } from "react-icons/bi"
import { FaClipboard, FaLuggageCart } from "react-icons/fa"

export default function AccountOrderSections({ soLuongDonHang, showPreorder }) {
  const [sl0, sl1, sl2] = orderCountParts(soLuongDonHang)

  return (
    <>
      <MenuGroup title="Quản lý đơn" className="mx-4 mb-3">
        <MenuRow
          icon={<FaLuggageCart size={16} />}
          label="Đơn chờ xác nhận"
          value={sl0}
          valueTone={Number(sl0) > 0 ? "danger" : "primary"}
          href={`/listdonhang/?trangthai=0&sl=${sl0}`}
        />
        <MenuRow icon={<BiSolidPackage size={17} />} label="Đơn đã xác nhận" value={sl1} href={`/listdonhang/?trangthai=1&sl=${sl1}`} />
      </MenuGroup>

      {showPreorder && (
        <MenuGroup title="Quản lý đơn đặt hàng" className="mx-4 mb-3">
          <MenuRow icon={<FaClipboard size={15} />} label="Kiểm tra đơn đặt hàng" value={sl2} href={`/kiemtradondathang/?sl=${sl2}`} />
        </MenuGroup>
      )}
    </>
  )
}
