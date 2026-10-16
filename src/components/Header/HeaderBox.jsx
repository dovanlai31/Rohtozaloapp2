import { Icon } from "zmp-framework/react"
import AppHeader from "./AppHeader"

// Header trang tab chính (icon + tiêu đề). Có bottomOnPress thì icon là nút quay lại tự xử lý.
const HeaderBox = ({ iconName = "", icon = <></>, HeaderBoxName = "", customBox = null, bottomOnPress }) => {
  if (bottomOnPress) {
    return <AppHeader title={customBox || HeaderBoxName} onBack={bottomOnPress} />
  }

  const leftIcon = iconName.length > 0 ? <Icon className="text-primary" icon={iconName} /> : icon
  return <AppHeader title={customBox || HeaderBoxName} icon={leftIcon} />
}

HeaderBox.displayName = "zmp-navbar"
export default HeaderBox
