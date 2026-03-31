import Color from "@components/common/Color"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTime } from "react-timer-hook"
import { Box, Text, Icon, zmp } from "zmp-framework/react"

const HeaderHello = ({ CusInfo, user, logoMain }) => {
  const { hours } = useTime()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const closeTimerRef = useRef(null)

  let helloString = ""

  if (hours > 6 && hours < 11) {
    helloString = "Chào buổi sáng, "
  } else if (hours < 13) {
    helloString = "Chào buổi trưa, "
  } else if (hours < 18) {
    helloString = "Chào buổi chiều, "
  } else {
    helloString = "Chào buổi tối, "
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const openSidebar = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsSidebarVisible(true)
    requestAnimationFrame(() => {
      setIsSidebarOpen(true)
    })
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
    closeTimerRef.current = setTimeout(() => {
      setIsSidebarVisible(false)
      closeTimerRef.current = null
    }, 240)
  }

  const goToNotify = () => {
    closeSidebar()
    zmp.views.current?.router?.navigate("/thongbaoPage/", {
      transition: "zmp-cover",
      animate: true,
    })
  }

  const sidebarNode = (
    <>
      <button
        type="button"
        onClick={closeSidebar}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.35)",
          opacity: isSidebarOpen ? 1 : 0,
          transition: "opacity 240ms ease",
          border: "none",
          zIndex: 2147483646,
        }}
        aria-label="Đóng menu"
      />

      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          margin: 0,
          width: "70vw",
          maxWidth: 290,
          height: "100dvh",
          background: "#fff",
          zIndex: 2147483647,
          padding: 0,
          boxShadow: "2px 0 10px rgba(0,0,0,0.16)",
          borderRadius: 0,
          overflow: "hidden",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 240ms cubic-bezier(0.2, 0, 0, 1)",
          willChange: "transform",
        }}
      >
        <div style={{ padding: "20px 12px 12px 12px", margin: 0 }}>
          <img
            width={66}
            height={"auto"}
            src={logoMain}
            alt="Main Logo"
            style={{ marginBottom: 24, marginLeft: 6 }}
          />

          <button
            type="button"
            onClick={goToNotify}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "none",
              background: "#fff",
              padding: "16px 8px",
              borderTop: "1px solid #ececec",
              borderBottom: "1px solid #ececec",
              textAlign: "left",
            }}
          >
            <Box flex alignItems="center" style={{ gap: 10 }}>
              <Box
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#e6f2ff",
                }}
              >
                <Icon zmp="zi-notif" style={{ color: "#2f80ed" }} />
              </Box>
              <Text style={{ fontWeight: 600, color: "#243b53" }}>Thông báo</Text>
            </Box>

            <Icon zmp="zi-chevron-right" style={{ color: "#b7b7b7" }} />
          </button>

          <button
            type="button"
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              border: "none",
              background: "#fff",
              padding: "16px 8px",
              textAlign: "left",
            }}
            className="hidden"
          >
            <Box flex alignItems="center" style={{ gap: 10 }}>
              <Box
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffe9eb",
                }}
              >
                <Icon zmp="zi-log-out" style={{ color: "#eb5757" }} />
              </Box>
              <Text style={{ fontWeight: 600, color: "#eb5757" }}>Đăng xuất</Text>
            </Box>
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Box
        flex
        style={{ width: "100%" }}
        alignItems="center"
        justifyContent="space-between"
        m="0"
      >
        <Box flex alignItems="center" style={{ gap: 10 }}>
          <button
            type="button"
            onClick={openSidebar}
            style={{
              width: 34,
              height: 34,
              border: "none",
              borderRadius: 8,
              background: "#D6E3F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
            }}
            aria-label="Mở menu"
          >
            <span style={{ fontSize: 20, lineHeight: 1, color: Color.primary }}>
              ☰
            </span>
          </button>

          {user && (
            <Box>
              <Text
                size="normal"
                style={{ fontSize: "12px", color: Color.textAPPBlueHeavy }}
              >
                {helloString}
              </Text>
              <Text
                size="large"
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: Color.primary,
                }}
              >
                {CusInfo.KHACHHANG_fk !== 0 ? CusInfo?.tenkh : user?.name}!
              </Text>
            </Box>
          )}
        </Box>

        <Box>
          <img
            width={128}
            height={"auto"}
            className="imgLogo"
            src={logoMain}
            alt="Main Logo"
          />
        </Box>
      </Box>

      {isSidebarVisible &&
        typeof document !== "undefined" &&
        createPortal(sidebarNode, document.body)}
    </>
  )
}

export default HeaderHello
