import { Icon, Link } from "zmp-framework/react"

// Header dùng chung cho các trang: nền trắng, nút quay lại / icon trang, tiêu đề, nút phụ bên phải.
// Chừa khoảng trống bên phải cho cụm nút ••• ✕ của Zalo.
// displayName "zmp-navbar": khi là con trực tiếp của <Page> sẽ được đặt cố định phía trên vùng cuộn.
const AppHeader = ({
  title,
  back = false, // hiện nút quay lại (router back)
  force = false,
  onBack, // tự xử lý nút quay lại thay cho router back
  onBackClick, // chạy thêm khi bấm quay lại (vẫn router back)
  icon, // icon bên trái khi không có nút quay lại (trang tab chính)
  rightText,
  onRightClick,
  right, // nội dung tuỳ ý bên phải (thay cho rightText)
  bordered = true, // tắt khi bên dưới còn thanh khác (vd. ô tìm kiếm) để liền một khối
}) => {
  const backClass =
    "!flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f5fa] border-0 p-0"
  const backIcon = <Icon color="#334155" size={20} zmp="zi-chevron-left-header"></Icon>

  return (
    <div className={`pt-st sticky top-0 z-20 w-full bg-white ${bordered ? "border-b border-[#e6ebf2]" : ""}`}>
      <div className="flex h-12 items-center gap-2 pl-3 pr-[104px]">
        {onBack ? (
          <button type="button" aria-label="Quay lại" onClick={onBack} className={backClass}>
            {backIcon}
          </button>
        ) : back ? (
          <Link back force={force} onClick={onBackClick} className={backClass}>
            {backIcon}
          </Link>
        ) : icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-primary [&_svg]:h-[18px] [&_svg]:w-[18px]">
            {icon}
          </span>
        ) : null}

        <div className="min-w-0 flex-1 truncate text-[16px] font-bold text-slate-800">{title}</div>

        {right ||
          (rightText && (
            <button
              type="button"
              onClick={onRightClick}
              className="w-auto shrink-0 rounded-full border-0 bg-[#e3edf8] px-3 py-1.5 text-xs font-semibold text-primary active:opacity-70"
            >
              {rightText}
            </button>
          ))}
      </div>
    </div>
  )
}

AppHeader.displayName = "zmp-navbar"
export default AppHeader
