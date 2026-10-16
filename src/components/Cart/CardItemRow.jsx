import store from "../../store"

import { forwardRef, useEffect, useState } from "react"
import "./../../styles/giohang.scss"
import { formatCurrency } from "@utils/networking"
import { IoClose } from "react-icons/io5"
import { QtyStepper, StatusBadge } from "@components/ui"

// Một dòng sản phẩm trong giỏ hàng
const RowItemBanhang = forwardRef((data, ref) => {
  const { item, index, updateGiohang, tinhtien, Refeshkm } = data
  const Giohang = store.getters.getGioHang.value || []
  const [soluong, updateItem] = useState(data.item.soluong)

  useEffect(() => {
    updateItem(data.item.soluong)
  }, [item.soluong])

  const setSoluongsp = (sl) => {
    let a = item
    a.soluong = sl
    a.chietkhauKM = 0
    updateItem(sl)
    store.dispatch("updateGiohang", a)
    tinhtien()
    Refeshkm?.()
  }

  const deleteP = (id) => {
    let arr = Giohang.filter((w) => w.id != id)
    updateGiohang(arr)
    store.dispatch("remoteItemGioHang", id)
  }

  const ckPercent = (item.chietkhauKM ? Number(item.chietkhauKM) : 0) + (item.nhomCkGam ? Number(item.nhomCkGam) : 0)
  const unitPrice = item.dongia * (1 - ckPercent / 100)
  const name = item.title ? item.title : item.ten

  return (
    <div key={index} className="flex gap-3 p-3">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        <img src={item.HinhAnh} alt={name} className="h-full w-full object-contain" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1">
          <div className="line-clamp-2 min-w-0 flex-1 text-[14px] font-medium leading-snug text-slate-700">{name}</div>
          <button
            type="button"
            aria-label="Xoá khỏi giỏ hàng"
            onClick={() => deleteP(item.id)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-slate-400"
          >
            <IoClose size={16} />
          </button>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[12px] text-slate-500">
          {ckPercent > 0 && <span className="line-through">{formatCurrency(item.dongia, true)}đ</span>}
          <span>
            {formatCurrency(unitPrice, true)}đ{item.donvi ? ` / ${item.donvi}` : ""}
          </span>
          {ckPercent > 0 && <StatusBadge tone="danger">-{ckPercent}%</StatusBadge>}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[15px] font-bold tabular-nums text-[#e5232a]">
            {formatCurrency(unitPrice * soluong, true)}đ
          </span>
          <QtyStepper value={soluong} min={1} onChange={(v) => setSoluongsp(v)} />
        </div>
      </div>
    </div>
  )
})
export default RowItemBanhang
