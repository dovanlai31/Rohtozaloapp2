import Color from "@components/common/Color"
import { useTime } from "react-timer-hook"
import { Box, Text } from "zmp-framework/react"

const HeaderHello = ({ CusInfo, user, logoMain }) => {
  const { hours } = useTime()
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
    </>
  )
}

export default HeaderHello
