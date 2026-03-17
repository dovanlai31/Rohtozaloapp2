import Sheet_SelectGift from "@components/DoiQua/Sheet_SelectGift"
import Sheet_TypeGift from "@components/DoiQua/Sheet_TypeGift"
import ViewListSpChon from "@components/DoiQua/ViewListSpChon"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import Color from "@components/common/Color"
import { formatCurrency, request } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { FaStar } from "react-icons/fa"
import { FaCheck, FaCoins } from "react-icons/fa6"
import { GoPlus } from "react-icons/go"
import { MdTune } from "react-icons/md"
import { TbPackageImport } from "react-icons/tb"
import { Card, Page, zmp } from "zmp-framework/react"
import { Box, Text } from "zmp-ui"
import store from "../store"
import "../styles/notifypage.scss"

const thongbaoPage = ({ zmproute }) => {
  const CusInfo = store.getters.getCusInfo.value || []

  const [xu, setXu] = useState(0)
  const [actionSheetVisible, setActionSheetVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [curItem, setcurItem] = useState({ id: "0", lable: "ĐỔI QUÀ TỪ XU" })

  const [XuDH, setXuDH] = useState(0)
  const [refresh, setrefresh] = useState(false)
  const [SheetGiftVisible, setSheetGiftVisible] = useState(false)
  const [dataList, setdataList] = useState([
    //{ id: 1, soluong: 1, ten: ' Thuộc diệt cỏ', thongtin: ' không được uống', gia: '100000', hinhanh: '', isChose: false,diem:10},
  ])
  const [dataListChose, setdataListChose] = useState([])
  const [IdDH, setIdDH] = useState("")
  const [trangthaidH, settrangthaidH] = useState("")
  const [isNhanHang, setIsNhanHang] = useState(false)

  const dialog = useRef(null)

  useEffect(() => {
    if (zmproute.query.loai == 0) {
      console.log("run xu")
      if (CusInfo && CusInfo.xu) setXu(CusInfo.xu)
      else setXu(0)
    } else {
      console.log("run điểm")
      if (CusInfo && CusInfo.diem) setXu(CusInfo.diem)
      else setXu(0)
    }

    if (!!zmproute.query.id) {
      setIdDH(zmproute.query.id)
      settrangthaidH(zmproute.query.tt)
      // getThongTinDonHang(zmproute.query.id, zmproute.query.loai)

      if (zmproute.query.loai == 0) {
        setcurItem({ id: "0", lable: "ĐỔI QUÀ TỪ XU" })
        // getListSPQuaTang(zmproute.query.loai, CusInfo.xu)
        initData(zmproute.query.loai, CusInfo.xu, zmproute.query.id)
      } else {
        setcurItem({ id: "1", lable: "ĐỔI QUÀ TỪ ĐIỂM" })
        // getListSPQuaTang(zmproute.query.loai, CusInfo.diem)
        initData(zmproute.query.loai, CusInfo.diem, zmproute.query.id)
      }
    } else {
      setLoading(true)
      setcurItem({ id: "0", lable: "ĐỔI QUÀ TỪ XU" })
      getListSPQuaTang_Create(0, CusInfo.xu)
    }
  }, [])

  const initDataList = (data) => {
    let _dataList = data[0]
    let _dataListChose = data[1]

    _dataList.map((item) => {
      if (_dataListChose.some((i) => i.id == item.id)) {
        item.isChose = true
      }

      return item
    })

    let xuDH = _dataListChose.reduce(
      (total, item) => total + (item.diem || item.gia || 0) * (item.soluong || 0),
      0
    )

    setdataList(_dataList)
    setdataListChose(_dataListChose)
    setXuDH(xuDH)
    setXu((prev) => prev + xuDH)
  }

  // const getListThongbao = async () => {
  //   let queryString = {
  //     userId: user.id,
  //   }
  //   try {
  //     const response = await (
  //       await request(
  //         "POST",
  //         "khachhang/getListThongbao",
  //         {
  //           userId: user.id,
  //         },
  //         queryString
  //       )
  //     ).json()
  //     if (response) {
  //       console.log("getListThongbao ", response.message)
  //       let p = JSON.parse(response.message)
  //       //alert(p)
  //       setListThongbao(p)
  //       setLoading(false)
  //     } else {
  //       setListThongbao([])
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     console.log("Error request api 2 ", error)
  //     setListThongbao([])
  //     setLoading(false)
  //   }
  // }
  // const openSheet = () => {
  //   if (sheet.current) {
  //     sheet.current.zmpSheet().open()
  //   }
  // }

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

  const getListSPQuaTang = async (loai, _xu) => {
    try {
      const response = await (
        await request("POST", "khachhang/getListSPQuaTang", {
          userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          loai: validateString(loai),
          xu: _xu,
        })
      ).json()
      if (response) {
        return JSON.parse(response.message)
      } else {
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
    }
  }

  const getListSPQuaTang_Create = async (loai, _xu) => {
    try {
      setLoading(true)
      const response = await (
        await request("POST", "khachhang/getListSPQuaTang", {
          userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          loai: validateString(loai + ""),
          xu: _xu,
        })
      ).json()
      if (response) {
        setdataList(JSON.parse(response.message))
      } else {
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
    } finally {
      setLoading(false)
    }
  }

  const getThongTinDonHang = async (id, loai) => {
    try {
      console.log("get thông tin đơn hàng")

      const response = await (
        await request(
          "POST",
          "khachhang/getThongTinDonHangQuaTang",
          {
            userId: CusInfo?.KHACHHANG_fk,
            dhId: id,
            loai: loai,
          },
          {
            userId: CusInfo?.KHACHHANG_fk,
            dhId: id,
            loai: loai,
          }
        )
      ).json()

      if (response) {
        return JSON.parse(response.message)
      } else {
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
    }
  }

  const initData = async (loai, _xu, id) => {
    console.log(loai, _xu, id)
    setLoading(true)
    return Promise.all([getListSPQuaTang(loai, _xu), getThongTinDonHang(id, loai)])
      .then((data) => {
        initDataList(data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const SheetActions = (t) => {
    console.log("SheetActions", t)
    setActionSheetVisible(false)
    setdataListChose([])
    if (t == 0) {
      setcurItem({ id: "0", lable: `ĐỔI QUÀ TỪ XU   ` })
      if (CusInfo && CusInfo.xu) {
        setXu(CusInfo.xu)
      } else {
        setXu(0)
      }
      getListSPQuaTang_Create(0, CusInfo.xu || 0)
    } else {
      setcurItem({ id: "1", lable: "ĐỔI QUÀ TỪ ĐIỂM" })
      if (CusInfo && CusInfo.diem) {
        setXu(CusInfo.diem)
      } else {
        setXu(0)
      }
      getListSPQuaTang_Create(1, CusInfo.diem || 0)
    }
  }

  const setChose = (value, index) => {
    let arr = JSON.parse(JSON.stringify(dataList))
    arr[index].isChose = !arr[index].isChose
    setdataList(arr)
  }

  const saveDataChose = () => {
    let arr = dataList.filter((r) => r.isChose == true)
    setdataListChose(arr)
    setSheetGiftVisible(false)
    updatetongxuDH(arr)
  }

  const updatetongxuDH = (x) => {
    let arr = JSON.parse(JSON.stringify(x ? x : dataListChose))
    let xu = 0
    arr.map((p) => {
      xu += p.diem * p.soluong
    })

    setdataListChose(x)
    setXuDH(xu)
  }

  const plus = (item, index) => {
    let arr = JSON.parse(JSON.stringify(dataListChose))
    arr[index].soluong = dataListChose[index].soluong + 1

    updatetongxuDH(arr)
  }

  const diff = (item, index) => {
    let arr = JSON.parse(JSON.stringify(dataListChose))

    arr[index].soluong = dataListChose[index].soluong - 1
    if (arr[index].soluong < 0) {
      arr[index].soluong = 0
    }

    updatetongxuDH(arr)
  }

  const removeItem = (item, index) => {
    let _dataListChose = JSON.parse(JSON.stringify(dataListChose)).filter(
      (r) => r.id != item.id
    )
    let _dataList = JSON.parse(JSON.stringify(dataList))

    _dataList.map((i) => {
      if (i.id == item.id) {
        i.isChose = false
      }

      return item
    })

    setdataList(_dataList)
    updatetongxuDH(_dataListChose)
  }

  const save = async () => {
    if (dataListChose.length < 1)
      return showDialog("Vui lòng chọn sản phẩm quà tặng trước khi chọn lưu")
    if (XuDH > xu)
      return showDialog(
        "Khách hàng không đủ Xu/Điểm để đổi quà, vui lòng kiểm tra lại"
      )

    if (!CusInfo) return

    let listsp = []

    dataListChose.map((s) => {
      if (s.id)
        listsp.push({ spId: s.id, soluong: s.soluong, thung: 0, diem: s.diem })
    })
    let params = {
      id: CusInfo?.KHACHHANG_fk,
      userId: CusInfo?.KHACHHANG_fk,
      sanpham: JSON.stringify(listsp),
      ghichu: "",
      loai: curItem.id,
      tongdiem: XuDH,
      dhId: IdDH,
    }

    console.log("params CreateDonQuaTang ", JSON.stringify(params))

    let method = "khachhang/CreateDonQuaTang"
    if (IdDH.length > 0) method = "khachhang/UpdateDonQuaTang"
    // if (appKm) {
    //   let listsort = [];
    //   method = 'khachhang/ApKhuyenMaiDonHang';
    //   params = { userId: user.id, sanpham: JSON.stringify(listsp), dieuchinh: '0', ctkmSort: JSON.stringify(listsort), };
    // }
    setLoading(true)
    try {
      const response = await (await request("POST", method, params)).json()
      if (response) {
        console.log("xxxxxxxxxx  CreateDonQuaTang", response)
        let p = JSON.parse(response.message)
        setLoading(false)

        console.log("xxxxxxxxxx ", response)

        if (p[0].RESULT == 1) {
          showDialog("Lưu thành công")

          let xumoi = xu - XuDH
          setXu(xumoi)
          setXuDH(0)
          if (IdDH.length == 0) setdataListChose([])
          let xukh = CusInfo.xu
          let diemkh = CusInfo.diem
          if (curItem.id == 0) xukh = xumoi
          else diemkh = xumoi
          store.dispatch("setCusInfo", {
            ...CusInfo,
            xu: xukh,
            diem: diemkh,
          })

          //
        } else {
          //  [{"RESULT":"0","MSG":"Không lấy được thông tin NVB…HANG":"","HETTONKHO":"","DATA":"","NGAYNHAP":""}]
          showDialog(p[0].MSG)
        }

        // let p = JSON.parse(response.message)
        // console.log(method, p)
        //}
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log("Error request api x ", error)
      setLoading(false)
    }
  }

  const handleNhanHang = () => {
    setLoading(true)
    return zmp.dialog
      .create({
        title: "Thông báo",
        content:
          '<div className="dialog-text">Bạn có muốn nhận hàng cho đơn hàng này ?</div>',
        buttons: [
          {
            text: "Xác nhận",
            onClick: () => {
              return getAPI(
                "donhang/nhanhangquatang",
                "POST",
                { id: id, userId: CusInfo?.KHACHHANG_fk },
                {}
              )
                .then(({ data, error }) => {
                  if (!error) {
                    setIsNhanHang(true)
                  }

                  zmp.dialog
                    .create({
                      title: "Thông báo",
                      content:
                        '<div className="dialog-text">' + data.message + "</div>",
                      buttons: [
                        {
                          text: "Đóng",
                        },
                      ],
                      destroyOnClose: true,
                    })
                    .open()
                })
                .catch((error) => {
                  console.log(error)
                })
                .finally(() => {
                  setLoading(false)
                })
            },
          },
          {
            text: "Đóng",
            onClick: () => {
              setLoading(false)
            },
          },
        ],
        destroyOnClose: true,
      })
      .open()
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
      // style={{backgroundColor:'white'}}
    >
      <HeaderBack slot="fixed" title={"Đổi quà"}></HeaderBack>
      <Box className="" style={{ background: "" }}>
        <Card inset className="">
          <Box m="0" className="view-center-gh4 " style={{ marginBottom: 1 }}>
            <Box m="0" flex justifyContent="space-between">
              <button
                disabled={IdDH}
                className="flex items-center gap-2"
                onClick={() => setActionSheetVisible(true)}
              >
                <MdTune color={Color.primary} size={30} />
                <Text style={{ color: Color.primary }}>Chọn Đổi Xu/Điểm</Text>
              </button>
            </Box>

            <Box
              m="0"
              style={{
                background: "white",
                borderWidth: 1,
                borderColor: "#eeee",
                borderRadius: 5,
              }}
            >
              <Box p={2} flex justifyContent="flex-start" alignItems="center">
                {curItem.id == 0 ? (
                  <Box m={0} p="0">
                    <span className="RoundIcon2">
                      <FaCoins size={20} color={Color.primary} />
                    </span>
                  </Box>
                ) : (
                  <Box m={0} p="0">
                    <span className="RoundIcon2">
                      <FaStar size={20} color={Color.textAPPRed}></FaStar>
                    </span>
                  </Box>
                )}
                <Text
                  size="normal"
                  className=""
                  style={{
                    fontWeight: 800,
                    margin: "0 10px",
                    color: curItem.id == 0 ? Color.primary : Color.textAPPRed,
                  }}
                >
                  {curItem.lable}
                </Text>
              </Box>
              <Box p={2} flex alignItems="center">
                {/* <AiFillPieChart color="#016CF5" size={20} /> */}
                <Text style={{ textTransform: "capitalize", marginRight: 5 }}>
                  {" "}
                  {curItem.id == "0" ? "xu" : "điểm"} khách hàng:{" "}
                </Text>
                <Text bold className="color-gia">
                  {"  "}
                  {formatCurrency(xu, true)}
                </Text>
              </Box>
              <Box p={2} flex alignItems="center">
                {/* <AiFillThunderbolt color="#016CF5" size={20} /> */}
                <Text style={{ textTransform: "capitalize", marginRight: 5 }}>
                  {" "}
                  {curItem.id == "0" ? "xu" : "điểm"} đơn hàng:{" "}
                </Text>
                <Text bold className="color-gia">
                  {"  "}
                  {formatCurrency(XuDH, true)}
                </Text>
              </Box>
              <Box p={2} flex alignItems="center">
                {/* <AiFillSafetyCertificate color="#016CF5" size={20} /> */}
                <Text style={{ textTransform: "capitalize", marginRight: 5 }}>
                  {" "}
                  {curItem.id == "0" ? "xu" : "điểm"} còn lại:{" "}
                </Text>
                <Text
                  bold
                  className="color-gia"
                  style={{ color: Color.textAPPGreen }}
                >
                  {"  "}
                  {formatCurrency(xu - XuDH, true)}
                </Text>
              </Box>
            </Box>

            <Box className="gap-7" p={2} flex justifyContent="space-between">
              {/* <Button iconZMP="zi-plus" onClick={() => setSheetGiftVisible(true)} text="Chọn quà">
              </Button> */}

              <button
                onClick={() => setSheetGiftVisible(true)}
                type="button"
                className="w-1/2 flex items-center justify-center p-2 gap-2"
              >
                <GoPlus size={30} />
                <Text style={{}}>Chọn quà</Text>
              </button>
              {(IdDH == "" || trangthaidH == 0) && (
                <button
                  disabled={loading}
                  onClick={() => {
                    save(true)
                  }}
                  className="w-1/2 flex items-center justify-center p-2 gap-2 outline"
                >
                  <FaCheck size={30} />
                  <Text style={{ fontWeight: "bold" }}>
                    {trangthaidH == 0 && IdDH != "" ? "Cập nhật" : "Lưu"}
                  </Text>
                </button>
              )}

              {trangthaidH == 4 && !isNhanHang && (
                <button
                  onClick={handleNhanHang}
                  type="button"
                  style={{
                    backgroundColor: "#e3ffc4",
                    borderColor: Color.textAPPGreen,
                    borderWidth: 2,
                    color: Color.textAPPGreen,
                    zIndex: 999,
                  }}
                  className="w-auto flex items-center justify-center p-1 rounded shadow-lg"
                >
                  <TbPackageImport size={25} color={Color.textAPPGreen} />
                  <Text
                    style={{
                      color: Color.textAPPGreen,
                      fontWeight: "bold",
                      marginLeft: 8,
                    }}
                  >
                    Nhận hàng
                  </Text>
                </button>
              )}
            </Box>
          </Box>
        </Card>
        {loading && <LoadingSpinner></LoadingSpinner>}
        <Box m="0">
          <ViewListSpChon
            refres={refresh}
            plus={(item, index) => plus(item, index)}
            diff={(item, index) => diff(item, index)}
            removeItem={(item, index) => removeItem(item, index)}
            dataListChose={dataListChose}
          ></ViewListSpChon>
        </Box>
      </Box>
      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>

      <Sheet_TypeGift
        setActionSheetVisible={setActionSheetVisible}
        actionSheetVisible={actionSheetVisible}
        SheetActions={(t) => SheetActions(t)}
      ></Sheet_TypeGift>

      <Sheet_SelectGift
        saveDataChose={saveDataChose}
        setChose={setChose}
        dataListChose={dataListChose}
        dataList={dataList}
        SheetGiftVisible={SheetGiftVisible}
        setSheetGiftVisible={setSheetGiftVisible}
        xu_diem={xu}
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
