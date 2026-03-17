import React, { useState } from "react"
import { FaUser } from "react-icons/fa"
import { Radio, zmp } from "zmp-framework/react"
import { Box, Button, List, Sheet } from "zmp-ui"
import logoMain from "../../static/images/logoimex.svg"
import store from "../../store"

import "../../styles/app.scss"

type IProps = {
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  data: Array<any>
  fetchData: (id: string) => void
  CapNhatDonHang: (id: string) => void
  setMucDuyet: (mucduyet: number) => void
  chonkhRef: any
}

const ChonKhachHang: React.FC<IProps> = ({
  isVisible,
  data,
  setIsVisible,
  fetchData,
  CapNhatDonHang,
  setMucDuyet,
  chonkhRef,
}) => {
  const [selectedKH, setSelectedKH] = useState<any>(null)

  const setKhachHang = (item: any) => {
    setSelectedKH(item)
  }

  const confirmChoose = (item: any) => {
    if (item?.mucduyet == 0) {
      return zmp.dialog
        .create({
          animate: true,
          backdrop: true,
          title: "Thông báo",
          content: "Tài khoản này chưa được duyệt. Vui lòng chọn tài khoản khác.",
          destroyOnClose: true,
          cssClass: "rounded",
          buttons: [
            {
              text: "Đóng",
              close: true,
              bold: true,
            },
          ],
        })
        .open()
    }

    console.log(item.mucduyet)

    chonkhRef.current = false
    setMucDuyet(item?.mucduyet || 1)
    fetchData(item?.KHACHHANG_fk)
    CapNhatDonHang(item?.KHACHHANG_fk)
    store.dispatch("setCusInfo", {
      ...item,
    })
    zmp.toolbar.show("#main-nav")
  }

  return (
    <Sheet
      visible={isVisible}
      autoHeight
      onClose={() => setIsVisible(false)}
      mask
      maskClosable={false}
      handler={false}
      height={"45%"}
      style={{
        width: "85%",
        top: "25%",
        left: "50%",
        translate: "-50%",
        borderRadius: 12,
      }}
      maskStyle={{
        background: "rgba(0,0,0,.9)",
      }}
    >
      <Box
        p={5}
        className="custom-bottom-sheet"
        style={{ height: "100%", overflowY: "scroll" }}
        flex
        flexDirection="column"
      >
        <img
          className="imgLogo"
          src={logoMain}
          alt="Main Logo"
          style={{
            alignSelf: "center",
            marginBottom: 24,
          }}
          height={"auto"}
          width={200}
        />
        <Box m={0} style={{ height: "100%" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: 18,
              textAlign: "center",
              marginBottom: 24,
              flexDirection: "row",
              display: "flex",
              gap: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaUser />
            Chọn khách hàng
          </div>
          <List>
            {data &&
              data.map((g, index) => {
                return (
                  <Box m={4}>
                    <Radio
                      name="khachhang"
                      value={g}
                      defaultChecked={index == 0}
                      onChange={() => setKhachHang(g)}
                      style={{ gap: 8 }}
                      disabled={g?.mucduyet == 0}
                    >
                      <span style={{ fontSize: 14 }}>
                        {g?.tenkh} {g?.mucduyet == 0 ? "(Chưa duyệt)" : ""}
                      </span>
                    </Radio>
                  </Box>
                )
              })}
          </List>
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
          }}
          pl={1}
        >
          <Button
            fullWidth
            onClick={() => {
              confirmChoose(selectedKH || data[0])
            }}
          >
            Đăng nhập
          </Button>
        </Box>
      </Box>
    </Sheet>
  )
}

export default ChonKhachHang
