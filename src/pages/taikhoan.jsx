import Color from "@components/common/Color"
import NotificationIcon from "@components/Notification"
import { formatCurrency, request, request3, zaloErrorMessages } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import { BiSolidPackage } from "react-icons/bi"

import { authorize } from "zmp-sdk/apis"
import { getSetting } from "zmp-sdk/apis"
import {
  FaCheckCircle,
  FaLuggageCart,
  FaShippingFast,
  FaStore,
  FaTimesCircle,
  FaTruckLoading,
  FaClipboard,
} from "react-icons/fa"
import {
  Box,
  Button,
  Card,
  Icon,
  Link,
  Page,
  Text,
  useStore,
  zmp,
  zmpready,
} from "zmp-framework/react"
import { getPhoneNumber, getUserInfo } from "zmp-sdk/apis"
import store from "../store"
import { validateString } from "@utils/util"
import { FaCircleXmark } from "react-icons/fa6"
import UserImg from "../static/images/user.png"

const AccountPage = ({ zmproute }) => {
  const dialog = useRef(null)
  const user = useStore("user")
  const token = useStore("Token")

  const Giohangx = store.getters.getGioHang.value || []
  const accessToken = store.getters.Token.value || ""
  const PhoneNumner = store.getters.getPhoneNumner.value || []
  const CusInfo = store.getters.getCusInfo.value || []
  console.log('store.getters.getCusInfo', CusInfo);
  const refres = store.getters.refres.value || false
  const [dataDoanhSo, setdataDoanhSo] = useState([])
  const [SoLuongDonHang, setSoLuongDonHang] = useState("0-0")

  const getSoLuongDonHang = async () => {
    try {
      console.log(CusInfo, user)
      const response = await (
        await request(
          "POST",
          "khachhang/getSoLuongDonHang",
          {
            userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          }
          // token
        )
      ).json()
      if (response.result) {
        if (validateString(response.message, true).length > 0) {
          setSoLuongDonHang(response.message)
        }
      } else {
        setSoLuongDonHang("0-0")
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
      setSoLuongDonHang("0-0")
    }
  }

  const getDoanhSo = async () => {
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/getDoanhSo",
          {
            userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          },
          token
        )
      ).json()
      if (response.result) {
        let p = JSON.parse(response.message)
        // alert(p[0].doanhthu)
        setdataDoanhSo(p)
      } else {
        setdataDoanhSo([])
      }
    } catch (error) {
      console.error("Error request api 2 ", error)
      setdataDoanhSo([])
    }
  }

  const getPhoneNumberByToken = async (token, accessToken) => {
    // gọi API Server của bạn để truy xuất thông tin từ token và user access token
    //your_user_access_token, your_token
    try {
      await request3(accessToken, token).then((result) => {
        console.log("khachhang/getPhoneNumberByToken: ", result)
        let sdt = "" + JSON.parse(result).data.number
        //showDialog("Thanhcong")
        if (sdt) {
          //
          onClickSenddangky(sdt)
        }
      })
    } catch (error) {
      console.log("Error request api getPhoneNumberByToken ", error)
      return []
    }
  }

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
      } else {
        return showDialog(p[0].MSG)
        // updateLoading(false)
      }
    } catch (error) {
      console.log("Error request api x ", error)
      // updateLoading(false)
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

  const getUser = async () => {
    const { userInfo } = await getUserInfo({})

    if (userInfo) {
      store.dispatch("setUser", {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
      })
    }
  }
  const checkPhonePermissionAndContinue = () => {
    getSetting({
      success: async (res) => {
        const auth = res.authSetting || {}
        const hasPhonePermission = auth["scope.userPhonenumber"]
        console.log("Qu___2 ", hasPhonePermission)
          console.log("Qu___ ", auth)

        if (hasPhonePermission) {
          try {

              return  zmp.views.current.router.navigate("/taomoiKh/", {
                transition: "zmp-cover",
                animate: true,
              })


            const { token } = await getPhoneNumber({})
            const result = await request3(accessToken, token)
            console.log("khachhang/getPhoneNumberByToken: ", result)

            const sdt = JSON.parse(result).data.number
            if (sdt) {

              console.log("khachhang/getPhoneNumberByToken: ", sdt)
                zmp.views.current.router.navigate("/taomoiKh/", {
                transition: "zmp-cover",
                animate: true,
                props: {
                  phoneNumber: sdt,
                },
              })
            } else {
              showDialog("Không lấy được số điện thoại. Vui lòng thử lại.")
            }
          } catch (err) {
            console.error("Lỗi khi gọi getPhoneNumber: ", err)
            showDialog("Không thể lấy số điện thoại.")
          }
        } else {
      
          zmp.dialog.confirm(
            "Bạn chưa cấp quyền truy cập số điện thoại. Vui lòng cấp quyền để tiếp tục.", "Thông báo",
            () => {
              requestPermission()
            }
          )
        }
      },
      fail: (err) => {
        console.error("Lỗi khi gọi getSetting: ", err)
        showDialog("Không thể kiểm tra quyền. Vui lòng thử lại.")
      },
    })
  }
const requestPermission = () => {
  authorize({
    scopes: ["scope.userInfo", "scope.userPhonenumber"],
    success: (res) => {
      console.log("_Đã cấp quyền:", res)
      getUser()
    },
    fail: (err) => {
      const code = err?.code?.toString()
      const message = zaloErrorMessages[code] || `Lỗi không xác định (code: ${code})`
      showDialog(message)
    },
  })
}

  useEffect(() => {
    getDoanhSo()
    getSoLuongDonHang()

    console.log(CusInfo)
  }, [Giohangx, refres])

  useEffect(() => {
    if (Object.keys(user || {}).length === 0) {
      getUser()
    }
  }, [])

  return (
    <Page className="home-page">
      <Box
        className="HeaderBox pt-st"
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
        slot="fixed"
        // style={{ height: 150 }}
      >
        <Box flex alignItems="center" m={5} >
          <Box flex justifyContent="space-between" m="0">
            <Box m={0} flex justifyContent="center" alignItems="center">
              <Link className="RoundIcon" href="/thongbaoPage">
                <NotificationIcon hasNotification />
              </Link>
              <Link>
                {PhoneNumner && PhoneNumner.length > 2 && (
                  <Box
                    flex
                    style={{
                      background: "rgb(247 249 255 / 31%)",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 10px",
                      borderRadius: "10px",
                    }}
                  >
                    <FaStore size={24} color={Color.textAPPBlue} />

                    <Text
                      className="view-center  "
                      size="xsmall"
                      style={{
                        marginTop: 0,
                        color: Color.textAPPBlue,
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                    >
                      {"" + PhoneNumner + " "}
                    </Text>
                  </Box>
                )}
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" mt={2} pt={3}></Box>
      </Box>
      <Card
        className="shadown-app-1 "
        inset
        style={{ fontWeight: "bold", fontSize: "30px" }}
      >
        <Box
          flex
          m={0}
          width={"100%"}
          className="view-block-ccount "
          style={{
            minHeight: "80px",
            borderRadius: "5px",
            position: "relative",
          }}
          flexDirection="column"
        >
          <Box m="0" p="0" flex alignItems="center" justifyContent="space-between">
            <Box
              m="0"
              p="0"
              className="avatar-account"
              style={{
                width: "80px",
                height: "80px",
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                loading="lazy"
                className="avatar-img"
                src={user?.avatar || UserImg}
              ></img>
            </Box>

            <Box
              flex
              pt="4"
              m="0"
              flexDirection="column"
              justifyContent="center"
              style={{ width: "100%" }}
            >
              <Text
                className="text-block-acc-name  text-blue-imex "
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  wordBreak: "break-word",
                  fontSize: "16px",
                }}
              >
                {CusInfo.tenkh}
              </Text>
              <Box
                flex
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  className="view-center  "
                  size="xsmall"
                  style={{
                    marginTop: 0,
                    background: "rgb(247 249 255 / 31%)",
                    fontWeight: 500,
                    fontSize: "11px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {CusInfo.KHACHHANG_fk !== 0 ? (
                    <FaCheckCircle color={Color.primary} size={15} />
                  ) : (
                    <FaCircleXmark color={Color.textAPPRed} size={15} />
                  )}{" "}
                  {CusInfo.KHACHHANG_fk !== 0 ? (
                    <strong>Hoạt động</strong>
                  ) : (
                    <strong>Chưa đồng bộ</strong>
                  )}
                </Text>
              </Box>
              {(CusInfo?.KHACHHANG_fk || 0) === 0 && (
                <Box
                  className=""
                  my="5"
                  flex
                  justifyContent="center"
                  alignItems="center"
                  style={{ background: "", padding: 10, margin: 0 }}
                >
                  <Link
                     onClick={checkPhonePermissionAndContinue}
                    animate
                    //transition='zmp-cover-v'
                    noLinkClass
                    className=""
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        padding: "0 25",
                        margin: "0 25",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: Color.textAPPGray2,
                      }}
                    >
                      Số điện thoại chưa được đồng bộ với hệ thống
                      <br />
                      Vui lòng đăng ký 
                    </Text>
                    <Button
                      className="filter-button-App"
                      typeName="primary"
                      style={{ margin: "10px 0px" }}
                      text="Đăng ký"
                      // iconZMP="zi-add-user"
                      // iconSize={25}
                    />
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Card>
      <Card
        className="shadown-app-1 "
        inset
        title="Doanh số"
        style={{ fontWeight: "bold", fontSize: "30px" }}
      >
        <Link animate noLinkClass href="/doanhsodetail/?loai=0">
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box flex style={{}} alignItems="center">
              {/* <Box m="0" className="RoundIcon2" style={{ marginRight: "15px" }}>
                <FaChartLine size={15}></FaChartLine>
              </Box> */}
              <Text style={{}} className="view-text-center">
                Doanh số tháng
                {dataDoanhSo && dataDoanhSo[0] && dataDoanhSo[0].Column1}
              </Text>
            </Box>
            <Text
              size="normal"
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                flexGrow: 1,
                textAlign: "right",
              }}
              className="view-text-center text-blue-imex "
            >
              {dataDoanhSo && dataDoanhSo[0]
                ? formatCurrency(dataDoanhSo[0].doanhthu)
                : formatCurrency(0)}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link>
        <Link animate noLinkClass href="/doanhsodetail/?loai=1">
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box flex style={{}} alignItems="center">
              {/* <Box m="0" className="RoundIcon2" style={{ marginRight: "15px" }}>
                <FaChartBar size={15}></FaChartBar>
              </Box> */}
              <Text style={{}} className="view-text-center">
                Doanh số năm
                {dataDoanhSo && dataDoanhSo[1] && dataDoanhSo[1].Column1}
              </Text>
            </Box>
            <Text
              size="normal"
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                flexGrow: 1,
                textAlign: "right",
              }}
              className="view-text-center text-blue-imex "
            >
              {dataDoanhSo && dataDoanhSo[1]
                ? formatCurrency(dataDoanhSo[1].doanhthu)
                : formatCurrency(0)}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link>
      </Card>
      <Card className="shadown-app-1" inset title="Quản lý đơn hàng">
        <Link
          href={`/listdonhang/?trangthai=0&sl=${SoLuongDonHang.split("-")[0] || 0}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box flex style={{ width: "80%" }} alignItems="center">
              <span className="RoundIcon2">
                <FaLuggageCart size={20}></FaLuggageCart>
              </span>
              <Text style={{ marginLeft: 15 }} className="view-text-center">
                Đơn chờ xác nhận
              </Text>
            </Box>
            <Text
              size="normal"
              style={{ marginLeft: 15, fontWeight: 600, fontSize: "1rem" }}
              className="view-text-center text-blue-imex "
            >
              {(SoLuongDonHang.length > 0 && SoLuongDonHang.split("-")[0]) || 0}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link>
        {/* <Link
          href={`/listdonhang/?trangthai=1&sl=${SoLuongDonHang.split("-")[1] || 0}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box style={{ width: "80%" }} flex alignItems="center">
              <span className="RoundIcon2">
                <FaTruckLoading size={20}></FaTruckLoading>
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Đơn đã xuất kho
              </Text>
            </Box>
            <Text
              size="normal"
              style={{ marginLeft: 15, fontWeight: 600, fontSize: "1rem" }}
              className="view-text-center text-blue-imex "
            >
              {(SoLuongDonHang.length > 0 && SoLuongDonHang.split("-")[1]) || 0}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link> */}
        {/* <Link
          href={`/listdonhang/?trangthai=2&sl=${SoLuongDonHang.split("-")[2] || 0}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaShippingFast size={20}></FaShippingFast>
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Đơn đang giao hàng
              </Text>
            </Box>
            <Text
              size="normal"
              style={{ marginLeft: 15, fontWeight: 600, fontSize: "1rem" }}
              className="view-text-center text-blue-imex "
            >
              {(SoLuongDonHang.length > 0 && SoLuongDonHang.split("-")[2]) || 0}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link> */}
        <Link
          href={`/listdonhang/?trangthai=1&sl=${SoLuongDonHang.split("-")[1] || 0}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <BiSolidPackage size={20}></BiSolidPackage>
              </span>

              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Đơn đã xác nhận
              </Text>
            </Box>
            <Text
              size="normal"
              style={{ marginLeft: 15, fontWeight: 600, fontSize: "1rem" }}
              className="view-text-center text-blue-imex "
            >
              {(SoLuongDonHang.length > 0 && SoLuongDonHang.split("-")[1]) || 0}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link>
        {/* <Link
          href={`/listdonhang/?trangthai=4&sl=${SoLuongDonHang.split("-")[4] || 0}`}
          animate
          transition="zmp-cover-v"
          noLinkClass
        >
          <Box p={1} style={styles.row} alignItems="center" flex>
            <Box alignItems="center" style={{ width: "80%" }} flex="row">
              <span className="RoundIcon2">
                <FaTimesCircle size={20}></FaTimesCircle>
              </span>
              <Text style={{ marginLeft: 15 }} className="view-text-center ">
                Đơn huỷ
              </Text>
            </Box>
            <Text
              size="normal"
              style={{ marginLeft: 15, fontWeight: 600, fontSize: "1rem" }}
              className="view-text-center text-blue-imex "
            >
              {(SoLuongDonHang.length > 0 && SoLuongDonHang.split("-")[4]) || 0}
            </Text>
            <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
          </Box>
        </Link> */}
      </Card>
      {!!CusInfo.xemDonDatHangZalo && (
        <Card className="shadown-app-1" inset title="Quản lý đơn đặt hàng">
          <Link
            href={`/kiemtradondathang/?sl=${SoLuongDonHang.split("-")[2] || 0}`}
            animate
            transition="zmp-cover-v"
            noLinkClass
          >
            <Box p={1} style={styles.row} alignItems="center" flex>
              <Box alignItems="center" style={{ width: "80%" }} flex="row">
                <span className="RoundIcon2">
                  <FaClipboard size={20}></FaClipboard>
                </span>

                <Text style={{ marginLeft: 15 }} className="view-text-center ">
                  Kiểm tra đơn đặt hàng
                </Text>
              </Box>
              <Text
                size="normal"
                style={{ marginLeft: 15, fontWeight: 600, fontSize: "1rem" }}
                className="view-text-center text-blue-imex "
              >
                {(SoLuongDonHang.length > 0 && SoLuongDonHang.split("-")[2]) || 0}
              </Text>
              <Icon className=" text-blue-imex " zmp="zi-chevron-right"></Icon>
            </Box>
          </Link>
        </Card>
      )}

      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
    </Page>
  )
}
const styles = {
  row: {
    borderBottomWidth: 1,
    borderColor: "#eeee",
    alignItems: "center",
    justifyContent: "space-between",
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
export default AccountPage
