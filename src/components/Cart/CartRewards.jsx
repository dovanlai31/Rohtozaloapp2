import { FaGift } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import { MdChevronRight, MdStars } from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import LoadingSpinner from "@components/LoadingSpinner"
import { SectionTitle } from "@components/ui"
import { LOAI_TRA_THUONG, tienTichLuy } from "../../hooks/useCartRewards"

const money = (n) => `${formatCurrency(Number(n) || 0, true)} ₫`

const Row = ({ icon, title, sub, loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="flex w-full items-center gap-3 border-0 bg-transparent px-3.5 py-3 text-left active:bg-[#f7faff]"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fdf3e6] text-[#c26a00]">{icon}</span>
    <span className="min-w-0 flex-1">
      <span className="block text-[14px] font-medium text-slate-700">{title}</span>
      <span className="block truncate text-[12px] text-slate-500">{sub}</span>
    </span>
    {loading ? (
      <span className="shrink-0 scale-75">
        <LoadingSpinner />
      </span>
    ) : (
      <MdChevronRight size={20} className="shrink-0 text-slate-400" />
    )}
  </button>
)

const Chosen = ({ label, value, onRemove }) => (
  <div className="flex items-center gap-2 py-1 pl-[60px] pr-3.5 text-[12px]">
    <span className="min-w-0 flex-1 truncate text-slate-600">{label}</span>
    {value && <span className="shrink-0 font-semibold tabular-nums text-[#1f8a4c]">{value}</span>}
    <button
      type="button"
      aria-label="Bỏ chọn"
      onClick={onRemove}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-slate-400"
    >
      <IoClose size={14} />
    </button>
  </div>
)

/** Khối "Ưu đãi trên đơn" trong giỏ hàng: thưởng tích lũy + phiếu trả thưởng */
const CartRewards = ({ rewards }) => {
  const { tlChon, ttChon, loadingTL, loadingTT, moTichLuy, moTraThuong, boTichLuy, boTraThuong, tienTL } = rewards

  const subTT = (x) => {
    const loai = LOAI_TRA_THUONG[x.loaitrathuong]?.label || "Trả thưởng"
    if (x.loaitrathuong == 3) return [`${loai}: ${x.scheme}`, `-${money(x.tientrathuong)}`]
    const sl = (x.sanpham || []).reduce((t, s) => t + (Number(s.soluong) || 0), 0)
    return [`${loai}: ${x.scheme}`, `${sl} sản phẩm`]
  }

  return (
    <div className="mt-4">
      <SectionTitle icon={<MdStars size={16} className="text-[#c26a00]" />}>Ưu đãi trên đơn</SectionTitle>
      <div className="overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
        <Row
          icon={<MdStars size={20} />}
          title="Thưởng tích lũy"
          sub={tlChon.length ? `Đã chọn ${tlChon.length} · -${money(tienTL)}` : "Kiểm tra thưởng tích lũy đạt được"}
          loading={loadingTL}
          onClick={moTichLuy}
        />
        {tlChon.map((x, i) => (
          <Chosen
            key={`${x.thuongtl_fk}_${i}`}
            label={x.dienGiai || x.diengiai || x.scheme}
            value={`-${money(tienTichLuy(x))}`}
            onRemove={() => boTichLuy(x)}
          />
        ))}

        <div className="border-t border-[#edf0f5]">
          <Row
            icon={<FaGift size={16} />}
            title="Phiếu trả thưởng"
            sub={ttChon.length ? `Đã chọn ${ttChon.length} phiếu` : "Dùng phiếu thưởng cho đơn hàng này"}
            loading={loadingTT}
            onClick={moTraThuong}
          />
          {ttChon.map((x) => {
            const [label, value] = subTT(x)
            return <Chosen key={x.trathuongId} label={label} value={value} onRemove={() => boTraThuong(x)} />
          })}
        </div>
        {(tlChon.length > 0 || ttChon.length > 0) && <div className="h-2" />}
      </div>
    </div>
  )
}

export default CartRewards
