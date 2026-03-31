import { useEffect, useMemo, useState } from "react"
import LoadingSpinner from "@components/LoadingSpinner"
import { request } from "@utils/networking"
import { validateString } from "@utils/util"
import { BsArrowUp } from "react-icons/bs"
import { Box, Icon, Link, Page, Text, useStore, zmp } from "zmp-framework/react"

const formatPoints = (value) => {
  const num = Number(value || 0)
  return new Intl.NumberFormat("vi-VN").format(Number.isNaN(num) ? 0 : num)
}

const resolvePointValue = (item) => {
  const candidates = [item?.DIEM, item?.TONGDIEM, item?.TONGGIATRI, item?.GIATRI]
  const found = candidates.find((v) => v !== undefined && v !== null && v !== "")
  const num = Number(found || 0)
  return Number.isNaN(num) ? 0 : num
}

const resolveTitle = (item) =>
  item?.TIEUDE ||
  item?.NOIDUNG ||
  item?.DIENGIAI ||
  item?.TEN ||
  `Giao dịch ${item?.MADH || ""}`

const resolveDateText = (item) => {
  const raw = item?.NGAYTAO || item?.NGAYDH || item?.ngaytao || item?.ngaydh
  if (!raw) return ""
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return String(raw)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const MM = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${hh}:${mm} - ${dd}/${MM}/${yyyy}`
}

const LichSuTichDiem = ({ zmproute }) => {
  const [listHistory, setListHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const CusInfo = useStore("getCusInfo")

  const getPointHistory = async () => {
    setLoading(true)
    try {
      const response = await (
        await request("POST", "khachhang/getListDonQatang", {
          userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          dhId: "",
          trangthai: "",
          tungay: "",
          denngay: "",
        })
      ).json()
      if (response) {
        let p = JSON.parse(response.message)
        setListHistory(Array.isArray(p) ? p : [])
      } else {
        setListHistory([])
      }
    } catch (error) {
      console.log("Error get point history", error)
      setListHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPointHistory()
  }, [zmproute?.url])

  const totalPoints = useMemo(
    () => listHistory.reduce((sum, item) => sum + resolvePointValue(item), 0),
    [listHistory]
  )
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
      className="detail-page bg-[#f3f4f6] p-2 m-0"
    >
      <Box className="p-0 pt-6 pb-3 m-0">
        <Box className="flex items-center justify-between p-0 m-0">
          <Box className="flex items-center gap-3 m-0">
            <Link
              noLinkClass
              className="h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center"
              onClick={handleBack}
            >
              <Icon zmp="zi-close" color="#6b7280" size={18} />
            </Link>
            <Text className="text-[20px] font-extrabold text-[#23408f]">
              Lịch sử điểm
            </Text>
          </Box>
          <Box className="text-right">
            <Text className="text-[13px] font-medium text-[#6b7280]">Tổng điểm</Text>
            <Text className="text-[24px] leading-none font-extrabold text-[#23408f]">
              {formatPoints(totalPoints)}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box className=" pb-6">
        {loading && <LoadingSpinner />}

        {!loading &&
          listHistory.map((item, index) => {
            const points = resolvePointValue(item)
            return (
              <Box
                key={item?.MADH || item?.id || `${index}`}
                className="mb-3 rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] m-0"
              >
                <Box className="flex items-start justify-between gap-3">
                  <Box className="flex flex-1 items-start gap-3 m-0">
                    <Box className="h-9 w-9 rounded-full bg-[#f3f4f6] flex items-center justify-center mt-[2px] m-0">
                      <BsArrowUp color="#3D9A5B" size={16} />
                    </Box>
                    <Box className="flex-1 m-0">
                      <Text className="text-[17px] leading-6 font-bold text-[#1f2937] m-0">
                        {resolveTitle(item)}
                      </Text>
                      <Text className="mt-1 text-[13px] text-[#9ca3af] m-0">
                        {resolveDateText(item)}
                      </Text>
                    </Box>
                  </Box>
                  <Text className="text-[18px] font-extrabold text-[#3D9A5B]">
                    +{formatPoints(points)}
                  </Text>
                </Box>
              </Box>
            )
          })}

        {!loading && !listHistory.length && (
          <Box className="min-h-[45vh] flex items-center justify-center">
            <Text className="text-sm text-[#9ca3af]">Chưa có lịch sử điểm</Text>
          </Box>
        )}
      </Box>
    </Page>
  )
}
export default LichSuTichDiem
