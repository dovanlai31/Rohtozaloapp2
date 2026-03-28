import Color from "@components/common/Color"
import { formatCurrency, request, request3 } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { BiSolidDiscount } from "react-icons/bi"
import { FaListAlt, FaShoppingBag, FaVideo } from "react-icons/fa"
import { MdFitbit, MdFormatAlignJustify,MdListAlt , MdChevronRight, MdShoppingCart } from "react-icons/md"
import ProgressBar from "@ramonak/react-progress-bar"
import {
  Box,
  Card,
  Icon,
  Link,
  Page,
  Text,
  useStore,
  zmp,
  zmpready,
} from "zmp-framework/react"
import { getPhoneNumber, openChat } from "zmp-sdk/apis"
import store from "../store"
import config from "../config"

const Khachhang = ({ zmproute }) => {
  const dialog = useRef(null)
  const user = useStore("user")
  const token = useStore("Token")
  const Giohangx = store.getters.getGioHang.value || []
  const accessToken = store.getters.Token.value || ""
  const PhoneNumner = store.getters.getPhoneNumner.value || []
  const CusInfo = store.getters.getCusInfo.value || []
  const [loading, setLoading] = useState(true)
  const [dataTichLuy, setDataTichLuy] = useState(null)
  const refres = store.getters.refres.value || false
  // useEffect(() => {
  //   console.log("refres x ", refres)
  //   getDoanhSo()
  //   getSoLuongDonHang()
  // }, [Giohangx, refres])
  const [dataDoanhSo, setdataDoanhSo] = useState([])
  const [SoLuongDonHang, setSoLuongDonHang] = useState("0-0-0-0-0")

  useEffect(() => {
    console.log("log__usser", CusInfo)
    getTichLuyTham()
  }, [])

  const onClickSenddangky = async (sdt) => {
    let params = { sodienthoai: sdt, userId: user.id }
    try {
      const response = await (
        await request("POST", "khachhang/dangky", params, params)
      ).json()
      if (response) {
        console.log("xxxxxxxxxx  dangky", response)
        let p = JSON.parse(response.message)
        //  updateLoading(false)
        console.log("xxxxxxxxxx ", response)
        if (p[0].RESULT == 1) {
          store.dispatch("setPhoneNumber", sdt)
          store.dispatch("setRefres", sdt)
          return showDialog(p[0].MSG)
        }
        // let p = JSON.parse(response.message)
        // console.log(method, p)

        //}
      } else {
        return showDialog(p[0].MSG)
        // updateLoading(false)
      }
    } catch (error) {
      console.log("Error request api x ", error)
      // updateLoading(false)
    }
  }
  const getTichLuyTham = async () => {
    const method = "khuyenmai/GetTichLuyTham"
    const params = {
      userId: String(CusInfo?.KHACHHANG_fk),
    }
    try {
      const post = await request("POST", method, params)

      const response = await post.json()
      console.log("logss", response)
      if (response && response.result && response.message) {
        let list = JSON.parse(response.message)
        console.log("list___", list)
        setDataTichLuy(list[0] || null)
      } else {
        setDataTichLuy(null)
      }
    } catch (error) {
      console.log("❌ Lỗi API GetTichLuyTham:", error)
      setDataTichLuy(null)
    } finally {
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
    if (dialog.current) {
      dialog.current.open()
    }
  }
  const openChatScreen = async () => {
    console.log("xxx")
    try {
      await openChat({
        type: "oa",
        id: config.OA_ID,
        message: "Xin Chào",
      })
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error)
    }
    // setTimeout(() => {
    //   zmp.tab.show("#view-main")
    // }, 1000)
  }

  return (
    <Page className="home-page">
      {/* <NavigationBar active={zmproute.path} /> */}
      {/* <div className="top_account"> */}

      {/* Tài khoản */}
      {/* <HeaderBox iconName="zi-user-settings-solid"></HeaderBox> */}

      <Box
        className="HeaderBoxKhachHang fixed-bg "
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
        style={{
          height: "40%",
          // background:'red',
        }}
      ></Box>
      <Box
        className=""
        noSpace={true}
        style={{ height: "100px", position: "relative" }}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          m="0"
          p="0"
          className="customBG "
          //  inset
          style={{
            width: "calc(100% - 40px)",
            minHeight: "100px",
            top: "-20px",
            left: "50%",
            borderRadius: "10px",
            border: "#c9d1d8 1px solid",
            transform: "translate(-50%, -50%)",
            position: "absolute",
          }}
        >
          <Box
            flex
            m={0}
            width={"100%"}
            className=""
            style={{
              minHeight: "150px",
              borderRadius: "5px",
            }}
            flexDirection="column"
          >
            <Box flex alignItems="center" justifyContent="space-between">
              <Box
                flex
                py="4"
                flexDirection="column"
                justifyContent="center"
                style={{ width: "100%" }}
              >
                {/* <Box flex justifyContent="center" style={{ width: "100%" }}>
                  <Box m="0" p="0" className="logo-imex "></Box>
                </Box> */}
                <Text
                  className="text-block-acc-name  text-blue-imex"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {"ROHTO - Khách hàng"}
                </Text>
                <Box
                  flex
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ textAlign: "center", lineHeight: 1.5 }}>
                    Bạn cần hỗ trợ nhanh, tư vấn hỗ trợ
                    <br />
                    <b style={{ color: Color.textAPPBlue }}>
                      Hãy gửi tin nhắn trực tiếp trên ứng dụng
                    </b>
                  </p>
                </Box>
                <Box
                  m="0"
                  flex
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // background:'red',
                  }}
                >
                  <Box
                    m="0"
                    flex
                    flexDirection="row"
                    style={{ width: "80%", gap: "20px" }}
                  >
                    <Link
                      onClick={() => {
                        openChatScreen()
                      }}
                      m="0"
                      className="view-center"
                      style={{
                        marginTop: 24,
                        flex: 1,
                        color: Color.BackGroundLightWhite,
                        backgroundColor: Color.primary,
                        fontWeight: 500,
                        padding: "5px 10px",
                        borderRadius: "5px",
                        width: "70%",
                        height: "40px",
                        textAlign: "center",
                      }}
                    >
                      Nhắn tin
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Card
        className="shadown-app-1 view-block-cardTL"
        inset
        // title="Chương trình"
        style={{ fontWeight: "bold", fontSize: "30px" }}
      >
        <Box m="0" p="2"
      
          // className="shadown-app-1"
          style={{
            borderRadius: 10,
         
            width: "100%",
            textAlign: "left",
          }}
        >
          {loading ? (
            <Text style={{ textAlign: "center",  fontSize: 11, color: "#888" }}>
              Đang tải dữ liệu...
            </Text>
          ) : dataTichLuy ? (
            <>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: Color.ColorGesoNewLight,
                  marginBottom: 8,
                }}
              >
                {CusInfo?.tenkh ?? "Khách hàng"}
              </Text>
                          <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: Color.textAPPBlue,
                  fontWeight: "bold",
                  marginBottom: 4,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                 {dataTichLuy.TuNgay ?? ""} đến ngày{" "}
                {dataTichLuy.DenNgay ?? ""}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginBottom: 4,
                  fontWeight: "bold",
                  color: Color.ColorGesoNewLight,
                }}
              >
                  {dataTichLuy?.TenChuongTrinh}
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
                {formatCurrency(dataTichLuy?.DoanhThuCamKet ?? 0, true)} -{" "}
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
                {formatCurrency(dataTichLuy?.DoanhThuThucHien ?? 0, true)} -{" "}
                <Text fontSize={11} >Doanh thu thực hiện</Text>{" "}
              </Text>

              {/* Thanh tiến độ */}

              <ProgressBar
                completed={dataTichLuy?.PhanTram ?? 0}
                bgColor={
                  (dataTichLuy?.PhanTram ?? 0) >= 100 ? "#f7ab6d" : Color.primary
                }
                baseBgColor="#e0e0e0"
                height="25px"
                borderRadius="5px"
                className="wrapper"
                labelSize="11px"
                labelAlignment="center"
                labelColor="#ffffff"
                animateOnRender
              />


              {/* <Text style={{ fontSize: 14, marginBottom: 10, color: Color.textAPPRed2, flexDirection:'row', display:'flex', alignItems:'center', gap:4 }}>
                <b>Hoàn thành:  {(dataTichLuy?.PhanTram ?? 0).toFixed(1)}%</b>
                
              </Text> */}
              <Box p="0" m="0" flex style={{ gap: 4 }}>
                <Link
                 href={`/PageTichLuyDetail/?pk_seq=${dataTichLuy?.PK_SEQ}`}
                  // className="view-center"
                  style={{
                    // backgroundColor: Color.primary,
                    color: Color.primary,
                    border: `0.5px solid ${Color.primary}`,
                    padding: "2px 6px",
                    marginTop: 12,
                    borderRadius: 5,
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  <Text
                    style={{
                      marginRight: 4,
                      fontWeight: "bold",
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: Color.primary,
                    }}
                  >
                    {" "}
                   Chi tiết
                    <MdShoppingCart />
                  </Text>
                </Link>
                <Link
                  href="/TichLuyList"
                  // className="view-center"
                  style={{
                    // backgroundColor: Color.primary,
                    color: Color.primary,
                    border: `0.5px solid ${Color.primary}`,
                    padding: "8px 12px",
                    marginTop: 12,
                    borderRadius: 5,
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  <Text
                    style={{
                      marginRight: 4,
                      fontWeight: "bold",
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: Color.primary,
                    }}
                  >
                    {" "}
                    Tích lũy
                    <MdChevronRight />
                  </Text>
                </Link>
              </Box>
            </>
          ) : (
            <Text
              style={{
                fontSize: 12,
                textAlign: "center",
                color: "#666",
                paddingVertical: 12,
                fontWeight: "bold",
              }}
            >
              Hiện tại bạn chưa tham gia chương trình tích lũy nào
            </Text>
          )}
        </Box>

        {/* <Link
          href="/TichLuyList"
          animate
          // transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaShoppingBag size={15}></FaShoppingBag>
              </span>
              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Tích lũy 
              </Text>
            </Box>

            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link>
        <Link
          href="/DoiQua/?loai=0"
          animate
          // transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaShoppingBag size={15}></FaShoppingBag>
              </span>
              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Đổi quà
              </Text>
            </Box>

            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link> */}
        {/* <Link
          href="/voucher"
          animate
          // transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <BiSolidDiscount size={18}></BiSolidDiscount>
              </span>
              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Voucher
              </Text>
            </Box>

            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link> */}
      </Card>
      <Card
        className="shadown-app-1 "
        inset
        title="Đồng hành cùng Nutifood"
        style={{ fontWeight: "bold", fontSize: "30px", display: "none" }}
      >
        <Box p={1} style={styles.row} alignItems="center" flex>
          <Link
            href="/KhaoSat/?trangthai=1"
            animate
            // transition="zmp-cover-v"
            noLinkClass
            style={{ flexGrow: 1 }}
          >
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaListAlt size={15} />
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Khảo sát
              </Text>
            </Box>
          </Link>
        </Box>
        <Box p={1} style={styles.row} alignItems="center" flex>
          <Link
            href="/pageVideoList"
            animate
            transition="zmp-cover-v"
            noLinkClass
            style={{ flexGrow: 1 }}
          >
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaVideo size={15} />
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Xem video tích xu
              </Text>
            </Box>
          </Link>
        </Box>
      </Card>
    </Page>
  )
}
const styles = {
  row: {
    display: "flex",
    borderBottomWidth: 1,
    borderColor: "#eeee",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  avatarView: {
    borderWidth: 2,
    borderColor: "gray",
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  Boxcapdokh: {
    // backgroundColor: '#C3D2FA',
    // borderRadius: 10,
  },
}
export default Khachhang
