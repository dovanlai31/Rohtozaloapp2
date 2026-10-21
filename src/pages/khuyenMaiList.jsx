import { useEffect, useState } from "react"
import { EmptyState, PillTabs, SectionTitle } from "@components/ui"
import { Box, Link, Page, useStore } from "zmp-framework/react"

import store from "../store"

import HeaderBox from "@components/Header/HeaderBox"
import LoadingSpinner from "@components/LoadingSpinner"
import { TbRosetteDiscountFilled } from "react-icons/tb"
import { MdAccessTime, MdLocalOffer } from "react-icons/md"
import "../styles/notifypage.scss"
import "../styles/promo-motion.css"
import { parseDate, timeInfo } from "@utils/promoTime"
import VoucherCard, { PROMO_TYPES, loaiOf } from "@components/KhuyenMai/VoucherCard"
import TichLuyProgramCard, { getTichLuyList } from "@components/TichLuy/TichLuyProgramCard"
import KhachhangTrungBayCard from "@components/Account/KhachhangTrungBayCard"
import { getCttbDaDangKy } from "../services/trungbayService"

const TABS = PROMO_TYPES

const EMPTY = {
  km: { title: "Chưa có chương trình khuyến mãi", desc: "Các ưu đãi mới sẽ hiển thị tại đây." },
  tichluy: {
    title: "Chưa tham gia chương trình tích lũy",
    desc: "Đăng ký chương trình tích lũy để nhận thêm ưu đãi khi đặt hàng.",
  },
  trungbay: {
    title: "Chưa có chương trình trưng bày",
    desc: "Liên hệ nhân viên bán hàng để đăng ký trưng bày và nhận thưởng.",
  },
}

const KhuyenMaiPage = ({ zmproute }) => {
  const ListKM = store.getters.ListKM.value || []
  const CusInfo = useStore("getCusInfo") || {}
  const refres = useStore("refres")
  const khId = CusInfo?.KHACHHANG_fk
  const [activeTab, setActiveTab] = useState("km")

  // Tab Tích lũy: chương trình tích lũy KH đang tham gia (TIEUCHITHUONGTL, không nằm trong getListKM)
  const [tichLuy, setTichLuy] = useState([])
  const [loadingTL, setLoadingTL] = useState(false)
  useEffect(() => {
    if (!khId) return
    setLoadingTL(true)
    getTichLuyList(khId, "1")
      .then((list) => setTichLuy(list || []))
      .finally(() => setLoadingTL(false))
  }, [khId])

  // Tab Trưng bày: chương trình trưng bày KH đã đăng ký (tải lại sau khi chụp ảnh trưng bày)
  const [trungBay, setTrungBay] = useState([])
  const [loadingTB, setLoadingTB] = useState(false)
  useEffect(() => {
    if (!khId) return
    setLoadingTB(true)
    getCttbDaDangKy(khId)
      .then(setTrungBay)
      .catch((e) => {
        console.log("getCttbDaDangKy error", e)
        setTrungBay([])
      })
      .finally(() => setLoadingTB(false))
  }, [khId, refres])

  // Lưu lại originalIndex để khi chuyển trang không bị lỗi index
  const withIndex = ListKM.map((km, index) => ({ ...km, originalIndex: index }))
  // Sắp hết hạn lên đầu
  const endTime = (km) => parseDate(km.DENNGAY)?.getTime() ?? Number.MAX_SAFE_INTEGER
  const kmList = withIndex
    .filter((km) => loaiOf(km) === "km")
    .sort((a, b) => endTime(a) - endTime(b))
  const sapHetHan = kmList.filter((km) => timeInfo(km.TUNGAY, km.DENNGAY).level === "soon")
  const dangDienRa = kmList.filter((km) => timeInfo(km.TUNGAY, km.DENNGAY).level !== "soon")

  const countOf = (key) =>
    key === "tichluy" ? tichLuy.length : key === "trungbay" ? trungBay.length : kmList.length

  const tabInfo = TABS.find((t) => t.key === activeTab) || TABS[0]
  const empty = (
    <EmptyState
      className="promo-enter"
      icon={<tabInfo.Icon size={24} />}
      title={EMPTY[activeTab].title}
      desc={EMPTY[activeTab].desc}
    />
  )

  // Thẻ hiện dần lần lượt (--i: thứ tự, dùng cho độ trễ của hiệu ứng)
  const enter = (i) => ({ className: "promo-enter", style: { "--i": i } })

  const renderKmGroup = (title, icon, list, offset = 0) =>
    list.length > 0 && (
      <div className="mb-3">
        <SectionTitle icon={icon} right={<span className="text-[12px] text-slate-500">{list.length}</span>}>
          {title}
        </SectionTitle>
        <div className="flex flex-col gap-2.5">
          {list.map((km, i) => (
            <Link
              key={km.scheme || km.originalIndex}
              animate
              noLinkClass
              href={`/tichluydetail?loai=2&item=${km.pk_seq}&index=${km.originalIndex}`}
              className="promo-enter block w-full"
              style={{ "--i": offset + i }}
            >
              <VoucherCard km={km} />
            </Link>
          ))}
        </div>
      </div>
    )

  let content
  if (activeTab === "tichluy") {
    content = loadingTL ? (
      <LoadingSpinner />
    ) : tichLuy.length === 0 ? (
      empty
    ) : (
      <div className="flex flex-col gap-2.5">
        {tichLuy.map((item, i) => (
          <div key={item.CTTL_FK} {...enter(i)}>
            <TichLuyProgramCard item={item} ended={false} />
          </div>
        ))}
      </div>
    )
  } else if (activeTab === "trungbay") {
    content = loadingTB ? (
      <LoadingSpinner />
    ) : trungBay.length === 0 ? (
      empty
    ) : (
      <div className="flex flex-col gap-2.5">
        {trungBay.map((item, i) => (
          <div key={item.id} {...enter(i)}>
            <KhachhangTrungBayCard item={item} />
          </div>
        ))}
      </div>
    )
  } else {
    content =
      kmList.length === 0 ? (
        empty
      ) : (
        <>
          {renderKmGroup("Sắp hết hạn", <MdAccessTime size={15} />, sapHetHan)}
          {renderKmGroup("Đang diễn ra", <MdLocalOffer size={15} />, dangDienRa, sapHetHan.length)}
        </>
      )
  }

  return (
    <Page className="detail-page bg-slate-50">
      {/* cùng icon huy hiệu % với tab Khuyến mãi ở thanh menu dưới */}
      <HeaderBox slot="fixed" icon={<TbRosetteDiscountFilled />} HeaderBoxName="Khuyến mãi" />

      {/* Tabs: đặt ở vùng cố định dưới header, không trôi khi cuộn danh sách */}
      <Box slot="fixed" m="0" p="0" className="bg-slate-50 px-4 pb-2 pt-3">
        <PillTabs
          tabs={TABS.map((t) => ({ key: t.key, label: t.label, icon: t.Icon, count: countOf(t.key) }))}
          value={activeTab}
          onChange={setActiveTab}
        />
      </Box>

      {/* key theo tab: đổi tab thì các thẻ chạy lại hiệu ứng hiện dần */}
      <div key={activeTab} className="px-4 pb-[150px] pt-1">
        {content}
      </div>
    </Page>
  )
}

export default KhuyenMaiPage
