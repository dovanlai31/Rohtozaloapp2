import { useEffect, useRef, useState } from "react"
import { Box, Page, useStore, zmp } from "zmp-framework/react"

import DanhmucItemAll from "@components/DanhMucSP/DanhmucItemAll"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { request } from "@utils/networking"
import "../styles/app.scss"

const AllDanhmuc = ({ zmproute }) => {
  const datasp = useStore("latestBlogs")
  const data = useStore("categories")
  const CusInfo = useStore("getCusInfo")
  const [vlData, setVlData] = useState({
    items: data,
  })
  const [loading, setLoading] = useState(true)
  const [listData, setListData] = useState([])

  const ref = useRef(null)

  useEffect(() => {
    if (zmproute.query && zmproute.query.index) {
      console.log("activeIndex: ", zmproute.query.index)

      zmp.tab.show("#tab-" + zmproute.query.index, true)
      getListSPDanhMuc(zmproute.query.index)
    } else {
      getListSPDanhMuc(0)
    }
  }, [])

  const getListSPDanhMuc = async (index) => {
    setLoading(true)
    setListData([])
    console.log("vlData.items[index]: ", vlData.items[index])
    let id = vlData.items[index].pk_seq

    let queryString = {
      userId: CusInfo?.KHACHHANG_fk,
      spId: "",
      idchungloai: id,
      ctkmid: "",
      loai: 0,
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
          },
          queryString
        )
      ).json()
      if (response) {
        setLoading(false)
        let p = JSON.parse(response.message)
        console.log("/khachhang/getListSpSearch: ", p)
        setListData(p)
      } else {
        setListData([])
      }
    } catch (error) {
      setLoading(false)
      console.log("Error request api x ", error)
      //setListData([])
    }
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className=""
    >
      <HeaderBack slot="fixed" title={"Danh mục"} />

      <Box
        className="wrapCatalogs   
          justify-center 
          flex-wrap flex
   
          "
      >
        {vlData.items.map((item, index) => (
          <DanhmucItemAll
            key={index + ""}
            seen={item.seen}
            item={item}
            index={index}
          />
        ))}
      </Box>
      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
      {loading && <LoadingSpinner />}
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

export default AllDanhmuc
