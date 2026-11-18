import AppHeader from "@components/Header/AppHeader"
import LoadingSpinner from "@components/LoadingSpinner"
import { Card, EmptyState, SectionTitle, StatusBadge } from "@components/ui"
import { fmtNgay, trangThaiBai } from "@utils/elearning"
import { validateString } from "@utils/util"
import { useEffect, useRef, useState } from "react"
import { FaGift } from "react-icons/fa"
import { MdChevronRight, MdMenuBook, MdQuiz, MdSchool } from "react-icons/md"
import { Page, useStore, zmp } from "zmp-framework/react"
import { getDanhSachHoc } from "../services/elearningService"

const escapeHtml = (s) =>
  String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

const openBai = (query) =>
  zmp.views.current.router.navigate(`/elearningbai/?${query}`, { transition: "zmp-cover", animate: true })

// Thông báo trước khi vào bài: học bài rồi trả lời câu hỏi để nhận quà
const xacNhanVaoBai = (bai) => {
  const coHoc = (bai.dsBaiHoc || []).some((h) => Number(h.daHoc) !== 1)
  const buoc = coHoc
    ? "Bạn sẽ <b>xem bài học</b> (video, hình ảnh, tài liệu), sau đó <b>trả lời câu hỏi</b>."
    : "Bạn sẽ <b>trả lời câu hỏi</b> của bài kiểm tra."
  const thuong = bai.thuong
    ? `<div style="margin-top:8px">Trả lời đúng từ <b>${bai.socaucandat || bai.tongcauhoi}/${bai.tongcauhoi}</b> câu để nhận: <b>${escapeHtml(bai.thuong)}</b></div>`
    : ""
  zmp.dialog
    .create({
      title: "Học và trả lời để nhận quà",
      content: `<div class="dialog-text">${buoc}${thuong}</div>`,
      buttons: [{ text: "Để sau" }, { text: "Bắt đầu", bold: true, onClick: () => openBai(`id=${bai.id}`) }],
    })
    .open()
}

