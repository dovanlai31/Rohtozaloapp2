import React from "react"
import { Link } from "zmp-framework/react"
import "../../styles/notifypage.scss"

import LoadingSpinner from "@components/LoadingSpinner"
import { Button, EmptyState, StatusBadge } from "@components/ui"
import { MdChevronRight, MdEvent, MdReceiptLong } from "react-icons/md"
import { formatCurrency } from "@utils/networking"

type Props = {
  ListDonHang: any[]
  loading: boolean
  lastPage: boolean
  getListDonHang: () => void
}

// Đổi trạng thái kỹ thuật (IN_PREPARATION, OPEN...) sang tiếng Việt + màu nhãn
const STATUS_MAP: Record<string, [string, string]> = {
  "DMS HỦY ĐƠN": ["Đã huỷ", "danger"],
  CANCELLED: ["Đã huỷ", "danger"],
  IN_PREPARATION: ["Đang chuẩn bị", "warning"],
  OPEN: ["Đã tiếp nhận", "info"],
  IN_PROCESS: ["Đang xử lý", "info"],
  COMPLETE: ["Hoàn tất", "success"],
}

const statusOf = (raw: string = "") => {
  const text = String(raw || "").trim()
  const code = text.split(" (")[0].trim().toUpperCase()
  if (STATUS_MAP[code]) return { label: STATUS_MAP[code][0], tone: STATUS_MAP[code][1] }
  // Tên trạng thái lấy từ bảng trangthai (tiếng Việt): tô màu theo từ khoá
  const lower = text.toLowerCase()
  const has = (...k: string[]) => k.some((w) => lower.includes(w))
  if (has("huỷ", "hủy", "xóa", "xoá", "từ chối")) return { label: text, tone: "danger" }
  if (has("hoàn tất", "hoàn thành", "đã giao", "đã nhận", "thành công")) return { label: text, tone: "success" }
  if (has("chờ", "mới", "chưa")) return { label: text, tone: "warning" }
  if (has("duyệt", "chốt", "xác nhận", "đang", "giao")) return { label: text, tone: "info" }
  return { label: text || "—", tone: "neutral" }
}

// Ngày dạng yyyy-mm-dd... -> dd/mm/yyyy (giữ nguyên nếu không đúng định dạng)
const fmtDay = (s: string = "") => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s
}

const DonHang: React.FC<Props> = (props) => {
  const { ListDonHang, lastPage, loading, getListDonHang } = props

  return (
    <div className="flex w-full flex-col gap-2.5 px-4 pb-8 pt-3">
      {ListDonHang.length == 0 && !loading && (
        <div className="rounded-xl border border-[#E3EBF6] bg-white">
          <EmptyState icon={<MdReceiptLong size={24} />} title="Chưa có đơn hàng" desc="Các đơn hàng của bạn sẽ hiển thị tại đây." />
        </div>
      )}

      {ListDonHang?.map((item, index) => {
        const st = statusOf(item.Trangthai)
        const total = Number(item.TONGGIATRI) || 0
        return (
          <Link
            key={item.MADH || index}
            href={"/capnhatdonhang/?id=" + item.MADH + "&tt=1&isgiaohang=" + item.trangthai_syn + ""}
            animate
            transition="zmp-cover-v"
            noLinkClass
            className="block"
          >
            <div className="rounded-xl border border-[#E3EBF6] bg-white p-3.5 active:bg-[#f7faff]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-semibold text-slate-700">Đơn #{item.MADH}</span>
                <StatusBadge tone={st.tone as any}>{st.label}</StatusBadge>
              </div>

              <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">
                <MdEvent size={12} />
                {fmtDay(item.NGAYDH)}
              </div>

              {(item.tt === 1 || item?.kiemTraDDH === 1) && (item.KYHIEU || item.SOHOADON) && (
                <div className="mt-1 text-[12px] text-slate-500">
                  Hoá đơn: {[item.KYHIEU, item.SOHOADON].filter(Boolean).join(" - ")}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between border-t border-[#edf0f5] pt-2">
                <span className="text-[12px] text-slate-500">Tổng tiền</span>
                <span className="flex items-center gap-1">
                  <span className="text-[15px] font-bold tabular-nums text-[#e5232a]">
                    {total > 0 ? `${formatCurrency(total, true)}đ` : "—"}
                  </span>
                  <MdChevronRight size={18} className="text-slate-300" />
                </span>
              </div>
            </div>
          </Link>
        )
      })}

      {loading && <LoadingSpinner />}
      {!loading && !lastPage && ListDonHang.length > 0 && (
        <Button variant="ghost" full className="!py-2.5 text-[13px] text-primary" onClick={() => getListDonHang()}>
          Xem thêm
        </Button>
      )}
    </div>
  )
}

export default DonHang
