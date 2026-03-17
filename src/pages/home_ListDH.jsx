import { useCallback, useEffect, useState } from "react"
import {
  Box,
  Icon,
  Link,
  Page,
  Tab,
  Tabbar,
  Tabs,
  Text,
  useStore,
} from "zmp-framework/react"

import "../styles/notifypage.scss"

import HeaderBox from "@components/Header/HeaderBox"
import LoadingSpinner from "@components/LoadingSpinner"
import { request } from "@utils/networking"
import { BrowserRouter as Router } from "react-router-dom"

import DonHang from "@components/DonHang/DonHang"
import { File } from "@components/Icons"
import Color from "@components/common/Color"
import { PAGE_SIZE, validateString } from "@utils/util"
import { FaBasketShopping, FaInbox } from "react-icons/fa6"

const home_ListDH = ({ zmproute }) => {
  const [dhId, setDhId] = useState("")
  const [trangthai, setTrangthai] = useState("")
  const [tungay, setTuggay] = useState("")
  const [denngay, setDenngay] = useState("")
  const [ListDonHang, setListDonHang] = useState([])
  const [ListDonHangTangQua, setListDonHangTangQua] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingQT, setLoadingQT] = useState(true)
  const [page, setPage] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [pageQT, setPageQT] = useState(0)
  const [lastPageQT, setLastPageQT] = useState(false)

  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")

  const [searchParam, setSearchParam] = useState({
    dhId,
    trangthai,
    tungay,
    denngay,
  })

  const getListDonHang = useCallback(async () => {
    try {
      setLoading(true)
      const response = await (
        await request(
          "POST",
          "khachhang/getListDonHang",
          {
            userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
            dhId: "",
            trangthai: "",
            tungay: "",
            denngay: "",
            lastDH: ListDonHang[ListDonHang.length - 1]?.MADH || "",
            lastNgayDH: ListDonHang[ListDonHang.length - 1]?.NGAYDH || "",
          },
          {
            page: page,
          }
        )
      ).json()
      if (response) {
        let p = JSON.parse(response.message || "[]")

        if (p.length < PAGE_SIZE || p.length == 0) {
          setLastPage(true)
        }

        setListDonHang([...ListDonHang, ...p])
      } else {
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
    } finally {
      setLoading(false)
    }
  }, [searchParam, page])

  const getListDonHangTangQua = useCallback(async () => {
    try {
      setLoadingQT(true)
      const response = await (
        await request(
          "POST",
          "khachhang/getListDonHangTangQua",
          {
            userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
            dhId: "",
            trangthai: "",
            tungay: "",
            denngay: "",
            lastDH: ListDonHangTangQua[ListDonHangTangQua.length - 1]?.MADH || "",
            lastNgayDH:
              ListDonHangTangQua[ListDonHangTangQua.length - 1]?.NGAYDH || "",
          },
          {
            page: page,
          }
        )
      ).json()
      if (response) {
        let p = JSON.parse(response.message || "[]")

        if (p.length < PAGE_SIZE || p.length == 0) {
          setLastPageQT(true)
        }

        setListDonHangTangQua([...ListDonHang, ...p])
      } else {
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
    } finally {
      setLoadingQT(false)
    }
  }, [searchParam, pageQT])

  useEffect(() => {
    getListDonHang()
    // getListDonHangTangQua()
  }, [getListDonHang,])

  return (
    <Router>
      <Page className="detail-page">
        <Box
          m="0"
          pb="8"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <HeaderBox
            slot="fixed"
            icon={<FaBasketShopping size={25} className="text-blue-imex" />}
            HeaderBoxName={"Lịch sử mua hàng"}
          />
          {/* <Box m={0} slot="fixed" p={0}>
            <Tabbar inner={false} m={0} p={5} className="CustomTabbar">
              <Link style={{ fontSize: "14px" }} tabLink="#tab-1DH" tabLinkActive>
                Đơn hàng
              </Link>
              <Link style={{ fontSize: "14px" }} tabLink="#tab-2DH">
                Đơn sampling
              </Link>
              <Link style={{ fontSize: "14px" }} tabLink="#tab-3CT">
            CT tích lũy xu
          </Link>
            </Tabbar>
          </Box> */}
          <Tabs animated swipeable>
            <Tab id={"tab-1DH"} style={{ overflow: "scroll" }} tabActive>
              <DonHang
                ListDonHang={ListDonHang}
                lastPage={lastPage}
                loading={loading}
                getListDonHang={() => setPage((prev) => prev + 1)}
              />
            </Tab>
            <Tab id={"tab-2DH"} style={{ overflow: "scroll" }}>
              <DonHang
                ListDonHang={ListDonHangTangQua}
                lastPage={lastPageQT}
                loading={loadingQT}
                getListDonHang={() => setPageQT((prev) => prev + 1)}
              />
            </Tab>
          </Tabs>
        </Box>
      </Page>
    </Router>
  )
}

const styles = {
  ButtonBack: {
    position: "absolute",
    top: 17,
    left: 17,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(82, 130, 255, 0.2)",
  },
  btnViewGiohang: {
    width: "93%",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderColor: "#dbdfe2",
  },
}

export default home_ListDH
