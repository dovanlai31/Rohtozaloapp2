import Color from "@components/common/Color"
import Header from "@components/Header"
import useDebounce from "@hooks/useDebounce"
import { datePickerData } from "@static/values"
import { formatCurrency, getAPI } from "@utils/networking"
import { formatDateFromArray, validateString } from "@utils/util"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { BsDashLg } from "react-icons/bs"
import { IoIosArrowRoundForward } from "react-icons/io"
import {
  Box,
  Card,
  DatePicker,
  Link,
  Page,
  Picker,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react"
import "../styles/app.scss"

const DoanhSoDetail = ({ zmproute }) => {
  const today = new Date()

  const [fromDate, setFromDate] = useState(
    zmproute.query?.loai == 1
      ? today.getFullYear()
      : new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [toDate, setToDate] = useState(
    zmproute.query?.loai == 1 ? today.getFullYear() : new Date()
  )
  const [data, setData] = useState([])

  const fromDateDebounce = useDebounce(fromDate, 400)
  const toDateDebounce = useDebounce(toDate, 400)

  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")

const getDoanhSo = useCallback(() => {
  const param = {
    userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
    tungay: validateString(
      zmproute.query?.loai == 0
        ? moment(fromDateDebounce).format("YYYY-MM-DD")
        : String(fromDateDebounce)
    ),
    denngay: validateString(
      zmproute.query?.loai == 0
        ? moment(toDateDebounce).format("YYYY-MM-DD")
        : String(toDateDebounce)
    ),
    loai: zmproute.query?.loai + "",
  };

  return getAPI("khachhang/getDoanhSoDetail", "POST", param)
    .then(({ data, error }) => {
      console.log("getDoanhSoDetail", data, param);

      if (error) {
        zmp.toast
          .create({
            position: "top",
            closeTimeout: 300,
            text: data.message,
          })
          .open();
      } else {
        try {
       
          const parsed = JSON.parse(data.content);
          setData(parsed);
        } catch (e) {
          console.log("JSON parse error:", e);
          setData([]);
        }
      }
    })
    .catch((err) => console.log(err));
}, [fromDateDebounce, toDateDebounce]);

  useEffect(() => {
    getDoanhSo()
  }, [fromDateDebounce, toDateDebounce, getDoanhSo])

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page relative customBackgound"
      style={{ background: "#f8f8f8" }}
    >
      <Header back>Doanh số </Header>
      <Card className="shadown-app-1" title="Báo cáo doanh số" inset px="5">
        <Box
          m={0}
          p={0}
          style={{
            width: "100%",
            height: "5px",
            // backgroundColor: 'red',

            paddingBottom: "10px",
            WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
            boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
          }}
          className="BoxLine"
        ></Box>
        <Box className="flex gap-3 mt-10 items-center">
          <Box m="0" className="relative">
            {zmproute.query?.loai == 1 && (
              <Box m="0">
                <Box
                  m="0"
                  className="absolute font-medium"
                  style={{
                    color: Color.textAPPBlue,
                    backgroundColor: "#fff",
                    zIndex: 2,
                    top: -10,
                    left: 10,
                    padding: "0 10px",
                    fontSize: "13px",
                  }}
                >
                  Năm
                </Box>
                <Picker
                  style={{ zIndex: 1, fontSize: "12px" }}
                  selected={[String(fromDate)]}
                  data={[
                    {
                      textAlign: "center",
                      values: datePickerData[0].values,
                      displayValues: datePickerData[0].values,
                    },
                  ]}
                  formatValue={(values, displayValues) => {
                    return `${displayValues[0]}`
                  }}
                  onChange={(picker, values) => setFromDate(values[0])}
                />
              </Box>
            )}
            {zmproute.query?.loai == 0 && (
              <>
                <Box
                  m="0"
                  className="absolute font-medium"
                  style={{
                    color: Color.textAPPBlue,
                    backgroundColor: "#fff",
                    zIndex: 2,
                    top: -10,
                    left: 10,
                    padding: "0 10px",
                    fontSize: "13px",
                  }}
                >
                  Từ ngày
                </Box>

                <DatePicker
                  title="Từ ngày"
                  value={fromDate}
                  style={{ zIndex: 1, fontSize: "12px" }}
                  actionText="Chọn ngày"
                  dateFormat="dd-mm-yyyy"
                  datePicker
                  datePickerColumns="DD-MM-YYYY"
                  placeholder="Từ"
                  onClickAction={(e) => {
                    let date = formatDateFromArray(e.value)
                    setFromDate(date)
                    e.close()
                  }}
                />
              </>
            )}
          </Box>
          <BsDashLg fontWeight={"bold"} />
          <Box m="0" className="relative">
            {zmproute.query?.loai == 1 && (
              <Box m="0">
                <Box
                  m="0"
                  className="absolute font-medium"
                  style={{
                    color: Color.textAPPBlue,
                    backgroundColor: "#fff",
                    zIndex: 2,
                    top: -10,
                    left: 10,
                    padding: "0 10px",
                    fontSize: "13px",
                  }}
                >
                  Năm
                </Box>
                <Picker
                  style={{ zIndex: 1, fontSize: "12px" }}
                  selected={[String(fromDate)]}
                  data={[
                    {
                      textAlign: "center",
                      values: datePickerData[0].values,
                      displayValues: datePickerData[0].values,
                    },
                  ]}
                  formatValue={(values, displayValues) => {
                    return `${displayValues[0]}`
                  }}
                  onChange={(picker, values) => setToDate(values[0])}
                />
              </Box>
            )}
            {zmproute.query?.loai == 0 && (
              <Box m="0">
                <Box
                  m="0"
                  className="absolute font-medium"
                  style={{
                    color: Color.textAPPBlue,
                    backgroundColor: "#fff",
                    zIndex: 2,
                    top: -10,
                    left: 10,
                    padding: "0 10px",
                    fontSize: "13px",
                  }}
                >
                  Đến ngày
                </Box>
                <DatePicker
                  title="Đến ngày"
                  value={toDate}
                  style={{ zIndex: 1, fontSize: "12px" }}
                  actionText="Chọn ngày"
                  dateFormat="dd-mm-yyyy"
                  datePicker
                  datePickerColumns="DD-MM-YYYY"
                  placeholder="Đến"
                  onClickAction={(e) => {
                    let date = formatDateFromArray(e.value)
                    setToDate(date)
                    e.close()
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          m={0}
          p={0}
          style={{
            width: "100%",
            height: "5px",
            marginBottom: "25px",
            WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
            boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
          }}
          className="BoxLine"
        ></Box>
        <Box style={{ minHeight: "30%" }}>
          <Box m="0" className="customBackgoundInner " style={{ height: 200 }}>
            <Box p="5" style={{ background: "", width: "100%", Height: "auto" }}>
              <Box
                m="0"
                my="4"
                flexWrap
                className="flex justify-between items-center relative"
              >
                <Text
                  className="text-base"
                  style={{ color: Color.textAPPBlack, fontWeight: "normal" }}
                >
                  Doanh số {zmproute.query?.loai == 1 ? "năm" : "tháng"}
                </Text>
                <Text className="text-xl font-semibold text-blue-imex">
                  {formatCurrency(data[1]?.soluong ? data[1]?.soluong : 0)}
                </Text>
              </Box>
              <Box
                m="0"
                my="4"
                flexWrap
                className="flex justify-between items-center relative mt-16"
              >
                <Text
                  className="text-base"
                  style={{ color: Color.textAPPBlack, fontWeight: "normal" }}
                >
                  Số lượng SKU {zmproute.query?.loai == 1 ? "năm" : "tháng"}
                </Text>
                <Text className="text-xl font-semibold text-blue-imex">
                  {formatCurrency(data[0]?.soluong ? data[0]?.soluong : "0", true)}
                </Text>
              </Box>
              <Box
                m={0}
                p={0}
                style={{
                  width: "100%",
                  height: "5px",
                  WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                  boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                }}
                className="BoxLine"
              ></Box>
              <Link
                animate
                noLinkClass
                href={`/listdonhang/?tungay=${fromDate}&denngay=${toDate}&loaids=${zmproute.query?.loai}&frombc=1`}
              >
                <Box
                  className="flex items-end mt-4"
                  flex
                  justifyContent="flex-end"
                  style={{}}
                >
                  <Box
                    m="0"
                    flex
                    pr="2"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      height: 30,
                      // background: '#78cd231f'
                      borderRadius: 5,
                    }}
                  >
                    <Box
                      className=""
                      style={{
                        color: Color.primary,
                        fontStyle: "italic",
                        fontSize: "13px",
                      }}
                    >
                      Chi tiết đơn hàng
                    </Box>
                    <IoIosArrowRoundForward size={20} color={Color.textAPPBlue} />
                  </Box>
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* <Box m="0" className="pt-5 customBackgound" style={{ minHeight: 300 }}></Box> */}
    </Page>
  )
}

export default DoanhSoDetail
