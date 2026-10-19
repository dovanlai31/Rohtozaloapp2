import Sheet_SelectGift, { giaQua } from "@components/DoiQua/Sheet_SelectGift"
import ViewListSpChon from "@components/DoiQua/ViewListSpChon"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { Button, EmptyState, PillTabs } from "@components/ui"
import { formatCurrency, getAPI, request } from "@utils/networking"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { FaStar } from "react-icons/fa"
import { FaCoins } from "react-icons/fa6"
import { MdAdd, MdCardGiftcard, MdCheck } from "react-icons/md"
import { TbPackageImport } from "react-icons/tb"
import { Page, zmp } from "zmp-framework/react"
import store from "../store"

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
      xu += giaQua(p) * (Number(p.soluong) || 0)
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
                { id: IdDH, userId: CusInfo?.KHACHHANG_fk },
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

  const laXu = curItem.id == "0"
  const donVi = laXu ? "xu" : "điểm"
  const conLai = xu - XuDH
  const choSua = IdDH == "" || trangthaidH == 0 // tạo mới hoặc đơn chưa xử lý
  const phanTram = xu > 0 ? Math.min(100, (XuDH * 100) / xu) : XuDH > 0 ? 100 : 0
  const doiLoai = (key) => {
    if (IdDH || key === curItem.id) return
    if (dataListChose.length) {
      zmp.dialog.confirm("Đổi loại sẽ bỏ các quà đã chọn. Tiếp tục?", "Thông báo", () => SheetActions(Number(key)))
    } else SheetActions(Number(key))
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#f5f7fb]"
    >
      <HeaderBack slot="fixed" title={IdDH ? `Đơn đổi quà #${IdDH}` : "Đổi quà"} />

      <div className="flex flex-col gap-3 px-4 pt-3" style={{ paddingBottom: "calc(120px + env(safe-area-inset-bottom, 0px))" }}>
        {/* Đổi bằng xu / điểm (đơn đã tạo thì không đổi loại được) */}
        {!IdDH && (
          <PillTabs
            variant="segmented"
            tabs={[
              { key: "0", label: "Đổi bằng Xu", icon: FaCoins },
              { key: "1", label: "Đổi bằng Điểm", icon: FaStar },
            ]}
            value={curItem.id}
            onChange={doiLoai}
          />
        )}

        {/* Số dư */}
        <div className="rounded-xl border border-[#E3EBF6] bg-white px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                laXu ? "bg-[#fdf3e6] text-[#c26a00]" : "bg-[#fdeeee] text-[#e5232a]"
              }`}
            >
              {laXu ? <FaCoins size={20} /> : <FaStar size={20} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-slate-500">{laXu ? "Xu" : "Điểm"} hiện có</div>
              <div className="text-[22px] font-bold leading-tight tabular-nums text-slate-800">
                {formatCurrency(xu, true)} <span className="text-[13px] font-semibold text-slate-500">{donVi}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf1f7]">
            <div
              className={`h-full rounded-full ${conLai < 0 ? "bg-[#e5232a]" : "bg-primary"}`}
              style={{ width: `${phanTram}%`, transition: "width 300ms ease-out" }}
            />
          </div>
          <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="rounded-lg bg-[#f7f9fc] px-3 py-2">
              <div className="text-[11px] text-slate-500">Dùng cho đơn này</div>
              <div className="text-[15px] font-bold tabular-nums text-[#c26a00]">
                {formatCurrency(XuDH, true)} {donVi}
              </div>
            </div>
            <div className="rounded-lg bg-[#f7f9fc] px-3 py-2">
              <div className="text-[11px] text-slate-500">Còn lại</div>
              <div className={`text-[15px] font-bold tabular-nums ${conLai < 0 ? "text-[#e5232a]" : "text-[#1f8a4c]"}`}>
                {formatCurrency(conLai, true)} {donVi}
              </div>
            </div>
          </div>
          {conLai < 0 && (
            <div className="mt-2 text-[12px] text-[#c23a3a]">Không đủ {donVi} để đổi, vui lòng bớt quà.</div>
          )}
        </div>

        {/* Quà đã chọn */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <span className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-700">
              <MdCardGiftcard size={16} className="text-[#c26a00]" />
              Quà đã chọn ({dataListChose.length})
            </span>
            {choSua && (
              <button
                type="button"
                onClick={() => setSheetGiftVisible(true)}
                className="flex w-auto items-center gap-1 rounded-full border-0 bg-[#e3edf8] px-3 py-1.5 text-[12px] font-semibold text-primary"
              >
                <MdAdd size={14} /> Chọn quà
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : dataListChose.length === 0 ? (
            <div className="rounded-xl border border-[#E3EBF6] bg-white">
              <EmptyState
                icon={<MdCardGiftcard size={28} />}
                title="Chưa chọn quà nào"
                desc={`Chọn quà muốn đổi bằng ${donVi} của bạn`}
                action={
                  choSua && (
                    <Button icon={<MdAdd size={16} />} onClick={() => setSheetGiftVisible(true)}>
                      Chọn quà
                    </Button>
                  )
                }
              />
            </div>
          ) : (
            <ViewListSpChon
              refres={refresh}
              plus={(item, index) => plus(item, index)}
              diff={(item, index) => diff(item, index)}
              removeItem={(item, index) => removeItem(item, index)}
              dataListChose={dataListChose}
              donVi={donVi}
              disabled={!choSua}
            />
          )}
        </div>
      </div>

      {/* Thanh tổng + lưu cố định đáy màn hình */}
      {(choSua || (trangthaidH == 4 && !isNhanHang)) && (
        <div
          className="fixed bottom-0 left-0 z-[999] w-full border-t border-[#e6ebf2] bg-white px-4 pt-3"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          {choSua && (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-slate-500">Tổng {donVi} đổi quà</span>
                <span className="text-[19px] font-bold tabular-nums text-[#c26a00]">
                  {formatCurrency(XuDH, true)} {donVi}
                </span>
              </div>
              <Button
                full
                className="mt-2.5"
                icon={<MdCheck size={18} />}
                disabled={loading || !dataListChose.length || conLai < 0}
                onClick={() => save(true)}
              >
                {IdDH ? "Cập nhật đơn đổi quà" : "Đổi quà"}
              </Button>
            </>
          )}
          {trangthaidH == 4 && !isNhanHang && (
            <Button full variant="success" className="mt-2.5" icon={<TbPackageImport size={18} />} onClick={handleNhanHang}>
              Đã nhận được quà
            </Button>
          )}
        </div>
      )}

      <Sheet_SelectGift
        saveDataChose={saveDataChose}
        setChose={setChose}
        dataListChose={dataListChose}
        dataList={dataList}
        SheetGiftVisible={SheetGiftVisible}
        setSheetGiftVisible={setSheetGiftVisible}
        xu_diem={xu}
        donVi={donVi}
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
