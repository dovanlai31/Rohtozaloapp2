import { formatCurrency } from "@utils/networking"
import { Button, StatusBadge } from "@components/ui"
import { FaCheckCircle } from "react-icons/fa"
import { FaCircleXmark } from "react-icons/fa6"
import { MdChevronRight, MdMilitaryTech, MdStars } from "react-icons/md"
import { Link } from "zmp-framework/react"
import UserImg from "../../static/images/user.png"

// Thẻ thông tin khách hàng: ảnh, tên, SĐT, trạng thái đồng bộ, cấp độ và điểm tích lũy
export default function AccountProfileCard({ user, cusInfo, phoneNumber, onRegisterClick }) {
  const isSynced = cusInfo.KHACHHANG_fk !== 0 && !!cusInfo.KHACHHANG_fk

  return (
    <div className="mx-4 mb-3 mt-3 overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
      <div className="flex items-center gap-3 p-4">
        <img
          loading="lazy"
          src={user?.avatar || UserImg}
          alt="avatar"
          className="h-14 w-14 shrink-0 rounded-full border border-[#E3EBF6] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[16px] font-semibold text-slate-700">{cusInfo.tenkh || user?.name || "---"}</div>
          <div className="mt-0.5 text-[13px] text-slate-500">{cusInfo.DIENTHOAI || phoneNumber || ""}</div>
          <div className="mt-1.5">
            {isSynced ? (
              <StatusBadge tone="success">
                <FaCheckCircle size={10} /> Khách hàng
              </StatusBadge>
            ) : (
              <StatusBadge tone="danger">
                <FaCircleXmark size={10} /> Chưa đồng bộ
              </StatusBadge>
            )}
          </div>
        </div>
      </div>

      {!isSynced && (
        <div className="mx-4 mb-4 rounded-xl bg-[#FFF8E6] p-3 text-center">
          <div className="text-[12px] leading-relaxed text-slate-600">
            Số điện thoại chưa được đồng bộ với hệ thống. Vui lòng đăng ký để xem giá và đặt hàng.
          </div>
          <Button full className="mt-2.5" onClick={onRegisterClick}>
            Đăng ký
          </Button>
        </div>
      )}

      <div className="flex border-t border-[#edf0f5]">
        <Link href="/TichLuyList/" noLinkClass className="!flex flex-1 items-center gap-2.5 border-r border-[#edf0f5] px-4 py-3 active:bg-[#f7faff]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fdf3e6] text-[#c26a00]">
            <MdMilitaryTech size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-slate-500">Cấp độ</span>
            <span className="block truncate text-[14px] font-semibold text-slate-700">{cusInfo?.capdo || "Hạng D"}</span>
          </span>
          <MdChevronRight size={16} className="shrink-0 text-slate-300" />
        </Link>
        <Link href="/lichsutichdiem/" noLinkClass className="!flex flex-1 items-center gap-2.5 px-4 py-3 active:bg-[#f7faff]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-primary">
            <MdStars size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-slate-500">Điểm tích lũy</span>
            <span className="block truncate text-[14px] font-semibold tabular-nums text-primary">
              {formatCurrency(cusInfo?.diem ?? 0, true)}
            </span>
          </span>
          <MdChevronRight size={16} className="shrink-0 text-slate-300" />
        </Link>
      </div>
    </div>
  )
}
