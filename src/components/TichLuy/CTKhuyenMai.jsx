import { useMemo, useState } from "react"
import { Link, zmp, useStore } from "zmp-framework/react"
import "../../styles/notifypage.scss"
import { FaMinus, FaPlus } from "react-icons/fa"
import {
  MdArrowForward,
  MdCardGiftcard,
  MdCheckCircle,
  MdExpandLess,
  MdExpandMore,
  MdEvent,
  MdImage,
  MdLocalOffer,
  MdShoppingCart,
} from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import { LEVEL, daysLeftText, fmtDate, timeInfo } from "@utils/promoTime"
import store from "../../store"

const money = (n) => `${formatCurrency(Math.round(Number(n) || 0), true)}đ`
const num = (n) => Number(n) || 0

const toast = (text) => zmp.toast.create({ text, position: "center", closeTimeout: 1800 }).open()

// Mô tả điều kiện "MUA" (dieukien: DIEUKIENKHUYENMAI, LOAI 1 = bắt buộc từng SP, 2 = bất kỳ trong)
const describeCondition = (dk, spList) => {
  if (!dk) return { title: "Theo điều kiện chương trình", sub: "" }
  if (num(dk.TONGTIEN_DKKM) > 0) {
    return { title: `Đơn từ ${money(dk.TONGTIEN_DKKM)}`, sub: "Tính trên các sản phẩm áp dụng" }
  }
  if (num(dk.LOAI) === 1) {
    const req = spList.filter((s) => num(s.SOLUONG) > 0)
    if (req.length === 1) return { title: `Mua ${req[0].SOLUONG} ${req[0].DVDL || ""}`.trim(), sub: req[0].TEN_SP }
    return { title: "Mua đủ số lượng từng sản phẩm", sub: `${req.length || spList.length} sản phẩm bắt buộc` }
  }
  const sl = num(dk.TONGLUONG_DKKM)
  return {
    title: `Mua ${sl} sản phẩm`,
    sub: spList.length > 1 ? `Bất kỳ trong ${spList.length} sản phẩm áp dụng` : spList[0]?.TEN_SP || "",
  }
}

// Mô tả phần thưởng "NHẬN" (tra: TRAKHUYENMAI, LOAI 1 = tiền, 2 = chiết khấu, 3 = sản phẩm)
const describeReward = (tra, spTra) => {
  if (!tra) return { title: "Ưu đãi theo chương trình", sub: "" }
  const val = String(tra.TONGTIEN || "").replace(" VND", "đ").replace(/,/g, ".")
  if (num(tra.LOAI) === 1) return { title: `Tặng ${val}`, sub: tra.DIENGIAI }
  if (num(tra.LOAI) === 2) return { title: `Chiết khấu ${val.replace(" %", "%")}`, sub: tra.DIENGIAI }
  if (spTra.length === 1) return { title: `Tặng ${val} ${spTra[0].DVDL || ""}`.trim(), sub: spTra[0].TEN_SP }
  return { title: `Tặng ${val} sản phẩm`, sub: spTra.length ? `Chọn trong ${spTra.length} sản phẩm` : tra.DIENGIAI }
}

