import { useEffect, useMemo, useState } from "react"
import { Link, useStore, zmp } from "zmp-framework/react"
import { BsQrCodeScan } from "react-icons/bs"
import { FaGift } from "react-icons/fa"
import {
  MdAssignment,
  MdCardGiftcard,
  MdChevronRight,
  MdLocalOffer,
  MdNotifications,
  MdReceiptLong,
  MdShoppingCart,
  MdStars,
} from "react-icons/md"
import { Grid, MenuGroup, MenuRow } from "@components/ui"
import VoucherCard, { promoHref } from "@components/KhuyenMai/VoucherCard"
import { request } from "@utils/networking"
import { orderCountParts } from "@utils/accountHelpers"
import { parseDate } from "@utils/promoTime"
import { validateString } from "@utils/util"
import { getPosmSummary } from "../../services/posmService"
import { demChuaDoc } from "@utils/thongbaoRead"

/* ------------------------------ Số liệu trang chủ ------------------------------ */

// POSM chưa kiểm tra, phiếu thưởng chưa nhận, đơn chờ xác nhận (tải lại khi store "refres" đổi)
export const useHomeSummary = (CusInfo) => {
  const refres = useStore("refres")
  const [summary, setSummary] = useState({ chuaKiemTra: 0, tongPosm: 0, phieuChuaTra: 0, donChoXacNhan: 0, thongBaoMoi: 0 })
  const khId = CusInfo?.KHACHHANG_fk

  useEffect(() => {
    if (!khId) return
    const userId = validateString(khId + "", true)
    let alive = true
    Promise.all([
      getPosmSummary(userId).catch(() => ({})),
      request("POST", "khachhang/getSoLuongDonHang", { userId })
        .then((r) => r.json())
        .then((r) => (r?.result ? orderCountParts(r.message)[0] : "0"))
        .catch(() => "0"),
      // thông báo chưa đọc (so với danh sách đã đọc lưu trên máy)
      request("POST", "khachhang/getListThongbao", { userId })
        .then((r) => r.json())
        .then((r) => (r?.result ? demChuaDoc(JSON.parse(r.message || "[]")) : 0))
        .catch(() => 0),
    ]).then(([posm, sl0, tbMoi]) => {
      if (!alive) return
      setSummary({
        chuaKiemTra: Number(posm?.chuaKiemTra) || 0,
        tongPosm: Number(posm?.tongPosm) || 0,
        phieuChuaTra: Number(posm?.phieuChuaTra) || 0,
        donChoXacNhan: Number(sl0) || 0,
        thongBaoMoi: Number(tbMoi) || 0,
      })
    })
    return () => {
      alive = false
    }
  }, [khId, refres])

  return summary
}

/* ---------------------------------- ② Cần làm hôm nay ---------------------------------- */

// Chỉ hiện những việc đang có; không còn việc gì thì ẩn cả khối
export const HomeTodo = ({ summary }) => {
  const items = [
    summary.chuaKiemTra > 0 && {
      key: "posm",
      icon: <BsQrCodeScan size={16} />,
      label: `${summary.chuaKiemTra} POSM chưa kiểm tra hôm nay`,
      href: "/kiemtraposm/",
    },
    summary.donChoXacNhan > 0 && {
      key: "don",
      icon: <MdReceiptLong size={18} />,
      label: `${summary.donChoXacNhan} đơn hàng đang chờ xác nhận`,
      href: `/listdonhang/?trangthai=0&sl=${summary.donChoXacNhan}`,
    },
    summary.phieuChuaTra > 0 && {
      key: "thuong",
      icon: <FaGift size={15} />,
      label: `${summary.phieuChuaTra} phiếu thưởng chưa nhận`,
      href: "/phieutrathuong/",
    },
  ].filter(Boolean)

  if (!items.length) return null
  return (
    <MenuGroup title="Cần làm hôm nay" className="mx-4 mt-3">
      {items.map((it) => (
        <MenuRow key={it.key} icon={it.icon} label={it.label} href={it.href} />
      ))}
    </MenuGroup>
  )
}

/* ---------------------------------- ③ Lối tắt ---------------------------------- */

