import { IoClose } from "react-icons/io5"
import { formatCurrency } from "@utils/networking"
import { QtyStepper } from "@components/ui"
import { GiftImage, giaQua } from "./Sheet_SelectGift"

/** Danh sách quà đã chọn trong đơn đổi quà: số lượng, thành tiền xu / điểm, bỏ quà */
const ViewListSpChon = ({ dataListChose, plus, diff, removeItem, donVi = "xu", disabled = false }) => (
  <div className="divide-y divide-[#edf0f5] overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
    {(dataListChose || []).map((g, index) => (
      <div key={g.id ?? index} className="flex gap-3 p-3">
        <GiftImage src={g?.HinhAnh || g?.hinhanh} className="h-16 w-16" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <div className="line-clamp-2 min-w-0 flex-1 text-[14px] font-medium leading-snug text-slate-700">{g.ten}</div>
            {!disabled && (
              <button
                type="button"
                aria-label="Bỏ quà"
                onClick={() => removeItem(g, index)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-slate-400"
              >
                <IoClose size={16} />
              </button>
            )}
          </div>
          {!!g.thongtin && <div className="mt-0.5 line-clamp-1 text-[12px] text-slate-500">{g.thongtin}</div>}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[14px] font-bold tabular-nums text-[#c26a00]">
              {formatCurrency(giaQua(g) * (Number(g.soluong) || 0), true)} {donVi}
            </span>
            {disabled ? (
              <span className="text-[13px] text-slate-500">SL: {g.soluong}</span>
            ) : (
              <QtyStepper
                value={Number(g.soluong) || 0}
                min={1}
                onChange={(v) => {
                  const cu = Number(g.soluong) || 0
                  if (v > cu) plus(g, index)
                  else if (v < cu) diff(g, index)
                }}
              />
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default ViewListSpChon
