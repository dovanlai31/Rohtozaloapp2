import Header from "@components/Header"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Card,
  DatePicker,
  Link,
  Page,
  Tab,
  Tabbar,
  Tabs,
  useStore,
  zmp,
} from "zmp-framework/react"
import { Input } from "zmp-ui"
import "../styles/notifypage.scss"

import DonHang from "@components/DonHang/DonHang"
import useDebounce from "@hooks/useDebounce"
import { requestWithAbortController } from "@utils/networking"
import {
  formatDateFromArray,
  formatDateToYYYYMMDD,
  validateString,
} from "@utils/util"
import { BsDashLg } from "react-icons/bs"
import { GrPowerReset } from "react-icons/gr"
import { BrowserRouter as Router } from "react-router-dom"

const listdonhang = ({ zmproute }) => {
  const abortController = useRef(new AbortController())
  const abortControllerTQ = useRef(new AbortController())

  const [dhId, setDhId] = useState("")
  const [tungay, setTuggay] = useState("")
  const [denngay, setDenngay] = useState("")

  const [ListDonHang, setListDonHang] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastPage, setLastPage] = useState(false)

  const [ListDonHangQT, setListDonHangQT] = useState([])
  const [lastPageQT, setLastPageQT] = useState(false)
  const [loadingQT, setLoadingQT] = useState(true)

  const dialog = useRef(null)

  const CusInfo = useStore("getCusInfo")

  const trangthai = zmproute.query.trangthai || "0"
  const frombc = zmproute?.query?.frombc + "" || "0"

  let dhIdDebounce = useDebounce(dhId, 400)
  let tuNgayDebounce = useDebounce(tungay, 400)
  let denNgayDebounce = useDebounce(denngay, 400)

  const getListDonHang = useCallback(
    async (AbortController, isLoadMore = false, mounted = true) => {
      try {
        setLoading(true)
        const response = await (
          await requestWithAbortController(
            "POST",
            "khachhang/getListDonHang",
            {
              userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
              dhId: validateString(dhId + "", true),
              trangthai: frombc == "1" ? "-1" : trangthai,
              tungay: tungay !== "" ? formatDateToYYYYMMDD(tungay) : "",
              denngay: denngay !== "" ? formatDateToYYYYMMDD(denngay) : "",
              lastDH:
                ListDonHang.length > 0 && isLoadMore
                  ? ListDonHang[ListDonHang.length - 1]?.MADH || ""
                  : "",
              lastNgayDH:
                ListDonHang.length > 0 && isLoadMore
                  ? ListDonHang[ListDonHang.length - 1]?.NGAYDH || ""
                  : "",
            },
            {},
            AbortController
          )
        ).json()
        if (response && mounted) {
          console.log(response)
          let p = JSON.parse(response.message)

          if (isLoadMore) {
            setListDonHang((prev) => [...prev, ...p])
          } else {
            setListDonHang(p)
          }

          console.log(
            Number(p.length) + Number(ListDonHang.length) >=
              (Number(response.content) || 0)
          )

          if (
            Number(p.length) + Number(ListDonHang.length) >=
            (Number(response.content) || 0)
          ) {
            setLastPage(true)
          } else {
            setLastPage(false)
          }
        }
      } catch (error) {
        console.log("Error request api 2 ", error)
      } finally {
        if (mounted) {
          setTimeout(() => {
            setLoading(false)
          }, 2000)
        }
      }
    },
    [dhIdDebounce, tuNgayDebounce, denNgayDebounce]
  )

  const getListDonHangTangQua = useCallback(
    async (AbortController, isLoadMore = false, mounted = true) => {
      try {
        setLoadingQT(true)
        const response = await (
          await requestWithAbortController(
            "POST",
            "khachhang/getListDonHangTangQua",
            {
              userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
              dhId: validateString(dhId + "", true),
              trangthai: frombc == "1" ? "-1" : trangthai,
              tungay: tungay !== "" ? formatDateToYYYYMMDD(tungay) : "",
              denngay: denngay !== "" ? formatDateToYYYYMMDD(denngay) : "",
              lastDH:
                ListDonHangQT.length > 0 && isLoadMore
                  ? ListDonHangQT[ListDonHangQT.length - 1]?.MADH || ""
                  : "",
              lastNgayDH:
                ListDonHangQT.length > 0 && isLoadMore
                  ? ListDonHangQT[ListDonHangQT.length - 1]?.NGAYDH || ""
                  : "",
            },
            {},
            AbortController
          )
        ).json()
        if (response && mounted) {
          console.log(response)
          let p = JSON.parse(response.message)

          if (isLoadMore) {
            setListDonHangQT((prev) => [...prev, ...p])
          } else {
            setListDonHangQT(p)
          }

          console.log(
            Number(p.length) + Number(ListDonHangQT.length) >=
              (Number(response.content) || 0)
          )

          if (
            Number(p.length) + Number(ListDonHangQT.length) >=
            (Number(response.content) || 0)
          ) {
            setLastPageQT(true)
          } else {
            setLastPageQT(false)
          }
        }
      } catch (error) {
        console.log("Error request api 2 ", error)
      } finally {
        if (mounted) {
          setTimeout(() => {
            setLoadingQT(false)
          }, 2000)
        }
      }
    },
    [dhIdDebounce, tuNgayDebounce, denNgayDebounce]
  )

  const getListDonHangAbort = () => {
    abortController.current.abort()
    abortController.current = new AbortController()

    getListDonHang(abortController, true)
  }

  const getListDonHangTangQuaAbort = () => {
    abortControllerTQ.current.abort()
    abortControllerTQ.current = new AbortController()

    getListDonHangTangQua(abortControllerTQ, true)
  }

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      if (zmproute.query.hasOwnProperty("tungay")) {
        if (zmproute.query?.loaids == 1) {
          setTuggay(new Date(Date.UTC(zmproute.query.tungay, 0, 1)))
        } else {
          setTuggay(new Date(zmproute.query.tungay))
        }
      }

      if (zmproute.query.hasOwnProperty("denngay")) {
        if (zmproute.query?.loaids == 1) {
          setDenngay(new Date(Date.UTC(zmproute.query.denngay, 11, 31)))
        } else {
          setDenngay(new Date(zmproute.query.denngay))
        }
      }
    }

    return () => {
      abortController.current.abort()
      abortControllerTQ.current.abort()
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    abortController.current.abort()
    abortController.current = new AbortController()

    getListDonHang(abortController, false, isMounted)

    return () => {
      abortController.current.abort()
      isMounted = false
    }
  }, [getListDonHang])

  useEffect(() => {
    let isMounted = true
    abortControllerTQ.current.abort()
    abortControllerTQ.current = new AbortController()

    getListDonHangTangQua(abortControllerTQ, false, isMounted)

    return () => {
      abortControllerTQ.current.abort()
      isMounted = false
    }
  }, [getListDonHangTangQua])

  const onSearchbarClearInput = () => {
    setDhId("")
    setTuggay("")
    setDenngay("")
  }

  return (
    <Router>
      <Page
        onPageBeforeIn={() => {
          zmp.toolbar.hide("#main-nav")
        }}
        className="detail-page"
      >
        <Box
          m="0"
          p="0"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Header back>Đơn hàng</Header>
          <Box m={0} slot="fixed" p={0}>
            <Tabbar inner={false} m={0} p={5} className="CustomTabbar">
              <Link
                style={{ fontSize: "14px" }}
                tabLink="#tab-1DHList"
                tabLinkActive
              >
                Đơn hàng
              </Link>
              <Link style={{ fontSize: "14px" }} tabLink="#tab-2DHList">
                Đơn sampling
              </Link>
              {/* <Link style={{ fontSize: "14px" }} tabLink="#tab-3CT">
            CT tích lũy xu
          </Link> */}
            </Tabbar>
          </Box>
          {/* <Box px="5" mb="0" style={{ backgroundColor: "transparent" }}>
            <Card inset className="shadown-app-1 ">
              <Box
                m="0"
                className="gap-3"
                flex
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
              >
                <Input
                  type="text"
                  value={dhId}
                  style={{
                    zIndex: 1,
                    fontSize: "14px",
                    backgroundColor: "transparent",
                    border: "1px solid #99a3ad",
                  }}
                  placeholder="Mã đơn hàng"
                  onChange={(e) => setDhId(e.target.value)}
                  // allowClear
                  // clearable
                />
                <Box m="0">
                  <Button
                    onClick={() => {
                      // setTuggay("")
                      onSearchbarClearInput()
                    }}
                    className="RoundIcon2"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "20px",
                    }}
                  >
                    <GrPowerReset />
                  </Button>
                </Box>
              </Box>

              <Box m="0" my="0" flex className=" gap-3  items-center">
                <DatePicker
                  title="Từ ngày"
                  value={tungay}
                  style={{ zIndex: 1, backgroundColor: "transparent" }}
                  actionText="Chọn ngày"
                  inputStyle={{ fontSize: "14px" }}
                  dateFormat="dd-mm-yyyy"
                  datePicker
                  datePickerColumns="DD-MM-YYYY"
                  placeholder="Từ ngày"
                  onClickAction={(e) => {
                    let date = formatDateFromArray(e.value)
                    setTuggay(date)
                    e.close()
                  }}
                  clearButton
                />
                <BsDashLg fontWeight={"bold"} />
                <DatePicker
                  title="Đến ngày"
                  value={denngay}
                  actionText="Chọn ngày"
                  dateFormat="dd-mm-yyyy"
                  datePicker
                  datePickerColumns="DD-MM-YYYY"
                  style={{ zIndex: 1, backgroundColor: "transparent" }}
                  inputStyle={{ fontSize: "14px" }}
                  placeholder="Đến ngày"
                  onClickAction={(e) => {
                    let date = formatDateFromArray(e.value)
                    setDenngay(date)
                    e.close()
                  }}
                  clearButton
                />
              </Box>
            </Card>
          </Box> */}
          <Tabs animated swipeable>
            <Tab id={"tab-1DHList"} style={{ overflow: "scroll" }} tabActive>
              <DonHang
                ListDonHang={ListDonHang}
                lastPage={lastPage}
                loading={loading}
                getListDonHang={getListDonHangAbort}
              />
            </Tab>
            <Tab id={"tab-2DHList"} style={{ overflow: "scroll" }} tabActive>
              <DonHang
                ListDonHang={ListDonHangQT}
                lastPage={lastPageQT}
                loading={loadingQT}
                getListDonHang={getListDonHangTangQuaAbort}
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
export default listdonhang
