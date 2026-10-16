import { forwardRef } from "react"
import "./../../../styles/giohang.scss"
import { formatCurrency } from "@utils/networking"
import { MdCardGiftcard, MdRedeem } from "react-icons/md"

const parseSp = (s) => {
  try {
    const v = JSON.parse(s || "[]")
    return Array.isArray(v) ? v : []
  } catch (e) {
    return []
  }
}

// Một chương trình khuyến mãi được áp trong đơn hàng (chỉ xem)
const RowItemKM = forwardRef((data, ref) => {
  const { item, index } = data
  const spList = parseSp(item?.spTen)
  const bySoLuong = Number(item?.soluong) > 0

  return (
    <div key={index} className="rounded-xl border border-[#fde2c8] bg-[#fff8f0] p-3">
      <div className="flex items-start gap-2">
        <MdCardGiftcard size={18} className="mt-0.5 shrink-0 text-[#c26a00]" />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-snug text-slate-700" style={{ overflowWrap: "anywhere" }}>
            {item?.ten}
          </div>
          {item?.Scheme && <div className="mt-0.5 text-[11px] text-slate-500">{item.Scheme}</div>}
        </div>
      </div>

      {spList.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          {spList.map((spkm, i) => (
            <div key={spkm.TEN || i} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 text-[12px] text-slate-600">
              <MdRedeem size={14} className="shrink-0 text-[#c26a00]" />
              <span className="min-w-0 flex-1">{spkm.TEN}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#f3d5b5] pt-2 text-[12px]">
        <span className="text-slate-500">{bySoLuong ? "Số lượng tặng" : "Giá trị khuyến mãi"}</span>
        <span className="text-[14px] font-bold tabular-nums text-[#e5232a]">
          {bySoLuong ? formatCurrency(item?.soluong || 0, true) : `${formatCurrency(item?.TongTien || 0, true)}đ`}
        </span>
      </div>
    </div>
  )
})
export default RowItemKM
