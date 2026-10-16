import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import Post from "@components/Product"
import NoDataMessage from "@components/common/NoDataMessage"
import { request } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import { Box, Icon, Page, Tab, Tabs, useStore, zmp } from "zmp-framework/react"
import "../styles/app.scss"
import Color from "@components/common/Color"
import DanhmucItem from "@components/DanhMucSP/DanhmucItem"
import CategoryThumb from "@components/DanhMucSP/CategoryThumb"

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
  const [activeCategory, setActiveCategory] = useState(null)

  let pageContent = null
  useEffect(() => {

    console.log("xxxxxxxxxxxxxxxxxx", zmproute.query)
    if (zmproute.query && zmproute.query.index) {
      console.log("activeIndex: ", zmproute.query.index)
      settabLinkActive(zmproute.query.index)
      scroll(zmproute.query.index)
      zmp.tab.show("#tab-" + zmproute.query.index, true)
      setListData([])
      getListSPDanhMuc(zmproute.query.index)
    } else getListSPDanhMuc(0)
  }, [])
  const ref = useRef(null)
  const scroll = (x) => {
    // ref.current.scrollLeft += x*40
  }
  console.log("vlData.items: ", vlData)
  const getListSPDanhMuc = async (index) => {

    if (zmproute.query.loai !== 'NHANHANG') {
      let data = JSON.parse(vlData.items[index].jsonNHANHANG)
      setListData(data)
      // setLoading(true)
      let id = vlData.items[index].PK_SEQ
      let ten = vlData.items[index].TEN
      setTendanhmuc(ten)
      setActiveCategory(vlData.items[index])

      return
    }



    let id =zmproute.query.index


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
      className="detail-page bg-slate-50"
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
              {/* Mô tả danh mục */}
              {activeCategory && (
                <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl border border-[#E3EBF6] bg-white p-3">
                  <CategoryThumb
                    src={activeCategory?.HINHANH}
                    name={activeCategory?.TEN}
                    index={Number(zmproute.query.index) || 0}
                    className="h-16 w-16 p-2"
                    textClassName="text-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold leading-snug text-slate-800">
                      {activeCategory?.DIENGIAI || activeCategory?.TEN}
                    </div>
                    {activeCategory?.MOTA && (
                      <div className="mt-1 text-[13px] leading-relaxed text-slate-600">
                        {activeCategory.MOTA}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {listData.length > 0 && zmproute.query.loai !== 'NHANHANG' ? (
                // Lưới nhãn hàng của danh mục
                <div className="mx-4 my-3 rounded-2xl border border-[#E3EBF6] bg-white px-2 pb-3 pt-3">
                  <div className="mb-3 px-2 text-[15px] font-bold text-slate-800">Nhãn hàng</div>
                  <div className="flex flex-wrap gap-y-3">
                    {listData.map((item, i) => (
                      <DanhmucItem
                        key={i + ""}
                        seen={item.seen}
                        item={item}
                        index={i}
                        loai={'NHANHANG'}
                      />
                    ))}
                  </div>
                </div>
              ) : listData.length > 0 && zmproute.query.loai === 'NHANHANG' ? (
                // Danh sách sản phẩm của nhãn hàng
                <div className="py-2">
                  {listData.map((item, i) => (
                    <Post {...item} CusInfo={CusInfo} key={i + ""} />
                  ))}
                </div>
              ) : (
                !loading && <NoDataMessage />
              )}
              {loading && <LoadingSpinner />}
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
