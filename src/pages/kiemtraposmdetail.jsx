import LoadingSpinner from "@components/LoadingSpinner"
import { PillTabs } from "@components/ui"
import PosmHeader from "@components/Posm/PosmHeader"
import { capturePosmImage } from "@utils/posmImage"
import { ensureCameraPermission } from "@utils/cameraPermission"
import { validateString } from "@utils/util"
import { useEffect, useState } from "react"
import { BsQrCodeScan } from "react-icons/bs"
import {
  FaBoxOpen,
  FaCamera,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaHistory,
  FaQuestionCircle,
  FaRedo,
  FaRegEdit,
  FaClipboardCheck,
} from "react-icons/fa"
import { Box, Page, Text, useStore, zmp } from "zmp-framework/react"
import { scanQRCode } from "zmp-sdk/apis"
import {
  LYDO_KHONG_QUET,
  TRANGTHAI_POSM_TEXT,
  checkPosmQR,
  getListPosm,
  getPosmHistory,
  isQRHopLe,
  savePosmCheck,
} from "../services/posmService"
import store from "../store"

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

const SectionTitle = ({ icon, children, required, className = "text-primary" }) => (
  <div className={`flex items-center gap-1.5 text-[14px] font-bold ${className}`}>
    {icon}
    <span>{children}</span>
    {required && <span className="text-[#e5232a]">*</span>}
  </div>
)

