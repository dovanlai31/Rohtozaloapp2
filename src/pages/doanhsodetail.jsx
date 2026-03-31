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
  Icon,
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

  const CusInfo = useStore("getCusInfo")

  const isYearMode = zmproute.query?.loai == 1
  const timeLabel = isYearMode ? "năm" : "tháng"

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
    }

    return getAPI("khachhang/getDoanhSoDetail", "POST", param)
      .then(({ data, error }) => {
        console.log("getDoanhSoDetail", data, param)

        if (error) {
          zmp.toast
            .create({
              position: "top",
              closeTimeout: 300,
              text: data.message,
            })
            .open()
        } else {
          try {
            const parsed = JSON.parse(data.content)
            setData(parsed)
          } catch (e) {
            console.log("JSON parse error:", e)
            setData([])
          }
        }
      })
      .catch((err) => console.log(err))
  }, [fromDateDebounce, toDateDebounce])

  useEffect(() => {
    getDoanhSo()
  }, [fromDateDebounce, toDateDebounce, getDoanhSo])
  const handleBack = () => {
    const currentRouter = zmp.views?.current?.router
    if (currentRouter?.history?.length > 1) {
      currentRouter.back()
      return
    }

    if (zmp.views?.main?.router?.history?.length > 1) {
      zmp.views.main.router.back()
      return
    }

    if (
      typeof globalThis.window !== "undefined" &&
      globalThis.window.history.length > 1
    ) {
      globalThis.window.history.back()
    }
  }
  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page relative customBackgound p-2 m-0"
      style={{ background: "#F4F9FE" }}
    >
      <Box className="flex items-center justify-between p-0 m-0">
        <Box className="flex items-center gap-3 m-0">
          <Link
            noLinkClass
            className="h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center "
            onClick={handleBack}
          >
            <Icon zmp="zi-close" size={18} />
          </Link>
          <Text className="text-[20px] font-extrabold text-[#23408f]">Doanh số</Text>
        </Box>
      </Box>
      <Card
        className="!m-0 !mt-[50px] px-2 bg-white rounded-2xl shadow-lg shadow-inherit border border-[#E0E0E0]"
        title="Báo cáo doanh số"
      >
        <Box m={0} p={0} className=" w-full border-b border-[#E0E0E0]" />
        <Box className="flex gap-3 mt-5 items-center ">
          <Box m="0" className="relative">
            {isYearMode && (
              <Box m="0">
                <Box
                  m="0"
                  className="absolute left-[10px] top-[-10px] z-[2] bg-white px-[10px] text-[13px] font-medium text-[#2455b4]"
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
            {!isYearMode && (
              <>
                <Box
                  m="0"
                  className="absolute left-[10px] top-[-10px] z-[2] bg-white px-[10px] text-[13px] font-bold text-[#2455b4]"
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
            {isYearMode && (
              <Box m="0">
                <Box
                  m="0"
                  className="absolute left-[10px] top-[-10px] z-[2] bg-white px-[10px] text-[13px] font-medium text-[#2455b4]"
                >
                  Năm
                </Box>
                <Picker
                  style={{ zIndex: 1, fontSize: "12px" }}
                  selected={[String(toDate)]}
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
            {!isYearMode && (
              <Box m="0">
                <Box
                  m="0"
                  className="absolute left-[10px] top-[-10px] z-[2] bg-white px-[10px] text-[13px] font-bold text-[#2455b4]"
                >
                  Đến ngày
                </Box>
                <DatePicker
                  className="text-base font-bold"
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
          className="BoxLine mb-8 h-[5px] w-full"
          style={{
            WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
            boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
          }}
        />
        <Box className="min-h-[30%]">
          <Box m="0" className="bg-[#D5E6F5] rounded-2xl h-[200px]">
            <Box p="5" className="w-full">
              <Box
                m="0"
                my="4"
                flexWrap
                className="flex justify-between items-center relative"
              >
                <Text className="text-base font-bold text-[#111]">
                  Doanh số {timeLabel}
                </Text>
                <Text className="text-xl font-semibold text-primary">
                  {formatCurrency(data[1]?.soluong ? data[1]?.soluong : 0, true)} đ
                </Text>
              </Box>
              <Box
                m="0"
                my="4"
                flexWrap
                className="flex justify-between items-center relative mt-16"
              >
                <Text className="text-base font-bold text-[#111]">
                  Số lượng SKU {timeLabel}
                </Text>
                <Text className="text-xl font-semibold text-primary">
                  {formatCurrency(data[0]?.soluong ? data[0]?.soluong : "0", true)}
                </Text>
              </Box>
              <Box className="BoxLine h-[5px] border-b border-[#E0E0E0] !mb-4 w-full" />
              <Link
                animate
                noLinkClass
                href={`/listdonhang/?tungay=${fromDate}&denngay=${toDate}&loaids=${zmproute.query?.loai}&frombc=1`}
              >
                <Box className="mt-4 flex items-end" flex justifyContent="flex-end">
                  <Box
                    m="0"
                    flex
                    pr="2"
                    justifyContent="center"
                    alignItems="center"
                    className="h-[30px] rounded-[5px]"
                  >
                    <Box className="text-[13px] italic text-primary font-bold">
                      Chi tiết đơn hàng
                    </Box>
                    <IoIosArrowRoundForward size={20} color="#2455b4" />
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
