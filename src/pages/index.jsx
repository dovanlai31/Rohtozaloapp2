import DanhMucSP from "@components/DanhMucSP"
import ChonKhachHang from "@components/KhachHang/ChonKhachHang"
import Latest from "@components/Latest"
import { useEffect, useRef, useState } from "react"
import { Box, Page, useStore, zmp } from "zmp-framework/react"
import {
  CapNhatDonHang,
  FetchInitData,
  getDataCusFromId,
  getDataCusFromSevice,
} from "../services/services"
import store from "../store"
import HeaderHello from "./homecomponent/HeaderHello"
import PaddingSection from "./homecomponent/PaddingSection"
import SearchBox from "./homecomponent/SearchBox"
import logoMain from "@static/images/opclogo.png"
import Banner from "@components/Categories/Banner"
import withOverlay from "@components/HOC/withOverlay"
import AlertNoUser from "@components/KhachHang/AlertNoUser"
import { getUserID, getUserInfo } from "zmp-sdk/apis"
import "../styles/app.scss"
import AlertLoiDongBo from "@components/KhachHang/AlertLoiDongBo"
import { zaloErrorMessages } from "@utils/networking"
import { authorize } from "zmp-sdk/apis"
import { getSetting } from "zmp-sdk/apis"
const HomePage = ({ showToast }) => {
  // const logged = useRef(false)
  const chonkh = useRef(false)
  const dialog = useRef(null)

  const [alertNoUser, setAlertNoUser] = useState(false)
  const [alertLoiDongBo, setAlertLoiDongBo] = useState(false)
  const [khData, setKHData] = useState([])
  const [error, setError] = useState({
    username: false,
    password: false,
  })
  const [loading, setLoading] = useState(false)
  const [mucduyet, setMucDuyet] = useState(0)

  const CusInfo = useStore("getCusInfo")
  const logged = useStore("getLogged")
  const user = useStore("user") || ""

  useEffect(() => {
   
    if (!store.getters["stories"].value.length) {
      store.dispatch("getStories")
    }

    if (!store.getters["categories"].value.length) {
    }

    // store.dispatch("getLatestBlogs", {  limit: 20, skip: 0, reset: true })

    console.log("mức duyệt: ", CusInfo?.mucduyet)
  }, [])

  const showDialog = (sms, btn) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + sms + "</div>",
      buttons: btn
        ? [
            {
              text: "Đóng",
            },
            {
              text: btn ? "Đăng ký" : "",
              //close: false,
              onClick() {
                console.log("main actions")
                if (btn) dk(0)
              },
            },
          ]
        : [
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
    console.log(" getUserInfo2 : ", userInfo)

    if (userInfo) {
      store.dispatch("setUser", {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
      })
    }
  }  

const requestPermission = () => {
  authorize({
    scopes: ["scope.userInfo", "scope.userPhonenumber"],
    success: async (res) => {
      console.log("res2___", res);
      const isEmpty = Object.keys(res || {}).length === 0
      if (isEmpty) {
        return   showDialog('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.')
      }
      return checkPhonePermissionAndContinue()


    },
    fail: (err) => {
      const code = err?.code?.toString()
      const message = zaloErrorMessages[code] || `Lỗi không xác định (code: ${code})`
      showDialog(message)
    },
  })
}  
const checkPhonePermissionAndContinue = () => {
  getSetting({
    success: async (res) => {
      const auth = res.authSetting || {}
      const hasPhonePermission = auth["scope.userPhonenumber"]
      console.log("Qu___2 ", hasPhonePermission)
      if (hasPhonePermission) {
        try {
            getUser()
            return  store.dispatch("setLogged", true).then(() => {
            setAlertNoUser(false)

            zmp.tab.show("#view-main")
            zmp.toolbar.hide("#main-nav")
            zmp.views.current.router.navigate("taomoiKh/", {
              transition: "zmp-cover",
              animate: true,
            })
          })



        } catch (err) {
          console.error("Lỗi khi gọi getPhoneNumber: ", err)
          showDialog("Không thể lấy số điện thoại.")
        }
      } else {
          
        requestPermission()
      }
    },
    fail: (err) => {
      console.error("Lỗi khi gọi getSetting: ", err)
      showDialog("Không thể kiểm tra quyền. Vui lòng thử lại.")
    },
  })
}

  const dk = async (value) => {

    checkPhonePermissionAndContinue()

  }
  // const dk = async (value) => {
  //   const { userInfo } = await getUserInfo({})

  //   if (userInfo) {
  //     store.dispatch("setUser", {
  //       id: userInfo.id,
  //       name: userInfo.name,
  //       avatar: userInfo.avatar,
  //     })
  //   }

  //   store.dispatch("setLogged", true).then(() => {
  //     setAlertNoUser(false)

  //     zmp.tab.show("#view-main")
  //     zmp.toolbar.hide("#main-nav")
  //     zmp.views.current.router.navigate("taomoiKh/", {
  //       transition: "zmp-cover",
  //       animate: true,
  //     })
  //   })
  // }

  // const login = (username, password) => {
  //   if (username.length == 0 && password.length == 0) {
  //     setError({ username: true, password: true })
  //     return zmp.toast.show({
  //       destroyOnClose: true,
  //       position: "bottom",
  //       text: "Vui lòng nhập số điện thoại và mật khẩu",
  //       closeButton: false,
  //       cssClass: "error",
  //     })
  //   } else if (username.length == 0) {
  //     setError({ username: true, password: false })
  //     return zmp.toast.show({
  //       destroyOnClose: true,
  //       position: "bottom",
  //       text: "Vui lòng nhập số điện thoại",
  //       closeButton: false,
  //       cssClass: "error",
  //     })
  //   } else if (password.length == 0) {
  //     setError({ username: false, password: true })
  //     return zmp.toast.show({
  //       destroyOnClose: true,
  //       position: "bottom",
  //       text: "Vui lòng nhập mật khẩu",
  //       closeButton: false,
  //       cssClass: "error",
  //     })
  //   }

  //   setError({ username: false, password: false })
  //   setLoading(true)

  //   return getAPI("customer/login", "POST", { username, password: btoa(password) })
  //     .then(({ data, error }) => {
  //       if (error) {
  //         showDialog(data.message)
  //       } else {
  //         if (!data.result) {
  //           showDialog(data.message)
  //         } else {
  //           logged.current = true
  //           zmp.toolbar.show("#main-nav")
  //           setLoading(false)
  //         }
  //       }
  //     })
  //     .catch((ex) => {
  //       console.log(ex)
  //       showDialog("Lỗi đăng nhập. Xin vui lòng liên hệ Admin để được hỗ trợ.")
  //     })
  // }

  // const getPhoneNumberByToken = async (token, accessToken) => {
  //   // gọi API Server của bạn để truy xuất thông tin từ token và user access token
  //   //your_user_access_token, your_token
  //   try {
  //     await request3(accessToken, token).then((result) => {
  //       console.log("khachhang/getPhoneNumberByToken: ", result)
  //       let sdt = "" + JSON.parse(result).data.number
  //       if (sdt) {
  //         onClickSenddangky(sdt)
  //       }
  //     })
  //   } catch (error) {
  //     console.log("Error request api getPhoneNumberByToken ", error)
  //     return []
  //   }
  // }

  // const onClickSenddangky = async (sdt) => {
  //   let params = { sodienthoai: sdt, userId: user.id }
  //   try {
  //     const response = await (
  //       await request("POST", "khachhang/dangky", params, params)
  //     ).json()
  //     if (response) {
  //       let p = JSON.parse(response.message)
  //       console.log("đăng ký res: ", response)
  //       if (p[0].RESULT == 1) {
  //         store.dispatch("setPhoneNumber", sdt)
  //         store.dispatch("setRefres", sdt)
  //         return showDialog(p[0].MSG)
  //       }
  //     } else {
  //       return showDialog(p[0].MSG)
  //     }
  //   } catch (error) {
  //     console.log("Error request api x ", error)
  //   }
  // }

  const onPageBeforeIn = () => {
     console.log('ckeckzalon', zmp.views);
    if (!logged || chonkh.current) {
      zmp.toolbar.hide("#main-nav")
    }
  }

  const onPageAfterIn = async () => {
     console.log("onPageAfterIn_onPageAfterIn", logged);
    try {
      if (logged) {
        return
      }

      let userId = await getUserID({})
      // trinh duyệt thì mở cái này lên vi nó ko lấy dc user id 
      if (!userId) {
        userId= '6802644555416690502'
      }
      console.log("userId: ", userId)

      const customerData = await getDataCusFromId(userId)
      if (customerData.length > 0) {
      console.log("customerData: ", customerData)
        store.dispatch("setLogged", true).then(() => {
          zmp.toolbar.show("#main-nav")

          setMucDuyet(customerData[0]?.mucduyet)
          FetchInitData(customerData[0]?.KHACHHANG_fk)
          CapNhatDonHang(customerData[0]?.KHACHHANG_fk)
          store.dispatch("login")
          store.dispatch("setCusInfo", customerData[0])
          console.log("customerData[0]", customerData[0]);
          //tai sp mới nhất
      
          store.dispatch("getLatestBlogs", {  limit: 20, skip: 0, reset: true })
        })
      } else {
        if (!logged) {
          setAlertNoUser(true)
          store.dispatch("setLogged", true)
        }
      }
    } catch (ex) {
      console.error(ex)
      zmp.toolbar.show("#main-nav")
    }
  }

  return (
    <Page
      ptr
      onPtrRefresh={() => {
         handleReload()
          FetchInitData(CusInfo?.KHACHHANG_fk).then(() => {
          zmp.ptr.done()
        })
      }}
      onPageBeforeIn={onPageBeforeIn}
      onPageAfterIn={onPageAfterIn}
      name="home"
      className={logged && "home-page"}
    >
      <Box className="headerHome" m="0" px="0" style={{}}>
        <Box
          className="HeaderBoxHome"
          noSpace={true}
          flex
          alignItems="center"
          justifyContent="space-between"
          slot="fixed"
        >
          <Box
            flex
            justifyContent="space-between"
            style={{ width: "100%" }}
            mt={6}
            pt={9}
          >
             <HeaderHello CusInfo={CusInfo} logoMain={logoMain}  user={user} />
          </Box>
        </Box>
        <Box
          m="20"
          flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {/*section search */}
          <SearchBox />
        </Box>
        {/*section slider */}
        <Box my="1" mx="5" p="0">
          <Banner user={user} cusInfo={CusInfo} />
        </Box>
      </Box>
      <Box className="bg-slate-50" mt="3">
        <DanhMucSP />
        <PaddingSection />
        <Latest CusInfo={CusInfo} mucduyet={mucduyet} />
      </Box>
      {chonkh.current && (
        <ChonKhachHang
          isVisible={chonkh.current}
          CapNhatDonHang={CapNhatDonHang}
          data={khData}
          fetchData={FetchInitData}
          setMucDuyet={(mucduyet) => setMucDuyet(mucduyet)}
          chonkhRef={chonkh}
        ></ChonKhachHang>
      )}
      <AlertNoUser
        isVisible={alertNoUser}
        setIsVisible={async (value) => {
          setAlertNoUser(value)
          zmp.toolbar.show("#main-nav")
        }}
        closeAlert={() => {
          setAlertLoiDongBo(true)
          setAlertNoUser(false)
        }}
        signup={async () => {
          dk()
        }}
      />
      <AlertLoiDongBo
        isVisible={alertLoiDongBo}
        setIsVisible={async (value) => {
          setAlertLoiDongBo(value)
          zmp.toolbar.show("#main-nav")
        }}
      />
    </Page>
  )
}

const styles = {
  boxsearch: {
    width: "100%",
    padding: 13,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}
export default withOverlay(HomePage)
