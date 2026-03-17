import React from "react"
import { Box, Button, Modal, Text } from "zmp-ui"
import logoMain from "../../static/images/opclogo.png"
import Color from "@components/common/Color"
import "../../styles/app.scss"

type IProps = {
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  closeAlert: () => void
  signup: () => void
}

const AlertNoUser: React.FC<IProps> = ({
  isVisible,
  setIsVisible,
  signup,
  closeAlert,
}) => {
  return (
    <Modal
      visible={isVisible}
      onClose={() => setIsVisible(false)}
      title=""
      unmountOnClose={true}
      maskClosable={false}

    >
      <Box
        p={5}
        className="custom-bottom-sheet"
        style={{ height: "100%", overflowY: "scroll" }}
        flex
        flexDirection="column"
      >
        <img
          src={logoMain}
          alt="Main Logo"
          width={100}
          height="auto"
          style={{
            marginBottom: 40,
            display: "block",
            margin: "0 auto",
          }}
        />

        <Text size="small">
          Tài khoản Zalo của người dùng chưa được đồng bộ với hệ thống của{" "}
          <strong>OPC</strong>
        </Text>
        <Text size="small" style={{ marginTop: 8 }}>
          Ứng dụng cần cung cấp thông tin cần thiết. Bạn có muốn <strong>đồng bộ qua số điện thoại</strong>?
        </Text>

        <Box
          mt={5}
          flex
          flexDirection="row"
          justifyContent="center"
          style={{
            flex: 1,
            marginTop: '20px',
            flexDirection: "row",

            gap: 24,
          }}
          pl={1}
        >
          <Button
            variant="secondary"
            type="danger"
            style={{

              borderRadius: '5px', 
            }}
            fullWidth onClick={() => closeAlert()}
          >
            Đóng
          </Button>
          <Button
            style={{
              backgroundColor: Color.primary,
              borderRadius: '5px', 
            }}
            fullWidth onClick={() => signup()}
          >
            Đồng bộ
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AlertNoUser
