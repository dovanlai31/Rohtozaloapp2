import { useEffect, useState } from "react"
import { PillTabs } from "@components/ui"
import { Box, Link, Page, Text, useStore } from "zmp-framework/react"

import store from "../store"

import HeaderBox from "@components/Header/HeaderBox"
import LoadingSpinner from "@components/LoadingSpinner"
import { MdDiscount } from "react-icons/md"
import { FaInbox } from "react-icons/fa6"
import "../styles/notifypage.scss"
import { parseDate } from "@utils/promoTime"
import VoucherCard, { PROMO_TYPES, loaiOf } from "@components/KhuyenMai/VoucherCard"
import TichLuyProgramCard, { getTichLuyList } from "@components/TichLuy/TichLuyProgramCard"

const TABS = PROMO_TYPES

const KhuyenMaiPage = ({ zmproute }) => {
  const ListKM = store.getters.ListKM.value || []
  const CusInfo = useStore("getCusInfo") || {}
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

  // Lưu lại originalIndex để khi chuyển trang không bị lỗi index
  const withIndex = ListKM.map((km, index) => ({ ...km, originalIndex: index }))
  // Sắp hết hạn lên đầu
  const endTime = (km) => parseDate(km.DENNGAY)?.getTime() ?? Number.MAX_SAFE_INTEGER
  const filteredList = withIndex
    .filter((km) => loaiOf(km) === activeTab)
    .sort((a, b) => endTime(a) - endTime(b))
  const countOf = (key) =>
    key === "tichluy" ? tichLuy.length : withIndex.filter((km) => loaiOf(km) === key).length

  const empty = (
    <div className="mt-20 flex flex-col items-center justify-center">
      <FaInbox size={36} color="#cbd5e1" className="mb-2" />
      <Text className="text-[13px] text-slate-400">Không có chương trình nào</Text>
    </div>
  )

  return (
    <Page className="detail-page bg-slate-50">
      <HeaderBox slot="fixed" icon={<MdDiscount />} HeaderBoxName="Khuyến mãi" />

      {/* Tabs: đặt ở vùng cố định dưới header, không trôi khi cuộn danh sách */}
      <Box slot="fixed" m="0" p="0" className="bg-slate-50 px-4 pb-2 pt-3">
        <PillTabs
          tabs={TABS.map((t) => ({ key: t.key, label: t.label, icon: t.Icon, count: countOf(t.key) }))}
          value={activeTab}
          onChange={setActiveTab}
        />
      </Box>

      <div className="px-4 pb-[150px] pt-1">
        {activeTab === "tichluy" ? (
          loadingTL ? (
            <LoadingSpinner />
          ) : tichLuy.length === 0 ? (
            empty
          ) : (
            <div className="flex flex-col gap-2.5">
              {tichLuy.map((item) => (
                <TichLuyProgramCard key={item.CTTL_FK} item={item} ended={false} />
              ))}
            </div>
          )
        ) : filteredList.length === 0 ? (
          empty
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredList.map((km) => (
              <Link
                key={km.scheme || km.originalIndex}
                animate
                noLinkClass
                href={`/tichluydetail?loai=2&item=${km.pk_seq}&index=${km.originalIndex}`}
                className="block w-full"
              >
                <VoucherCard km={km} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}

export default KhuyenMaiPage
