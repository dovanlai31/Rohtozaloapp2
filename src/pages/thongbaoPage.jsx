import HeaderBack from "@components/Header/HeaderBack"
import { Alert } from "@components/Icons"
import LoadingSpinner from "@components/LoadingSpinner"
import { request } from "@utils/networking"
import { formatDateToDDMMYYYY } from "@utils/util"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { BsClockFill } from "react-icons/bs"
import { Box, Link, Page, Text, useStore, zmp } from "zmp-framework/react"
import { Modal } from "zmp-ui"
import "../styles/notifypage.scss"

const thongbaoPage = ({ zmproute }) => {
  useEffect(() => {
    getListThongbao()
  }, [])

  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")
  const [ListThongbao, setListThongbao] = useState([])
  const [loading, setLoading] = useState(true)
  const [curItem, setcurItem] = useState({ NOIDUNG: "", TIEUDE: "" })

  const [customSheetOpened, setCustomSheetOpened] = useState(false)
  const sheet = useRef(null)
  const dialog = useRef(null)

  const getListThongbao = async () => {
    let queryString = {
      userId: CusInfo?.KHACHHANG_fk,
    }
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/getListThongbao",
          {
            userId: user.id,
          },
          queryString
        )
      ).json()
      if (response) {
        let p = JSON.parse(response.message)
        //alert(p)
        setListThongbao(p)
        setLoading(false)
      } else {
        setListThongbao([])
        setLoading(false)
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
      setListThongbao([])
      setLoading(false)
    }
  }
  const openSheet = () => {
    if (sheet.current) {
      sheet.current.zmpSheet().open()
    }
  }

  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [
        {
          text: "Đóng",
        },
      ],
    })
    if (dialog.current) {
      dialog.current.open()
    }
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      <HeaderBack slot={"fixed"} title="Thông báo" />

      <Box className="view-center-gh" style={{ marginBottom: 1 }}>
        {loading && <LoadingSpinner></LoadingSpinner>}
        {ListThongbao &&
          ListThongbao.map((km) => {
            return (
              <Box
                className="list-item-km2 shadown-app-1"
                key={km.TIEUDE}
                style={{ padding: 0, borderRadius: 15, background: "white" }}
              >
                <Link
                  // href={`/search?ctkmid=${km.scheme}`}
                  onClick={() => {
                    setcurItem(km)
                    //setCustomSheetOpened(true)
                    // openSheet()
                    showDialog(km.NOIDUNG)
                    // zmp.views.main.router.navigate("/search/?ctkmid=" + km.scheme+'')
                    // zmp.tab.show("#view-main")
                  }}
                >
                  <Box flex alignItems="center">
                    <Box className="list-icon2" style={{ width: "20%" }}>
                      <span className="RoundIcon4">
                        <Alert
                          color={{
                            id: "RedGradientTb",
                            start: "#e60f0f",
                            end: "#e0887d",
                          }}
                        />
                      </span>

                      {/* <img className="giohang-img"
                          style={{ width: 55, height: 55, }} src={icongif2}></img> */}
                    </Box>
                    <Box style={{ width: "100%" }}>
                      <Text className="font-extrabold text-blue-imex text-sm">
                        {km.TIEUDE}
                      </Text>
                      <Box
                        p="0"
                        m="0"
                        mt="2"
                        alignItems="baseline"
                        flex
                        flexDirection="column"
                        justifyContent="space-between"
                        style={{ gap: 8 }}
                      >
                        <Text mx="0" className="text-xs" style={{ color: "#ccc" }}>
                          {formatDateToDDMMYYYY(km.NGAYBATDAU, "/") +
                            " - " +
                            formatDateToDDMMYYYY(km.NGAYKETTHUC, "/")}
                        </Text>
                        <Text
                          mx="0"
                          className="text-xs"
                          style={{
                            color: "#ccc",
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <BsClockFill size={15} />
                          {!!km?.NGAYTAO && moment(km.NGAYTAO).fromNow()}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )
          })}
      </Box>
      <Modal
        visible={customSheetOpened}
        title={curItem.TIEUDE}
        onClose={() => {
          setCustomSheetOpened(false)
        }}
        actions={[
          // {
          //   text: "Button",
          // },
          {
            text: "Đóng",
            close: true,
            highLight: true,
          },
        ]}
        description={curItem.NOIDUNG}
      />
    </Page>
  )
}
const styles = {
  ButtonBack: {
    position: "absolute",
    top: 17,
    left: 17,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(82, 130, 255, 0.2)",
  },
  btnViewGiohang: {
    width: "93%",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderColor: "#dbdfe2",
  },
}
export default thongbaoPage
