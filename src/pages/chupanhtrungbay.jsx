import AppHeader from "@components/Header/AppHeader"
import LoadingSpinner from "@components/LoadingSpinner"
import { Card, EmptyState, Grid, PillTabs, SectionTitle, StatusBadge } from "@components/ui"
import { ensureCameraPermission } from "@utils/cameraPermission"
import { capturePosmImage } from "@utils/posmImage"
import { validateString } from "@utils/util"
import { useEffect, useState } from "react"
import { FaCamera, FaHistory, FaRedo } from "react-icons/fa"
import { MdCalendarToday, MdStorefront } from "react-icons/md"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import { Page, useStore, zmp } from "zmp-framework/react"
import {
  chupAnhTrungBay,
  duocChupAnh,
  getAnhChupTrungBay,
  getCttbDaDangKy,
  toDMY,
} from "../services/trungbayService"
import store from "../store"

const SO_ANH = 2

const showAlert = (msg, title = "Thông báo") => {
  zmp.dialog
    .create({
      title,
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [{ text: "Đóng" }],
    })
    .open()
}

const showToast = (text) =>
  zmp.toast.create({ text, position: "center", closeTimeout: 2000 }).open()

// KH tự chụp 2 ảnh trưng bày cho chương trình đã đăng ký và được duyệt (giống KhachHang_ChupAnh của app sale)
const ChupAnhTrungBay = ({ zmproute }) => {
  const cttbId = zmproute?.query?.cttbId || ""
  const CusInfo = useStore("getCusInfo")
  const userId = validateString(CusInfo?.KHACHHANG_fk + "", true)

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chup")
  const [history, setHistory] = useState([])
  const [images, setImages] = useState(Array(SO_ANH).fill(null)) // [{ preview, base64 }]
  const [saving, setSaving] = useState(false)

  const loadHistory = () =>
    getAnhChupTrungBay(userId, cttbId)
      .then(setHistory)
      .catch((e) => console.log("Error getAnhChupTrungBay", e))

  useEffect(() => {
    getCttbDaDangKy(userId)
      .then((list) => setItem(list.find((r) => String(r.id) === String(cttbId)) || null))
      .catch((e) => showAlert(e.message || "Không tải được chương trình trưng bày"))
      .finally(() => setLoading(false))
    loadHistory()
  }, [cttbId])

  const takePhoto = async (index) => {
    if (!(await ensureCameraPermission())) return
    try {
      const img = await capturePosmImage(CusInfo?.mafast)
      if (img) setImages((prev) => prev.map((p, i) => (i === index ? img : p)))
    } catch (e) {
      console.log("capture trungbay image fail", e)
      showAlert("Không chụp được ảnh, vui lòng thử lại")
    }
  }

  const save = async () => {
    if (saving || !item) return
    if (images.some((img) => !img)) return showAlert(`Vui lòng chụp đủ ${SO_ANH} ảnh trưng bày`)

    setSaving(true)
    try {
      await chupAnhTrungBay({
        userId,
        cttbId,
        image1: images[0].base64,
        image2: images[1].base64,
      })
      showToast("Chụp ảnh trưng bày thành công")
      store.dispatch("setRefres", Date.now())
      zmp.views.current.router.back()
    } catch (e) {
      // giữ nguyên ảnh để người dùng lưu lại
      showAlert(e.message || "Lưu ảnh trưng bày thất bại")
    } finally {
      setSaving(false)
    }
  }

  const choChup = item && duocChupAnh(item)
  const showSaveBar = !loading && choChup && activeTab === "chup"

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="bg-slate-50"
    >
      <AppHeader title="Chụp ảnh trưng bày" back />

      {showSaveBar && (
        <div
          className="fixed bottom-0 left-0 z-[999] w-full border-t border-[#e6ebf2] bg-white px-4 pt-3"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className={`w-full rounded-xl border-0 bg-primary p-3 text-sm font-semibold text-white ${
              saving ? "opacity-50" : "active:opacity-70"
            }`}
          >
            {saving ? "Đang lưu..." : "Lưu ảnh trưng bày"}
          </button>
        </div>
      )}

      <div className="px-4 pt-3" style={{ paddingBottom: showSaveBar ? 110 : 32 }}>
        <PillTabs
          className="mb-3"
          tabs={[
            { key: "chup", label: "Chụp ảnh", icon: FaCamera },
            { key: "ls", label: "Lịch sử", icon: FaHistory, count: history.length },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        {loading && <LoadingSpinner />}

        {/* ------------------------------ Tab Chụp ảnh ------------------------------ */}
        {!loading && activeTab === "chup" && !item && (
          <EmptyState
            icon={<MdStorefront size={24} />}
            title="Không tìm thấy chương trình trưng bày"
            desc="Chương trình đã kết thúc hoặc bạn chưa đăng ký."
          />
        )}

        {!loading && activeTab === "chup" && item && (
          <div className="flex flex-col gap-2.5">
            <Card className="bg-white">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef4fb] text-primary">
                  <MdStorefront size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold leading-5 text-slate-700">
                    {item.TenChuongTrinh}
                  </div>
                  {item.SCHEME && item.SCHEME !== item.TenChuongTrinh && (
                    <div className="mt-0.5 text-[12px] text-slate-500">{item.SCHEME}</div>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">
                    <MdCalendarToday size={13} />
                    {toDMY(item.TuNgay)} - {toDMY(item.DenNgay)}
                  </div>
                </div>
              </div>
              {item.tieuChi.length > 0 && (
                <div className="mt-2.5 border-t border-[#edf0f5] pt-2">
                  <div className="mb-1.5 text-[12px] text-slate-500">Tiêu chí trưng bày</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tieuChi.map((t, i) => (
                      <span
                        key={`${t.nhan}-${i}`}
                        className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[12px] text-slate-600"
                      >
                        {t.nhan}
                        {Number(t.soluong) > 0 && ` · SL ${t.soluong}`}
                        {Number(t.phantram) > 0 && ` · ${t.phantram}%`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {choChup ? (
              <Card className="bg-white">
                <SectionTitle icon={<FaCamera size={13} />}>
                  Ảnh trưng bày ({images.filter(Boolean).length}/{SO_ANH})
                </SectionTitle>
                <div className="mb-2.5 text-[12px] text-slate-500">
                  Chụp rõ toàn bộ khu vực trưng bày sản phẩm, mỗi ảnh một góc khác nhau.
                </div>
                <Grid cols={2}>
                  {images.map((img, index) => (
                    <div key={index}>
                      <button
                        type="button"
                        onClick={() => takePhoto(index)}
                        className="relative block w-full border-0 bg-transparent p-0"
                      >
                        {img ? (
                          <>
                            <img
                              src={img.preview}
                              alt={`Ảnh trưng bày ${index + 1}`}
                              className="h-40 w-full rounded-xl object-cover"
                            />
                            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-primary">
                              <FaRedo size={10} /> Chụp lại
                            </span>
                          </>
                        ) : (
                          <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c9d6e8] bg-[#f7faff]">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3edf8] text-primary">
                              <FaCamera size={20} />
                            </span>
                            <span className="text-[12px] text-slate-500">Chạm để chụp</span>
                          </div>
                        )}
                      </button>
                      <div className="mt-1.5 text-center text-[12px] text-slate-500">Ảnh {index + 1}</div>
                    </div>
                  ))}
                </Grid>
              </Card>
            ) : (
              <Card tone="warning">
                <div className="text-[13px] text-slate-600">
                  {item.istradeduyet === 2
                    ? "Đăng ký trưng bày không được duyệt nên không thể chụp ảnh."
                    : "Đăng ký trưng bày đang chờ duyệt. Bạn có thể chụp ảnh sau khi được duyệt."}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ------------------------------- Tab Lịch sử ------------------------------- */}
        {activeTab === "ls" &&
          (history.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {history.map((h, idx) => (
                <Card key={`${h.ThoiDiem}-${idx}`} className="bg-white">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-slate-700">{toDMY(h.ThoiDiem)}</span>
                    <StatusBadge tone={Number(h.tuMiniApp) === 1 ? "info" : "neutral"}>
                      {Number(h.tuMiniApp) === 1 ? "Bạn chụp" : "Nhân viên chụp"}
                    </StatusBadge>
                  </div>
                  <div className="flex gap-2">
                    {h.images.map((src) => (
                      <Zoom key={src}>
                        <img
                          src={src}
                          alt="Ảnh trưng bày"
                          className="h-20 w-20 shrink-0 rounded-lg bg-[#e9eef6] object-cover"
                        />
                      </Zoom>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FaHistory size={22} />}
              title="Chưa có lịch sử chụp ảnh"
              desc="Ảnh trưng bày bạn chụp sẽ hiển thị tại đây."
            />
          ))}
      </div>
    </Page>
  )
}

export default ChupAnhTrungBay
