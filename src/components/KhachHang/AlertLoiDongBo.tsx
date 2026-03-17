import React from "react"
import { Box, Button, Sheet, Text, Modal } from "zmp-ui"
import logoMain from "../../static/images/opclogo.png"

import "../../styles/app.scss"

type IProps = {
  isVisible: boolean
  setIsVisible: (value: boolean) => void
}

const AlertLoiDongBo: React.FC<IProps> = ({ isVisible, setIsVisible }) => {
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
            marginBottom: 35,
            display: "block",
            margin: "0 auto",
          }}
        />
        <Box
          m={0}
          style={{
            height: "100%",
            textAlign: "center",
            flexDirection: "column",
            gap: 12,
            display: "flex",
          }}
        >
          <Text size="small">
            Đồng bộ thất bại. Vui lòng quét QR để thực hiện lại !
          </Text>
        </Box>
      </Box>
      <Box flex flexDirection="row" mt={1}>
        <Box
          style={{
            flex: 1,
            marginLeft: 12,
            marginRight: 12,
            marginBottom: 12,
            marginTop: 12,
            flexDirection: "row",
            display: "flex",
            gap: 24,
          }}
          pl={1}
        >
          <Button
             style={{

              borderRadius: '5px', 
            }}
            variant="secondary"
            type="danger"
            fullWidth
            onClick={() => setIsVisible(false)}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AlertLoiDongBo
