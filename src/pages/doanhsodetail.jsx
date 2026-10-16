import Header from "@components/Header"
import useDebounce from "@hooks/useDebounce"
import { datePickerData } from "@static/values"
import { formatCurrency, getAPI } from "@utils/networking"
import { formatDateFromArray, validateString } from "@utils/util"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { BsDashLg } from "react-icons/bs"
import { MdDateRange, MdInventory2, MdPayments, MdReceiptLong } from "react-icons/md"
import { Box, DatePicker, Page, Picker, useStore, zmp } from "zmp-framework/react"
import { Card, Grid, MenuGroup, MenuRow, SectionTitle } from "@components/ui"
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
  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-slate-50"
    >
      <Header back>Doanh số {timeLabel}</Header>

      <div className="flex flex-col gap-3 px-4 pb-8 pt-3">
        {/* Khoảng thời gian */}
        <Card>
          <SectionTitle icon={<MdDateRange size={16} />} className="!px-0">
            Khoảng thời gian
          </SectionTitle>
          <div className="flex items-end gap-2">
          <Box m="0" className="min-w-0 flex-1">
            {isYearMode && (
              <Box m="0">
                <div className="mb-1 text-[12px] text-slate-500">Từ năm</div>
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
                <div className="mb-1 text-[12px] text-slate-500">Từ ngày</div>
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
          <BsDashLg className="mb-3 shrink-0 text-slate-400" />
          <Box m="0" className="min-w-0 flex-1">
            {isYearMode && (
              <Box m="0">
                <div className="mb-1 text-[12px] text-slate-500">Đến năm</div>
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
                <div className="mb-1 text-[12px] text-slate-500">Đến ngày</div>
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
          </div>
        </Card>

        {/* Kết quả */}
        <Grid cols={2}>
          <Card>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <MdPayments size={15} className="text-primary" />
              Doanh số {timeLabel}
            </div>
            <div className="mt-1.5 text-[19px] font-bold tabular-nums text-[#e5232a]">
              {formatCurrency(data[1]?.soluong ? data[1]?.soluong : 0, true)}đ
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <MdInventory2 size={15} className="text-primary" />
              Số lượng SKU {timeLabel}
            </div>
            <div className="mt-1.5 text-[19px] font-bold tabular-nums text-primary">
              {formatCurrency(data[0]?.soluong ? data[0]?.soluong : "0", true)}
            </div>
          </Card>
        </Grid>

        <MenuGroup>
          <MenuRow
            icon={<MdReceiptLong size={18} />}
            label="Chi tiết đơn hàng"
            sub="Các đơn hàng trong khoảng thời gian đã chọn"
            href={`/listdonhang/?tungay=${fromDate}&denngay=${toDate}&loaids=${zmproute.query?.loai}&frombc=1`}
          />
        </MenuGroup>
      </div>
    </Page>
  )
}

export default DoanhSoDetail
