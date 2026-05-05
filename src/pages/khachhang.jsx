import KhachhangCallModal from "@components/Account/KhachhangCallModal"
import KhachhangSupportHero from "@components/Account/KhachhangSupportHero"
import KhachhangTichLuyCard from "@components/Account/KhachhangTichLuyCard"
import SubTitle from "@components/common/SubTitle"
import KhaoSatList from "@components/KhaoSat/KhaoSatList"
import { useKhachhangPage } from "@hooks/useKhachhangPage"
import { getAPI } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import { FaBook, FaGlobe, FaListAlt, FaRegComments, FaVideo } from "react-icons/fa"
import { MdDescription } from "react-icons/md"
import { Box, Card, Link, Page, Text } from "zmp-framework/react"
import { openWebview } from "zmp-sdk"  // Thêm import ở đầu file
const Khachhang = () => {
  const {
    CusInfo,
    loading,
    dataTichLuy,
    isCallModalOpen,
    hotlineText,
    openCallScreen,
    closeCallModal,
    confirmCall,
    openChatScreen,
  } = useKhachhangPage()
  const linksRef = useRef(null)
  const [linksProgress, setLinksProgress] = useState(0)
  const [listKhaoSat, setListKhaoSat] = useState([])

  const customerLinks = [
    {
      key: "zalo",
      title: "Zalo",
      url: "https://zalo.me/2005153025265810776",
      icon: <FaRegComments size={26} />,
      iconBg: "bg-[#4d6fd1]",
      urlImg: "https://dms.rohto.com.vn:7999/AnhSanPham/Zalo.png",
    },
    {
      key: "website",
      title: "Website",
      url: "https://rohto.com.vn/",
      icon: <FaGlobe size={26} />,
      iconBg: "bg-[#6c63ff]",
      urlImg: "https://dms.rohto.com.vn:7999/AnhSanPham/Website.png",
    },
    {
      key: "catalog",
      title: "Catalog",
      url: "https://rohto.com.vn/catalogue2026/",
      icon: <FaBook size={26} />,
      iconBg: "bg-[#70c281]",
      urlImg: "https://dms.rohto.com.vn:7999/AnhSanPham/Catalog.png",
    },
    {
      key: "tailieu",
      title: "Tài liệu",
      url: "https://rohto.com.vn/tai-lieu",
      icon: <MdDescription size={26} />,
      iconBg: "bg-[#e39a42]",
      urlImg: "https://dms.rohto.com.vn:7999/AnhSanPham/TaiLieu.png",
    },
  ]

  const onLinksScroll = () => {
    const node = linksRef.current
    if (!node) return
    const maxScroll = node.scrollWidth - node.clientWidth
    if (maxScroll <= 0) {
      setLinksProgress(0)
      return
    }
    setLinksProgress(node.scrollLeft / maxScroll)
  }



  const openExternalLink = (url) => {
    openWebview({
      url: url,
      type: "browser",  // Mở bằng trình duyệt ngoài
      fail: (error) => {
        console.error("Open link failed:", error)
        // Fallback: thử cách khác
        window.open(url, "_blank")
      }
    })
  }

  useEffect(() => {
    const getListKhaoSat = async () => {
      try {

        const { data, error } = await getAPI("khaosat/getKhaoSat", "POST", {}, {})
        if (error || !data?.result) {
          console.error("getKhaoSat error:", data)
          return
        }

        if (data?.message?.includes("Info")) {
          return
        }

        const parsed = JSON.parse(data?.content || "[]")
        setListKhaoSat(parsed || [])
      } catch (err) {
        console.error("getKhaoSat exception:", err)
      }
    }

    getListKhaoSat()
  }, [])

  let tichLuyContent = (
    <KhachhangTichLuyCard loading={false} dataTichLuy={null} cusInfo={CusInfo} />
  )

  if (loading) {
    tichLuyContent = (
      <KhachhangTichLuyCard loading={true} dataTichLuy={null} cusInfo={CusInfo} />
    )
  } else if (dataTichLuy.length > 0) {
    tichLuyContent = dataTichLuy.map((item, index) => (
      <KhachhangTichLuyCard
        key={item?.PK_SEQ || `${item?.TenChuongTrinh || "tichluy"}-${index}`}
        loading={false}
        dataTichLuy={item}
        cusInfo={CusInfo}
      />
    ))
  }

  return (
    <Page className="home-page m-0">
      <KhachhangCallModal
        visible={isCallModalOpen}
        hotlineText={hotlineText}
        onConfirmCall={confirmCall}
        onCancel={closeCallModal}
      />
      <KhachhangSupportHero
        onCallClick={openCallScreen}
        onChatClick={openChatScreen}
      />

      <SubTitle title="Khảo sát khách hàng" />
      <KhaoSatList
        listKhaoSat={listKhaoSat}
        setPages={() => { }}
        setCurrentItem={() => { }}
      />

      <SubTitle title="Thông tin tích lũy" />

      {tichLuyContent}
      <Card
        className="shadown-app-1 "
        inset
        title="Đồng hành cùng Nutifood"
        style={{ fontWeight: "bold", fontSize: "30px", display: "none" }}
      >
        <Box p={1} style={styles.row} alignItems="center" flex>
          <Link
            href="/KhaoSat/?trangthai=1"
            animate
            // transition="zmp-cover-v"
            noLinkClass
            style={{ flexGrow: 1 }}
          >
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaListAlt size={15} />
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Khảo sát
              </Text>
            </Box>
          </Link>
        </Box>
        <Box p={1} style={styles.row} alignItems="center" flex>
          <Link
            href="/pageVideoList"
            animate
            transition="zmp-cover-v"
            noLinkClass
            style={{ flexGrow: 1 }}
          >
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaVideo size={15} />
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Xem video tích xu
              </Text>
            </Box>
          </Link>
        </Box>
      </Card>

      {CusInfo?.active !== "0" && <SubTitle
        title="Liên kết khách hàng"
        rightContent={
          <div className="relative h-1.5 w-14 rounded-full bg-[#cfcfd6] overflow-hidden">
            <span
              className="absolute left-0 top-0 h-1.5 w-7 rounded-full bg-[#2d5bb9] transition-all duration-150"
              style={{ transform: `translateX(${linksProgress * 28}px)` }}
            />
          </div>
        }
      />}
      <div
        ref={linksRef}
        onScroll={onLinksScroll}
        className="mx-4 mb-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CusInfo?.active !== "0" && customerLinks.map((item) => (
          <button
            key={item.key}
            onClick={() => openExternalLink(item.url)}
            className="min-w-[32%] snap-start rounded-3xl px-4 py-2 text-center shadow-sm bg-white"
          >
            <span
              className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-[22px]`}
            >
              <img
                src={item.urlImg}
                alt={item.title}
                className="h-14 w-14 object-contain rounded-[18px] "
                style={{ background: 'white' }}
              />
            </span>
            {/* <div className="text-[17px] font-bold text-[#222]">{item.title}</div> */}
          </button>
        ))}
      </div>
    </Page>
  )
}
const styles = {
  row: {
    display: "flex",
    borderBottomWidth: 1,
    borderColor: "#eeee",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
}
export default Khachhang
