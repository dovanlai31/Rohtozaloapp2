import { forwardRef, useRef, useState } from "react"
import { zmp } from "zmp-framework/react"
import { Sheet } from "zmp-ui"
import {
  MdCardGiftcard,
  MdCasino,
  MdChevronRight,
  MdExpandLess,
  MdExpandMore,
  MdLocalOffer,
  MdSearch,
  MdWarningAmber,
} from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import { Button, QtyStepper } from "@components/ui"
import { useHideMainNav } from "../../../hooks/useHideMainNav"
import { chiaSoLuong, chooserInfo, conTon, quotaOf } from "@utils/kmRules"

const money = (n) => `${formatCurrency(Number(n) || 0, true)} ₫`

// Một dòng trả thưởng: icon + nội dung + giá trị bên phải
const RewardLine = ({ icon, children, right }) => (
  <div className="flex items-start gap-2 py-1">
    <span className="mt-[1px] flex shrink-0">{icon}</span>
    <div className="min-w-0 flex-1 text-[13px] leading-snug text-slate-600">{children}</div>
    {right}
  </div>
)

const SO_DONG_HIEN_SAN = 5 // danh sách sản phẩm trả dài thì chỉ hiện sẵn 5 dòng, còn lại bấm "Xem thêm"

// Danh sách sản phẩm trả có nút ẩn/hiện: mặc định hiện SO_DONG_HIEN_SAN dòng
const CollapsibleRows = ({ items, renderItem }) => {
  const [expanded, setExpanded] = useState(false)
  const hidden = items.length - SO_DONG_HIEN_SAN
  const list = expanded || hidden <= 0 ? items : items.slice(0, SO_DONG_HIEN_SAN)

  return (
    <>
      {list.map(renderItem)}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-0.5 flex w-auto items-center gap-0.5 border-0 bg-transparent p-0 py-1 text-[12px] font-semibold text-primary"
        >
          {expanded ? (
            <>
              Thu gọn <MdExpandLess size={16} />
            </>
          ) : (
            <>
              Xem thêm {hidden} sản phẩm <MdExpandMore size={16} />
            </>
          )}
        </button>
      )}
    </>
  )
}

const giftIcon = <MdCardGiftcard size={16} className="text-[#c26a00]" />
const discountIcon = <MdLocalOffer size={15} className="text-[#e5232a]" />

