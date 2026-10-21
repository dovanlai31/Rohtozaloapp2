import PropTypes from "prop-types"
import { MdChevronRight } from "react-icons/md"
import { Link } from "zmp-framework/react"

// Thẻ trạng thái trống ở tab Khách hàng (chưa tham gia tích lũy / trưng bày...)
export default function KhachhangEmptyCard({ icon, title, desc, actionLabel, actionHref }) {
  return (
    <div className="mx-4 mb-4 rounded-xl border border-[#E3EBF6] bg-white px-4 py-5 text-center">
      <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4fb] text-primary">
        {icon}
      </span>
      <div className="text-[14px] font-semibold text-slate-700">{title}</div>
      {desc && <div className="mx-auto mt-1 max-w-[260px] text-[13px] leading-5 text-slate-500">{desc}</div>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          noLinkClass
          className="mx-auto mt-4 inline-flex items-center gap-0.5 rounded-full bg-[#eef4fb] px-4 py-2 text-[13px] font-semibold !text-primary"
        >
          {actionLabel}
          <MdChevronRight size={18} />
        </Link>
      )}
    </div>
  )
}

KhachhangEmptyCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  actionLabel: PropTypes.string,
  actionHref: PropTypes.string,
}
