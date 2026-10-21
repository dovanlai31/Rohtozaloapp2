import { Card, InfoRow, StatusBadge } from "@components/ui"
import { DUYET_TRUNGBAY, duocChupAnh, toDMY } from "../../services/trungbayService"
import PropTypes from "prop-types"
import { FaCamera } from "react-icons/fa"
import { MdCalendarToday, MdStorefront } from "react-icons/md"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import { Link } from "zmp-framework/react"

const kichThuoc = (item) => {
  const parts = [item.DAI, item.RONG, item.CAO].map((v) => Number(v || 0))
  return parts.some((v) => v > 0) ? parts.join(" x ") : ""
}

// Thẻ một chương trình trưng bày KH đã đăng ký (tab Khách hàng)
export default function KhachhangTrungBayCard({ item }) {
  const duyet = DUYET_TRUNGBAY[item.istradeduyet] || DUYET_TRUNGBAY[0]
  const ngayDk = toDMY(item.NgayDangKy)

  return (
    <Card className="bg-white">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef4fb] text-primary">
          <MdStorefront size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[14px] font-semibold leading-5 text-slate-700">
              {item.TenChuongTrinh}
            </div>
            <StatusBadge tone={duyet.tone}>{duyet.text}</StatusBadge>
          </div>
          {item.SCHEME && item.SCHEME !== item.TenChuongTrinh && (
            <div className="mt-0.5 text-[12px] text-slate-500">{item.SCHEME}</div>
          )}
          <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">
            <MdCalendarToday size={13} />
            {toDMY(item.TuNgay)} - {toDMY(item.DenNgay)}
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <InfoRow label="Số suất đăng ký" value={Number(item.SoSuat || 0)} />
        <InfoRow label="Kích thước (D x R x C)" value={kichThuoc(item)} />
        <InfoRow label="Ngày đăng ký" value={ngayDk} />
        <InfoRow
          label="Lần chụp gần nhất"
          value={item.LanChupCuoi ? `${toDMY(item.LanChupCuoi)} (${item.SoLanChup} lần)` : "Chưa chụp"}
        />
      </div>

      {item.tieuChi.length > 0 && (
        <div className="border-t border-[#edf0f5] pt-2">
          <div className="mb-1.5 text-[12px] text-slate-500">Tiêu chí trưng bày</div>
          <div className="flex flex-wrap gap-1.5">
            {item.tieuChi.map((t, i) => (
              <span
                key={`${t.nhan}-${i}`}
                className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[12px] text-slate-600"
              >
                {t.nhan}
                {Number(t.soluong) > 0 && ` · SL ${t.soluong}`}
                {Number(t.phantram) > 0 && ` · ${t.phantram}%`}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.images.length > 0 && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto">
          {item.images.map((src) => (
            <Zoom key={src}>
              <img
                src={src}
                alt="Ảnh trưng bày"
                className="h-16 w-16 shrink-0 rounded-lg bg-[#e9eef6] object-cover"
              />
            </Zoom>
          ))}
        </div>
      )}

      {duocChupAnh(item) ? (
        <Link
          href={`/chupanhtrungbay/?cttbId=${item.id}`}
          noLinkClass
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[13px] font-semibold !text-white active:opacity-70"
        >
          <FaCamera size={14} />
          Chụp ảnh trưng bày
        </Link>
      ) : (
        <div className="mt-3 rounded-xl bg-[#f8fafc] px-3 py-2 text-center text-[12px] text-slate-500">
          {item.istradeduyet === 2
            ? "Đăng ký không được duyệt, không thể chụp ảnh trưng bày"
            : "Đăng ký đang chờ duyệt, bạn có thể chụp ảnh sau khi được duyệt"}
        </div>
      )}
    </Card>
  )
}

KhachhangTrungBayCard.propTypes = {
  item: PropTypes.shape({
    TenChuongTrinh: PropTypes.string,
    SCHEME: PropTypes.string,
    TuNgay: PropTypes.string,
    DenNgay: PropTypes.string,
    NgayDangKy: PropTypes.string,
    LanChupCuoi: PropTypes.string,
    SoLanChup: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    SoSuat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    istradeduyet: PropTypes.number,
    DAI: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    RONG: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    CAO: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    tieuChi: PropTypes.array.isRequired,
  }).isRequired,
}
