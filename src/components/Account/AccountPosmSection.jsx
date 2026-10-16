import { MenuGroup, MenuRow } from "@components/ui"
import { BsQrCodeScan } from "react-icons/bs"
import { FaGift } from "react-icons/fa"

export default function AccountPosmSection({ posmSummary }) {
  const { tongPosm = 0, chuaKiemTra = 0, phieuChuaTra = 0 } = posmSummary || {}

  return (
    <MenuGroup title="Quản lý POSM" className="mx-4 mb-3">
      <MenuRow
        icon={<BsQrCodeScan size={16} />}
        label="Kiểm tra POSM"
        value={`${chuaKiemTra}/${tongPosm}`}
        valueTone={chuaKiemTra > 0 ? "danger" : "primary"}
        href="/kiemtraposm/"
      />
      <MenuRow
        icon={<FaGift size={15} />}
        label="Phiếu trả thưởng"
        value={phieuChuaTra}
        valueTone={phieuChuaTra > 0 ? "danger" : "primary"}
        href="/phieutrathuong/"
      />
    </MenuGroup>
  )
}
