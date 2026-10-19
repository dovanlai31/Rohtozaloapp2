import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import RowItemGH from "@components/Cart/RowItemGH"
import RowItemKM from "@components/Cart/RowItemKM"
import Color from "@components/common/Color"
import { formatCurrency, getAPI, request } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { TbPackageImport } from "react-icons/tb"
import { Page, useStore, zmp } from "zmp-framework/react"
import { Button as UiButton, SectionTitle } from "@components/ui"
import { MdEdit, MdLocalOffer, MdShoppingBag } from "react-icons/md"
import store from "../store"
import { goToCartTab } from "@utils/navigation"
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
  // Chỉ đơn mới tạo (DONHANG.TRANGTHAI = 0) mới được sửa / xoá.
  // Lấy trạng thái thật từ API chi tiết đơn (tham số isgiaohang trên link là trạng thái đồng bộ, không phải trạng thái đơn)
  const laDonMoi = donHang?.tt !== undefined && donHang?.tt !== null && String(donHang.tt) === "0"

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

  // Sửa đơn (trạng thái 0): đưa sản phẩm của đơn vào giỏ hàng (giá hiện hành), tính lại khuyến mãi rồi cập nhật đơn
  const onClickSuaDon = () => {
    if (!laDonMoi) {
      zmp.dialog.alert("Đơn hàng đã được xử lý, không thể chỉnh sửa", "Thông báo")
      return
    }
    const gioHienTai = store.getters.getGioHang.value || []
    const dangSua = store.getters.dhDangSua.value || ""
    if (gioHienTai.length > 0 && dangSua != id) {
      zmp.dialog.confirm(
        "Giỏ hàng đang có sản phẩm. Thay bằng sản phẩm của đơn #" + id + " để chỉnh sửa?",
        "Thông báo",
        napDonVaoGio
      )
    } else napDonVaoGio()
  }

  const napDonVaoGio = async () => {
    updateLoading(true)
    const userId = validateString(CusInfo?.KHACHHANG_fk + "", true)
    const thieu = []
    try {
      const list = (
        await Promise.all(
          listSp.map(async (item) => {
            try {
              const { data, error } = await getAPI("khachhang/getSpDetail", "POST", {}, {
                userId,
                spId: validateString(item.id + "", true),
                idchungloai: "",
                loai: "2",
              })
              const sp = !error && data?.result ? JSON.parse(data.content)?.[0] : null
              if (!sp) throw new Error()
              return { ...sp, soluong: Number(item.soluong ?? item.SOLUONG) || 1 }
            } catch (e) {
              thieu.push(item.ten || item.TEN || item.ma)
              return null
            }
          })
        )
      ).filter(Boolean)

      if (!list.length) {
        zmp.dialog.alert("Không lấy được thông tin sản phẩm của đơn hàng, vui lòng thử lại", "Thông báo")
        return
      }
      await store.dispatch("AddAllGioHang", list)
      store.dispatch("setDhDangSua", id)
      const goToCart = goToCartTab
      if (thieu.length) {
        zmp.dialog.alert("Một số sản phẩm không còn bán nên không đưa vào giỏ: " + thieu.join(", "), "Thông báo", goToCart)
      } else {
        zmp.toast.create({ text: "Đã đưa đơn #" + id + " vào giỏ hàng để chỉnh sửa", position: "center", closeTimeout: 1800 }).open()
        goToCart()
      }
    } finally {
      updateLoading(false)
    }
  }

  // Huỷ đơn (chỉ đơn trạng thái 0): dùng API huỷ đơn của Rohto, hoàn lại tồn kho và phân bổ khuyến mãi
  const onClickXoaDonHang = async () => {
    if (!laDonMoi) {
      zmp.dialog.alert("Đơn hàng đã được xử lý, không thể xoá", "Thông báo")
      return
    }
    updateLoading(true)
    try {
      const response = await (
        await request(
          "POST",
          "khachhang/xoadonhang",
          { userId: validateString(CusInfo?.KHACHHANG_fk + "", true) },
          { dhId: id }
        )
      ).json()
      if (response?.result) {
        store.dispatch("setRefres", Date.now()) // làm mới danh sách đơn / số đơn chờ xác nhận
        zmp.dialog.alert(response.message || "Đã xoá đơn hàng", "Thông báo", () => zmp.views.current.router.back())
      } else {
        zmp.dialog.alert(response?.message || "Không xoá được đơn hàng, vui lòng thử lại", "Thông báo")
      }
    } catch (error) {
      zmp.dialog.alert("Không xoá được đơn hàng, vui lòng thử lại", "Thông báo")
    } finally {
      updateLoading(false)
    }
  }

  const HIEN_SAN = 3 // số sản phẩm hiện sẵn, còn lại bấm "Xem thêm"
  const listSp = Array.isArray(Giohang) ? Giohang : []
  const canChot = laDonMoi
  const tienHang = Number(TongTien) || 0
  const tienKm = Number(TongtieKm) || 0

  return (
    <Page
      className="detail-page bg-slate-50"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
    >
      <HeaderBack slot="fixed" force={true} title={id ? `Đơn hàng #${id}` : "Đơn hàng"} />

      {listSp.length > 0 && (
        <div className="flex flex-col gap-3 px-4 pt-3" style={{ paddingBottom: canChot ? 260 : 190 }}>
          {/* Sản phẩm */}
          <div>
            <SectionTitle icon={<MdShoppingBag size={16} />}>
              Sản phẩm ({listSp.length}) · {formatCurrency(tongSoLuong, true)} SL
            </SectionTitle>
            <div className="divide-y divide-[#edf0f5] overflow-hidden rounded-xl border border-[#E3EBF6] bg-white">
              {(ViewMore ? listSp : listSp.slice(0, HIEN_SAN)).map((item, index) => (
                <RowItemGH
                  key={item.id || index}
                  item={item}
                  index={index}
                  ViewMore={ViewMore}
                  updateGiohang={(a) => updateGiohang(a)}
                  tinhtien={() => tinhtien()}
                  length={listSp.length}
                />
              ))}
            </div>
            {!ViewMore && listSp.length > HIEN_SAN && (
              <UiButton variant="ghost" full className="mt-2 !py-2.5 text-[13px] text-primary" onClick={() => updateViewMore(true)}>
                Xem thêm {listSp.length - HIEN_SAN} sản phẩm
              </UiButton>
            )}
          </div>

          {/* Chương trình khuyến mãi */}
          {datakm.length > 0 && (
            <div>
              <SectionTitle icon={<MdLocalOffer size={16} className="text-[#e5232a]" />}>Chương trình khuyến mãi</SectionTitle>
              <div className="flex flex-col gap-2">
                {datakm.map((item, index) => (
                  <RowItemKM
                    key={index}
                    item={item}
                    index={index}
                    length={datakm.length}
                    updateGiohang={(a) => updateGiohang(a)}
                    tinhtien={() => tinhtien()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tổng tiền + thao tác (cố định đáy màn hình) */}
      {listSp.length > 0 && (
        <div
          className="fixed bottom-0 left-0 z-[999] w-full border-t border-[#e6ebf2] bg-white px-4 pt-3"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="flex flex-col gap-1 text-[13px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Tiền hàng</span>
              <span className="tabular-nums text-slate-600">{formatCurrency(tienHang, true)}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Khuyến mãi</span>
              <span className="font-semibold tabular-nums text-[#1f8a4c]">
                {tienKm > 0 ? `-${formatCurrency(tienKm, true)}đ` : "0đ"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">VAT</span>
              <span className="tabular-nums text-slate-600">{formatCurrency(Number(TongTienVAT) || 0, true)}đ</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between border-t border-dashed border-[#dfe6f0] pt-1.5">
            <span className="text-[14px] font-semibold text-slate-700">Tổng thanh toán</span>
            <span className="text-[19px] font-bold tabular-nums text-[#e5232a]">
              {formatCurrency(Number(TongGiatri) || 0, true)}đ
            </span>
          </div>

          {canChot &&
            (loading ? (
              <div className="flex justify-center py-2">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="mt-2.5 flex gap-2">
                <UiButton
                  variant="ghost"
                  aria-label="Xoá đơn hàng"
                  className="!px-3.5 text-[#e5232a]"
                  icon={<IoTrashBin size={18} />}
                  onClick={() =>
                    zmp.dialog.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?", "Thông báo", onClickXoaDonHang)
                  }
                />
                <UiButton className="flex-1" icon={<MdEdit size={16} />} onClick={onClickSuaDon}>
                  Sửa đơn hàng
                </UiButton>
              </div>
            ))}
        </div>
      )}
    </Page>
  )
}

export default Capnhatdonhang
