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
import { Input, Modal } from "zmp-ui"
import "../styles/notifypage.scss"

import DonHang from "@components/DonHang/DonHang"
import useDebounce from "@hooks/useDebounce"
import { getAPI, requestWithAbortController } from "@utils/networking"
import {
  formatDateFromArray,
  formatDateToYYYYMMDD,
  replaceUnicode,
  validateString,
} from "@utils/util"
import { BsDashLg } from "react-icons/bs"
import { GrPowerReset } from "react-icons/gr"
import { BrowserRouter as Router } from "react-router-dom"
import DonHangKiemTraDDH from "@components/DonHang/DonHangKiemTraDDH"
import withOverlay from "@components/HOC/withOverlay"

const KiemTraDonDatHang = ({ zmproute, showToast }) => {
  const abortController = useRef(new AbortController())
  const abortControllerTQ = useRef(new AbortController())

  const [dhId, setDhId] = useState("")
  const [tungay, setTuggay] = useState("")
  const [denngay, setDenngay] = useState("")

  const [ListDonHang, setListDonHang] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastPage, setLastPage] = useState(false)

  const [selectedDH, setSelectedDH] = useState("")
  const [lyDoOrOTP, setlyDoOrOTP] = useState("")
  const [loai, setLoai] = useState(0)

  const dialog = useRef(null)

  const CusInfo = useStore("getCusInfo")

  const trangthai = zmproute.query.trangthai || ""
  const frombc = zmproute?.query?.frombc + "" || "0"

  let dhIdDebounce = useDebounce(dhId, 400)
  let tuNgayDebounce = useDebounce(tungay, 400)
  let denNgayDebounce = useDebounce(denngay, 400)

  const getListDonHang = useCallback(
    async (AbortController, isLoadMore = false, mounted = true, listLocal = []) => {
      try {
        setLoading(true)
        console.log(ListDonHang)
        const response = await (
          await requestWithAbortController(
            "POST",
            "donhang/cuahang/getListDonHang?",
            {},
            {
              userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
              dhId: validateString(dhId + "", true),
              trangthai: frombc == "1" ? "-1" : trangthai,
              tungay: tungay !== "" ? formatDateToYYYYMMDD(tungay) : "",
              denngay: denngay !== "" ? formatDateToYYYYMMDD(denngay) : "",
              lastDH:
                listLocal.length > 0 && isLoadMore
                  ? listLocal[listLocal.length - 1]?.MADH || ""
                  : "",
              lastNgayDH:
                listLocal.length > 0 && isLoadMore
                  ? listLocal[listLocal.length - 1]?.NGAYDH || ""
                  : "",
            },
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
            Number(p.length) + Number(listLocal.length) >=
              (Number(response.content) || 0)
          )

          if (
            Number(p.length) + Number(listLocal.length) >=
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

  const getListDonHangAbort = () => {
    abortController.current.abort()
    abortController.current = new AbortController()

    getListDonHang(abortController, true, true, ListDonHang)
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

  const onSearchbarClearInput = () => {
    setDhId("")
    setTuggay("")
    setDenngay("")
  }

  const _ConfirmDonHang = async () => {
    console.log(lyDoOrOTP)
    try {
      const { data, error } = await getAPI(
        "donhang/cuahang/xacNhanDonHang",
        "POST",
        {
          dhId: selectedDH,
          text: lyDoOrOTP,
          userId: validateString(CusInfo?.nhanVienId + "", true),
        }
      )

      if (!data.result || error) {
        showToast(data.message, "danger")
        return
      }

      showToast(data.message, "success")

      const listLocal = JSON.parse(JSON.stringify(ListDonHang))
      const indexDH = listLocal.findIndex((item) => item.MADH == selectedDH)

      listLocal[indexDH].Trangthai = "Đã xác nhận"

      setListDonHang(listLocal)
      setSelectedDH("")
      setlyDoOrOTP("")
    } catch (error) {
      console.error(error)
    }
    return
  }

  const _DenyDonHang = async () => {
    console.log(lyDoOrOTP)

    try {
      const { data, error } = await getAPI("donhang/cuahang/tuChoiDonHang", "POST", {
        dhId: selectedDH,
        text: lyDoOrOTP,
        userId: validateString(CusInfo?.nhanVienId + "", true),
      })

      if (!data.result || error) {
        showToast(data.message, "danger")
        return
      }

      showToast(data.message, "success")

      const listLocal = JSON.parse(JSON.stringify(ListDonHang))
      const indexDH = listLocal.findIndex((item) => item.MADH == selectedDH)

      listLocal[indexDH].Trangthai = "Đã từ chối"

      setListDonHang(listLocal)
      setSelectedDH("")
      setlyDoOrOTP("")
    } catch (error) {
      console.error(error)
    }
    return
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
          <Header back>Kiểm tra đơn hàng</Header>
          <Box px="5" mb="5" style={{ backgroundColor: "transparent" }}>
            <Card inset className=" ">
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
                  placeholder="Mã đơn hàng, PG, cửa hiệu"
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

              <Box m="0" my="2" flex className=" gap-3  items-center">
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
          </Box>
          <DonHangKiemTraDDH
            ListDonHang={ListDonHang}
            lastPage={lastPage}
            loading={loading}
            getListDonHang={getListDonHangAbort}
            setLoai={(loai) => setLoai(loai)}
            setSelectedDH={(selectedDH) => setSelectedDH(selectedDH)}
          />
          <Modal
            visible={selectedDH !== ""}
            title={loai === 1 ? "Xác nhận đơn hàng" : "Từ chối đơn hàng"}
            actionsDivider
            actions={[
              {
                text: "Đóng",
                close: true,
                danger: true,
              },
              {
                text: "Xác nhận",
                highLight: true,
                onClick: () => (loai === 1 ? _ConfirmDonHang() : _DenyDonHang()),
              },
            ]}
            mask
            maskClosable
            onClose={() => setSelectedDH("")}
          >
            {loai === 2 && (
              <Input.TextArea
                placeholder=""
                value={lyDoOrOTP}
                onChange={(e) => setlyDoOrOTP(e.currentTarget.value)}
                helperText="Lý do từ chối xác nhận đơn hàng"
              />
            )}
            {loai === 1 && (
              <Input
                maxLength={20}
                show
                value={lyDoOrOTP}
                onChange={(e) => {
                  const text = replaceUnicode(e.currentTarget.value)
                  setlyDoOrOTP(text)
                }}
                helperText="Mã tham chiếu tối đa cho phép 20 kí tự"
              />
            )}
          </Modal>
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
export default withOverlay(KiemTraDonDatHang)