// Tiến độ đạt điều kiện theo giỏ hàng hiện tại + số lượng còn thiếu từng sản phẩm
const calcProgress = (dk, spList, cartQty) => {
  if (!dk || !spList.length) return null
  const qty = (sp) => cartQty[String(sp.SANPHAM_FK)] || 0

  if (num(dk.TONGTIEN_DKKM) > 0) {
    const target = num(dk.TONGTIEN_DKKM)
    const current = spList.reduce((s, sp) => s + qty(sp) * num(sp.dongia), 0)
    const missingMoney = Math.max(0, target - current)
    // Bù phần thiếu bằng sản phẩm đã có trong giỏ (hoặc sản phẩm đầu tiên có giá)
    const base = spList.find((sp) => qty(sp) > 0 && num(sp.dongia) > 0) || spList.find((sp) => num(sp.dongia) > 0)
    const add = base && missingMoney > 0 ? [{ sp: base, n: Math.ceil(missingMoney / num(base.dongia)) }] : []
    return { current, target, isMoney: true, done: missingMoney <= 0, add }
  }

  if (num(dk.LOAI) === 1) {
    const req = spList.filter((sp) => num(sp.SOLUONG) > 0)
    const target = req.reduce((s, sp) => s + num(sp.SOLUONG), 0)
    const current = req.reduce((s, sp) => s + Math.min(qty(sp), num(sp.SOLUONG)), 0)
    const add = req.filter((sp) => qty(sp) < num(sp.SOLUONG)).map((sp) => ({ sp, n: num(sp.SOLUONG) - qty(sp) }))
    return { current, target, isMoney: false, done: target > 0 && add.length === 0, add }
  }

  const target = num(dk.TONGLUONG_DKKM)
  const current = spList.reduce((s, sp) => s + qty(sp), 0)
  const missing = Math.max(0, target - current)
  const base = spList.find((sp) => qty(sp) > 0) || spList[0]
  return { current, target, isMoney: false, done: target > 0 && missing === 0, add: missing > 0 ? [{ sp: base, n: missing }] : [] }
}

const toCartItem = (sp, soluong) => ({
  ...sp,
  id: sp.SANPHAM_FK,
  ten: sp.TEN_SP,
  title: sp.TEN_SP,
  ma: sp.MA_SP,
  donvi: sp.DVDL,
  HinhAnh: sp.HINHANH,
  thumbnail: sp.HINHANH,
  dongia: sp.dongia,
  soluong,
})

const SectionTitle = ({ icon, children, right }) => (
  <div className="mb-2 flex items-center justify-between px-1">
    <span className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-700">
      {icon}
      {children}
    </span>
    {right}
  </div>
)

const ProductThumb = ({ src, name }) => (
  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg">
    {src ? (
      <img src={src} alt={name || ""} loading="lazy" className="h-full w-full object-contain" />
    ) : (
      <MdImage size={22} className="text-slate-300" />
    )}
  </span>
)

const SP_HIEN_THI = 10 // số sản phẩm áp dụng hiện sẵn, còn lại bấm "Xem thêm"

