import { request, request3, zaloErrorMessages } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { authorize, getPhoneNumber, getSetting, getUserInfo } from "zmp-sdk/apis"
import { useStore, zmp } from "zmp-framework/react"
import store from "../store"

export function useAccountPage() {
  const dialog = useRef(null)
  const user = useStore("user")
  const token = useStore("Token")

  const Giohangx = store.getters.getGioHang.value || []
  const accessToken = store.getters.Token.value || ""
  const PhoneNumner = store.getters.getPhoneNumner.value || []
  const CusInfo = store.getters.getCusInfo.value || []
  const refres = store.getters.refres.value || false

  const [dataDoanhSo, setdataDoanhSo] = useState([])
  const [SoLuongDonHang, setSoLuongDonHang] = useState("0-0")

  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [{ text: "Đóng" }],
    })
    dialog.current?.open()
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

  const requestPermission = () => {
    authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
      success: () => {
        getUser()
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

        if (hasPhonePermission) {
          try {
            return zmp.views.current.router.navigate("/taomoiKh/", {
              transition: "zmp-cover",
              animate: true,
            })

            const { token: phoneToken } = await getPhoneNumber({})
            const result = await request3(accessToken, phoneToken)
            const sdt = JSON.parse(result).data.number
            if (sdt) {
              zmp.views.current.router.navigate("/taomoiKh/", {
                transition: "zmp-cover",
                animate: true,
                props: { phoneNumber: sdt },
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
            "Bạn chưa cấp quyền truy cập số điện thoại. Vui lòng cấp quyền để tiếp tục.",
            "Thông báo",
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

  const getSoLuongDonHang = async () => {
    try {
      const response = await (
        await request("POST", "khachhang/getSoLuongDonHang", {
          userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
        })
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
          { userId: validateString(CusInfo?.KHACHHANG_fk + "", true) },
          token
        )
      ).json()
      if (response.result) {
        setdataDoanhSo(JSON.parse(response.message))
      } else {
        setdataDoanhSo([])
      }
    } catch (error) {
      console.error("Error request api 2 ", error)
      setdataDoanhSo([])
    }
  }

  useEffect(() => {
    getDoanhSo()
    getSoLuongDonHang()
  }, [Giohangx, refres])

  useEffect(() => {
    if (Object.keys(user || {}).length === 0) {
      getUser()
    }
  }, [])

  return {
    user,
    PhoneNumner,
    CusInfo,
    dataDoanhSo,
    SoLuongDonHang,
    checkPhonePermissionAndContinue,
  }
}
