import HeaderBack from "@components/Header/HeaderBack"
import { Alert } from "@components/Icons"
import LoadingSpinner from "@components/LoadingSpinner"
import { request } from "@utils/networking"
import { formatDateToDDMMYYYY } from "@utils/util"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { BsBellFill, BsClockFill } from "react-icons/bs"
import { Box, Link, Page, Text, useStore, zmp } from "zmp-framework/react"
import { Modal } from "zmp-ui"
import "../styles/notifypage.scss"

// Object mau theo dung cac field dang dung trong UI thong bao.
const THONGBAO_SAMPLE = {
  TIEUDE: "Thong bao mau",
  NOIDUNG: "Noi dung thong bao mau de ban xu ly tiep.",
  NGAYBATDAU: "2026-03-30T00:00:00",
  NGAYKETTHUC: "2026-04-30T23:59:59",
  NGAYTAO: "2026-03-30T08:30:00",
  scheme: "",
}

const ThongbaoPage = ({ zmproute }) => {
  useEffect(() => {
    getListThongbao()
  }, [])

  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")
  const [ListThongbao, setListThongbao] = useState([])
  const [loading, setLoading] = useState(true)
  const [curItem, setcurItem] = useState({ NOIDUNG: "", TIEUDE: "" })

  const [customSheetOpened, setCustomSheetOpened] = useState(false)
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
    dialog.current?.open()
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      <HeaderBack slot={"fixed"} title="Thông báo" />

      <Box className="view-center-gh mb-[1px]">
        {loading && <LoadingSpinner></LoadingSpinner>}
        {ListThongbao?.map((km) => {
            return (
              <Box
                className="list-item-km2 shadown-app-1"
                key={km.TIEUDE}
                style={{ padding: 0 }}
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
                    <Box className="list-icon2 w-1/5">
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
                    <Box className="w-full">
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
                        className="gap-2"
                      >
                        <Text mx="0" className="text-xs text-[#ccc]">
                          {formatDateToDDMMYYYY(km.NGAYBATDAU, "/") +
                            " - " +
                            formatDateToDDMMYYYY(km.NGAYKETTHUC, "/")}
                        </Text>
                        <Text mx="0" className="text-xs text-[#ccc] flex gap-2 items-center">
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
        {!loading && !ListThongbao?.length && (
          <Box className="min-h-[60vh] w-full flex flex-col justify-center items-center gap-2 text-[#808080]">
            <BsBellFill size={30} color="#808080" />
            <Text className="font-bold text-[#808080] text-base">Không có thông báo</Text>
            <Text className="text-[#808080] text-sm text-center">
              Bạn chưa có thông báo nào. Hãy quay lại sau nhé!
            </Text>
          </Box>
        )}
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
export default ThongbaoPage