const CTKhuyenMai = ({ data, CTKM }) => {
  const [showAllSp, setShowAllSp] = useState(false)
  const CusInfo = useStore("getCusInfo")
  const ListGiohang = useStore("getGioHang")
  const canBuy = CusInfo?.active !== "0"

  const parse = (s) => {
    try {
      return JSON.parse(s || "[]")
    } catch (e) {
      return []
    }
  }
  const dieukien = data.length > 0 ? parse(data[0]?.dieukien) : []
  const tra = data.length > 0 ? parse(data[0]?.tra) : []
  const sanphamdk = data.length > 1 ? parse(data[1]?.dieukien).filter((x) => x?.SANPHAM_FK) : []
  const sanphamtra = data.length > 1 ? parse(data[1]?.tra).filter((x) => x?.SANPHAM_FK) : []

  const cartQty = useMemo(() => {
    const m = {}
    ;(ListGiohang || []).forEach((it) => (m[String(it.id)] = num(it.soluong)))
    return m
  }, [ListGiohang])

  const dk = dieukien[0]
  const cond = describeCondition(dk, sanphamdk)
  const reward = describeReward(tra[0], sanphamtra)
  const progress = calcProgress(dk, sanphamdk, cartQty)
  const t = timeInfo(CTKM?.TUNGAY, CTKM?.DENNGAY)
  const lv = LEVEL[t.level]

  const setQty = (sp, n) => {
    if (n <= 0) store.dispatch("remoteItemGioHang", sp.SANPHAM_FK)
    else store.dispatch("SetAddGioHang", toCartItem(sp, n))
  }

  // Thêm đúng phần còn thiếu để đủ điều kiện (giữ nguyên số lượng đang có trong giỏ)
  const addMissing = () => {
    if (!progress?.add.length) return
    progress.add.forEach(({ sp, n }) => setQty(sp, (cartQty[String(sp.SANPHAM_FK)] || 0) + n))
    toast("Đã thêm vào giỏ hàng, đơn đã đủ điều kiện")
  }

  const backHome = () => {
    zmp.views.current.router.back()
    zmp.views.main?.router?.clearPreviousHistory()
    if (zmp.views.main?.router?.currentRoute?.path !== "/") {
      zmp.views.main.router.navigate("/", { reloadCurrent: true })
    }
    setTimeout(() => zmp.tab.show("#view-giohang"), 250)
  }

  const one = progress?.add.length === 1 ? progress.add[0] : null
  const ctaText = !progress
    ? "Xem giỏ hàng"
    : progress.done
    ? "Xem giỏ hàng"
    : one
    ? `Thêm ${one.n} ${one.sp.DVDL || ""} ${one.sp.TEN_SP} để đủ điều kiện`.replace(/\s+/g, " ")
    : "Thêm sản phẩm còn thiếu để đủ điều kiện"
  const onCta = !progress || progress.done ? backHome : addMissing
  const pct = progress && progress.target > 0 ? Math.min(100, (progress.current / progress.target) * 100) : 0

  return (
    <>
      <div className="flex flex-col gap-3 px-4 pb-32 pt-3">
        {/* Thông tin chương trình + thời gian */}
        <div className="rounded-xl border border-[#E3EBF6] bg-white p-3.5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-slate-500">
              <MdLocalOffer size={13} className="shrink-0 text-[#e5232a]" />
              <span className="truncate">{CTKM?.scheme || "Chương trình khuyến mãi"}</span>
            </span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${lv.badge}`}>{lv.label}</span>
          </div>
          <div className="text-[15px] font-semibold leading-snug text-slate-700" style={{ overflowWrap: "anywhere" }}>
            {CTKM?.diengiai || CTKM?.scheme}
          </div>
          {t.end && (
            <>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MdEvent size={12} />
                  {fmtDate(t.start)} - {fmtDate(t.end)}
                </span>
                <span className={t.level === "soon" ? "font-semibold text-[#c26a00]" : ""}>{daysLeftText(t.daysLeft)}</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#edf0f5]">
                <div className={`h-full rounded-full ${lv.bar}`} style={{ width: `${t.progress}%` }} />
              </div>
            </>
          )}
        </div>

        {/* Mua → Nhận */}
        <div className="flex items-stretch gap-2">
          <div className="min-w-0 flex-1 rounded-xl border border-[#E3EBF6] bg-white p-3">
            <div className="mb-1 text-[10px] font-bold tracking-wide text-primary">MUA</div>
            <div className="text-[14px] font-bold leading-snug text-primary">{cond.title}</div>
            {cond.sub && <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{cond.sub}</div>}
          </div>
          <span className="flex shrink-0 items-center text-slate-300">
            <MdArrowForward size={18} />
          </span>
          <div className="min-w-0 flex-1 rounded-xl border border-[#fde2c8] bg-[#fff8f0] p-3">
            <div className="mb-1 text-[10px] font-bold tracking-wide text-[#c26a00]">NHẬN</div>
            <div className="text-[14px] font-bold leading-snug text-[#e5232a]">{reward.title}</div>
            {reward.sub && <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{reward.sub}</div>}
          </div>
        </div>
        {(dieukien.length > 1 || tra.length > 1) && (
          <div className="-mt-1 px-1 text-[11px] text-slate-400">
            Chương trình có {dieukien.length} điều kiện và {tra.length} mức thưởng, xem chi tiết bên dưới.
          </div>
        )}

        {/* Tiến độ theo giỏ hàng */}
        {canBuy && progress && progress.target > 0 && (
          <div
            className={`rounded-xl border p-3 ${
              progress.done ? "border-[#BFE6CB] bg-[#EEF9F1]" : "border-[#E3EBF6] bg-white"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[13px]">
              {progress.done ? (
                <>
                  <MdCheckCircle size={18} className="shrink-0 text-[#1f8a4c]" />
                  <span className="font-semibold text-[#1f7a45]">Giỏ hàng của bạn đã đủ điều kiện nhận ưu đãi</span>
                </>
              ) : (
                <>
                  <MdShoppingCart size={16} className="shrink-0 text-primary" />
                  <span className="text-slate-600">
                    Giỏ hàng đang có{" "}
                    <b className="text-primary">
                      {progress.isMoney ? money(progress.current) : progress.current}/
                      {progress.isMoney ? money(progress.target) : progress.target}
                    </b>
                    {progress.isMoney ? "" : " sản phẩm"}
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#edf0f5]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progress.done ? "bg-[#1f8a4c]" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {!progress.done && progress.add.length > 0 && (
              <div className="mt-1.5 text-[12px] text-slate-500">
                Mua thêm{" "}
                {progress.add.map((a, i) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    <b className="font-semibold text-slate-600">
                      {a.n} {a.sp.DVDL || ""} {a.sp.TEN_SP}
                    </b>
                  </span>
                ))}{" "}
                để nhận ưu đãi
              </div>
            )}
          </div>
        )}

        {/* Sản phẩm áp dụng */}
        {sanphamdk.length > 0 && (
          <div>
            <SectionTitle icon={<MdShoppingCart size={16} className="text-primary" />}>
              Sản phẩm áp dụng ({sanphamdk.length})
            </SectionTitle>
            <div className="flex flex-col gap-2">
              {(showAllSp ? sanphamdk : sanphamdk.slice(0, SP_HIEN_THI)).map((sp) => {
                const q = cartQty[String(sp.SANPHAM_FK)] || 0
                return (
                  <div key={sp.SANPHAM_FK} className="flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white p-2.5">
                    <Link
                      href={"/detail/?id=" + sp.SANPHAM_FK}
                      animate
                      transition="zmp-cover-v"
                      noLinkClass
                      className="!flex min-w-0 flex-1 items-center gap-3"
                    >
                      <ProductThumb src={sp.HINHANH} name={sp.TEN_SP} />
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-700">{sp.TEN_SP}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {[sp.MA_SP, sp.DVDL].filter(Boolean).join(" · ")}
                          {num(sp.SOLUONG) > 0 && <span className="ml-1 font-semibold text-primary">· cần {sp.SOLUONG}</span>}
                        </div>
                        {canBuy && num(sp.dongia) > 0 && (
                          <div className="mt-0.5 text-[13px] font-bold tabular-nums text-primary">{money(sp.dongia)}</div>
                        )}
                      </div>
                    </Link>
                    {canBuy &&
                      (q === 0 ? (
                        <button
                          type="button"
                          aria-label="Thêm vào giỏ hàng"
                          onClick={() => setQty(sp, 1)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-[#e5232a] text-white active:opacity-80"
                        >
                          <FaPlus size={12} />
                        </button>
                      ) : (
                        <div className="flex shrink-0 flex-col items-center rounded-full border border-[#d5e2f2] bg-white">
                          <button
                            type="button"
                            aria-label="Tăng số lượng"
                            onClick={() => setQty(sp, q + 1)}
                            className="flex h-7 w-8 items-center justify-center border-0 bg-transparent text-primary"
                          >
                            <FaPlus size={10} />
                          </button>
                          <span className="text-[13px] font-semibold tabular-nums text-slate-700">{q}</span>
                          <button
                            type="button"
                            aria-label="Giảm số lượng"
                            onClick={() => setQty(sp, q - 1)}
                            className="flex h-7 w-8 items-center justify-center border-0 bg-transparent text-primary"
                          >
                            <FaMinus size={10} />
                          </button>
                        </div>
                      ))}
                  </div>
                )
              })}
            </div>
            {sanphamdk.length > SP_HIEN_THI && (
              <button
                type="button"
                onClick={() => setShowAllSp((v) => !v)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-[#E3EBF6] bg-white py-2.5 text-[13px] font-semibold text-primary active:bg-[#f7faff]"
              >
                {showAllSp ? (
                  <>
                    Thu gọn <MdExpandLess size={18} />
                  </>
                ) : (
                  <>
                    Xem thêm {sanphamdk.length - SP_HIEN_THI} sản phẩm <MdExpandMore size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Quà / thưởng nhận được */}
        {(tra.length > 0 || sanphamtra.length > 0) && (
          <div>
            <SectionTitle icon={<MdCardGiftcard size={16} className="text-[#c26a00]" />}>Quà / thưởng nhận được</SectionTitle>
            <div className="flex flex-col gap-2">
              {tra.map((r, i) => {
                const d = describeReward(r, sanphamtra)
                return (
                  <div key={r.PK_SEQ || i} className="rounded-xl border border-[#fde2c8] bg-[#fff8f0] px-3 py-2.5">
                    <div className="text-[13px] font-bold text-[#e5232a]">{d.title}</div>
                    {r.DIENGIAI && <div className="mt-0.5 text-[12px] text-slate-500">{r.DIENGIAI}</div>}
                    {r.HINHTHUC_DIENGIAI && r.HINHTHUC_DIENGIAI !== "Không xác định" && (
                      <div className="mt-0.5 text-[11px] text-slate-400">{r.HINHTHUC_DIENGIAI}</div>
                    )}
                  </div>
                )
              })}
              {sanphamtra.map((sp) => (
                <Link
                  key={sp.SANPHAM_FK}
                  href={"/detail/?id=" + sp.SANPHAM_FK}
                  animate
                  transition="zmp-cover-v"
                  noLinkClass
                  className="!flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white p-2.5"
                >
                  <ProductThumb src={sp.HINHANH} name={sp.TEN_SP} />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-700">{sp.TEN_SP}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{[sp.MA_SP, sp.DVDL].filter(Boolean).join(" · ")}</div>
                  </div>
                  {num(sp.SOLUONG) > 0 && (
                    <span className="shrink-0 rounded-full bg-[#fdf1dc] px-2 py-0.5 text-[11px] font-semibold text-[#9a5a00]">
                      x{sp.SOLUONG}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Các điều kiện khác (khi chương trình có nhiều điều kiện) */}
        {dieukien.length > 1 && (
          <div>
            <SectionTitle icon={<MdLocalOffer size={16} className="text-primary" />}>Tất cả điều kiện</SectionTitle>
            <div className="flex flex-col gap-2">
              {dieukien.map((d, i) => (
                <div key={d.PK_SEQ || i} className="rounded-xl border border-[#E3EBF6] bg-white px-3 py-2.5">
                  <div className="text-[13px] font-semibold text-slate-700">{describeCondition(d, sanphamdk).title}</div>
                  {d.DIENGIAI && <div className="mt-0.5 text-[12px] text-slate-500">{d.DIENGIAI}</div>}
                  <div className="mt-0.5 text-[11px] text-slate-400">{d.LOAI_DIENGIAI}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.length > 0 && !dieukien.length && !tra.length && !sanphamdk.length && (
          <div className="py-10 text-center text-[13px] text-slate-400">Chương trình chưa có thông tin chi tiết</div>
        )}
      </div>

      {/* Nút hành động cuối trang */}
      {canBuy && data.length > 0 && (
        <div
          className="fixed bottom-0 left-0 z-[1000] w-full border-t border-[#e6ebf2] bg-white px-4 pt-2.5"
          style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={onCta}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border-0 px-3 py-3 text-[14px] font-semibold text-white active:opacity-80 ${
              progress && !progress.done ? "bg-[#e5232a]" : "bg-primary"
            }`}
          >
            <MdShoppingCart size={18} className="shrink-0" />
            <span className="truncate">{ctaText}</span>
          </button>
        </div>
      )}
    </>
  )
}

export default CTKhuyenMai
