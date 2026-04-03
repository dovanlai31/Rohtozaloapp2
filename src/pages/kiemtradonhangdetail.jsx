import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import RowItemGH from "@components/Cart/RowItemGH"
import RowItemKM from "@components/Cart/RowItemKM"
import Color from "@components/common/Color"
import { formatCurrency, getAPI, request } from "@utils/networking"
import { MAPPING, replaceUnicode, validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { TbPackageImport } from "react-icons/tb"
import { Box, Button, Card, Page, Text, useStore, zmp } from "zmp-framework/react"
import store from "../store"
import "../styles/app.scss"
import "./../styles/giohang.scss"
import "./../styles/output.css"
import "./localscss/DonHangDetail.scss"
import FOBHorizontal from "@components/common/FOBHorizontal"
import { Input, Modal } from "zmp-ui"
import withOverlay from "@components/HOC/withOverlay"

const KiemTraDonDatHangDetail = ({ zmproute, showToast }) => {
  const PhoneNumner = store.getters.PhoneNumner.value || ""
  const Giohangx = store.getters.getGioHang.value || []

  const [Giohang, updateGiohang] = useState({})
  const [tongSoLuong, setTongSoLuong] = useState(0)
  const [datakm, updateDatakm] = useState([])
  const [loading, updateLoading] = useState(false)
  const [appKm, updateAppKm] = useState(true)
  const [ViewMore, updateViewMore] = useState(false)
  const [isGiaoHang, setIsGiaoHang] = useState(zmproute.query?.isgiaohang)
  const [forceReload, setForceReload] = useState(false)
  const [donHang, setDonHang] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loai, setLoai] = useState(1)
  const [lyDoOrOTP, setlyDoOrOTP] = useState("")
  const [isConfirm, setIsConfirm] = useState(0)

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

  const getThongTinDonHang = async (id) => {
    let queryString = {
      dhId: id,
    }
    try {
      const response = await (
        await request(
          "POST",
          "donhang/cuahang/getThongTinDonHang",
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

          const tongSoLuong = listsp.reduce(
            (total, item) => Number(total) + Number(item?.soluong || 0),
            0
          )

          updateGiohang(listsp)
          updateDatakm(listkm)
          setTongSoLuong(tongSoLuong)
          setDonHang(donHang[0])

          if (
            donHang[0]?.Trangthai === "Đã xác nhận" ||
            donHang[0]?.Trangthai === "Đã từ chối"
          ) {
            setIsConfirm(1)
          }

          store.dispatch("AddAllGioHang", p)
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

  const _ConfirmDonHang = async () => {
    console.log(lyDoOrOTP)
    try {
      const { data, error } = await getAPI(
        "donhang/cuahang/xacNhanDonHang",
        "POST",
        {
          dhId: id,
          text: lyDoOrOTP,
          userId: validateString(CusInfo?.nhanVienId + "", true),
        }
      )

      if (!data.result || error) {
        showToast(data.message, "danger")
        return
      }

      showToast(data.message, "success")
      setIsConfirm(1)
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
    }
    return
  }

  const _DenyDonHang = async () => {
    console.log(lyDoOrOTP)

    try {
      const { data, error } = await getAPI("donhang/cuahang/tuChoiDonHang", "POST", {
        dhId: id,
        text: lyDoOrOTP,
        userId: validateString(CusInfo?.nhanVienId + "", true),
      })

      if (!data.result || error) {
        showToast(data.message, "danger")
        return
      }

      showToast(data.message, "success")
      setIsConfirm(1)
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
    }
    return
  }

  return (
    <Page
      className="detail-page relative"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
    >
      <HeaderBack slot="fixed" force={true} title={"Kiểm tra đơn hàng"} />
      {loading && <LoadingSpinner />}

      {Giohang.length > 0 && (
        <>
          <Box mx={5} className={`box`}>
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
                  marginBottom: 16,
                  WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                  boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                }}
                className="BoxLine"
              ></Box>
              <Box m="0">
                <Text
                  size="normal"
                  className="font-extrabold text-blue-imex "
                  style={{
                    width: "100%",
                    fontSize: "14px",
                  }}
                >
                  {donHang.MADH}
                </Text>
              </Box>
              <Box mx="0" alignItems="center">
                <Text
                  className="desc text-blue-dark overflow-ellipsis "
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    color: Color.textAPPGray,
                  }}
                  size="small"
                >
                  <b>Trạng thái:</b> {donHang.Trangthai}
                </Text>

                {/* <Text  mx="5" size="small">
                              Đến: {km.DENNGAY}
                              </Text> */}
                <Text
                  className="desc text-blue-dark overflow-ellipsis "
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    color: Color.textAPPGray,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  size="small"
                >
                  <b>Người tạo:</b> {donHang.PG}
                </Text>
                <Text
                  className="desc text-blue-dark overflow-ellipsis "
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    color: Color.textAPPGray,
                  }}
                  size="small"
                >
                  <b>Cửa hiệu:</b> {donHang.CUAHIEU}
                </Text>
                <Text
                  className="desc text-blue-dark overflow-ellipsis "
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    color: Color.textAPPGray,
                  }}
                  size="small"
                >
                  <b>Ngày Tạo:</b> {donHang.NGAYDH}
                </Text>
                <Text
                  className="desc text-blue-dark overflow-ellipsis "
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    color: Color.textAPPGreen,
                    marginTop: 8,
                  }}
                  size="small"
                >
                  <b>{formatCurrency(donHang.TONGGIATRI, false)}</b>
                </Text>
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
          <Box style={{ height: 200 }}></Box>
        </>
      )}

      {isGiaoHang == 1 && !loading && (
        <button
          onClick={handleNhanHang}
          type="button"
          style={{
            backgroundColor: Color.textAPPGreen,
            bottom: 130,
            left: 30,
            zIndex: 999,
          }}
          className="w-auto flex items-center justify-center p-2 rounded-full fixed shadow-lg"
        >
          <TbPackageImport size={30} color="#eee" />
          <Text style={{ color: "#eee", fontWeight: "bold", marginLeft: 8 }}>
            Nhận hàng
          </Text>
        </button>
      )}

      {isConfirm === 0 && (
        <FOBHorizontal
          position="bottom"
          buttons={[
            {
              variant: "tertiary",
              text: "Từ chối",
              icon: "zi-close",
              iconStyle: { size: 25, color: "#dc1f18" },
              containerStyle: {
                border: "#dc1f18 solid 2px",
                backgroundColor: "#FFF",
              },
              type: "danger",
              onClick: () => {
                setlyDoOrOTP("")
                setLoai(2)
                setIsModalOpen(true)
              },
            },
            {
              text: "Xác nhận",
              icon: "zi-check",
              iconStyle: { size: 25, color: "#FFF" },
              containerStyle: { backgroundColor: "green" },
              onClick: () => {
                setlyDoOrOTP("")
                setLoai(1)
                setIsModalOpen(true)
              },
            },
          ]}
        />
      )}

      <Modal
        visible={isModalOpen}
        title={loai === 1 ? "Xác nhận đơn hàng" : "Từ chối đơn hàng"}
        actionsDivider
        actions={[
          {
            text: "Đóng",
            close: true,
            danger: true,
          },
          {
            text: "Xác nhận",
            highLight: true,
            onClick: () => (loai === 1 ? _ConfirmDonHang() : _DenyDonHang()),
          },
        ]}
        mask
        maskClosable
        onClose={() => setIsModalOpen(false)}
      >
        {loai === 2 && (
          <Input.TextArea
            placeholder=""
            value={lyDoOrOTP}
            onChange={(e) => setlyDoOrOTP(e.currentTarget.value)}
            helperText="Lý do từ chối xác nhận đơn hàng"
          />
        )}
        {loai === 1 && (
          <Input
            maxLength={20}
            show
            value={lyDoOrOTP}
            onChange={(e) => {
              const text = replaceUnicode(e.currentTarget.value)
              setlyDoOrOTP(text)
            }}
            helperText="Mã tham chiếu tối đa cho phép 20 kí tự"
          />
        )}
      </Modal>
    </Page>
  )
}

export default withOverlay(KiemTraDonDatHangDetail)
