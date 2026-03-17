import { Box, Card, Page, zmp } from "zmp-framework/react"
import "../styles/output.css"
import "../styles/tailwind.css"

import { FaShoppingBasket, FaUser } from "react-icons/fa"
import { FaCoins } from "react-icons/fa6"
import Header from "../components/Header"

const ReportXuDiem = ({ zmproute }) => {
  const header = zmproute.query.loai == 0 ? "xu" : "điểm"
  const title = zmproute.query.loai == 0 ? "Xu" : "Điểm"

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page relative customBackgound"
      style={{ background: "#f8f8f8" }}
    >
      <Header back>{title}</Header>
      <Card className="shadow-xl" inset px="5" style={{ zIndex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 20 }}>{`Báo cáo ${header}`}</div>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#999",
            borderRadius: 24,
            marginTop: 8,
            opacity: 0.4,
          }}
          className="BoxLine"
        ></div>
        <Box style={{ minHeight: "30%" }}>
          <Box m="0" style={{ padding: 8 }}>
            <div style={{ background: "", width: "100%", Height: "auto" }}>
              <Box
                m="0"
                flexWrap
                className="flex justify-between items-center relative"
              >
                <Box
                  className="text-base"
                  style={{
                    color: "#555",
                    fontWeight: "normal",
                    gap: 12,
                    fontSize: 13,
                  }}
                  flex
                  alignItems="center"
                >
                  <span
                    style={{
                      padding: 10,
                      backgroundColor: "#f26f26",
                      borderRadius: 12,
                    }}
                  >
                    <FaUser size={20} color="#fff" />
                  </span>
                  {title} Khách Hàng
                </Box>
                <Box className="text-xl font-medium text-blue-imex">0</Box>
              </Box>
              <Box
                m="0"
                flexWrap
                className="flex justify-between items-center relative mt-13"
              >
                <Box
                  className="text-base"
                  style={{ color: "#555", fontWeight: "normal", gap: 12 }}
                  flex
                  alignItems="center"
                >
                  <span
                    style={{
                      padding: 10,
                      backgroundColor: "#f26f26",
                      borderRadius: 12,
                    }}
                  >
                    <FaShoppingBasket size={20} color="#fff" />
                  </span>
                  {title} Đơn Hàng
                </Box>
                <Box className="text-xl font-medium text-blue-imex">0</Box>
              </Box>
              <Box
                m="0"
                flexWrap
                className="flex justify-between items-center relative mt-13"
              >
                <Box
                  className="text-base"
                  style={{ color: "#555", fontWeight: "normal", gap: 12 }}
                  flex
                  alignItems="center"
                >
                  <span
                    style={{
                      padding: 10,
                      backgroundColor: "#f26f26",
                      borderRadius: 12,
                    }}
                  >
                    <FaCoins size={20} color="#fff" />
                  </span>
                  {title} Còn Lại
                </Box>
                <Box className="text-xl font-medium text-blue-imex">0</Box>
              </Box>
            </div>
          </Box>
        </Box>
      </Card>
      <div
        style={{
          background:
            "linear-gradient(0deg, #85ccf5 25%, #AFDEF2 60%, #f7f9ff 100%)",
          width: "100%",
          height: 600,
          position: "absolute",
          bottom: 0,
          left: 0,
          opacity: 0.1,
        }}
      ></div>
    </Page>
  )
}

export default ReportXuDiem
