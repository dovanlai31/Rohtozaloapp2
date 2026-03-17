import Header from "@components/Header"
import { Pages } from "@components/KhaoSat/Constants"
import KhaoSatDetail from "@components/KhaoSat/KhaoSatDetail"
import KhaoSatList from "@components/KhaoSat/KhaoSatList"
import LoadingSpinner from "@components/LoadingSpinner"
import { getAPI } from "@utils/networking"
import { useEffect, useState } from "react"
import { Box, Page, useStore, zmp } from "zmp-framework/react"
import "../styles/notifypage.scss"
import HeaderBox from "@components/Header/HeaderBox"

const KhaoSat = () => {
  const [pages, setPages] = useState([])
  const [currentItem, setCurrentItem] = useState({})
  const [loading, setLoading] = useState(false)
  const [listKhaoSat, setListKhaoSat] = useState([])

  // const listKhaoSat = useStore("getListKhaoSat")
  const phoneNumber = useStore("getPhoneNumner")

  useEffect(() => {
    getListKhaoSat()
    setPages((prev) => [Pages.List])
  }, [])

  const getListKhaoSat = async () => {
    try {
      const url = "khaosat/getKhaoSat"
      const { data, error } = await getAPI(url, "POST", {}, {})

      if (error || !data.result) {
        console.error(data)
      } else {
        if (data.message.includes("Info")) {
          console.log(data.message)
        } else {
          console.log(data)
          setListKhaoSat(JSON.parse(data.content || "[]"))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleBack = () => {
    setPages((prev) => prev.slice(0, -1))
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
      style={{ background: "#f8f8f8" }}
    >
      {pages[pages.length - 1] === Pages.List && <Header back>Khảo sát</Header>}
      {pages[pages.length - 1] === Pages.Detail && (
        <HeaderBox
          HeaderBoxName="Khảo sát > Câu hỏi"
          bottomOnPress={handleBack}
          iconName="zi-chevron-left-header"
        />
      )}
      <Box
        className="latest relative"
        m="0"
        p="0"
        flex
        justifyContent="center"
        height="100%"
      >
        {loading && (
          <div
            className="w-full h-full absolute z-50 flex items-center justify-center text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, .3)" }}
          >
            <LoadingSpinner />
            Cảm ơn bạn vì đã chờ hệ thống xử lí
          </div>
        )}
        {pages[pages.length - 1] == Pages.List && (
          <KhaoSatList
            listKhaoSat={listKhaoSat}
            setPages={setPages}
            setCurrentItem={setCurrentItem}
          />
        )}
        {pages[pages.length - 1] == Pages.Detail && (
          <KhaoSatDetail
            currentItem={currentItem}
            setPages={setPages}
            pages={pages}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </Box>
    </Page>
  )
}

export default KhaoSat
