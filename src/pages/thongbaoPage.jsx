import { useEffect, useState } from "react"
import { Page, useStore, zmp } from "zmp-framework/react"
import { Sheet } from "zmp-ui"
import { openWebview } from "zmp-sdk/apis"
import { MdAttachFile, MdDateRange, MdNotifications } from "react-icons/md"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { Button, EmptyState, StatusBadge } from "@components/ui"
import { request } from "@utils/networking"
import { useHideMainNav } from "../hooks/useHideMainNav"
import { docDaDoc, luuDaDoc } from "@utils/thongbaoRead"
import store from "../store"



// "yyyy-mm-dd..." -> "dd/mm/yyyy"
const dmy = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ""
}

// Ngày giờ dạng chuỗi theo giờ máy (API trả "yyyy-mm-dd HH:mm:ss")
const parseLocal = (s) => {
  const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/)
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null
}

const thoiGian = (s) => {
  const d = parseLocal(s)
  if (!d) return ""
  const phut = Math.floor((Date.now() - d.getTime()) / 60000)
  if (phut < 1) return "Vừa xong"
  if (phut < 60) return `${phut} phút trước`
  if (phut < 60 * 24) return `${Math.floor(phut / 60)} giờ trước`
  if (phut < 60 * 24 * 7) return `${Math.floor(phut / 1440)} ngày trước`
  return dmy(s)
}

const laMoi = (s) => {
  const d = parseLocal(s)
  return !!d && Date.now() - d.getTime() < 3 * 24 * 60 * 60 * 1000
}

const coHtml = (s) => /<[a-z][\s\S]*>/i.test(s || "")
const tomTat = (s) =>
  String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const ThongbaoPage = () => {
  const CusInfo = useStore("getCusInfo")
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [daDoc, setDaDoc] = useState(docDaDoc)
  const [dangXem, setDangXem] = useState(null)
  useHideMainNav(!!dangXem)

  useEffect(() => {
    request("POST", "khachhang/getListThongbao", { userId: String(CusInfo?.KHACHHANG_fk ?? "") })
      .then((r) => r.json())
      .then((r) => {
        const data = r?.result ? JSON.parse(r.message || "[]") : []
        setList(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        console.log("Lỗi getListThongbao", e)
        setList([])
      })
      .finally(() => setLoading(false))
  }, [])

  const moThongBao = (tb) => {
    setDangXem(tb)
    if (!daDoc.has(tb.PK_SEQ)) {
      const next = new Set(daDoc)
      next.add(tb.PK_SEQ)
      setDaDoc(next)
      luuDaDoc(next)
      store.dispatch("setRefres", Date.now()) // trang chủ cập nhật số chưa đọc
    }
  }

  const docTatCa = () => {
    const next = new Set(daDoc)
    list.forEach((tb) => next.add(tb.PK_SEQ))
    setDaDoc(next)
    luuDaDoc(next)
    store.dispatch("setRefres", Date.now())
  }

  const moTep = (url) => {
    const loi = () => zmp.dialog.alert("Không mở được tệp đính kèm", "Thông báo")
    try {
      Promise.resolve(openWebview({ url })).catch(loi)
    } catch (e) {
      loi()
    }
  }

  const chuaDoc = list.filter((tb) => !daDoc.has(tb.PK_SEQ)).length

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#f5f7fb]"
    >
      <HeaderBack slot="fixed" title="Thông báo" />

      <div className="flex flex-col gap-2.5 px-4 pb-10 pt-3">
        {loading ? (
          <LoadingSpinner />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<MdNotifications size={28} />}
            title="Không có thông báo"
            desc="Bạn chưa có thông báo nào. Hãy quay lại sau nhé!"
          />
        ) : (
          <>
            <div className="flex items-center justify-between px-1 text-[12px] text-slate-500">
              <span>{chuaDoc > 0 ? `${chuaDoc} thông báo chưa đọc` : `${list.length} thông báo`}</span>
              {chuaDoc > 0 && (
                <button type="button" onClick={docTatCa} className="w-auto border-0 bg-transparent p-0 text-[12px] font-semibold text-primary">
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            {list.map((tb) => {
              const doc = daDoc.has(tb.PK_SEQ)
              return (
                <button
                  key={tb.PK_SEQ}
                  type="button"
                  onClick={() => moThongBao(tb)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left active:bg-[#f7faff] ${
                    doc ? "border-[#E3EBF6] bg-white" : "border-[#cfe0f5] bg-[#f7faff]"
                  }`}
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-primary">
                    <MdNotifications size={20} />
                    {!doc && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#e5232a]" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className={`line-clamp-2 text-[14px] leading-snug ${doc ? "font-medium text-slate-700" : "font-semibold text-slate-800"}`}>
                        {tb.TIEUDE || "Thông báo"}
                      </span>
                      {laMoi(tb.NGAYTAO) && <StatusBadge tone="danger">Mới</StatusBadge>}
                    </span>
                    {!!tomTat(tb.NOIDUNG) && (
                      <span className="mt-0.5 line-clamp-2 block text-[12px] leading-snug text-slate-500">{tomTat(tb.NOIDUNG)}</span>
                    )}
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                      <span>{thoiGian(tb.NGAYTAO)}</span>
                      {tb.NGAYKETTHUC && <span>Hiệu lực đến {dmy(tb.NGAYKETTHUC)}</span>}
                      {!!tb.fileUrl && (
                        <span className="flex items-center gap-0.5 text-primary">
                          <MdAttachFile size={12} /> Tệp đính kèm
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* Chi tiết thông báo */}
      <Sheet visible={!!dangXem} onClose={() => setDangXem(null)} mask handler swipeToClose>
        {dangXem && (
          <div className="flex flex-col px-4" style={{ maxHeight: "80vh" }}>
            <div className="text-[16px] font-semibold leading-snug text-slate-800">{dangXem.TIEUDE}</div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[12px] text-slate-500">
              <span>{thoiGian(dangXem.NGAYTAO)}</span>
              {(dangXem.NGAYBATDAU || dangXem.NGAYKETTHUC) && (
                <span className="flex items-center gap-1">
                  <MdDateRange size={13} />
                  {dmy(dangXem.NGAYBATDAU)} – {dmy(dangXem.NGAYKETTHUC)}
                </span>
              )}
            </div>
            <div className="my-3 h-px bg-[#edf0f5]" />

            <div className="-mx-4 flex-1 overflow-y-auto px-4 pb-2">
              {coHtml(dangXem.NOIDUNG) ? (
                // Nội dung soạn trên DMS (có định dạng)
                <div
                  className="text-[14px] leading-relaxed text-slate-700 [&_a]:text-primary [&_img]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: dangXem.NOIDUNG }}
                />
              ) : (
                <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-700">
                  {dangXem.NOIDUNG || "Không có nội dung"}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
              {!!dangXem.fileUrl && (
                <Button variant="soft" className="flex-1" icon={<MdAttachFile size={16} />} onClick={() => moTep(dangXem.fileUrl)}>
                  Xem tệp đính kèm
                </Button>
              )}
              <Button variant="ghost" className="flex-1" onClick={() => setDangXem(null)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </Page>
  )
}

export default ThongbaoPage
