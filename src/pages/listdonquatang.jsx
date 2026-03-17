import Header from "@components/Header"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Card,
  DatePicker,
  Icon,
  Link,
  Page,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react"
import { Input } from "zmp-ui"
import "../styles/notifypage.scss"

import Color from "@components/common/Color"
import { File } from "@components/Icons"
import LoadingSpinner from "@components/LoadingSpinner"
import useDebounce from "@hooks/useDebounce"
import { formatCurrency, request } from "@utils/networking"
import {
  formatDateFromArray,
  formatDateToYYYYMMDD,
  validateString,
} from "@utils/util"
import { BsDashLg } from "react-icons/bs"
import { GrPowerReset } from "react-icons/gr"
import { BrowserRouter as Router } from "react-router-dom"

const listdonhang = ({ zmproute }) => {
  const options = [
    { value: "", label: "Tất cả" },
    { value: "0", label: "Chờ xác nhận" },
    { value: "1", label: "Đơn hàng thành công" },
    { value: "2", label: "Đơn hàng hủy" },
    { value: "3", label: "Đơn hàng đang vận chuyển" },
  ]

  const [dhId, setDhId] = useState("")
  const [trangthai, setTrangthai] = useState("")
  const [tungay, setTuggay] = useState("")
  const [denngay, setDenngay] = useState("")
  const [ListDonHang, setListDonHang] = useState([])
  const [loading, setLoading] = useState(false)

  const dialog = useRef(null)
  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")

  let dhIdDebounce = useDebounce(dhId, 400)
  let tuNgayDebounce = useDebounce(tungay, 400)
  let denNgayDebounce = useDebounce(denngay, 400)

  const getListDonHang = useCallback(async () => {
    setLoading(true)
    try {
      const response = await (
        await request("POST", "khachhang/getListDonQatang", {
          userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          dhId: validateString(dhIdDebounce + "", true),
          trangthai: trangthai,
          tungay: validateString(
            tuNgayDebounce !== "" ? formatDateToYYYYMMDD(tuNgayDebounce) : ""
          ),
          denngay: validateString(
            denNgayDebounce !== "" ? formatDateToYYYYMMDD(denNgayDebounce) : ""
          ),
        })
      ).json()
      if (response) {
        setLoading(false)
        let p = JSON.parse(response.message)
        //alert(p)
        setListDonHang(p)
      } else {
        setListDonHang([])
        setLoading(false)
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
      setListDonHang([])
      setLoading(false)
    }
  }, [dhIdDebounce, trangthai, tuNgayDebounce, denNgayDebounce])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    console.log(typeof tungay)
    //setTrangthai(zmproute.query.trangthai);
    getListDonHang()
  }, [dhIdDebounce, trangthai, tuNgayDebounce, denNgayDebounce])

  const onSearchbarClearInput = () => {
    setDhId("")
    setTuggay("")
    setDenngay("")
  }

  const deleteDonhang = (item) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content:
        '<div className="dialog-text">Xác nhận xóa đơn sampling này, Bạn thật sự muốn xóa đơn hàng?</div>',
      buttons: [
        {
          text: "Đóng",
        },
        {
          text: "Xóa đơn",
          onClick() {
            callApiXoadon(item)
          },
        },
      ],
    })
    if (dialog.current) {
      dialog.current.open()
    }
  }

  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [
        {
          text: "Đóng",
        },
      ],
    })
    if (dialog.current) {
      dialog.current.open()
    }
  }

  const callApiXoadon = async (donhang) => {
    //  xoadonhang
    if (loading) return

    setLoading(true)
    let queryString = {
      dhId: donhang.MADH,
    }
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/xoadonQuaTang",
          {
            userId: user.id,
            dhId: donhang.MADH,
            loai: donhang.loai,
          },
          queryString
        )
      ).json()
      if (response) {
        setLoading(false)
        console.log("xoa don qa tang", response)
        if (response) {
          // store.dispatch("setRefres", donhang.MADH)
          showDialog(response.message)
          if (response.result) getListDonHang()
          return
        }
      } else {
        showDialog(response.message)
      }
    } catch (error) {
      //showDialog("Lỗi xóa đơn hàng")
    }
  }

  return (
    <Router>
      <Page
        onPageBeforeIn={() => {
          zmp.toolbar.hide("#main-nav")
        }}
        className="detail-page"
      >
        <Header back>Đơn sampling</Header>
        <Box px="5" mb="5" slot="fixed" style={{}}>
          <Card inset className="shadown-app-2">
            <Box
              m="0"
              className="gap-3"
              flex
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
            >
              <Input
                value={dhId}
                style={{
                  zIndex: 1,
                  fontSize: "14px",
                  backgroundColor: "transparent",
                  border: "1px solid #99a3ad",
                }}
                placeholder="Mã đơn hàng"
                onChange={(e) => setDhId(e.target.value)}
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
              />
              <BsDashLg fontWeight={"bold"} />
              <DatePicker
                title="Đến ngày"
                value={denngay}
                style={{ zIndex: 1, backgroundColor: "transparent" }}
                inputStyle={{ fontSize: "14px" }}
                actionText="Chọn ngày"
                dateFormat="dd-mm-yyyy"
                datePicker
                datePickerColumns="DD-MM-YYYY"
                placeholder="Đến ngày"
                onClickAction={(e) => {
                  let date = formatDateFromArray(e.value)
                  setDenngay(date)
                  e.close()
                }}
              />
            </Box>
          </Card>
        </Box>

        <Box
          className="latest"
          //mx="5"
          mt="5"
          flex
          justifyContent="space-between"
        >
          <Box className="view-center-gh">
            {loading && <LoadingSpinner></LoadingSpinner>}
            {ListDonHang &&
              ListDonHang.map((item) => {
                return (
                  <Box className="list-item-donhang bg-white" key={item.MADH}>
                    <Box className="list-icon2" style={{ width: "30%" }}>
                      <Box className="RoundIcon">
                        {item.TRANGTHAI_INT == 0 ? (
                          <File
                            color={{
                              id: "orangeGradient",
                              start: "#ffa300",
                              end: "#ffe0a8",
                            }}
                          />
                        ) : item.TRANGTHAI_INT === 1 ? (
                          <File
                            color={{
                              id: "blueGradient",
                              start: "#1196ff",
                              end: "#aadaff",
                            }}
                          />
                        ) : item.TRANGTHAI_INT === 2 ? (
                          <File
                            color={{
                              id: "redGradient",
                              start: "#ff0000",
                              end: "#ffcccc",
                            }}
                          />
                        ) : item.TRANGTHAI_INT === 3 ? (
                          <File
                            color={{
                              id: "greenGradient",
                              start: "#2ac442",
                              end: "#93c49b",
                            }}
                          />
                        ) : item.TRANGTHAI_INT === 4 ? (
                          <File
                            color={{
                              id: "purpleGradient",
                              start: "#c120ff",
                              end: "#ebb6ff",
                            }}
                          />
                        ) : (
                          <File
                            color={{
                              id: "yellowGradient",
                              start: "#fff619",
                              end: "#fffdcc",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Link
                      className="customText"
                      style={{ width: "70%" }}
                      href={
                        "/DoiQua/?id=" +
                        item.MADH +
                        "&tt=" +
                        item.TRANGTHAI_INT +
                        "&loai=" +
                        item.loai
                      }
                      animate
                      transition="zmp-cover-v"
                      noLinkClass
                    >
                      <Box
                        className="customText"
                        style={{ width: "100%" }}
                        flex
                        flexDirection="column"
                        alignItems="flex-start"
                      >
                        <Box m={0}>
                          <Text
                            size="normal"
                            className="font-extrabold text-blue-imex "
                            style={{
                              width: "100%",
                              fontSize: "14px",
                            }}
                          >
                            Mã đơn hàng: {item.MADH}
                          </Text>
                        </Box>
                        <Box mx={0} alignItems="center">
                          <Text
                            className="desc text-blue-dark overflow-ellipsis "
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              color: Color.textAPPGray,
                            }}
                            mx="0"
                            size="small"
                          >
                            {item.Trangthai}
                          </Text>

                          {/* <Text  mx="5" size="small">
                      Đến: {km.DENNGAY}
                      </Text> */}

                          <Text
                            className="desc text-blue-dark overflow-ellipsis "
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              color: Color.textAPPGray,
                            }}
                            mx="0"
                            size="small"
                          >
                            Ngày Tạo: {item.NGAYDH}
                          </Text>
                          <Text
                            className="desc text-blue-dark overflow-ellipsis "
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              color: Color.textAPPGreen,
                            }}
                            mx="0"
                            size="small"
                          >
                            {formatCurrency(item.TONGGIATRI, true)}{" "}
                            {item.loai == 0 ? "Xu" : "Điểm"}
                          </Text>
                        </Box>
                      </Box>
                    </Link>
                    <Box className="list-icon2" style={{ width: "30%" }}>
                      <Box>
                        {item.TRANGTHAI_INT == 0 && (
                          <Link onClick={() => deleteDonhang(item)}>
                            <Box className="RoundIcon">
                              <Icon color="red" zmp="zi-delete" />
                            </Box>
                          </Link>
                        )}
                        <Link
                          href={
                            "/DoiQua/?id=" +
                            item.MADH +
                            "&tt=" +
                            item.TRANGTHAI_INT +
                            "&loai=" +
                            item.loai
                          }
                          animate
                          transition="zmp-cover-v"
                          noLinkClass
                        ></Link>
                      </Box>
                    </Box>
                  </Box>
                )
              })}
          </Box>
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
