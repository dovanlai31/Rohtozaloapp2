/**
 * Bộ component giao diện dùng chung của mini app (xem DESIGN.md ở thư mục gốc).
 * Mọi trang mới / trang sửa lại nên dùng các component này thay vì tự viết class,
 * để giao diện đồng nhất: thẻ trắng viền mảnh, chữ dịu, tab dạng viên thuốc, màu nhấn xanh #005DAA.
 *
 * Lưu ý CSS của zmp:
 * - zmp-framework đặt `button { width: 100% }` cho MỌI nút → nút co theo nội dung phải có `w-auto`.
 * - giohang.scss có `.grid { grid-template-columns: 3fr 10fr 40px }` → lưới dùng style trực tiếp (xem <Grid>).
 * - zmp-ui / app.scss thêm viền cho input[type=text] → ô nhập dùng <TextInput>.
 */
import { FaMinus, FaPlus } from "react-icons/fa"
import { Link } from "zmp-framework/react"
import { FaInbox } from "react-icons/fa6"

const cx = (...a) => a.filter(Boolean).join(" ")

/* --------------------------------- Card --------------------------------- */

const CARD_TONE = {
  default: "border-[#E3EBF6] bg-white",
  success: "border-[#BFE6CB] bg-[#EEF9F1]",
  warning: "border-[#F7DFA3] bg-[#FFF8E6]",
  danger: "border-[#F5C2C2] bg-[#FDEEEE]",
  reward: "border-[#fde2c8] bg-[#fff8f0]",
  info: "border-[#d5e2f2] bg-[#f3f8fd]",
}

// Thẻ nội dung: nền trắng, viền mảnh, bo góc xl
export const Card = ({ tone = "default", className = "", padding = "p-3.5", children, ...rest }) => (
  <div className={cx("rounded-xl border", CARD_TONE[tone] || CARD_TONE.default, padding, className)} {...rest}>
    {children}
  </div>
)

/* ----------------------------- SectionTitle ----------------------------- */

