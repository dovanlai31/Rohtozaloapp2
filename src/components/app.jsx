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


    handleLogin()

    dialog.current = zmp.dialog.create({
      title: "Đóng ứng dụng",
      content: "Bạn thật sự muốn đóng ứng dụng ?",
      buttons: [
        {
          text: "Không",
          cssClass: "dialog-negative-action",
          //close: true,
        },
        {
          text: "Đúng",
          close: false,
          onClick() {
            closeApp()
          },
        },
      ],
    })

    onConfirmToExit(() => openDialog())
    return () => offConfirmToExit()
  }, [])

  useEffect(() => {}, [Giohang])
  const openDialog = () => {
    if (dialog.current) {
      dialog.current.open()
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
            if( Giohang?.length > 0) {
              zmp.toolbar.hide("#main-nav")
              zmp.views.giohang.router.updateCurrentUrl("/giohang/")
            } else {
              zmp.toolbar.show("#main-nav")
              zmp.views.giohang.router.updateCurrentUrl("/giohang/")
            }
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
