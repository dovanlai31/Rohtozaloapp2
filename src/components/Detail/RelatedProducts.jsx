import { formatCurrency } from "@utils/networking"

const RelatedProducts = ({ list_sp_tt, onProductClick }) => {
  return (
    <div className="p-4">
      <div className="mb-3 text-[15px] font-bold text-slate-800">Sản phẩm liên quan</div>
      {list_sp_tt && list_sp_tt.length > 0 ? (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {list_sp_tt.map((sp, index) => (
            <button
              key={index + ""}
              type="button"
              onClick={() => onProductClick(sp)}
              className="w-[104px] shrink-0 border-0 bg-transparent p-0 text-left"
            >
              <span className="flex h-[96px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#E3EBF6] bg-white p-2">
                <img src={sp.HinhAnh} alt={sp.ten} loading="lazy" className="h-full w-full object-contain" />
              </span>
              <span className="mt-1.5 line-clamp-2 text-[12px] leading-tight text-slate-700">{sp.ten}</span>
              {Number(sp.dongia) > 0 && (
                <span className="mt-0.5 block text-[12px] font-semibold tabular-nums text-[#e5232a]">
                  {formatCurrency(sp.dongia, true)}đ
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="py-2 text-center text-[13px] text-slate-400">Không có sản phẩm liên quan</div>
      )}
    </div>
  )
}

export default RelatedProducts