// Tiêu đề một mục trong trang (icon + chữ + phần phụ bên phải)
export const SectionTitle = ({ icon, children, right, className = "" }) => (
  <div className={cx("mb-2 flex items-center justify-between gap-2 px-1", className)}>
    <span className="flex min-w-0 items-center gap-1.5 text-[14px] font-semibold text-slate-700">
      {icon && <span className="flex shrink-0 text-primary">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
    {right}
  </div>
)

/* ------------------------------- PillTabs ------------------------------- */

/**
 * Thanh tab dạng viên thuốc.
 * tabs: [{ key, label, icon?: Component, count?: number }]
 * variant: "solid" (tab chọn nền xanh, dùng cho tab nội dung)
 *          "segmented" (tab chọn nền trắng trên nền xám, dùng cho bộ lọc / sắp xếp)
 */
export const PillTabs = ({ tabs, value, onChange, variant = "solid", className = "" }) => {
  const seg = variant === "segmented"
  return (
    <div
      className={cx(
        "flex rounded-full border border-[#E3EBF6]",
        seg ? "bg-[#f5f7fb] p-0.5" : "bg-white p-1",
        className
      )}
    >
      {tabs.map((t) => {
        const active = value === t.key
        const Icon = t.icon
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cx(
              "flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border-0 text-[12px]",
              seg ? "py-1.5 font-semibold" : "py-2 font-bold",
              active
                ? seg
                  ? "bg-white text-primary shadow-sm"
                  : "bg-primary text-white"
                : seg
                ? "bg-transparent text-slate-500"
                : "bg-transparent text-primary"
            )}
          >
            {Icon && <Icon size={14} className="shrink-0" />}
            <span className="truncate">{t.label}</span>
            {t.count !== undefined && (
              <span
                className={cx(
                  "min-w-[18px] shrink-0 rounded-full px-1.5 text-[11px]",
                  active && !seg ? "bg-white text-primary" : "bg-[#e3edf8] text-primary"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------ StatusBadge ----------------------------- */

const BADGE_TONE = {
  success: "bg-[#e3f4ea] text-[#1f7a45]",
  warning: "bg-[#fdf1dc] text-[#9a5a00]",
  danger: "bg-[#fdecec] text-[#c23a3a]",
  info: "bg-[#e7effa] text-primary",
  neutral: "bg-[#f1f5f9] text-slate-500",
}

// Nhãn trạng thái nhỏ (Đã trả, Chưa kiểm tra, Sắp hết hạn...)
export const StatusBadge = ({ tone = "neutral", children, className = "" }) => (
  <span
    className={cx(
      "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
      BADGE_TONE[tone] || BADGE_TONE.neutral,
      className
    )}
  >
    {children}
  </span>
)

/* -------------------------------- InfoRow ------------------------------- */

// Dòng "nhãn — giá trị" trong thẻ thông tin (tự ẩn khi không có giá trị)
export const InfoRow = ({ label, value, divider = true, className = "" }) =>
  value || value === 0 ? (
    <div
      className={cx(
        "flex items-start justify-between gap-3 py-2 text-[13px]",
        divider && "border-t border-[#edf0f5]",
        className
      )}
    >
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right text-slate-700" style={{ overflowWrap: "anywhere" }}>
        {value}
      </span>
    </div>
  ) : null

/* ------------------------------- QtyStepper ----------------------------- */

// Bộ tăng/giảm số lượng dạng viên thuốc (ngang, hoặc dọc khi vertical)
export const QtyStepper = ({ value, onChange, min = 0, vertical = false, full = false, className = "" }) => {
  const btn = "flex h-8 w-8 items-center justify-center border-0 bg-transparent text-primary"
  const dec = (
    <button type="button" aria-label="Giảm số lượng" className={btn} onClick={() => onChange(Math.max(min, value - 1))}>
      <FaMinus size={10} />
    </button>
  )
  const inc = (
    <button type="button" aria-label="Tăng số lượng" className={btn} onClick={() => onChange(value + 1)}>
      <FaPlus size={10} />
    </button>
  )
  const num = <span className="min-w-[24px] text-center text-[13px] font-semibold tabular-nums text-slate-700">{value}</span>
  return (
    <div
      className={cx(
        "flex shrink-0 items-center rounded-full border border-[#d5e2f2] bg-white",
        vertical && "flex-col",
        full && !vertical && "w-full justify-between",
        className
      )}
    >
      {vertical ? (
        <>
          {inc}
          {num}
          {dec}
        </>
      ) : (
        <>
          {dec}
          {num}
          {inc}
        </>
      )}
    </div>
  )
}

/* ---------------------------------- Button ------------------------------ */

const BTN_VARIANT = {
  primary: "border-0 bg-primary text-white active:opacity-80",
  danger: "border-0 bg-[#e5232a] text-white active:opacity-80",
  success: "border-0 bg-[#1f8a4c] text-white active:opacity-80",
  outline: "border border-primary bg-white text-primary active:bg-[#f3f8fd]",
  soft: "border-0 bg-[#e3edf8] text-primary active:opacity-80",
  ghost: "border border-[#d5e2f2] bg-white text-slate-600 active:bg-[#f7faff]",
}

// Nút chuẩn. full = rộng hết; size: "md" (nút chính) | "sm" (nút nhỏ dạng viên thuốc)
export const Button = ({ variant = "primary", full = false, size = "md", icon, children, className = "", disabled, ...rest }) => (
  <button
    type="button"
    disabled={disabled}
    className={cx(
      "flex items-center justify-center gap-1.5 font-semibold",
      size === "sm" ? "rounded-full px-3 py-1.5 text-[12px]" : "rounded-xl px-4 py-3 text-[14px]",
      full ? "w-full" : "w-auto",
      BTN_VARIANT[variant] || BTN_VARIANT.primary,
      disabled && "opacity-50",
      className
    )}
    {...rest}
  >
    {icon}
    {children}
  </button>
)

/* ------------------------------- EmptyState ----------------------------- */

// Trạng thái trống / không có dữ liệu
export const EmptyState = ({ icon, title = "Không có dữ liệu", desc, action, className = "" }) => (
  <div className={cx("flex flex-col items-center px-6 py-14 text-center", className)}>
    <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4fb] text-primary">
      {icon || <FaInbox size={24} />}
    </span>
    <div className="text-[14px] font-semibold text-slate-700">{title}</div>
    {desc && <div className="mt-1 text-[13px] text-slate-500">{desc}</div>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

/* ---------------------------------- Grid -------------------------------- */

// Lưới n cột (style trực tiếp để tránh rule .grid của giohang.scss)
export const Grid = ({ cols = 2, gap = 10, className = "", children }) => (
  <div className={className} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
    {children}
  </div>
)

/* ------------------------------- TextInput ------------------------------ */

// Ô nhập bo tròn có icon; tắt viền/bóng mặc định của zmp-ui và app.scss
export const TextInput = ({ icon, right, className = "", inputRef, ...inputProps }) => (
  <div
    className={cx(
      "flex h-10 items-center gap-2 rounded-full border border-[#E3EBF6] bg-[#f1f5fa] pl-3.5 pr-1.5 transition-colors focus-within:border-primary focus-within:bg-white",
      className
    )}
  >
    {icon && <span className="flex shrink-0 text-slate-400">{icon}</span>}
    <input
      ref={inputRef}
      type="text"
      {...inputProps}
      className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400"
      style={{ border: "none", boxShadow: "none", borderRadius: 0, padding: 0, background: "transparent", outline: "none" }}
    />
    {right}
  </div>
)

/* ------------------------------ MenuGroup / MenuRow ------------------------------ */

// Nhóm các dòng menu trong một thẻ (vd. "Quản lý đơn", "Doanh số" ở trang Tài khoản)
export const MenuGroup = ({ title, right, children, className = "" }) => (
  <div className={cx("overflow-hidden rounded-xl border border-[#E3EBF6] bg-white", className)}>
    {title && (
      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <span className="text-[14px] font-semibold text-slate-700">{title}</span>
        {right}
      </div>
    )}
    <div className="divide-y divide-[#edf0f5]">{children}</div>
  </div>
)

const VALUE_TONE = {
  default: "text-slate-700",
  primary: "text-primary",
  danger: "text-[#e5232a]",
  muted: "text-slate-400",
}

// Một dòng menu: icon tròn · nhãn (+ mô tả) · giá trị · ›
export const MenuRow = ({ icon, label, sub, value, valueTone = "primary", href, onClick, chevron = true }) => {
  const content = (
    <div className="flex items-center gap-3 px-4 py-3 active:bg-[#f7faff]">
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-primary">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] text-slate-700">{label}</span>
        {sub && <span className="block text-[12px] text-slate-500">{sub}</span>}
      </span>
      {value !== undefined && value !== null && value !== "" && (
        <span className={cx("shrink-0 text-[14px] font-semibold tabular-nums", VALUE_TONE[valueTone] || VALUE_TONE.primary)}>
          {value}
        </span>
      )}
      {chevron && (
        <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0 text-slate-300" fill="currentColor" aria-hidden="true">
          <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z" />
        </svg>
      )}
    </div>
  )
  if (href) {
    return (
      <Link href={href} animate transition="zmp-cover-v" noLinkClass className="block">
        {content}
      </Link>
    )
  }
  return (
    <div role={onClick ? "button" : undefined} onClick={onClick}>
      {content}
    </div>
  )
}
