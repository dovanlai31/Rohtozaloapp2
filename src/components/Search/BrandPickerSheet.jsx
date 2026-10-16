import CategoryThumb from "@components/DanhMucSP/CategoryThumb"
import { useEffect, useMemo, useState } from "react"
import { MdCheckCircle, MdSearch } from "react-icons/md"
import { Sheet } from "zmp-ui"

// Bỏ dấu tiếng Việt để tìm "rohto" khớp "Rohto", "hada" khớp "Hada Labo"...
const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()

// Bảng chọn nhãn hàng trượt lên từ đáy màn hình
// brands: [{ id, ten, hinhAnh }], value: id đang chọn ("" = tất cả)
const BrandPickerSheet = ({ visible, onClose, brands, value, onChange }) => {
  const [q, setQ] = useState("")
  useEffect(() => {
    if (visible) setQ("")
  }, [visible])

  const list = useMemo(() => {
    const k = normalize(q.trim())
    return k ? brands.filter((b) => normalize(b.ten).includes(k)) : brands
  }, [brands, q])

  const pick = (id) => {
    onChange(id)
    onClose()
  }

  const Item = ({ id, ten, hinhAnh, index }) => {
    const active = value === id
    return (
      <button
        type="button"
        onClick={() => pick(id)}
        className={`relative flex min-w-0 flex-col items-center rounded-xl border bg-white px-1 pb-2 pt-2.5 ${
          active ? "border-primary bg-[#f3f8fd]" : "border-[#E3EBF6]"
        }`}
      >
        {active && <MdCheckCircle size={16} className="absolute right-1.5 top-1.5 text-primary" />}
        {id ? (
          <CategoryThumb src={hinhAnh} name={ten} index={index} className="h-12 w-12 p-1.5" />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4fb] text-[12px] font-bold text-primary">
            Tất cả
          </span>
        )}
        <span
          className={`mt-1.5 line-clamp-2 w-full text-center text-[12px] leading-tight ${
            active ? "font-semibold text-primary" : "text-slate-700"
          }`}
          style={{ overflowWrap: "anywhere" }}
        >
          {id ? ten : "Tất cả nhãn hàng"}
        </span>
      </button>
    )
  }

  return (
    <Sheet visible={visible} onClose={onClose} mask handler swipeToClose title="Chọn nhãn hàng">
      <div className="flex flex-col px-4 pb-4" style={{ maxHeight: "70vh" }}>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#f5f7fb] px-3 py-2">
          <MdSearch size={18} className="shrink-0 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm nhãn hàng"
            style={{ border: "none", boxShadow: "none", borderRadius: 0, padding: 0, background: "transparent", outline: "none" }}
            className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-slate-800 outline-none"
          />
        </div>

        <div className="overflow-y-auto pb-2">
          {/* Lưới 3 cột bằng style trực tiếp (giohang.scss có rule .grid ghi đè class grid) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {!q && <Item id="" index={0} />}
            {list.map((b, i) => (
              <Item key={b.id} id={b.id} ten={b.ten} hinhAnh={b.hinhAnh} index={i} />
            ))}
          </div>
          {list.length === 0 && (
            <div className="py-8 text-center text-[13px] text-slate-400">Không tìm thấy nhãn hàng</div>
          )}
        </div>
      </div>
    </Sheet>
  )
}

export default BrandPickerSheet
