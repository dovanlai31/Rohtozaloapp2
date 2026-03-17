import Header from "@components/Header"
import iconSalesUp from "@static/images/salesup.png"
import { request, request3 } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Card,
  List,
  ListInput,
  Page,
  Preloader,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react"
import { getPhoneNumber } from "zmp-sdk/apis"
import store from "../store"
import withOverlay from "@components/HOC/withOverlay"
import {
  FetchInitData,
  follow,
  getDataCusFromId,
  requestSendNotifications,
} from "../services/services"

const CreateCus = ({ zmproute, showToast }) => {
  const dialog = useRef(null)
  const user = useStore("user")
  const accessToken = store.getters.Token.value || ""

  const [PhoneNumner, setsodienthoai] = useState("")
  const [loading, setLoading] = useState(false)
  const [CusInfo, setCusInfo] = useState("")
  const [formData, setFormData] = useState({
    hoten: "",
    diachigiaohang: "",
    diachixuathoadon: "",
    masothue: "",
  })

  useEffect(() => {
    initPhoneNum().then(() => {
      setCusInfo(store.getters.getCusInfo.value)
    })
  }, [])

  const handleOnSubmitForm = (e) => {
    e.preventDefault()

    if (CusInfo.chuadk == 1 && CusInfo.mafast.length > 0) {
      return zmp.dialog
        .create({
          title: "Thông báo",
          content: `<div className="dialog-text">SĐT này đang thuộc <b>mã KH ${
            CusInfo.mafast
          } - ${
            CusInfo?.tenkh || "khách hàng"
          }</b>. Bạn có muốn cập nhật lại thông tin mới không?</div>`,
          buttons: [
            {
              text: "Đồng ý",
              onClick: () => {
                return onClickSenddangky({
                  sodienthoai: PhoneNumner,
                  userId: user.id,
                  diachigiaohang: formData.diachigiaohang,
                  diachixuathoadon: formData.diachixuathoadon,
                  masothe: formData.masothue,
                  tenkh: formData.hoten,
                  isOverwrite: 1,
                })
              },
            },
            {
              text: "Không",
              onClick: () => {
                return onClickSenddangky({
                  sodienthoai: PhoneNumner,
                  userId: user.id,
                  diachigiaohang: formData.diachigiaohang,
                  diachixuathoadon: formData.diachixuathoadon,
                  masothe: formData.masothue,
                  tenkh: formData.hoten,
                  isOverwrite: 0,
                })
              },
            },
          ],
          destroyOnClose: true,
        })
        .open()
    } else {
      return onClickSenddangky({
        sodienthoai: PhoneNumner,
        userId: user.id,
        diachigiaohang: formData.diachigiaohang,
        diachixuathoadon: formData.diachixuathoadon,
        masothe: formData.masothue,
        tenkh: formData.hoten,
        isOverwrite: 0,
      })
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

  const initPhoneNum = () => {
    return getPhoneNumber({
      success: (data) => {
        let { token } = data
        // xử lý cho trường hợp sử dụng phiên bản Zalo mới (phiên bản lớn hơn 23.02.01)
        if (token) {
          getPhoneNumberByToken(token, accessToken)
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error)
      },
    })
  }

  const getPhoneNumberByToken = async (token, accessToken) => {
    try {
      const result = await request3(accessToken, token)

      let sdt = "" + JSON.parse(result).data.number
      if (sdt) {
        let sodienthoai = sdt.substring(2, sdt.length)
        sodienthoai = "0" + sodienthoai

        console.log("sô điện thoại: ", sodienthoai)

        setsodienthoai(sodienthoai)
        setFormData({
          ...formData,
          hoten: user.name,
        })
      }
    } catch (error) {
      console.log("Error request api getPhoneNumberByToken ", error)
      return []
    }
  }

  const onClickSenddangky = async (dataparam) => {
    setLoading(true)
    const {
      sodienthoai,
      userId,
      diachigiaohang,
      diachixuathoadon,
      masothe,
      tenkh,
      isOverwrite,
    } = dataparam
    let params = {
      sodienthoai: sodienthoai,
      userId: userId,
      diachigiaohang,
      diachi: diachixuathoadon,
      masothe,
      tenkh: tenkh,
      isOverwrite,
    }

    console.log(params)

    if (!PhoneNumner || PhoneNumner.length < 5 || sodienthoai.length < 5) {
      setLoading(false)
      showToast("Không lấy được thông tin số điện thoại", "info")
      return
    }

    try {
      const response = await (
        await request("POST", "khachhang/dangky", params, params)
      ).json()
      if (response) {
        let p = JSON.parse(response.message)
        if (p[0].RESULT == 1) {
          await store.dispatch("getLatestBlogs", {  limit: 20, skip: 0, reset: true })
          await store.dispatch("setPhoneNumber", PhoneNumner)
          await store.dispatch("setRefres", PhoneNumner)

          const cusInfoLocal = await getDataCusFromId(user.id)
          if (cusInfoLocal.length) {
            FetchInitData(cusInfoLocal[0]?.KHACHHANG_fk)
            await store.dispatch("setCusInfo", cusInfoLocal[0])
          }

          await follow()
          await requestSendNotifications()

          zmp.views.current.router.back("", {
            animate: true,
          })
        } else {
          showToast(p[0].MSG, "danger")
        }
      } else {
        showToast(p[0].MSG, "danger")
      }
    } catch (error) {
      showToast(
        "Lỗi lưu thông tin người dùng. Xin vui lòng liên hệ Admin để được hỗ trợ",
        "danger"
      )
    } finally {
      setLoading(false)
    }

    return
  }

  return (
    <Page
      className="menu-page"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      id={`register`}
    >
      <Header back force={true}>
        Đăng ký{" "}
      </Header>
      <Box mx="2">
        <Card inset>
          <Text
            className="text-blue-imex"
            style={{ fontSize: 18, fontWeight: "bold" }}
          >
            Thông tin tài khoản
          </Text>
          <List
            style={{
              listStyle: "none",
            }}
            form
            id="my-form"
            noHairlines
          >
            <ListInput
              label="Số điện thoại"
              type="text"
              style={{ marginBottom: 8 }}
              // placeholder='Enter your age'
              // clearButton
              required
              name="dienthoai"
              value={PhoneNumner}
              readonly
              // validate
            ></ListInput>
            <ListInput
              label="Họ và tên"
              type="text"
              style={{ marginBottom: 8 }}
              placeholder="Enter your full name"
              info="Tên đầy đủ của bạn"
              name="fullName"
              required
              validate
              value={formData.hoten}
              onChange={(e) => setFormData({ ...formData, hoten: e.target.value })}
            ></ListInput>
            <ListInput
              label="Địa chỉ giao hàng "
              type="text"
              style={{ marginBottom: 8, display: "none" }}
              placeholder="Địa chỉ giao hàng"
              // info="Địa chỉ giao hàng của bạn"
              name="diachigiaohang"
              required
              validate
              value={formData.diachigiaohang}
              onChange={(e) =>
                setFormData({ ...formData, diachigiaohang: e.target.value })
              }
            ></ListInput>
            <ListInput
              label="Địa chỉ khách hàng"
              type="text"
              style={{ marginBottom: 8 }}
              placeholder="Địa chỉ khách hàng"
              // info="Địa chỉ khách hàng"
              name="diachixuathoadon"
              value={formData.diachixuathoadon}
              onChange={(e) =>
                setFormData({ ...formData, diachixuathoadon: e.target.value })
              }
            ></ListInput>
            <ListInput
              label="Mã số thuế"
              type="text"
              style={{ marginBottom: 8, display: "none" }}
              placeholder="Mã số thuế"
              // info="Mã số thuế"
              name="masothe"
              value={formData.masothue}
              onChange={(e) =>
                setFormData({ ...formData, masothue: e.target.value })
              }
            ></ListInput>
            <Box m="0" p="0" style={{ marginTop: 24 }}>
              {loading ? (
                <Box my="4">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Preloader size={35} logo={iconSalesUp} />
                  </div>
                </Box>
              ) : (
                <Button
                  type="submit"
                  typeName="secondary"
                  responsive
                  className="filter-button3"
                  onClick={handleOnSubmitForm}
                  style={{ backgroundColor: "#136f43", padding: 24 }}
                >
                  Lưu đăng ký
                </Button>
              )}
            </Box>
          </List>
        </Card>
      </Box>
    </Page>
  )
}
export default withOverlay(CreateCus)
