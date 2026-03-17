import Header from "@components/Header"
import { useEffect, useRef, useState } from "react"
import { Box, Button, Page, useStore, zmp } from "zmp-framework/react"
import store from "../store"
import "../styles/app.scss"
import "../styles/notifypage.scss"

import ChupAnh from "@components/TrungBay/ChupAnh"
import DanhSach from "@components/TrungBay/DanhSach"
import { request } from "@utils/networking"
const trungbay = ({ zmproute }) => {
  useEffect(() => {
    console.log("zmproute", zmproute.query)
    getListDonHang(zmproute.query.trangthai)
    store.dispatch("getListTrungBay", "")
    store.dispatch("getListCTTrungBay", "")
  }, [])

  const user = useStore("user")
  const trungbay = useStore("getListTrungBay")
  const ctTrungBay = useStore("getListCTTrungBay")

  const [ListDonHang, setListDonHang] = useState([])
  const [tab, setTab] = useState(0)

  const dialog = useRef(null)

  const getListDonHang = async (trangthai) => {
    let queryString = {
      trangthai: trangthai,
    }
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/getListDonHang",
          {
            userId: user.id,
          },
          queryString
        )
      ).json()
      if (response) {
        console.log("getListDonHang ", response.message)
        let p = JSON.parse(response.message)
        //alert(p)
        setListDonHang(p)
      } else {
        setListDonHang([])
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
      setListDonHang([])
    }
  }

  const deleteDonhang = (item) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content:
        '<div className="dialog-text">Xác nhận xóa đơn hàng, Bạn thật sự muốn xóa đơn hàng?</div>',
      buttons: [
        {
          text: "Đóng",
        },
        {
          text: "Xóa đơn",
          onClick() {
            callApiXoadon(item)
          },
        },
      ],
    })
    if (dialog.current) {
      dialog.current.open()
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

  const callApiXoadon = async (donhang) => {
    //  xoadonhang
    let queryString = {
      dhId: donhang.MADH,
    }
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/xoadonhang",
          {
            userId: user.id,
          },
          queryString
        )
      ).json()
      if (response) {
        if (response.result) {
          store.dispatch("setRefres", donhang.MADH)
          showDialog(response.message)
          getListDonHang(zmproute.query.trangthai)
          return
        }
      } else {
        showDialog(response.message)
      }
    } catch (error) {
      //showDialog("Lỗi xóa đơn hàng")
    }
  }

  const toggleTab = (i) => {
    if (tab != i) {
      return setTab(i)
    }
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
      style={{ background: "#eee" }}
    >
      <Header back>Trưng bày</Header>

      <Box
        className="latest"
        //mx="5"
        mt="2"
        flex
        justifyContent="space-between"
      >
        <Box
          className="view-center-gh box-shadow"
          style={{ background: "#fff", borderRadius: 8, height: 700 }}
        >
          <Box flex justifyContent="space-around" style={{ gap: 10 }}>
            <Button
              type="button"
              typeName={tab == 0 ? "primary" : "ghost"}
              onClick={() => toggleTab(0)}
            >
              Chụp ảnh trưng bày
            </Button>
            <Button
              type="button"
              typeName={tab == 1 ? "primary" : "ghost"}
              onClick={() => toggleTab(1)}
            >
              Đăng ký trưng bày
            </Button>
          </Box>
          {tab == 0 && <ChupAnh cttrungbay={ctTrungBay}></ChupAnh>}
          {tab == 1 && <DanhSach trungbay={trungbay}></DanhSach>}
        </Box>
      </Box>
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
export default trungbay
