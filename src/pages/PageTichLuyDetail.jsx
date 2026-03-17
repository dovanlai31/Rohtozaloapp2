import { Box, Page, Text, useStore, zmp, Button } from "zmp-framework/react"
import { useEffect, useState } from "react"
import {
  MdCardGiftcard,
  MdRemoveShoppingCart,
  MdShoppingCart,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md"
import { FaGift, FaInbox } from "react-icons/fa"
import Color from "@components/common/Color"
import { formatCurrency, request } from "@utils/networking"
import { formatDateToDDMMYYYY } from "@utils/util"
import store from "../store"
import HeaderBack from "@components/Header/HeaderBack"
import ProgressBar from "@ramonak/react-progress-bar"
import LoadingSpinner from "@components/LoadingSpinner"

const PageTichLuyDetail = ({ zmproute }) => {
  const CusInfo = store.getters.getCusInfo.value || {}
  const { pk_seq } = zmproute.query
  const CTTL_FK = pk_seq

  const [dataCT, setDataCT] = useState(null)
  const [quaChuaNhan, setQuaChuaNhan] = useState([])
  const [quaDaNhan, setQuaDaNhan] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 Thu gọn / Mở rộng
  const [showQuaChuaNhan, setShowQuaChuaNhan] = useState(true)
  const [showQuaDaNhan, setShowQuaDaNhan] = useState(true)

  // 🔹 Gọi API lấy chi tiết chương trình
  const getCTTLKHInfo = async () => {
    const method = "khuyenmai/getCTTLKH_info"
    const params = {
      userId: String(CusInfo?.KHACHHANG_fk),
      CTTL_FK,
    }

    try {
      const post = await request("POST", method, params)
      const response = await post.json()
      console.log("loxg_", response)
      if (response?.result && response?.message) {
        const result = JSON.parse(response.message)
        const info = result.ThongTinCT?.[0]
        setDataCT(info)
        setQuaChuaNhan(result.QuaChuaNhan || [])
        setQuaDaNhan(result.QuaDaNhan || [])
      } else {
        setDataCT(null)
      }
    } catch (error) {
      console.log("❌ Lỗi getCTTLKH_info:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCTTLKHInfo()
  }, [])

  const renderQuaItem = (item, index, isDaNhan = false) => (
    <Box
      p="0"
      m="0"
      key={index}
      // className="shadown-app-1"
      style={{
        background: "#e4ebe442",
        borderRadius: 5,
        padding: 5,
        marginBottom: 5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "0.5px solid #c0cfb25d",
      }}
    >
      <Box flexDirection="column" style={{ width: "70%" }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: Color.textAPPBlue,
            marginBottom: 4,
            wordWrap: "break-word",
          }}
        >
          {item.TenSP}
        </Text>
        <Text style={{ fontSize: 12, color: Color.ColorGesoNewLight }}>
          <b>SL</b> {item.SOLUONG} x {formatCurrency(item.DONGIA, true)}
        </Text>

        <Text
          style={{ fontSize: 12, color: Color.textAPPRedChill, fontWeight: 500 }}
        >
          <b>Thành tiền:</b> {formatCurrency(item.THANHTIEN, true)}
        </Text>
        {/* {isDaNhan && item.DONHANG_FK && (
          <Text style={{ fontSize: 11, color: "#888" }}>
            Đơn hàng: #{item.DONHANG_FK}
          </Text>
        )} */}
      </Box>

      <Box
        style={{
          backgroundColor: isDaNhan ? "#E6F7E6" : "#fff4e5cc",
          width: 34,
          height: 34,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaGift size={18} color={isDaNhan ? "#4caf50" : "#f9b349"} />
      </Box>
    </Box>
  )

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      <HeaderBack
        slot="fixed"
        icon={<MdCardGiftcard size={25} className="text-blue-imex" />}
        title="Chi tiết tích lũy"
      />

      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />{" "}
          <span className="font-semibold">Đang tải dữ liệu...</span>
        </div>
      ) : !dataCT ? (
        <div className="flex flex-col justify-center items-center">
          <FaInbox size={25} color="#ccc" />
          <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
            Không có chương trình đang tham gia
          </Text>
        </div>
      ) : (
        <Box p={0}>
          {/* 🧩 Thông tin chương trình */}
          <Box
            // className="shadown-app-1"
            style={{
              background: "linear-gradient(135deg, #ffffff, #f8fbff)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              border: "1px solid #e4e9f0",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: Color.ColorGesoNewLight,
                marginBottom: 4,
                wordWrap: "break-word",
              }}
            >
              {dataCT?.TenChuongTrinh}
            </Text>
            <Text style={{ fontSize: 12, color: Color.textAPPGray }}>
              {formatDateToDDMMYYYY(dataCT?.TuNgay)} đến ngày{" "}
              {formatDateToDDMMYYYY(dataCT?.DenNgay)}
            </Text>

            <Box m={0} p={0} mt={1}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: Color.ColorGesoBlueBold,
                  marginBottom: 4,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {formatCurrency(dataCT?.DoanhThuCamKet ?? 0, true)} -{" "}
                <Text fontSize={11}>Doanh thu cam kết</Text>{" "}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: Color.ColorGesoBlueBold,
                  marginBottom: 4,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {formatCurrency(dataCT?.DoanhThuThucHien ?? 0, true)} -{" "}
                <Text fontSize={11}>Doanh thu thực hiện</Text>{" "}
              </Text>

              {/* Progress bar */}
              <Box mt={2}>
                <ProgressBar
                  completed={dataCT?.PhanTram ?? 0}
                  bgColor={
                    (dataCT?.PhanTram ?? 0) >= 100
                      ? "linear-gradient(90deg, #4caf50, #81c784)"
                      : "linear-gradient(90deg, #42a5f5, #64b5f6)"
                  }
                  baseBgColor="#e0e0e0"
                  height="12px"
                  borderRadius="6px"
                  animateOnRender
                  isLabelVisible={false}
                />
              </Box>

              <Text style={{ fontSize: 12, color: Color.mainColor, marginTop: 4 }}>
                <b>Hoàn thành:</b> {(dataCT?.PhanTram ?? 0).toFixed(1)}%
              </Text>
               <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: Color.ColorNutiMain,
                  marginBottom: 4,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {formatCurrency(dataCT?.TongThuong ?? 0, true)} -{" "}
                <Text style={{color: Color.ColorNutiMain, fontWeight: 'bold'}} fontSize={11}>Thưởng tích lũy</Text>{" "}
              </Text>
            </Box>
          </Box>
          <Box
            // className="shadown-app-1"
            style={{
              background: "#fff",
              borderRadius: 5,
              padding: 16,
              border: "1px solid #e0e0e0",
            }}
          >
            <Button
              style={{
                cursor: "pointer",
                justifyContent: "space-between",
                width: "100%",
              }}
              flex
              alignItems="center"
              onClick={() => setShowQuaDaNhan(!showQuaDaNhan)}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: Color.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaGift size={16} color={Color.primary} />
                Quà đã nhận
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: Color.textAPPRedChill,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Hiện quà{" "}
                {showQuaDaNhan ? (
                  <MdOutlineArrowDropDown color={Color.textAPPRedChill} size={24} />
                ) : (
                  <MdOutlineArrowDropUp color={Color.textAPPRedChill} size={24} />
                )}
              </Text>
            </Button>

            {showQuaDaNhan && (
              <Box mt={3}>
                {quaDaNhan.length === 0 ? (
                  <Box
                    flex
                    justifyContent="center"
                    alignItems="center"
                    style={{ padding: 10 }}
                  >
                    <MdShoppingCart size={13} color="#ccc" />
                    <Text style={{ fontSize: 12, marginLeft: 8, color: "#aaa" }}>
                      Chưa có quà đã nhận
                    </Text>
                  </Box>
                ) : (
                  quaDaNhan.map((item, index) => renderQuaItem(item, index, true))
                )}
              </Box>
            )}
          </Box>

          <Box
            // className="shadown-app-1"
            style={{
              background: "#fff",
              borderRadius: 5,
              padding: 16,
              marginBottom: 20,
              border: "1px solid #e0e0e0",
            }}
          >
            <Button
              style={{
                cursor: "pointer",
                justifyContent: "space-between",
                width: "100%",
              }}
              flex
              alignItems="center"
              onClick={() => setShowQuaChuaNhan(!showQuaChuaNhan)}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: Color.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaGift size={16} color={Color.primary} />
                Quà chưa nhận
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: Color.textAPPRedChill,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Hiện quà{" "}
                {showQuaChuaNhan ? (
                  <MdOutlineArrowDropDown color={Color.textAPPRedChill} size={24} />
                ) : (
                  <MdOutlineArrowDropUp color={Color.textAPPRedChill} size={24} />
                )}
              </Text>
            </Button>

            {showQuaChuaNhan && (
              <Box mt={3}>
                {quaChuaNhan.length === 0 ? (
                  <Box
                    flex
                    justifyContent="center"
                    alignItems="center"
                    style={{ padding: 10 }}
                  >
                    <MdShoppingCart size={13} color="#ccc" />
                    <Text style={{ fontSize: 12, marginLeft: 8, color: "#aaa" }}>
                      Không có quà chưa nhận
                    </Text>
                  </Box>
                ) : (
                  quaChuaNhan.map((item, index) => renderQuaItem(item, index, false))
                )}
              </Box>
            )}
          </Box>
        </Box>
        
      )}
            <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
    </Page>
  )
}

export default PageTichLuyDetail