const BaiKiemTraCard = ({ bai }) => {
  const tt = trangThaiBai(bai)
  const soHoc = (bai.dsBaiHoc || []).length
  const daHoc = (bai.dsBaiHoc || []).filter((h) => Number(h.daHoc) === 1).length
  const conLuot = Number(bai.soLanDaLam) < Number(bai.soLanToiDa)
  const coTheLam = Number(bai.conHan) === 1 && conLuot && Number(bai.dat) !== 1

  const onClick = () => {
    if (tt.key === "quay" || tt.key === "dat") return openBai(`id=${bai.id}`)
    if (coTheLam) return xacNhanVaoBai(bai)
    zmp.toast
      .create({
        text: tt.key === "het" ? "Bài kiểm tra đã hết hạn" : "Bạn đã làm hết số lần cho phép",
        position: "center",
        closeTimeout: 2000,
      })
      .open()
  }

  return (
    <button type="button" onClick={onClick} className="block w-full border-0 bg-transparent p-0 text-left">
      <Card className="active:bg-[#f7faff]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 text-[14px] font-semibold leading-snug text-slate-700">{bai.tenBai}</div>
          <StatusBadge tone={tt.tone}>{tt.label}</StatusBadge>
        </div>

        {!!bai.thuong && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-[#fff8f0] px-2.5 py-2 text-[12px] text-[#9a5a00]">
            <FaGift size={13} className="mt-0.5 shrink-0" />
            <span className="min-w-0">{bai.thuong}</span>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-slate-500">
          {soHoc > 0 && (
            <span>
              Bài học: <b className="text-slate-700">{daHoc}/{soHoc}</b>
            </span>
          )}
          <span>
            Câu hỏi: <b className="text-slate-700">{bai.tongcauhoi}</b>
            {Number(bai.socaucandat) > 0 && ` · cần đúng ${bai.socaucandat}`}
          </span>
          <span>
            Đã làm: <b className="text-slate-700">{bai.soLanDaLam}/{bai.soLanToiDa}</b>
          </span>
          {Number(bai.thoigianlambai) > 0 && <span>{bai.thoigianlambai} phút</span>}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-[#edf0f5] pt-2 text-[12px]">
          <span className="text-slate-400">Hạn: {fmtNgay(bai.denNgay)}</span>
          <span className="flex items-center font-semibold text-primary">
            {tt.key === "quay" ? "Quay thưởng" : tt.key === "dat" ? "Xem quà" : coTheLam ? "Bắt đầu" : "Xem"}
            <MdChevronRight size={18} />
          </span>
        </div>
      </Card>
    </button>
  )
}

const BaiHocRow = ({ hoc }) => (
  <button
    type="button"
    onClick={() => openBai(`baihoc=${hoc.id}`)}
    className="block w-full border-0 bg-transparent p-0 text-left"
  >
    <Card className="flex items-center gap-3 active:bg-[#f7faff]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-primary">
        <MdMenuBook size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold leading-snug text-slate-700">{hoc.tenBai}</span>
        <span className="block text-[11px] text-slate-400">Đến {fmtNgay(hoc.denNgay)}</span>
      </span>
      {Number(hoc.daHoc) === 1 ? (
        <StatusBadge tone="success">Đã học</StatusBadge>
      ) : (
        <StatusBadge tone="info">Chưa học</StatusBadge>
      )}
    </Card>
  </button>
)

// Học & nhận quà: bài kiểm tra khai báo cho khách hàng (Quản lý E-learning trên web) + bài học riêng
const Elearning = () => {
  const CusInfo = useStore("getCusInfo")
  const khId = validateString(CusInfo?.KHACHHANG_fk + "", true)
  const isSynced = !!CusInfo?.KHACHHANG_fk && CusInfo?.KHACHHANG_fk !== 0

  const [data, setData] = useState({ baiKiemTra: [], baiHoc: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const daVao = useRef(false)

  const load = async () => {
    if (!isSynced) return
    setLoading(true)
    setError("")
    try {
      const d = await getDanhSachHoc(khId)
      setData({ baiKiemTra: d?.baiKiemTra || [], baiHoc: d?.baiHoc || [] })
    } catch (e) {
      setError(e.message || "Không tải được danh sách")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [khId])

  // Bài học đã nằm trong bài kiểm tra thì không lặp lại ở mục bài học riêng
  const hocTrongBai = new Set(data.baiKiemTra.flatMap((b) => (b.dsBaiHoc || []).map((h) => String(h.id))))
  const baiHocRieng = data.baiHoc.filter((h) => !hocTrongBai.has(String(h.id)))
  const trong = !loading && !error && !data.baiKiemTra.length && !baiHocRieng.length

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      onPageAfterIn={() => {
        // quay lại từ màn học / làm bài: tải lại trạng thái (lần vào đầu đã tải ở useEffect)
        if (daVao.current && isSynced) load()
        daVao.current = true
      }}
      className="detail-page bg-slate-50"
    >
      <AppHeader title="Học & nhận quà" back rightText="Tải lại" onRightClick={load} />

      {!isSynced ? (
        <EmptyState icon={<MdSchool size={26} />} title="Chưa có dữ liệu" desc="Vui lòng đồng bộ qua số điện thoại" />
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-8 pt-3">
          <Card tone="info" className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary">
              <MdSchool size={20} />
            </span>
            <div className="min-w-0 text-[13px] leading-relaxed text-slate-600">
              Xem bài học về sản phẩm, trả lời câu hỏi để nhận <b className="text-slate-700">phiếu thưởng</b> hoặc
              <b className="text-slate-700"> lượt quay may mắn</b>. Phiếu thưởng được dùng khi đặt hàng.
            </div>
          </Card>

          {loading && <LoadingSpinner />}
          {!loading && !!error && <EmptyState title="Không tải được dữ liệu" desc={error} />}
          {trong && (
            <EmptyState
              icon={<MdQuiz size={26} />}
              title="Chưa có bài học nào"
              desc="Khi có chương trình học và nhận quà, bài sẽ hiện ở đây"
            />
          )}

          {!loading && !error && data.baiKiemTra.length > 0 && (
            <div>
              <SectionTitle icon={<MdQuiz size={16} />}>Bài kiểm tra có quà</SectionTitle>
              <div className="flex flex-col gap-2.5">
                {data.baiKiemTra.map((b) => (
                  <BaiKiemTraCard key={b.id} bai={b} />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && baiHocRieng.length > 0 && (
            <div>
              <SectionTitle icon={<MdMenuBook size={16} />}>Bài học</SectionTitle>
              <div className="flex flex-col gap-2.5">
                {baiHocRieng.map((h) => (
                  <BaiHocRow key={h.id} hoc={h} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Page>
  )
}

export default Elearning
