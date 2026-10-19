import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { Button } from "@components/ui"
import { request, request3 } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import { MdInfoOutline, MdLock, MdPhoneIphone, MdPlace, MdStorefront, MdVerifiedUser } from "react-icons/md"
import { Page, useStore, zmp } from "zmp-framework/react"
import { getPhoneNumber, getUserID } from "zmp-sdk/apis"
import store from "../store"
import withOverlay from "@components/HOC/withOverlay"
import logoRohto from "@static/images/logoRohto.png"
import {
  CapNhatDonHang,
  FetchInitData,
  follow,
  getDataCusFromId,
  requestSendNotifications,
} from "../services/services"

// Ô nhập của form: nhãn phía trên, khung bo góc, icon bên trái
const Field = ({ label, required, icon, hint, error, children }) => (
  <label className="block">
    <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-slate-600">
      {label}
      {required && <span className="text-[#e5232a]">*</span>}
    </span>
    <span
      className={`flex min-h-[48px] items-center gap-2.5 rounded-xl border bg-white px-3.5 transition-colors focus-within:border-primary ${
        error ? "border-[#e5232a]" : "border-[#d9e3ef]"
      }`}
    >
      {icon && <span className="flex shrink-0 text-slate-400">{icon}</span>}
      {children}
    </span>
    {error ? (
      <span className="mt-1 block text-[12px] text-[#e5232a]">{error}</span>
    ) : hint ? (
      <span className="mt-1 block text-[12px] text-slate-400">{hint}</span>
    ) : null}
  </label>
)

