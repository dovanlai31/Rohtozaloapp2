import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import RowItemGH from "@components/Cart/RowItemGH"
import RowItemKM from "@components/Cart/RowItemKM"
import Color from "@components/common/Color"
import { formatCurrency, getAPI, request } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { TbPackageImport } from "react-icons/tb"
import { Box, Button, Card, Link, Page, Text, useStore, zmp } from "zmp-framework/react"
import Logo from "../static/images/logoMain.webp"
import store from "../store"
import "../styles/app.scss"
import "./../styles/giohang.scss"
import "./../styles/output.css"
import "./localscss/DonHangDetail.scss"
import { ConvertOpacity } from "@utils/ConvertOpacity"
import { IoChevronBack, IoPersonRemove, IoRemove, IoTrashBin } from "react-icons/io5"
import { FaCheck, FaShoppingCart } from "react-icons/fa"

const CLOSE_OTP_5_MINUTES = 5 * 60 * 1000

const Capnhatdonhang = ({ zmproute }) => {
  const PhoneNumner = store.getters.PhoneNumner.value || ""
  const Giohangx = store.getters.getGioHang.value || []

  const [Giohang, updateGiohang] = useState({})
  const [TongTien, updateTongTien] = useState(0)
  const [TongGiatri, updateTongGiatri] = useState(0)
  const [TongTienVAT, updateTongTienVAT] = useState(0)
  const [tongSoLuong, setTongSoLuong] = useState(0)
  const [datakm, updateDatakm] = useState([])
  const [loading, updateLoading] = useState(false)
  const [appKm, updateAppKm] = useState(true)
  const [TongtieKm, updateTongtieKm] = useState(0)
  const [ViewMore, updateViewMore] = useState(false)
  const [isGiaoHang, setIsGiaoHang] = useState(zmproute.query?.isgiaohang)
  const [forceReload, setForceReload] = useState(false)
  const [donHang, setDonHang] = useState({})
  const [isOpenOTP, setIsOpenOTP] = useState(false)

  const dialog = useRef(null)
  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")
  const id = zmproute.query?.id

  useEffect(() => {
    getThongTinDonHang(zmproute.query.id)
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">Cập nhật đơn hàng thành công</div>',
      buttons: [
        {
          text: "Ok",
          onClick() {
            updateGiohang([])
            store.dispatch("remoteAllGioHang")
          },
        },
      ],
    })
  }, [])

  useEffect(() => {
    let timeOutKey = null

    if (Object.keys(donHang).length > 0) {
      console.log("Đơn hàng ready")
      timeOutKey = setTimeout(() => {
        setIsOpenOTP(false)
      }, CLOSE_OTP_5_MINUTES)
    }

    return () => {
      if (timeOutKey !== null) {
        clearTimeout(timeOutKey)
      }
    }
  }, [donHang])

  const getThongTinDonHang = async (id) => {

    console.log("getThongTinDonHang id ", zmproute.query)

    let queryString = {
      dhId: id,
    }
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/getThongTinDonHang",
          {
            userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
          },
          queryString
        )
      ).json()
      if (response) {

        let data = JSON.parse(response.message)
        if (data[0].RESULT == 1) {
          const p = JSON.parse(data[0].ChiTiet)
          const donHang = JSON.parse(data[0].DonHang)
          const listsp = p.filter((item) => item.Scheme.length == 0)
          const listkm = p.filter((item) => item.Scheme != "")
          let tt = listsp.reduce((total, item) => total + (Number(item?.soluong || 0) * Number(item?.dongia || 0)), 0)

          let ttkm = listkm.reduce((total, item) => total + item.TongTien, 0)
          //tienvat += (parseFloat(item.soluong ?? 0) * parseFloat(item.dongia ?? 0)) * (1 - (parseFloat(item.nhomCkGam ?? 0) + parseFloat(item.chietkhauKM ?? 0)) / 100.0) * (parseFloat(item.vat ?? 0) / 100.0)

          let tongtienVat = listsp.reduce((total, item) => {
            // const sl = Number(item.soluong || 0);
            // const gia = Number(item.dongia || 0);
            // const vat = Number(item.thuevat || 0);
            // return total + (sl * gia * vat / 100);
            return total + item.TIENVAT;
          }, 0);

          console.log("listkm ", listkm);

          updateTongTienVAT(tongtienVat)
          console.log("getThongTinDonHang___", listsp);

          const tongSoLuong = listsp.reduce(
            (total, item) => Number(total) + Number(item?.soluong || 0),
            0
          )
          updateTongTien(tt)
          updateTongGiatri(data[0].TongGiaTri)
          updateGiohang(listsp)
          updateDatakm(listkm)
          updateTongtieKm(ttkm)
          updateGiohang(listsp)
          updateDatakm(listkm)
          setTongSoLuong(tongSoLuong)
          setDonHang(donHang[0])
          //store.dispatch("AddAllGioHang", p)
        }
      } else {
        updateGiohang([])
        updateDatakm([])
        setTongSoLuong(0)
        setDonHang({})
      }
    } catch (error) {
      console.log("Error request api 2 ", error)
      updateGiohang([])
      updateDatakm([])
      setTongSoLuong(0)
      setDonHang({})
    }
  }

  const openDialog = (sms) => {
    if (dialog.current) {
      dialog.current.open()
    }
  }

  const onClickLuu = async () => {
    updateLoading(true)
    let listsp = []
    let khuyenmai = []
    Giohangx.map((s) => {
      if (s.id && !s.Scheme)
        listsp.push({ spId: s.id, soluong: s.soluong, thung: 0 })
    })

    if (datakm.length > 0) {
      datakm.map((s) => {
        if (s.Loai === "3") {
          if (s.HinhThuc === "2") {
            if (JSON.parse(s.spTen)[0].AVAILABLE > 0)
              khuyenmai.push({
                id: s.Scheme,
                tkmId: s.TraKhuyenMai,
                sosuat: s.soXuat || s.sosuat,
                TongGiaTri: 0,
                spId: JSON.parse(s.spTen)[0].spId,
                soluong: parseFloat(s.TongLuong) * parseFloat(s.sosuat),
              })
          } else {
            khuyenmai.push({
              id: s.Scheme,
              tkmId: s.TraKhuyenMai,
              sosuat: s.soXuat || s.sosuat,
              TongGiaTri: 0,
              spId: JSON.parse(s.spTen)[0].spId,
              soluong: JSON.parse(s.spTen)[0].SOLUONG,
            })
          }
        } else {
          khuyenmai.push({
            id: s.Scheme,
            tkmId: s.TraKhuyenMai,
            sosuat: s.soXuat || s.sosuat,
            TongGiaTri: s.TongTien,
            spId: 0,
            soluong: 0,
          })
        }
      })
    }

    let params = {
      sodienthoai: PhoneNumner,
      id: user.id,
      userId: user.id,
      sanpham: JSON.stringify(listsp),
      khuyenmai: JSON.stringify(khuyenmai),
      SanPhamSuDung: "",
      ghichu: "",
      dhId: zmproute.query.id,
    }

    console.log("params km ", JSON.stringify(khuyenmai))

    let method = "khachhang/updateDonHang"
    if (appKm) {
      let listsort = []
      method = "khachhang/ApKhuyenMaiDonHang"
      params = {
        userId: user.id,
        sanpham: JSON.stringify(listsp),
        dieuchinh: "0",
        ctkmSort: JSON.stringify(listsort),
        dhId: zmproute.query.id,
      }
      updateDatakm([])
    }
    try {
      const response = await (await request("POST", method, params)).json()
      if (response) {
        console.log("xxxxxxxxxx ", response)
        let p = JSON.parse(response.message)
        updateLoading(false)

        console.log("xxxxxxxxxx ", response)

        if (p[0].RESULT == 1) {
          openDialog()
        } else showDialog(p[0].MSG)
      } else {
        updateLoading(false)
      }
    } catch (error) {
      console.log("Error request api x ", error)
      updateLoading(false)
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

  const Appkm = async (number) => {
    updateLoading(true)
    let listsp = []
    let khuyenmai = []
    Giohangx.map((s) => {
      listsp.push({ spId: s.id, soluong: s.soluong, thung: 0 })
    })
    if (listsp.length <= 0) return
    let params = {
      sodienthoai: number,
      id: user.id,
      userId: user.id,
      sanpham: JSON.stringify(listsp),
      khuyenmai: JSON.stringify(khuyenmai),
      SanPhamSuDung: "",
      ghichu: "ghichu",
    }
    let method = ""
    if (appKm) {
      let listsort = []
      updateDatakm([])
      method = "khachhang/ApKhuyenMaiDonHang"
      params = {
        userId: user.id,
        sanpham: JSON.stringify(listsp),
        dieuchinh: "0",
        ctkmSort: JSON.stringify(listsort),
      }

      try {
        const response = await (await request("POST", method, params)).json()
        if (response) {
          console.log("xxxxxxxxxx  ApKhuyenMaiDonHang", response)
          let p = JSON.parse(response.message)

          //  [{"RESULT":"1","MSG":"","DATA":"[]"}]'
          if (p[0].RESULT == 1) {
            updateDatakm(JSON.parse(p[0].DATA))
            let listsp = Giohang.filter((item) => item.Scheme == "" || !item.Scheme)
            const lkm = JSON.parse(p[0].DATA)

            if (lkm.length == 0) {
              setTimeout(() => {
                onClickLuu()
              }, 500)
              return
            }
            {
              //  updateGiohang([...listsp, ...JSON.parse(p[0].DATA)])
              let tkm = 0
              if (JSON.parse(p[0].DATA).length > 0) {
                JSON.parse(p[0].DATA).map((t) => {
                  tkm += t.TongTien
                })
              }
              updateTongtieKm(tkm)
              updateAppKm(false)
              updateLoading(false)
            }
          } else {
            updateAppKm(false)
            setTimeout(() => {
              onClickLuu()
            }, 500)
          }
        } else {
          updateLoading(false)
        }
      } catch (error) {
        console.log("Error request api x ", error)
        updateLoading(false)
      }
    } else onClickLuu("")
  }

  const handleNhanHang = () => {
    updateLoading(true)
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
                "donhang/nhanhang",
                "POST",
                { id: id, userId: CusInfo?.KHACHHANG_fk },
                {}
              )
                .then(({ data, error }) => {
                  if (!error) {
                    setIsGiaoHang(2)
                    setForceReload(true)
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
                  updateLoading(false)
                })
            },
          },
          {
            text: "Đóng",
            onClick: () => {
              updateLoading(false)
            },
          },
        ],
        destroyOnClose: true,
      })
      .open()
  }

  const onClickChotDonHang = async (status = "1") => {
    if (isGiaoHang != 0) {
      //alert trạng thái không hợp lệ
      zmp.dialog.alert("Trạng thái đơn hàng không hợp lệ để chốt đơn", "Thông báo");
      return

    }
    updateLoading(true)
    let queryString = {
      dhId: id,
    }
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/ChotDonhang",
          {
            userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
            trangthai: status
          },
          queryString
        )
      ).json()
      if (response) {

        //{
        //   "result": true,
        //   "message": "Donhang.SysOTC.NotFound",
        //   "content": 0
        // }

        updateLoading(false)
        console.log("ChotDonhang response ", response)
        if (response.result) {
          zmp.dialog.alert(response.message, "Thông báo");
        }
        if (!response.result) {
           zmp.dialog.alert(response.title, "Thông báo");
        }
      
      } else {
        updateLoading(false)
      }
    } catch (error) {
      updateLoading(false)
    }
  }




  return (
    <Page
      className="detail-page relative"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
    >
      <HeaderBack slot="fixed" force={true} title={"Đơn hàng"} />
      {/* {loading && <LoadingSpinner />} */}

      {Giohang.length > 0 && (
        <>
          <Box mx={2} className={`box ${isOpenOTP ? "open" : ""}`}>
            <Card inset className="">
              <Box flex justifyContent="center" style={{ width: "100%" }}>
                <Box m="0" p="0" className="logo-imex "></Box>
              </Box>
              <Box
                m={0}
                p={0}
                style={{
                  width: "100%",
                  height: "5px",
                  // backgroundColor: 'red',

                  paddingBottom: "10px",
                  WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                  boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                }}
                className="BoxLine"
              ></Box>

              {Giohang.map((item, index) => {
                if (index < 3) {
                  return (
                    <RowItemGH
                      key={index}
                      item={item}
                      index={index}
                      ViewMore={ViewMore}
                      updateGiohang={(a) => updateGiohang(a)}
                      tinhtien={() => tinhtien()}
                      length={Giohang.length}
                    ></RowItemGH>
                  )
                } else {
                  if (index == 3 && !ViewMore)
                    return (
                      <div className="mt-4 flex items-center justify-center">
                        <Button
                          className="gap-2 px-6 py-4"
                          onClick={() => updateViewMore(true)}
                        >
                          <Text
                            className="text-brown-dark-text-size8 "
                            style={{
                              color: Color.textAPPGray,
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          >
                            Xem thêm
                          </Text>
                          {/* <FaCircleArrowDown size={25} fill="#0091FF" /> */}
                        </Button>
                      </div>
                    )
                  if (ViewMore)
                    return (
                      <RowItemGH
                        key={index}
                        item={item}
                        index={index}
                        ViewMore={ViewMore}
                        updateGiohang={(a) => updateGiohang(a)}
                        tinhtien={() => tinhtien()}
                        length={Giohang.length}
                      ></RowItemGH>
                    )
                }
              })}
            </Card>

            {datakm.length > 0 ? (
              <Card style={{ marginTop: "10px" }} inset>
                <Box flex justifyContent="center" style={{ width: "100%" }}>
                  <Text
                    className="font-extrabold "
                    style={{ color: Color.textAPPBlue, fontSize: "16px" }}
                  >
                    Chương trình
                  </Text>
                </Box>

                <Box className="">
                  {datakm.map((item, index) => {
                    return (
                      <RowItemKM
                        key={index}
                        item={item}
                        index={index}
                        length={datakm.length}
                        updateGiohang={(a) => updateGiohang(a)}
                        tinhtien={() => tinhtien()}
                      ></RowItemKM>
                    )
                  })}
                </Box>
              </Card>
            ) : (
              <></>
            )}
          </Box>
          <Box style={{ height: isOpenOTP ? 420 : 280 }}></Box>
        </>
      )}


      {Giohang.length > 0 ? (
        <Box
          m="0"
          p="0"
          flex
          className="mx-0 customBG "
          alignItems="center"
          slot="fixed"
          style={{
            height: 200,
            width: "100%",
            position: "absolute",
            bottom: 0,
            zIndex: 9,
            //  background: "white",

            // boxShadow: " -1px -2px 0px 0px rgba(173,155,155,0.75)",
            borderTopWidth: 0,

          }}
        >
          {/* <Icon zmp='zi-star'></Icon> */}
          <Box m="0" p="0" style={{ width: "100%" }}>
            <Box style={{ width: "100%" }}>
              {Giohang.length > 0 && (
                <Box
                  className="viewtotal-bottom"
                  flex
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box width={"90%"}>
                    <div className="flex justify-between mb-1">
                      <Text
                        style={{
                          color: Color.textAPPBlue,
                          fontWeight: "800",
                          fontSize: "13px",
                        }}
                      >
                        Tổng tiền
                      </Text>
                      <Text
                        style={{
                          color: Color.textAPPGreen,
                          fontWeight: 800,
                          fontSize: "16px",
                        }}
                      >
                        {formatCurrency(Number(TongTien))}
                      </Text>
                    </div>
                    <div className="flex justify-between mb-1">
                      <Text
                        style={{
                          color: Color.textAPPBlue,
                          fontWeight: "800",
                          fontSize: "13px",
                        }}
                      >Tiền khuyến mãi</Text>
                      <Text
                        style={{
                          color: Color.BackgrondLightAPP4,
                          fontWeight: 800,
                          fontSize: "16px",
                        }}
                      >
                        {formatCurrency(
                          Number(TongtieKm) > 0 ? Number(TongtieKm) * -1 : -0
                        )}
                      </Text>
                    </div>
                    <div
                      className="flex justify-between mb-4 border-b-2"
                      style={{ borderColor: "#ccc", borderStyle: "dashed" }}
                    >
                      <Text
                        style={{
                          color: Color.textAPPBlue,
                          fontWeight: "800",
                          fontSize: "13px",
                        }}
                      >
                        VAT
                      </Text>
                      <Text
                        style={{
                          color: Color.textAPPGreen,
                          fontWeight: 800,
                          fontSize: "16px",
                        }}
                      >
                        {formatCurrency(Number(TongTienVAT))}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text
                        style={{
                          color: Color.textAPPBlue,
                          fontWeight: 800,
                          fontSize: "13px",
                        }}
                      >
                        Tổng tiền sau VAT
                      </Text>
                      <Text
                        style={{
                          color: Color.textAPPGreen,
                          fontWeight: 800,
                          fontSize: "16px",
                        }}
                      >
                        {formatCurrency(
                          Number(TongGiatri)
                        )}{" "}
                      </Text>
                    </div>
                  </Box>

                </Box>
              )}
            </Box>

            {isGiaoHang == 0 ? (
              <Box m="0" p="0" className="p-4" flex justifyContent="center">

                {loading ? (
                  <LoadingSpinner></LoadingSpinner>
                ) : (
                  <Box m="0" p="0" className="p-4" flex justifyContent="center" style={{ width: "90%" }}>

                    <Box m="0" p="0" flex style={{ width: "100%", gap: 5 }}>
                      <Link
                        onClick={() => {

                          zmp.dialog.confirm(
                            "Bạn có chắc chắn muốn xóa đơn hàng này?", "Thông báo",
                            () => {
                              onClickChotDonHang("2")
                            }
                          )
                        }}
                      >
                        <Box
                          m="0"
                          p="0"
                          flex
                          alignItems="center"
                          justifyContent="center"
                          style={{
                            backgroundColor: ConvertOpacity(Color.textAPPGreen, 0.1),
                            borderRadius: 5,
                            width: "50px",
                            height: "50px",
                            border: `1px solid ${ConvertOpacity(Color.textAPPGreen, 0.1)}`,
                          }}
                        >
                          <IoTrashBin color={Color.textAPPRed2} style={{}} />
                        </Box>
                      </Link>
                      <Button
                        className="view-center"
                        fill
                        style={{
                          backgroundColor: ConvertOpacity(Color.textAPPGreen2, 1),
                          color: "white",
                          fontSize: 16,
                          borderRadius: 5,
                          height: 50,
                          flexGrow: 1,
                        }}
                        onClick={() => {

                          // hiên alert xác nhận
                          zmp.dialog.confirm(
                            "Bạn có chắc chắn muốn chốt đơn hàng này?", "Thông báo",
                            () => {
                              onClickChotDonHang(0)
                            }
                          )

                        }}
                      >
                        <Box flex alignItems="center" justifyContent="center">
                          <FaCheck style={{ marginRight: 8 }} />
                          <Text style={{ color: "white", fontSize: 13 }}>
                            Chốt đơn hàng
                          </Text>
                        </Box>
                      </Button>
                    </Box>

                    {/* <Button
                      small
                      className="filter-button-luu view-center"
                      color="white"
                      iconZMP="zi-check-circle"
                      onClick={() => {

                        // hiên alert xác nhận
                        zmp.dialog.confirm(
                          "Bạn có chắc chắn muốn chốt đơn hàng này?", "Thông báo",
                          () => {
                            onClickChotDonHang()
                          }
                        )

                      }}
                    >
                      <Text style={{ color: "white", marginTop: 0 }}>
                        Chốt đơn hàng
                      </Text>
                    </Button> */}
                  </Box>
                )}
              </Box>) : null}

          </Box>
        </Box>
      ) : (
        <></>
      )}
    </Page>
  )
}

export default Capnhatdonhang
