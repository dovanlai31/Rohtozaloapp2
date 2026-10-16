import { useEffect, useState } from "react"
import { Box, Page, useStore, zmp } from "zmp-framework/react"
import { MdStars } from "react-icons/md"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { EmptyState, PillTabs } from "@components/ui"
import TichLuyProgramCard, { getTichLuyList } from "@components/TichLuy/TichLuyProgramCard"

const TABS = [
  { key: "1", label: "Đang tham gia" },
  { key: "2", label: "Đã kết thúc" },
]

const TichLuyList = () => {
  const CusInfo = useStore("getCusInfo") || {}
  const khId = CusInfo?.KHACHHANG_fk
  const [tab, setTab] = useState("1")
  const [lists, setLists] = useState({ 1: [], 2: [] })
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!khId) {
      setLoading(false)
      return Promise.resolve()
    }
    return Promise.all([getTichLuyList(khId, "1"), getTichLuyList(khId, "2")])
      .then(([a, b]) => setLists({ 1: a || [], 2: b || [] }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [khId])

  const list = lists[tab] || []

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#f5f7fb]"
    >
      <HeaderBack slot="fixed" title="Chương trình tích lũy" />

      <Box slot="fixed" m="0" p="0" className="bg-[#f5f7fb] px-4 pb-2 pt-3">
        <PillTabs
          tabs={TABS.map((t) => ({ ...t, count: loading ? undefined : (lists[t.key] || []).length }))}
          value={tab}
          onChange={setTab}
        />
      </Box>

      <div className="flex flex-col gap-3 px-4 pb-10 pt-1">
        {loading ? (
          <LoadingSpinner />
        ) : !khId ? (
          <EmptyState icon={<MdStars size={28} />} title="Chưa có dữ liệu" desc="Vui lòng đồng bộ qua số điện thoại" />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<MdStars size={28} />}
            title={tab === "1" ? "Chưa tham gia chương trình nào" : "Chưa có chương trình đã kết thúc"}
            desc={tab === "1" ? "Các chương trình tích lũy bạn đăng ký sẽ hiển thị tại đây" : undefined}
          />
        ) : (
          list.map((item) => <TichLuyProgramCard key={item.CTTL_FK} item={item} ended={tab === "2"} />)
        )}
      </div>
    </Page>
  )
}

export default TichLuyList