const inputStyle = { border: "none", boxShadow: "none", borderRadius: 0, padding: 0, background: "transparent", outline: "none" }

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

  const [loiTen, setLoiTen] = useState("")

  const handleOnSubmitForm = (e) => {
    e?.preventDefault?.()
    if (!(formData.hoten || "").trim()) {
      setLoiTen("Vui lòng nhập tên cửa hàng / họ tên")
      return
    }
    setLoiTen("")

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

  const layZaloId = async () => {
    if (user?.id) return user.id
    try {
      return (await getUserID({})) || ""
    } catch (e) {
      return ""
    }
  }

  // Đăng ký xong: lưu thông tin KH trước rồi mới tải dữ liệu theo KH đó (giá, khuyến mãi, sản phẩm, banner...)
  const taiLaiDuLieu = async (zaloId) => {
    const cusInfoLocal = await getDataCusFromId(zaloId)
    const kh = cusInfoLocal?.[0]
    if (kh) {
      await store.dispatch("setCusInfo", kh)
      await store.dispatch("setLogged", true)
      store.dispatch("login")
      const safe = (fn) => Promise.resolve().then(fn).catch((e) => console.log("reload fail", e))
      await Promise.all([
        safe(() => FetchInitData(kh.KHACHHANG_fk)),
        safe(() => CapNhatDonHang(kh.KHACHHANG_fk)),
        safe(() => store.dispatch("getBanner")),
        safe(() => store.dispatch("getDanhmucSp")),
        safe(() => store.dispatch("getLatestBlogs", { limit: 20, skip: 0, reset: true })),
      ])
    }
    // làm mới số liệu trang chủ / tài khoản (đơn chờ, POSM, thông báo...)
    await store.dispatch("setRefres", Date.now())
  }

  const onClickSenddangky = async (dataparam) => {
    setLoading(true)
    const zaloId = await layZaloId()
    const {
      sodienthoai,
      userId: _userId,
      diachigiaohang,
      diachixuathoadon,
      masothe,
      tenkh,
      isOverwrite,
    } = dataparam
    const userId = _userId || zaloId
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
          await store.dispatch("setPhoneNumber", PhoneNumner)
          await taiLaiDuLieu(userId)

          await follow()
          await requestSendNotifications()

          showToast("Đăng ký thành công", "success")
          zmp.toolbar.show("#main-nav")
          zmp.views.current.router.back("", {
            animate: true,
          })
        } else {
          showToast(p[0].MSG, "danger")
        }
      } else {
        showToast("Không lưu được thông tin đăng ký, vui lòng thử lại", "danger")
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

  const daCoMaKH = CusInfo?.chuadk == 1 && (CusInfo?.mafast || "").length > 0

  return (
    <Page
      className="detail-page bg-[#f5f7fb]"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      id={`register`}
    >
      <HeaderBack slot="fixed" title="Đăng ký tài khoản" />

      <form
        onSubmit={handleOnSubmitForm}
        className="flex flex-col gap-3 px-4 pt-3"
        style={{ paddingBottom: "calc(110px + env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Giới thiệu */}
        <div className="flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white px-4 py-3.5">
          <span className="flex h-12 w-[84px] shrink-0 items-center justify-center rounded-xl bg-white">
            <img src={logoRohto} alt="Rohto" className="h-auto w-full object-contain" />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold leading-snug text-slate-800">Liên kết cửa hàng với Rohto</div>
            <div className="mt-0.5 text-[12px] leading-snug text-slate-500">
              Điền thông tin để bắt đầu đặt hàng, nhận khuyến mãi và tích lũy.
            </div>
          </div>
        </div>

        {/* Số điện thoại này đã có mã khách hàng trên hệ thống */}
        {daCoMaKH && (
          <div className="flex items-start gap-2 rounded-xl border border-[#cfe0f5] bg-[#f3f8fd] px-3.5 py-3 text-[13px] leading-snug text-slate-600">
            <MdInfoOutline size={18} className="mt-[1px] shrink-0 text-primary" />
            <span>
              Số điện thoại này đã có trên hệ thống: <b className="text-slate-800">{CusInfo.mafast}</b>
              {CusInfo?.tenkh ? ` - ${CusInfo.tenkh}` : ""}. Khi lưu, bạn có thể chọn cập nhật lại thông tin.
            </span>
          </div>
        )}

        {/* Thông tin */}
        <div className="flex flex-col gap-4 rounded-xl border border-[#E3EBF6] bg-white px-4 py-4">
          <Field
            label="Số điện thoại"
            icon={<MdPhoneIphone size={19} />}
            hint={PhoneNumner ? "Lấy tự động từ tài khoản Zalo" : ""}
          >
            {PhoneNumner ? (
              <>
                <input
                  type="tel"
                  value={PhoneNumner}
                  readOnly
                  className="h-11 min-w-0 flex-1 text-[15px] font-semibold tabular-nums text-slate-800"
                  style={inputStyle}
                />
                <MdLock size={16} className="shrink-0 text-slate-300" />
              </>
            ) : (
              <span className="flex flex-1 items-center gap-2 py-3 text-[13px] text-slate-400">
                <span className="scale-75">
                  <LoadingSpinner />
                </span>
                Đang lấy số điện thoại từ Zalo…
              </span>
            )}
          </Field>

          <Field label="Tên cửa hàng / Họ tên" required icon={<MdStorefront size={19} />} error={loiTen}>
            <input
              type="text"
              name="fullName"
              value={formData.hoten}
              maxLength={200}
              placeholder="Ví dụ: Nhà thuốc An Khang"
              onChange={(e) => {
                setFormData({ ...formData, hoten: e.target.value })
                if (loiTen) setLoiTen("")
              }}
              className="h-11 min-w-0 flex-1 text-[15px] text-slate-800 placeholder:text-slate-400"
              style={inputStyle}
            />
          </Field>

          <Field label="Địa chỉ cửa hàng" icon={<MdPlace size={19} />} hint="Số nhà, đường, phường / xã, quận / huyện, tỉnh / thành">
            <input
              type="text"
              name="diachixuathoadon"
              value={formData.diachixuathoadon}
              maxLength={300}
              placeholder="Nhập địa chỉ"
              onChange={(e) => setFormData({ ...formData, diachixuathoadon: e.target.value })}
              className="h-11 min-w-0 flex-1 text-[15px] text-slate-800 placeholder:text-slate-400"
              style={inputStyle}
            />
          </Field>
        </div>

        <div className="flex items-start gap-2 px-1 text-[12px] leading-snug text-slate-500">
          <MdVerifiedUser size={16} className="mt-[1px] shrink-0 text-[#1f8a4c]" />
          Thông tin chỉ dùng để xác nhận cửa hàng và giao hàng, không chia sẻ cho bên thứ ba.
        </div>
      </form>

      {/* Nút lưu cố định đáy màn hình */}
      <div
        className="fixed bottom-0 left-0 z-[999] w-full border-t border-[#e6ebf2] bg-white px-4 pt-3"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Button full disabled={loading || !PhoneNumner} onClick={handleOnSubmitForm}>
          {loading ? "Đang lưu…" : "Hoàn tất đăng ký"}
        </Button>
      </div>
    </Page>
  )
}

export default withOverlay(CreateCus)
