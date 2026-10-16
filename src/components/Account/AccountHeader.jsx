import AppHeader from "@components/Header/AppHeader"
import { FaUser } from "react-icons/fa"

// Header trang Tài khoản (trang tab chính, không có nút quay lại)
export default function AccountHeader({ phoneNumber }) {
  const show = phoneNumber && String(phoneNumber).length > 2
  return (
    <AppHeader
      title="Tài khoản"
      icon={<FaUser />}
      right={show ? <span className="shrink-0 text-xs text-slate-500">{phoneNumber}</span> : null}
    />
  )
}

AccountHeader.displayName = "zmp-navbar"
