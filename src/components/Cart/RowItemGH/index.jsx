import { forwardRef, useEffect, useState } from "react"
import "./../../../styles/giohang.scss"
import { formatCurrency } from "@utils/networking"
import { MdImage } from "react-icons/md"

// Một dòng sản phẩm trong chi tiết đơn hàng (chỉ xem)
const RowItemGH = forwardRef((data, ref) => {
  const { item, index } = data
  const [soluong, updateItem] = useState(data.item.soluong)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    updateItem(data.item.soluong)
  }, [item.soluong])

  const name = item.title ? item.title : item?.ten
  const donGia = Number(item.dongia) || 0

  return (
    <div key={index} className="flex gap-3 p-3">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {item.HinhAnh && !imgError ? (
          <img src={item.HinhAnh} alt={name} onError={() => setImgError(true)} className="h-full w-full object-contain" />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-lg bg-[#f1f5fa] text-slate-300">
            <MdImage size={22} />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-700">{name}</div>
        {item?.ma && <div className="mt-0.5 text-[11px] text-slate-500">Mã: {item.ma}</div>}
        <div className="mt-1.5 flex items-center justify-between gap-2 text-[12px]">
          <span className="text-slate-500">
            SL <b className="font-semibold text-slate-700">{formatCurrency(soluong, true)}</b>
            {donGia > 0 && <> × {formatCurrency(donGia, true)}đ</>}
          </span>
          {donGia > 0 && (
            <span className="text-[13px] font-semibold tabular-nums text-slate-700">
              {formatCurrency(Number(soluong) * donGia, true)}đ
            </span>
          )}
        </div>
      </div>
    </div>
  )
})
export default RowItemGH
