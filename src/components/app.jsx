import { useEffect, useRef, useState } from "react"
import { App, TabView, View, zmp, zmpready ,} from "zmp-framework/react"
import { closeApp, login, offConfirmToExit, onConfirmToExit } from "zmp-sdk/apis"
import store from "../store"
import NavigationBar from "./NavigationBar"
import { useSnackbar } from "zmp-ui"

const MyApp = () => {
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("main")

  const Giohang = store.getters.getGioHang.value || []
  const dialog = useRef(null)

  useEffect(() => {
    // Đăng ký xác nhận thoát TRƯỚC mọi việc khác: nếu bước sau lỗi thì nút tắt vẫn hỏi lại
    try {
      onConfirmToExit(() => openDialog())
    } catch (e) {
      console.log("onConfirmToExit fail", e)
    }

    handleLogin()

    return () => offConfirmToExit()
  }, [])

  useEffect(() => {}, [Giohang])

  // Tạo hộp thoại khi cần (lúc mount zmp.dialog có thể chưa sẵn sàng)
  const openDialog = () => {
    try {
      if (!dialog.current) {
        dialog.current = zmp.dialog.create({
          title: "Đóng ứng dụng",
          content: "Bạn thật sự muốn đóng ứng dụng?",
          buttons: [
            {
              text: "Không",
              cssClass: "dialog-negative-action",
            },
            {
              text: "Đóng",
              close: false,
              onClick() {
                closeApp()
              },
            },
          ],
        })
      }
      dialog.current.open()
    } catch (e) {
      // dự phòng khi không tạo được hộp thoại của zmp
      console.log("open exit dialog fail", e)
      if (window.confirm("Bạn thật sự muốn đóng ứng dụng?")) closeApp()
    }
  }

  // ZMP Parameters
  const zmpparams = {
    name: "ROHTO", // App name
    theme: "auto", // Automatic theme detection
    store: store,
    touch: {
      iosTouchRipple: false,
      mdTouchRipple: false,
    },
    toast: {
      closeTimeout: 3000,
      closeButton: true,
    },
  }

  const handleLogin = () => {
    login({
      success: () => {
        // login thành công
        console.log("login thành công")
        zmpready(() => {
          console.log("init data")

          store.dispatch("getToken")
          store.dispatch("getBanner")
           store.dispatch("getDanhmucSp")
          // store.dispatch("getListVideos")
          // store.dispatch("getListKhaoSat")
        })
      },
      fail: (error) => {
        console.log(error)
      },
    })
  }

  return (
    <App {...zmpparams}>
      <TabView name="main-app" className="safe-areas">
        <NavigationBar
          activeTab={activeTab}
          NotifyGH={Giohang.length > 0 ? true : false}
        />
        <View
          id="view-main"
          onTabShow={() => {
            setActiveTab("main")
            zmp.views.main.router.updateCurrentUrl("/")
          }}
          main
          tabActive
          tab
          initRouterOnTabShow
          url="/"
        ></View>

        <View
          id="view-search"
          initRouterOnTabShow
          name="search"
          tab
          onTabShow={() => {
            setActiveTab("khuyenMaiList")
            zmp.views.search.router.updateCurrentUrl("/khuyenMaiList/")
          }}
          url="/khuyenMaiList/"
        ></View>
        <View
          id="view-giohang"
          initRouterOnTabShow
          onTabShow={() => {
            setActiveTab("giohang")
              zmp.views.giohang.router.updateCurrentUrl("/giohang/")

            // if (Giohang?.length > 0) {
            //   zmp.toolbar.hide("#main-nav")
            //   zmp.views.giohang.router.updateCurrentUrl("/giohang/")
            // } else {
            //   zmp.toolbar.show("#main-nav")
            //   zmp.views.giohang.router.updateCurrentUrl("/giohang/")
            // }
            // zmp.toolbar.hide("#main-nav");
          }}
          name="giohang"
          tab
          url="/giohang/"
        ></View>
        <View
          id="view-menu"
          initRouterOnTabShow
          onTabShow={() => {
            setActiveTab("menu")
            zmp.views.menu.router.updateCurrentUrl("/home_ListDH/")
          }}
          name="menu"
          tab
          url="/home_ListDH/"
        ></View>
        <View
          id="khachhang"
          initRouterOnTabShow
          name="khachhang"
          tab
          url="/khachhang/"
          onTabShow={() => {
            setActiveTab("khachhang")
            zmp.views.menu.router.updateCurrentUrl("/khachhang/")
          }}
        ></View>
        <View
          id="view-account"
          initRouterOnTabShow
          name="taikhoan"
          tab
          url="/taikhoan/"
          onTabShow={() => {
            setActiveTab("taikhoan")
            zmp.views.menu.router.updateCurrentUrl("/taikhoan/")
          }}
        ></View>
      
      </TabView>
    </App>
  )
}
export default MyApp