const Shortcut = ({ icon, label, badge, tint, href, onClick }) => {
  const inner = (
    <span className="flex flex-col items-center px-0.5 py-1">
      {/* Ô icon trắng có bóng nhẹ, nổi trên nền kính mờ của khung */}
      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-[0_3px_10px_rgba(15,45,90,0.10)] ring-1 ring-white transition-transform active:scale-95 ${tint}`}
      >
        {icon}
        {badge > 0 && (
          <span className="absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full border-2 border-white bg-[#e5232a] px-1 text-center text-[10px] font-bold leading-[14px] text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="mt-1.5 w-full truncate text-center text-[11px] font-medium text-slate-600">{label}</span>
    </span>
  )
  return href ? (
    <Link href={href} animate noLinkClass className="block min-w-0">
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className="block min-w-0 border-0 bg-transparent p-0">
      {inner}
    </button>
  )
}

export const HomeShortcuts = ({ summary, kmCount }) => {
  // màu icon (ô icon nền trắng)
  const BLUE = "text-primary"
  const ORANGE = "text-[#c26a00]"
  const GREEN = "text-[#1f7a55]"
  const RED = "text-[#e5232a]"

  return (
    // Nền kính mờ: vài mảng màu nhạt được làm mờ phía sau + lớp trắng trong mờ, để các ô icon trắng nổi lên
    <div className="relative mx-4 mt-3 overflow-hidden rounded-xl border border-white/70 bg-[#f4f8fd]">
      <span aria-hidden className="pointer-events-none absolute -left-6 -top-8 h-28 w-28 rounded-full bg-[#bcd6f2] opacity-70 blur-2xl" />
      <span aria-hidden className="pointer-events-none absolute -right-4 top-2 h-24 w-24 rounded-full bg-[#fde3c2] opacity-70 blur-2xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-[#cdeee0] opacity-70 blur-2xl" />
      <div className="relative bg-white/40 px-2 py-3 backdrop-blur-md">
      <Grid cols={4} gap={6}>
        <Shortcut icon={<MdShoppingCart size={22} />} label="Đặt hàng" tint={BLUE} href="/search?all=1" />
        <Shortcut icon={<MdReceiptLong size={22} />} label="Đơn hàng" tint={BLUE} badge={summary.donChoXacNhan} href="/listdonhang/?trangthai=-1" />
        <Shortcut
          icon={<MdLocalOffer size={21} />}
          label="Khuyến mãi"
          tint={RED}
          badge={kmCount}
          onClick={() => zmp.tab.show("#view-search")}
        />
        <Shortcut icon={<BsQrCodeScan size={19} />} label="Kiểm tra POSM" tint={GREEN} badge={summary.chuaKiemTra} href="/kiemtraposm/" />
        <Shortcut icon={<MdCardGiftcard size={22} />} label="Đổi quà" tint={ORANGE} href="/DoiQua/" />
        <Shortcut icon={<MdStars size={22} />} label="Tích lũy" tint={ORANGE} href="/TichLuyList/" />
        <Shortcut icon={<FaGift size={18} />} label="Phiếu thưởng" tint={GREEN} badge={summary.phieuChuaTra} href="/phieutrathuong/" />
        <Shortcut icon={<MdNotifications size={22} />} label="Thông báo" tint={BLUE} badge={summary.thongBaoMoi} href="/thongbaoPage/" />
      </Grid>
      </div>
    </div>
  )
}

/* ----------------------------- ④ Khuyến mãi sắp hết hạn ----------------------------- */

const PROMO_MAX = 8

export const HomePromos = ({ ListKM }) => {
  // Giữ chỉ số gốc trong ListKM để trang chi tiết lấy đúng chương trình
  const list = useMemo(() => {
    const endTime = (km) => parseDate(km.DENNGAY)?.getTime() ?? Number.MAX_SAFE_INTEGER
    return (ListKM || [])
      .map((km, index) => ({ km, index }))
      .sort((a, b) => endTime(a.km) - endTime(b.km))
      .slice(0, PROMO_MAX)
  }, [ListKM])

  if (!list.length) return null
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between px-5">
        <span className="flex items-center gap-1.5 text-[15px] font-semibold text-slate-700">
          <MdAssignment size={17} className="text-[#e5232a]" />
          Khuyến mãi sắp hết hạn
        </span>
        <button
          type="button"
          onClick={() => zmp.tab.show("#view-search")}
          className="flex w-auto items-center gap-0.5 border-0 bg-transparent p-0 text-xs font-semibold text-primary"
        >
          Tất cả <MdChevronRight size={16} />
        </button>
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1">
        {list.map(({ km, index }) => (
          <Link key={km.pk_seq || index} href={promoHref(km, index)} animate noLinkClass className="block w-[250px] shrink-0">
            <VoucherCard km={km} compact />
          </Link>
        ))}
      </div>
    </div>
  )
}
