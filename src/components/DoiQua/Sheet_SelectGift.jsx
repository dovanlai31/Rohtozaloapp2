import { useEffect, useState } from "react"
import { Sheet } from "zmp-ui"
import { MdCardGiftcard, MdCheck, MdSearch } from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import { Button } from "@components/ui"
import { useHideMainNav } from "../../hooks/useHideMainNav"

// Ảnh quà (không có ảnh / lỗi ảnh thì hiện icon hộp quà)
export const GiftImage = ({ src, className = "" }) => {
  const [loi, setLoi] = useState(false)
  useEffect(() => setLoi(false), [src])
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fdf3e6] ${className}`}>
      {src && !loi ? (
        <img src={encodeURI(src)} alt="" loading="lazy" onError={() => setLoi(true)} className="h-full w-full bg-white object-contain" />
      ) : (
        <MdCardGiftcard size={26} className="text-[#c26a00]" />
      )}
    </span>
  )
}

// Số xu / điểm đổi 1 quà
export const giaQua = (g) => Number(g?.diem ?? g?.gia ?? 0) || 0

const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")

/** Bảng chọn quà: tìm kiếm, chạm để chọn / bỏ chọn; quà chưa đủ mức xu / điểm thì không chọn được */
const Sheet_SelectGift = ({ SheetGiftVisible, setSheetGiftVisible, dataList, saveDataChose, setChose, xu_diem, donVi = "xu" }) => {
  const [q, setQ] = useState("")
  useHideMainNav(SheetGiftVisible)
  useEffect(() => {
    if (SheetGiftVisible) setQ("")
  }, [SheetGiftVisible])

  const list = (dataList || []).map((g, index) => ({ g, index }))
  const hien = q.trim() ? list.filter(({ g }) => normalize(`${g.ten} ${g.thongtin}`).includes(normalize(q.trim()))) : list
  const soChon = list.filter(({ g }) => g.isChose).length

  return (
    <Sheet visible={SheetGiftVisible} onClose={() => setSheetGiftVisible(false)} mask handler swipeToClose title="Chọn quà muốn đổi">
      <div className="flex flex-col px-4" style={{ maxHeight: "78vh" }}>
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-[#E3EBF6] bg-[#f5f7fb] px-3 py-2">
          <MdSearch size={18} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm quà"
            className="w-full text-[14px] text-slate-700"
            style={{ border: "none", boxShadow: "none", padding: 0, background: "transparent", outline: "none" }}
          />
        </div>

        <div className="-mx-4 flex-1 overflow-y-auto px-4">
          {hien.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-slate-400">Không có quà phù hợp</div>
          ) : (
            hien.map(({ g, index }) => {
              const duMuc = Number(xu_diem) >= Number(g?.tumuc || 0)
              const chon = !!g.isChose
              return (
                <button
                  key={g.id ?? index}
                  type="button"
                  disabled={!duMuc}
                  onClick={() => setChose("", index)}
                  className={`mb-2 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                    chon ? "border-primary bg-[#f7faff]" : "border-[#E3EBF6] bg-white"
                  } ${duMuc ? "" : "opacity-50"}`}
                >
                  <GiftImage src={g?.HinhAnh || g?.hinhanh} className="h-14 w-14" />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-[14px] font-medium leading-snug text-slate-700">{g.ten}</span>
                    {!!g.thongtin && <span className="mt-0.5 line-clamp-1 block text-[12px] text-slate-500">{g.thongtin}</span>}
                    <span className="mt-1 block text-[13px] font-bold tabular-nums text-[#c26a00]">
                      {formatCurrency(giaQua(g), true)} {donVi}
                    </span>
                    {!duMuc && (
                      <span className="block text-[11px] text-[#c23a3a]">
                        Cần tối thiểu {formatCurrency(g.tumuc, true)} {donVi}
                      </span>
                    )}
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      chon ? "border-primary bg-primary text-white" : "border-[#c5d3e6] bg-white text-transparent"
                    }`}
                  >
                    <MdCheck size={16} />
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div className="pt-2" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
          <Button full onClick={saveDataChose}>
            Xong{soChon ? ` · ${soChon} quà` : ""}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

export default Sheet_SelectGift
