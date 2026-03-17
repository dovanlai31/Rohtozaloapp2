import Header from "@components/Header"
import { useEffect, useState } from "react"
import { Box, Page, Text, useStore, zmp } from "zmp-framework/react"
import "../styles/notifypage.scss"

import Color from "@components/common/Color"
import { File } from "@components/Icons"
import LoadingSpinner from "@components/LoadingSpinner"
import { BrowserRouter as Router } from "react-router-dom"

let data = [
  {
    id: 1,
    sohoadon: 123456,
    kyhieu: "TEST1",
    ngaygio: "2024-11-01",
    trangthai: 2,
  },
  {
    id: 2,
    sohoadon: 456789,
    kyhieu: "TEST2",
    ngaygio: "2024-11-01",
    trangthai: 3,
  },
]

const listhoadon = ({ zmproute }) => {
  const dhId = zmproute.query?.dhId || 0
  const user = useStore("user")
  const [listHoaDon, setListHoaDon] = useState([])
  const [pending, setPending] = useState(false)

  const getListHoaDon = () => {
    setPending(true)
    return setTimeout(() => {
      setListHoaDon(data)
      setPending(false)
    }, 100)
  }

  useEffect(() => {
    getListHoaDon()
  }, [])

  return (
    <Router>
      <Page
        onPageBeforeIn={() => {
          zmp.toolbar.hide("#main-nav")
        }}
        className="detail-page"
      >
        <Header back>Hoá đơn</Header>
        <div className="w-full px-5" style={{ maxHeight: 470, overflow: "scroll" }}>
          {listHoaDon &&
            listHoaDon.map((item, index) => {
              return (
                <Box className="list-item-donhang bg-white" key={item.MADH}>
                  <Box className="list-icon2" style={{ width: "30%" }}>
                    <Box className="RoundIcon4">
                      {item.trangthai == 2 ? (
                        <File
                          color={{
                            id: "yellowGradient",
                            start: "#dddd2b",
                            end: "#dddda9",
                          }}
                        />
                      ) : (
                        <File
                          color={{
                            id: "redGradient3",
                            start: "#FF5733",
                            end: "#FFC300",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box
                    className="customText"
                    style={{ width: "70%" }}
                    flex
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <Box m={0}>
                      <Text
                        size="normal"
                        className="font-extrabold text-blue-imex "
                        style={{
                          width: "100%",
                          fontSize: "14px",
                        }}
                      >
                        {item.kyhieu} - {item.sohoadon}
                      </Text>
                    </Box>
                    <Box mx={0} alignItems="center">
                      <Text
                        className="desc text-blue-dark overflow-ellipsis "
                        style={{
                          width: "100%",
                          fontSize: "13px",
                          color: Color.textAPPGray,
                        }}
                        mx="0"
                        size="small"
                      >
                        {item.Trangthai == 2 ? "Hợp lệ" : "Đã huỷ"}
                      </Text>

                      <Text
                        className="desc text-blue-dark overflow-ellipsis "
                        style={{
                          width: "100%",
                          fontSize: "13px",
                          color: Color.textAPPGray,
                        }}
                        mx="0"
                        size="small"
                      >
                        Ngày Tạo {item.ngaygio}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          {pending && <LoadingSpinner />}
        </div>
      </Page>
    </Router>
  )
}

export default listhoadon
