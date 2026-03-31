import ProgressBar from "@ramonak/react-progress-bar"
import { formatCurrency } from "@utils/networking"
import PropTypes from "prop-types"
import { Card, Link } from "zmp-framework/react"
import {
  MdApartment,
  MdCalendarToday,
  MdDescription,
  MdShoppingCart,
  MdStackedLineChart,
  MdTaskAlt,
} from "react-icons/md"
import { FaCoins } from "react-icons/fa"

function StateMessage({ children, className }) {
  return <div className={className}>{children}</div>
}

StateMessage.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

StateMessage.defaultProps = {
  className: "",
}

function InfoTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <table className="w-full table-fixed">
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.label}>
              <td className="w-1/2 px-1 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#3b5ea8]">
                    {row.icon}
                  </span>
                  <span className="truncate text-[14px]  text-[#878787]">
                    {row.label}
                  </span>
                </div>
              </td>
              <td className="w-1/2 px-1 py-2.5 text-right">
                <span className={`text-[16px] font-bold ${row.valueClassName}`}>
                  {row.value}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

InfoTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
      valueClassName: PropTypes.string,
    })
  ).isRequired,
}

function OutlineActionLink({ href, label, icon, padding, variant }) {
  return (
    <Link
      href={href}
      className={`w-full rounded-2xl text-center ${
        variant === "primary"
          ? "bg-[#3b5ea8] !text-white"
          : "bg-[#e9edf5] !text-[#3b5ea8]"
      }`}
      style={{ padding }}
    >
      <span className="flex items-center justify-center gap-1 text-[14px] ">
        {icon}
        {label}
      </span>
    </Link>
  )
}

OutlineActionLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "muted"]),
  padding: PropTypes.string,
}

OutlineActionLink.defaultProps = {
  variant: "muted",
  padding: undefined,
}

export default function KhachhangTichLuyCard({ loading, dataTichLuy, cusInfo }) {
  const hasData = !!dataTichLuy
  const progress = dataTichLuy?.PhanTram ?? 0
  const infoRows = [
    {
      icon: <MdTaskAlt size={18} />,
      label: "Chương trình",
      value: dataTichLuy?.TenChuongTrinh || "---",
      valueClassName: "text-[#262936]",
    },
    {
      icon: <MdShoppingCart size={18} />,
      label: "Doanh thu cam kết",
      value: formatCurrency(dataTichLuy?.DoanhThuCamKet ?? 0, true),
      valueClassName: "text-[#2f3345]",
    },
    {
      icon: <MdStackedLineChart size={18} />,
      label: "Doanh thu thực hiện",
      value: formatCurrency(dataTichLuy?.DoanhThuThucHien ?? 0, true),
      valueClassName: "text-[#d5961f]",
    },
  ]

  if (loading) {
    return (
      <Card className="shadown-app-1 " inset>
        <div className="w-full rounded-[10px] p-4 text-left">
          <StateMessage className="text-center text-[11px] text-gray-500">
            Đang tải dữ liệu...
          </StateMessage>
        </div>
      </Card>
    )
  }

  return (
    <Card className="shadown-app-1  mx-4 overflow-hidden rounded-2xl bg-white">
      <div className="w-full p-4 text-left">
        {hasData ? (
          <>
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3b5ea8] text-2xl text-white">
                <MdApartment />
              </span>
              <div className="min-w-0">
                <div className="line-clamp-2 text-[17px] font-extrabold leading-6 text-[#242632]">
                  {cusInfo?.tenkh ?? "Khách hàng"}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#e8ebf4] px-3 py-1 text-[13px] font-bold text-[#3b5ea8]">
                  <MdCalendarToday size={14} />
                  {dataTichLuy.TuNgay ?? ""} - {dataTichLuy.DenNgay ?? ""}
                </div>
              </div>
            </div>

            <div className="mb-4 border-t border-[#F2F2F2]" />

            <InfoTable rows={infoRows} />

            <div className="mt-2 rounded-2xl bg-[#f1f2f89d] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#4a4d5f]">
                  Hoàn thành
                </span>
                <span className="rounded-full bg-[#F6F2E7] px-3 py-1 text-[14px] font-extrabold text-[#F3A81D]">
                  {progress}%
                </span>
              </div>
              <ProgressBar
                completed={progress}
                bgColor="#F5A627"
                baseBgColor="#dbdde8"
                height="10px"
                borderRadius="999px"
                className="wrapper"
                isLabelVisible={false}
                animateOnRender
              />
            </div>

            <div className="mt-5 flex gap-3">
              <OutlineActionLink
                href={`/PageTichLuyDetail/?pk_seq=${dataTichLuy?.PK_SEQ}`}
                padding="12px 10px"
                label="Chi tiết"
                icon={<MdDescription size={16} />}
                variant="primary"
              />
              <OutlineActionLink
                href="/TichLuyList"
                padding="12px 10px"
                label="Tích lũy"
                icon={<FaCoins size={16} />}
                variant="muted"
              />
            </div>
          </>
        ) : (
          <StateMessage className="py-3 text-center text-xs font-bold text-[#666]">
            Hiện tại bạn chưa tham gia chương trình tích lũy nào
          </StateMessage>
        )}
      </div>
    </Card>
  )
}

KhachhangTichLuyCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  dataTichLuy: PropTypes.shape({
    TuNgay: PropTypes.string,
    DenNgay: PropTypes.string,
    TenChuongTrinh: PropTypes.string,
    DoanhThuCamKet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    DoanhThuThucHien: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    PhanTram: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    PK_SEQ: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  cusInfo: PropTypes.shape({
    tenkh: PropTypes.string,
  }),
}

KhachhangTichLuyCard.defaultProps = {
  dataTichLuy: null,
  cusInfo: {},
}
