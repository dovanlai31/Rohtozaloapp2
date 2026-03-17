import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import Post from "@components/Product"
import NoDataMessage from "@components/common/NoDataMessage"
import { request } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import { Box, Icon, Page, Tab, Tabs, Text, useStore, zmp } from "zmp-framework/react"
import "../styles/app.scss"
import Color from "@components/common/Color"

const ListPost = ({ zmproute }) => {
  const datasp = useStore("latestBlogs")
  const data = useStore("categories")
  console.log('data_Check', data);
  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")
  const [vlData, setVlData] = useState({
    items: data,
  })
  const [vlDatasp, setVlDatasp] = useState({
    items: datasp.data,
  })
  const [tabLinkActive, settabLinkActive] = useState(0)
  const [tendanhmuc, setTendanhmuc] = useState("Sản phẩm danh mục")
  const [loading, setLoading] = useState(false)
  const [listData, setListData] = useState([])
  const [lastPage, setLastPage] = useState(false)

  let pageContent = null
  useEffect(() => {
    console.log("xxxxxxxxxxxxxxxxxx", datasp)
    if (zmproute.query && zmproute.query.index) {
      console.log("activeIndex: ", zmproute.query.index)
      settabLinkActive(zmproute.query.index)
      scroll(zmproute.query.index)
      zmp.tab.show("#tab-" + zmproute.query.index, true)
      getListSPDanhMuc(zmproute.query.index)
    } else getListSPDanhMuc(0)
  }, [])
  const ref = useRef(null)
  const scroll = (x) => {
    // ref.current.scrollLeft += x*40
  }
  console.log("vlData.items: ", vlData)
  const getListSPDanhMuc = async (index) => {
    setLoading(true)
    let id = vlData.items[index].PK_SEQ
    let ten = vlData.items[index].TEN
    setTendanhmuc(ten)
    let queryString = {
      userId: CusInfo?.KHACHHANG_fk,
      spId: "",
      idchungloai: id,
      ctkmid: "",
      loai: 0,
      lastId: listData.length > 0 ? listData[listData.length - 1]?.id : "",
    }
    //getdata api
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/getListSP",
          {
            userId: CusInfo?.KHACHHANG_fk,
            spId: "",
            idchungloai: id,
            ctkmid: "",
            loai: 0,
            lastId: listData.length > 0 ? listData[listData.length - 1]?.id : "",
          },
          queryString
        )
      ).json()
      if (response) {
        console.log('Check__', response);
        let p = JSON.parse(response.message)
        console.log("/khachhang/getListSpSearch: ", p)
        setListData((prev) => [...prev, ...p])

        if (listData.length + p.length >= response.content) {
          setLastPage(true)
        }
      }
    } catch (error) {
      console.log("Error request api x ", error)
      //setListData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      <HeaderBack slot="fixed" title={tendanhmuc}></HeaderBack>
      <Box className="latest ">
        <Tabs className="home-page" animated>
          {vlData.items.map((category, index) => (
            <Tab
              key={index + ""}
              id={"tab-" + index + "-tabs"}
              className="page-content-danhmuc"
              tabLinkActive={index == tabLinkActive}
            >
              <Box
                flexWrap
                m="2"
                flex
                flexDirection="row"
                justifyContent="center"
                className="gap-3"
              >
                {listData.length > 0 ? (
                  listData.map((item, i) => <Post {...item} key={i + ""} />)
                ) : (
                  <NoDataMessage />
                )}
                {loading && <LoadingSpinner />}
                {!loading && !lastPage && listData.length > 0 && (
                  <button
                    className="py-3 flex flex-row items-center justify-center"
                    onClick={() => getListSPDanhMuc(zmproute.query.index)}
                  >
                    <Text
                      className="text-brown-dark-text-size8 "
                      style={{
                        color: Color.textAPPGray,
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Xem thêm
                    </Text>
                    {/* <Icon color={Color.primary} zmp="zi-arrow-down"></Icon> */}
                  </button>
                )}
              </Box>
            </Tab>
          ))}
        </Tabs>
      </Box>
      {/* <Tabs
        scrollable
        defaultActiveKey={0}
        className="category-tabs"
      >
        {vlData.items.map((category,index) => (
          <Tabs.Tab key={index} label={category.ten}>
            <Suspense>
      
            </Suspense>
          </Tabs.Tab>
        ))}
      </Tabs> */}
      {/* <Box className="list-post" px="5" pb="10" pt={0} m="0">
        {pageContent}
      </Box> */}
    </Page>
  )
}

// const CategoryPage: FC = () => {
//   return (
//     <Page className="flex flex-col">
//       <Header title="Danh mục" />
//       <CategoryPicker />
//     </Page>
//   );
// };

export default ListPost