// Một chương trình khuyến mãi được áp cho đơn (trong giỏ hàng)
const RowItemKMBanhang = forwardRef((data, ref) => {
  const { item, index, updateItemKM, setIsShowModalKm, handleShowvongQuay } = data
  const [MaxTT, setMaxTT] = useState(0)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProductRow, setSelectedProductRow] = useState(null)
  const [tempSpTra, setTempSpTra] = useState([])
  const [searchText, setSearchText] = useState("")
  const [chooser, setChooser] = useState(null) // { kind, max, price, unit } của dòng đang chọn quà
  const dialog = useRef(null)
  useHideMainNav(showProductModal)

  const handleShowSpKm = (value, item, index, i) => {
    const info = chooserInfo(value, item)
    if (!info) return
    setIsShowModalKm(true)
    setChooser(info)
    setMaxTT(info.max)
    setSearchText("")
    setShowProductModal(true)
    setSelectedProductRow({ value, item, index, i })

    // chỉ hiện sản phẩm còn tồn, giá từ thấp đến cao; giữ lại số lượng đã chọn trước đó
    const daChon = value.spTra_xuly || []
    const list = (value.spTra || [])
      .filter(conTon)
      .map((sp) => {
        const MA = sp.MA ?? sp.ma
        const old = daChon.find((x) => x.MA === MA)
        return { ...sp, MA, TEN: sp.TEN ?? sp.ten, gia: info.price(sp), soluong: old ? Number(old.soluong) || 0 : 0 }
      })
      .sort((a, b) => a.gia - b.gia)
      .sort((a, b) => b.soluong - a.soluong)
    setTempSpTra(list)
  }

  const fmtMax = (n) => (chooser?.unit === "điểm" ? `${formatCurrency(Number(n) || 0, true)} điểm` : money(n))

  // Chia số lượng "bất kỳ trong": tổng không vượt số lượng được hưởng, không vượt tồn kho
  const setSoLuongChia = (value, k, v) => {
    const quota = quotaOf(value, item)
    const sp = value.spTra[k]
    let val = Math.max(0, Number(v) || 0)
    const others = value.spTra.reduce((t, x, j) => (j === k ? t : t + (Number(x.soluong) || 0)), 0)
    if (others + val > quota) {
      showDialog(`Tổng số lượng quà không được vượt quá ${quota}`)
      val = Math.max(0, quota - others)
    }
    if (sp.tonkho !== undefined && sp.tonkho !== null && val > Number(sp.tonkho)) {
      showDialog(`Sản phẩm ${sp.TEN ?? sp.ten} chỉ còn ${sp.tonkho}`)
      val = Math.max(0, Number(sp.tonkho))
    }
    sp.soluong = val
    updateItemKM(item)
  }

  const closeModal = () => {
    setShowProductModal(false)
    setIsShowModalKm(false)
  }

  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div class="dialog-text">' + msg + "</div>",
      buttons: [{ text: "Đóng" }],
    })
    dialog.current?.open()
  }

  const tongChon = tempSpTra.reduce((sum, sp) => sum + (Number(sp.soluong * sp.gia) || 0), 0)

  // Nhập số lượng cho từng sản phẩm trả, tổng giá trị không vượt quá hạn mức
  const handleChangeSoluong = (sp, val) => {
    let newArr = [...tempSpTra]
    val = Math.max(0, Number(val) || 0)
    const idx = newArr.findIndex((x) => x.MA === sp.MA)
    if (idx === -1) return
    newArr[idx] = { ...newArr[idx], soluong: val }
    const total = newArr.reduce((sum, x) => sum + (Number(x.soluong * x.gia) || 0), 0)
    const ton = newArr[idx].tonkho
    if (ton !== undefined && ton !== null && val > Number(ton)) {
      showDialog(`Sản phẩm ${newArr[idx].TEN} chỉ còn ${ton}`)
      newArr[idx] = { ...newArr[idx], soluong: Math.max(0, Number(ton)) }
      setTempSpTra(newArr)
      return
    }
    if (total > MaxTT) {
      showDialog(`Tổng giá trị quà không được vượt quá ${fmtMax(MaxTT)}`)
      const others = total - (Number(newArr[idx].soluong * newArr[idx].gia) || 0)
      newArr[idx] = { ...newArr[idx], soluong: Math.max(0, Math.floor((MaxTT - others) / newArr[idx].gia)) }
    }
    setTempSpTra(newArr)
  }

  // Xác nhận chọn quà
  const handleConfirmSpTra = () => {
    if (!tempSpTra.some((sp) => Number(sp.soluong) > 0)) {
      showDialog("Vui lòng chọn ít nhất 1 quà")
      return
    }
    if (selectedProductRow) {
      const { item, i } = selectedProductRow
      item.trakhuyenmai[i].spTra_xuly = tempSpTra.filter((sp) => Number(sp.soluong) > 0).map((sp) => ({ ...sp }))
      item.trakhuyenmai[i].chontkm = true
      updateItemKM(item)
    }
    setSelectedProductRow(null)
    closeModal()
  }

  const q = searchText.trim().toLowerCase()
  const filteredSp = tempSpTra.filter(
    (sp) => !q || sp.TEN?.toLowerCase().includes(q) || sp.MA?.toLowerCase().includes(q)
  )

  const renderValue = (value, i) => {
    const hasWheel = (value.spTra_vongquay || []).length > 0

    // Vòng quay may mắn
    if (hasWheel) {
      return (
        <div key={i} className="py-1">
          {!item.ketqua_vongquay ? (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-[#fff8f0] px-3 py-2">
              <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-slate-600">
                <MdCasino size={16} className="shrink-0 text-[#c26a00]" />
                Bạn có lượt quay thưởng
              </span>
              <Button
                size="sm"
                className="shrink-0 !bg-[#f59e0b]"
                onClick={() => handleShowvongQuay(value, item)}
              >
                Quay ngay
              </Button>
            </div>
          ) : (
            item.ketqua_vongquay.map((sp, k) => (
              <RewardLine key={k} icon={<MdCasino size={16} className="text-[#c26a00]" />}>
                <span className="text-slate-500">Vòng quay {k + 1}: </span>
                {sp.LOAI === 1 && <b className="font-semibold text-slate-700">{money(sp.tongTien)}</b>}
                {sp.LOAI === 2 && <b className="font-semibold text-slate-700">Chiết khấu {sp.chietKhau}</b>}
                {sp.LOAI === 3 && <b className="font-semibold text-slate-700">{sp.traDIENGIAI}</b>}
              </RewardLine>
            ))
          )}
        </div>
      )
    }

    const info = chooserInfo(value, item)
    const chonQua = !!info
    const isDiscount = (value.loai == 1 || value.loai == 2) && !chonQua
    const traSp = (value.loai == 3 || value.loai == 5) && !chonQua
    const chia = traSp && chiaSoLuong(value, item)
    const daChon = value.spTra_xuly || []
    const quota = quotaOf(value, item)
    // bất kỳ trong (không cho chọn): dồn hết vào sản phẩm đầu; còn lại: các sản phẩm có số lượng
    const spTang = !traSp || chia
      ? []
      : value.hinhthuc == 2
      ? (value.spTra || []).slice(0, 1).map((sp) => ({ ...sp, soluong: quota }))
      : (value.spTra || []).filter((sp) => Number(sp.soluong) > 0)
    const tongChia = chia ? (value.spTra || []).reduce((t, sp) => t + (Number(sp.soluong) || 0), 0) : 0

    return (
      <div key={i}>
        <RewardLine
          icon={isDiscount ? discountIcon : giftIcon}
          right={
            isDiscount ? (
              <span className="shrink-0 text-[13px] font-bold tabular-nums text-[#1f8a4c]">-{money(value.tongtien)}</span>
            ) : null
          }
        >
          {value.diengiai}
          {value.isvuotmuc == 1 && (
            <span className="ml-1.5 rounded bg-[#e3f4ea] px-1.5 py-[1px] align-middle text-[10px] font-semibold text-[#1f7a45]">
              Thưởng vượt
            </span>
          )}
        </RewardLine>

        {chia && (
          <div className="ml-6 mt-0.5">
            <div className={`mb-1 text-[12px] ${tongChia === quota ? "text-slate-500" : "text-[#9a5a00]"}`}>
              Chọn quà: <b className="tabular-nums">{tongChia}</b>/{quota}
            </div>
            <CollapsibleRows
              // giữ vị trí gốc k trong value.spTra vì setSoLuongChia cập nhật theo vị trí
              items={(value.spTra || []).map((sp, k) => ({ sp, k })).filter(({ sp }) => conTon(sp))}
              renderItem={({ sp, k }) => (
                <div key={sp.MA || sp.ma || k} className="flex items-center justify-between gap-2 py-1">
                  <div className="min-w-0">
                    <div className="text-[12px] leading-snug text-slate-600">{sp.TEN ?? sp.ten}</div>
                    {sp.tonkho !== undefined && sp.tonkho !== null && (
                      <div className="text-[11px] text-slate-400">Tồn {formatCurrency(sp.tonkho, true)}</div>
                    )}
                  </div>
                  <QtyStepper value={Number(sp.soluong) || 0} min={0} onChange={(v) => setSoLuongChia(value, k, v)} />
                </div>
              )}
            />
          </div>
        )}

        {spTang.length > 0 && (
          <div className="ml-6">
            <CollapsibleRows
              items={spTang}
              renderItem={(sp, k) => (
                <div key={sp.MA || k} className="flex items-start justify-between gap-2 py-0.5 text-[12px] text-slate-500">
                  <span className="min-w-0">{sp.TEN}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-slate-700">× {sp.soluong}</span>
                </div>
              )}
            />
          </div>
        )}

        {chonQua && (
          <div className="ml-6 mt-1">
            {daChon.length > 0 ? (
              <div className="mb-1.5 flex flex-col gap-0.5">
                <CollapsibleRows
                  items={daChon}
                  renderItem={(sp, k) => (
                    <div key={sp.MA || k} className="flex items-start justify-between gap-2 text-[12px] text-slate-500">
                      <span className="min-w-0">{sp.TEN}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-slate-700">× {sp.soluong}</span>
                    </div>
                  )}
                />
              </div>
            ) : (
              <div className="mb-1.5 flex items-center gap-1 text-[12px] text-[#9a5a00]">
                <MdWarningAmber size={14} className="shrink-0" />
                Chưa chọn quà
              </div>
            )}
            <button
              type="button"
              onClick={() => handleShowSpKm(value, item, index, i)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#d5e2f2] bg-[#f7faff] px-3 py-2 text-left"
            >
              <span className="text-[12px] text-slate-600">
                {daChon.length > 0 ? "Đổi quà" : "Chọn quà"} · tối đa{" "}
                <b className="font-semibold text-slate-700">
                  {info?.unit === "điểm" ? `${formatCurrency(info.max, true)} điểm` : money(info?.max)}
                </b>
              </span>
              <MdChevronRight size={18} className="shrink-0 text-primary" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={`px-3.5 py-3 ${index > 0 ? "border-t border-[#edf0f5]" : ""}`}>
        <div className="text-[13px] font-semibold leading-snug text-slate-700" style={{ overflowWrap: "anywhere" }}>
          {item.diengiai}
        </div>
        <div className="mb-1 mt-0.5 text-[11px] text-slate-400">Mã: {item.scheme}</div>
        {(item.trakhuyenmai || []).map((value, i) => (value.chontkm === false ? null : renderValue(value, i)))}
      </div>

      {/* Bảng chọn quà theo hạn mức */}
      <Sheet visible={showProductModal && !!selectedProductRow} onClose={closeModal} mask handler swipeToClose title="Chọn quà tặng">
        <div className="flex flex-col px-4" style={{ maxHeight: "72vh" }}>
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="text-slate-500">
              Tối đa <b className="tabular-nums text-slate-700">{fmtMax(MaxTT)}</b>
            </span>
            <span className="text-slate-500">
              Còn lại <b className="tabular-nums text-primary">{fmtMax(MaxTT - tongChon)}</b>
            </span>
          </div>
          <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#edf1f7]">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${MaxTT > 0 ? Math.min(100, (tongChon * 100) / MaxTT) : 0}%`, transition: "width 200ms" }}
            />
          </div>

          <div className="my-2 flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#f5f7fb] px-3 py-2">
            <MdSearch size={18} className="shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm quà theo tên hoặc mã"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full text-[14px] text-slate-700"
              style={{ border: "none", boxShadow: "none", padding: 0, background: "transparent", outline: "none" }}
            />
          </div>

          <div className="-mx-4 flex-1 overflow-y-auto px-4">
            {filteredSp.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-slate-400">Không tìm thấy quà phù hợp</div>
            ) : (
              filteredSp.map((sp, idx) => (
                <div key={sp.MA || idx} className="flex items-center justify-between gap-3 border-b border-[#edf0f5] py-2.5">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium leading-snug text-slate-700">{sp.TEN}</div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {sp.MA} · {fmtMax(sp.gia)}
                      {sp.tonkho !== undefined && sp.tonkho !== null ? ` · Tồn ${formatCurrency(sp.tonkho, true)}` : ""}
                    </div>
                  </div>
                  <QtyStepper value={Number(sp.soluong) || 0} min={0} onChange={(v) => handleChangeSoluong(sp, v)} />
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-3 py-3" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-slate-500">Đã chọn</div>
              <div className="text-[15px] font-bold tabular-nums text-slate-800">{fmtMax(tongChon)}</div>
            </div>
            <Button className="flex-1" onClick={handleConfirmSpTra}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  )
})
export default RowItemKMBanhang
