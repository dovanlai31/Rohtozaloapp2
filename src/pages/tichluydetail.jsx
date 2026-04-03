import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import CTKhuyenMai from "@components/TichLuy/CTKhuyenMai"
import CTTichLuy from "@components/TichLuy/CTTichLuy"
import { request } from "@utils/networking"
import { useEffect, useState } from "react"
import { Page, useStore, zmp } from "zmp-framework/react"
import store from "../store"
import "../styles/notifypage.scss"
import { validateString } from "@utils/util"

const TichLuyDetail = ({ zmproute }) => {
  const { loai, item, hinhthuc, index } = zmproute.query
  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [listSP, setListSP] = useState([])
  const [tenCTTL, setTenCTTL] = useState("")
  const [CTKM, setCTKM] = useState({})

  const getCTTLDetail = () => {
    setLoading(true)

    return request(
      "POST",
      "khuyenmai/getCTTLDetail",
      {
        id: validateString(CusInfo.KHACHHANG_fk + "", true),
        stt: loai,
        tkmId: item,
        hinhthucId: hinhthuc,
      },
      {}
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.result) {
          setTenCTTL(JSON.parse(JSON.parse(data?.content)[0]?.detail)[0]?.scheme)
          setData(JSON.parse(data.content))
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getKhuyenMaiDetail = () => {
    return request(
      "POST",
      "khuyenmai/getKhuyenMaiDetail",
      {
        id: validateString(CusInfo.KHACHHANG_fk + "", true),
        stt: "0",
        tkmId: item,
        hinhthucId: "",
      },
      {}
    )
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        console.log(err)
        throw err
      })
  }

  const getSPKhuyenMai = () => {
    return request(
      "POST",
      "khuyenmai/getKhuyenMaiSp",
      {
        id: validateString(CusInfo.KHACHHANG_fk + "", true),
        stt: "0",
        tkmId: validateString(item + "", true),
      },
      {}
    )
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        console.log(err)
        throw err
      })
  }

  useEffect(() => {
    if (loai != 2) {
      getCTTLDetail()
      // if (loai == 0) {
      //   setTenCTTL(store.getters.ListCTTLDiem?.value[index]?.ten)
      // } else {
      //   setTenCTTL(store.getters.ListCTTLXu?.value[index]?.ten)
      // }
    } else {
      setCTKM(store.getters.ListKM?.value[index])
      setLoading(true)
      Promise.all([getKhuyenMaiDetail(), getSPKhuyenMai()])
        .then((res) => {
          // console.log('getKhuyenMaiDetail(), getSPKhuyenMai()',res[0].content)

          if (res.length > 0) {
            const dk = JSON.parse(res[0].content)[0] || {}
            const sp = JSON.parse(res[1].content)[0] || {}

            setData([dk, sp])
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
      style={{ background: "#f8f8f8" }}
    >
      <HeaderBack slot="fixed" title={`Chi tiết ${loai != 2 ? "tích luỹ" : "khuyến mãi"}`}></HeaderBack>

      {loai == 2 && <CTKhuyenMai data={data} CTKM={CTKM} listSP={listSP} />}
      {loai != 2 && (
        <CTTichLuy loai={loai} data={data} tenCTTL={tenCTTL} hinhthuc={hinhthuc} />
      )}
      {loading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />{" "}
          <span className="font-semibold">Đang tải dữ liệu...</span>
        </div>
      )}
    </Page>
  )
}

export default TichLuyDetail