// Kiểm tra POSM chi tiết (giống KT_Tu_Detail của app sale): tab Kiểm tra / Lịch sử
// ?scan=1: mở camera quét QR ngay; ?scan=0: chọn lý do không quét được QR
const KiemTraPosmDetail = ({ zmproute }) => {
  const uploadCtId = zmproute?.query?.uploadCtId || ""
  const autoScan = zmproute?.query?.scan === "1"

  const CusInfo = useStore("getCusInfo")
  const userId = validateString(CusInfo?.KHACHHANG_fk + "", true)

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("kt")
  const [history, setHistory] = useState([])

  const [image, setImage] = useState(null) // { preview, base64 }
  const [qrRaw, setQrRaw] = useState("")
  const [ketQua, setKetQua] = useState("") // kết quả kiểm tra QR từ server
  const [qrMsg, setQrMsg] = useState("")
  const [manualQRReason, setManualQRReason] = useState(!autoScan)
  const [lydo, setLydo] = useState("")
  const [lydoKhac, setLydoKhac] = useState("")
  const [ghichu, setGhichu] = useState("")
  const [saving, setSaving] = useState(false)

  const bbHinh = Number(item?.requireImage) === 1
  const bbQR = Number(item?.requireQR) === 1

  useEffect(() => {
    getListPosm(userId, uploadCtId)
      .then(([row]) => setItem(row || null))
      .catch((e) => showAlert(e.message || "Không tải được thông tin POSM"))
      .finally(() => setLoading(false))
    getPosmHistory(userId)
      .then(setHistory)
      .catch((e) => console.log("Error getPosmHistory", e))
    if (autoScan) startScan()
  }, [uploadCtId])

  const startScan = async () => {
    setQrRaw("")
    setKetQua("")
    setQrMsg("")
    setLydo("")

    // Xin quyền camera trước khi mở máy quét; bị từ chối thì chuyển sang chọn lý do
    if (!(await ensureCameraPermission())) {
      setManualQRReason(true)
      return
    }

    let content = ""
    try {
      const res = await scanQRCode()
      content = (res?.content || "").trim()
    } catch (e) {
      console.log("scanQRCode fail", e)
    }
    // Huỷ / không quét được: chuyển sang chọn lý do
    if (!content) {
      setManualQRReason(true)
      return
    }

    setQrRaw(content)
    try {
      const { ketQua: kq, msg } = await checkPosmQR(userId, uploadCtId, content)
      if (!kq || kq === "-1") {
        setManualQRReason(true)
        return showAlert(msg || "Không kiểm tra được mã QR, vui lòng quét lại")
      }
      const hopLe = isQRHopLe(kq)
      // QR không hợp lệ: lý do lưu luôn là kết quả kiểm tra, vẫn cho chụp ảnh và lưu
      setLydo(hopLe ? "" : msg)
      setLydoKhac("")
      setKetQua(kq)
      setQrMsg(msg)
      setManualQRReason(false)

      if (kq === "3") showToast("Quét mã QR thành công")
      else if (kq === "2") showAlert("Mã QR sẽ được gán cho tài sản này khi lưu kiểm tra.", "Mã QR mới")
      else showAlert(msg + "<br/>Vui lòng chụp ảnh POSM để lưu kiểm tra.")
    } catch (e) {
      setManualQRReason(true)
      showAlert(e.message || "Không kiểm tra được mã QR, vui lòng quét lại")
    }
  }

  const takePhoto = async () => {
    if (!(await ensureCameraPermission())) return
    try {
      const img = await capturePosmImage(CusInfo?.mafast)
      if (img) setImage(img)
    } catch (e) {
      console.log("capturePosmImage fail", e)
      showAlert("Không chụp được ảnh, vui lòng thử lại")
    }
  }

  const save = async () => {
    if (saving || !item) return
    if (bbHinh && !image) return showAlert("POSM này bắt buộc chụp hình, vui lòng chụp ảnh POSM")
    if (qrRaw && !ketQua) return showAlert("Chưa kiểm tra được mã QR, vui lòng quét lại")
    if (bbQR && !ketQua && !lydo)
      return showAlert("POSM này bắt buộc quét mã QR, vui lòng quét mã QR hoặc chọn lý do không quét")
    if (lydo === "Khác" && !lydoKhac.trim()) return showAlert("Vui lòng nhập lý do khác")

    setSaving(true)
    try {
      await savePosmCheck({
        userId,
        uploadCtId,
        qr: qrRaw,
        lydo: lydo === "Khác" ? lydoKhac.trim() : lydo,
        ghichu: ghichu.trim(),
        image: image?.base64 || "",
      })
      showToast("Lưu thành công")
      store.dispatch("setRefres", Date.now())
      zmp.views.current.router.back()
    } catch (e) {
      // giữ nguyên ảnh và lựa chọn để người dùng lưu lại
      showAlert(e.message || "Lưu kiểm tra POSM thất bại")
    } finally {
      setSaving(false)
    }
  }

  const qrOk = isQRHopLe(ketQua)

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#e4ecf5]"
    >
      <PosmHeader
        title="Kiểm tra POSM chi tiết"
        rightText={saving ? "Đang lưu..." : ""}
        onRightClick={save}
      />

      {/* Nút lưu cố định ở đáy màn hình để không bị che khi cuộn / bàn phím / thanh dưới */}
      {!loading && item && activeTab === "kt" && (
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
            {saving ? "Đang lưu..." : "Lưu kiểm tra"}
          </button>
        </div>
      )}

      <Box mx="3" mt="3" style={{ paddingBottom: activeTab === "kt" ? 110 : 32 }}>
        {/* Tab Kiểm tra / Lịch sử */}
        <PillTabs
          className="mb-3"
          tabs={[
            { key: "kt", label: "Kiểm tra", icon: FaClipboardCheck },
            { key: "ls", label: "Lịch sử", icon: FaHistory, count: history.length },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        {loading && <LoadingSpinner />}

        {!loading && !item && activeTab === "kt" && (
          <Box className="min-h-[30vh] flex items-center justify-center">
            <Text className="text-sm text-slate-400">Không tìm thấy POSM</Text>
          </Box>
        )}

        {/* ----------------------------- Tab Kiểm tra ----------------------------- */}
        {!loading && item && activeTab === "kt" && (
          <div className="flex flex-col gap-2.5">
            <div className="rounded-xl border border-[#E3EBF6] bg-white p-3">
              <SectionTitle icon={<FaBoxOpen size={14} />}>Sản phẩm POSM</SectionTitle>
              <div className="mt-1.5 text-base font-bold text-slate-800">{item.name || "--"}</div>
              <span className="mt-1.5 inline-block rounded-full bg-[#e3edf8] px-2.5 py-0.5 text-xs font-semibold text-primary">
                Mã: {item.maSp || "--"}
              </span>
            </div>

            {/* Ảnh POSM */}
            <div className="rounded-xl border border-[#E3EBF6] bg-white p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <SectionTitle icon={<FaCamera size={14} />} required={bbHinh}>
                  Ảnh POSM
                </SectionTitle>
                {image && (
                  <button
                    type="button"
                    onClick={takePhoto}
                    className="flex w-auto items-center gap-1 rounded-full border-0 bg-[#e3edf8] px-2.5 py-1 text-xs font-bold text-primary"
                  >
                    <FaRedo size={11} /> Chụp lại
                  </button>
                )}
              </div>
              <button type="button" onClick={takePhoto} className="block w-full border-0 bg-transparent p-0">
                {image ? (
                  <img src={image.preview} alt="Ảnh POSM" className="h-56 w-full rounded-xl object-cover" />
                ) : (
                  <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c9d6e8] bg-[#f7faff]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3edf8] text-primary">
                      <FaCamera size={26} />
                    </span>
                    <span className="text-xs text-slate-500">Chạm để chụp ảnh POSM</span>
                  </div>
                )}
              </button>
            </div>

            {/* Mã QR */}
            <div className="rounded-xl border border-[#E3EBF6] bg-white p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <SectionTitle icon={<BsQrCodeScan size={14} />} required={bbQR}>
                  Mã QR
                </SectionTitle>
                <button
                  type="button"
                  onClick={startScan}
                  className="flex w-auto items-center gap-1.5 rounded-full border-0 bg-primary px-3 py-1.5 text-xs font-bold text-white"
                >
                  <BsQrCodeScan size={13} />
                  {ketQua || qrRaw ? "Quét lại" : "Quét QR"}
                </button>
              </div>

              {ketQua ? (
                <div
                  className={`flex items-start gap-2 rounded-xl border p-2.5 ${
                    qrOk ? "border-[#BFE6CB] bg-[#EEF9F1]" : "border-[#F5C2C2] bg-[#FDEEEE]"
                  }`}
                >
                  {qrOk ? (
                    <FaCheckCircle className="mt-0.5 shrink-0 text-[#1f8a4c]" size={18} />
                  ) : (
                    <FaExclamationCircle className="mt-0.5 shrink-0 text-[#e5232a]" size={18} />
                  )}
                  <div className="flex-1">
                    <div className={`text-[13px] font-bold ${qrOk ? "text-[#1f8a4c]" : "text-[#e5232a]"}`}>
                      {ketQua === "3" ? "QR hợp lệ" : qrMsg}
                    </div>
                    {ketQua === "2" ? (
                      <div className="text-xs text-slate-500">Mã QR sẽ được gán cho tài sản này khi lưu</div>
                    ) : !qrOk ? (
                      <div className="text-xs text-slate-500">Lý do này sẽ được lưu kèm kết quả kiểm tra</div>
                    ) : null}
                  </div>
                </div>
              ) : manualQRReason ? (
                <div className="flex items-start gap-2 rounded-xl border border-[#F7DFA3] bg-[#FFF8E6] p-2.5">
                  <FaExclamationTriangle className="mt-0.5 shrink-0 text-[#E6A100]" size={17} />
                  <div className="flex-1 text-xs text-slate-500">
                    {bbQR
                      ? "POSM này bắt buộc quét mã QR. Nếu không quét được, vui lòng chọn lý do bên dưới."
                      : "Chưa quét mã QR. Có thể chọn lý do không quét bên dưới."}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Chưa có kết quả quét</div>
              )}

              {!!qrRaw && <div className="mt-2 truncate font-mono text-[11px] text-slate-400">{qrRaw}</div>}
            </div>

            {/* Lý do không quét QR */}
            {manualQRReason && (
              <div className="rounded-xl border border-[#E3EBF6] bg-white p-3">
                <SectionTitle icon={<FaQuestionCircle size={14} />} required={bbQR} className="text-[#e5232a]">
                  Lý do không quét mã QR
                </SectionTitle>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {LYDO_KHONG_QUET.map((ld) => {
                    const selected = lydo === ld
                    return (
                      <button
                        key={ld}
                        type="button"
                        onClick={() => setLydo(ld)}
                        className={`flex w-auto items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-[#d5e2f2] bg-white text-primary"
                        }`}
                      >
                        {selected && <FaCheckCircle size={12} />}
                        {ld}
                      </button>
                    )
                  })}
                </div>
                {lydo === "Khác" && (
                  <input
                    value={lydoKhac}
                    maxLength={250}
                    onChange={(e) => setLydoKhac(e.target.value)}
                    placeholder="Nhập lý do khác..."
                    className="mt-2.5 w-full rounded-lg border border-[#d9dfe9] px-3 py-2 text-[13px]"
                  />
                )}
              </div>
            )}

            {/* Ghi chú */}
            <div className="rounded-xl border border-[#E3EBF6] bg-white p-3">
              <SectionTitle icon={<FaRegEdit size={14} />}>Ghi chú</SectionTitle>
              <textarea
                value={ghichu}
                maxLength={250}
                rows={3}
                onChange={(e) => setGhichu(e.target.value)}
                placeholder="Nhập ghi chú..."
                className="mt-2 w-full rounded-lg border border-[#d9dfe9] px-3 py-2 text-[13px]"
              />
            </div>

          </div>
        )}

        {/* ----------------------------- Tab Lịch sử ----------------------------- */}
        {activeTab === "ls" && (
          <div className="rounded-xl border border-[#E3EBF6] bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <SectionTitle icon={<FaHistory size={14} />}>Lịch sử kiểm tra POSM</SectionTitle>
              <span className="rounded-full bg-[#e3edf8] px-2 text-xs font-bold text-primary">{history.length}</span>
            </div>
            {history.length > 0 ? (
              history.map((h, idx) => (
                <div
                  key={h.id || idx}
                  className={`flex items-center gap-3 py-2.5 ${idx > 0 ? "border-t border-[#edf0f5]" : ""}`}
                >
                  {h.img ? (
                    <img
                      src={(h.linkanh || "") + h.img}
                      alt="Ảnh kiểm tra POSM"
                      className="h-16 w-16 shrink-0 rounded-lg bg-[#e9eef6] object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#e9eef6] text-slate-400">
                      <FaCamera size={18} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-xs text-slate-500">
                    <div className="truncate text-[13px] font-bold text-slate-800">{h.tenPosm || `ID: ${h.id}`}</div>
                    <div>Ngày tạo: {h.ngayTao}</div>
                    <div>Trạng thái POSM: {TRANGTHAI_POSM_TEXT[h.trangThaiPosm] || ""}</div>
                    {!!h.lydo && <div className="font-bold text-[#e5232a]">Lý do: {h.lydo}</div>}
                    {!!h.ghichu && <div className="truncate">Ghi chú: {h.ghichu}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">Chưa có lịch sử kiểm tra POSM</div>
            )}
          </div>
        )}
      </Box>
    </Page>
  )
}

export default KiemTraPosmDetail
