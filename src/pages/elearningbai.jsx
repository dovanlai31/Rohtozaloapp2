import LessonContent from "@components/Elearning/LessonContent"
import QuizView from "@components/Elearning/QuizView"
import RewardWheel from "@components/Elearning/RewardWheel"
import AppHeader from "@components/Header/AppHeader"
import LoadingSpinner from "@components/LoadingSpinner"
import { Button, Card, EmptyState, InfoRow, SectionTitle, StatusBadge } from "@components/ui"
import { fmtNgay, moTaPhieuThuong } from "@utils/elearning"
import { validateString } from "@utils/util"
import { useEffect, useState } from "react"
import { FaGift } from "react-icons/fa"
import { MdCheckCircle, MdMenuBook, MdQuiz, MdRadioButtonUnchecked } from "react-icons/md"
import { Page, useStore, zmp } from "zmp-framework/react"
import {
  chonQua,
  getCauHoi,
  getDanhSachHoc,
  getThongTinThuong,
  hocXong,
  nopBai,
  quayThuong,
} from "../services/elearningService"

const toast = (text) => zmp.toast.create({ text, position: "center", closeTimeout: 2200 }).open()
const thongBao = (title, html) =>
  zmp.dialog.create({ title, content: `<div class="dialog-text">${html}</div>`, buttons: [{ text: "Đóng" }] }).open()
const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

const moPhieuThuong = () =>
  zmp.views.current.router.navigate("/phieutrathuong/", { transition: "zmp-cover", animate: true })

/* --------------------------------- Phiếu thưởng --------------------------------- */

const DsPhieu = ({ ds }) =>
  ds?.length ? (
    <div className="flex flex-col gap-2">
      {ds.map((p) => (
        <div key={p.id} className="flex items-start gap-2.5 rounded-xl border border-[#fde2c8] bg-[#fff8f0] px-3 py-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#c26a00]">
            <FaGift size={13} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-slate-700">{moTaPhieuThuong(p)}</span>
            <span className="block text-[11px] text-slate-500">
              Phiếu {p.sophieu}
              {p.ngaytao ? ` · ${fmtNgay(p.ngaytao)}` : ""}
            </span>
          </span>
        </div>
      ))}
      <div className="text-[12px] leading-relaxed text-slate-500">
        Phiếu thưởng được áp dụng khi bạn đặt hàng (mục <b className="text-slate-600">Phiếu trả thưởng</b> trong giỏ hàng).
      </div>
    </div>
  ) : null

// Ô "Or" trúng nhiều quà: khách chọn 1
const ChonQua = ({ cho, dangChon, onChon }) => (
  <Card tone="warning">
    <div className="text-[13px] font-semibold text-slate-700">
      Lượt {cho.luot}: trúng "{cho.diengiai}" — chọn 1 phần quà
    </div>
    <div className="mt-2 flex flex-col gap-2">
      {(cho.dsTrakm || []).map((t) => (
        <button
          key={t.trakmId}
          type="button"
          disabled={dangChon}
          onClick={() => onChon(cho, t)}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#F7DFA3] bg-white px-3 py-2.5 text-left active:bg-[#fffaf0]"
        >
          <span className="min-w-0 text-[13px] text-slate-700">{t.diengiai || t.ma}</span>
          <span className="shrink-0 text-[12px] font-semibold text-primary">Chọn</span>
        </button>
      ))}
    </div>
  </Card>
)

/* ----------------------------------- Trang ----------------------------------- */

// Học bài -> làm bài kiểm tra -> nhận thưởng (phiếu trả thưởng / vòng quay may mắn).
// ?id=<bài kiểm tra> hoặc ?baihoc=<bài học riêng, chỉ học>
const ElearningBai = ({ zmproute }) => {
  const baiTapId = zmproute?.query?.id || ""
  const baiHocRieng = zmproute?.query?.baihoc || ""
  const CusInfo = useStore("getCusInfo")
  const khId = validateString(CusInfo?.KHACHHANG_fk + "", true)

  const [bai, setBai] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [buoc, setBuoc] = useState("") // hoc | batdau | lam | ketqua
  const [hocIdx, setHocIdx] = useState(0)
  const [dangLuu, setDangLuu] = useState(false)
  const [cauHoi, setCauHoi] = useState([])
  const [ketQua, setKetQua] = useState(null) // kết quả lần nộp vừa xong
  const [thuong, setThuong] = useState(null) // ELN_VongQuay_ThongTin
  const [dangChon, setDangChon] = useState(false)

  const dsHoc = bai?.dsBaiHoc || []

  const taiThuong = async () => {
    try {
      setThuong(await getThongTinThuong(khId, baiTapId))
    } catch (e) {
      console.log("getThongTinThuong", e)
    }
  }

  const taiBai = async () => {
    const d = await getDanhSachHoc(khId)
    const b = (d?.baiKiemTra || []).find((x) => String(x.id) === String(baiTapId))
    if (!b) throw new Error("Không tìm thấy bài kiểm tra hoặc bài không còn dành cho bạn")
    setBai(b)
    return b
  }

  useEffect(() => {
    if (baiHocRieng) {
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    taiBai()
      .then(async (b) => {
        if (!alive) return
        if (Number(b.dat) === 1) {
          await taiThuong()
          setBuoc("ketqua")
        } else {
          const chuaHoc = (b.dsBaiHoc || []).findIndex((h) => Number(h.daHoc) !== 1)
          if (chuaHoc >= 0) {
            setHocIdx(chuaHoc)
            setBuoc("hoc")
          } else setBuoc("batdau")
        }
      })
      .catch((e) => alive && setError(e.message || "Không tải được bài"))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [baiTapId, baiHocRieng])

  /* ---- Học ---- */

  const xongBaiHoc = async () => {
    const h = dsHoc[hocIdx]
    setDangLuu(true)
    try {
      if (Number(h.daHoc) !== 1) await hocXong(khId, h.id)
      const moi = dsHoc.map((x, i) => (i === hocIdx ? { ...x, daHoc: 1 } : x))
      setBai({ ...bai, dsBaiHoc: moi })
      const tiep = moi.findIndex((x) => Number(x.daHoc) !== 1)
      if (Number(bai.dat) === 1 || Number(ketQua?.dat) === 1) setBuoc("ketqua")
      else if (tiep >= 0) setHocIdx(tiep)
      else {
        setBuoc("batdau")
        toast("Bạn đã học xong, hãy trả lời câu hỏi để nhận quà")
      }
    } catch (e) {
      thongBao("Thông báo", esc(e.message))
    } finally {
      setDangLuu(false)
    }
  }

  const xongBaiHocRieng = async () => {
    setDangLuu(true)
    try {
      await hocXong(khId, baiHocRieng)
      toast("Đã ghi nhận bạn học xong bài")
      zmp.views.current.router.back()
    } catch (e) {
      thongBao("Thông báo", esc(e.message))
    } finally {
      setDangLuu(false)
    }
  }

  /* ---- Làm bài ---- */

  const batDauLam = async () => {
    setDangLuu(true)
    try {
      const ds = await getCauHoi(khId, baiTapId)
      setCauHoi(Array.isArray(ds) ? ds : [])
      setKetQua(null)
      setBuoc("lam")
    } catch (e) {
      thongBao("Thông báo", esc(e.message))
    } finally {
      setDangLuu(false)
    }
  }

  const nop = async (chon) => {
    setDangLuu(true)
    try {
      const kq = await nopBai(khId, baiTapId, cauHoi, chon)
      setKetQua(kq)
      if (kq?.thuong) setThuong(kq.thuong)
      setBuoc("ketqua")
      taiBai().catch(() => {})
    } catch (e) {
      thongBao("Nộp bài không thành công", esc(e.message))
    } finally {
      setDangLuu(false)
    }
  }

  /* ---- Vòng quay ---- */

  const quay = async () => {
    try {
      return await quayThuong(khId, baiTapId)
    } catch (e) {
      thongBao("Thông báo", esc(e.message))
      throw e
    }
  }

  const sauKhiQuay = async (kq) => {
    if (Number(kq?.choChon) === 1) {
      thongBao("Chúc mừng!", `Bạn trúng <b>${esc(kq.diengiai)}</b>. Hãy chọn 1 phần quà bên dưới.`)
    } else if (kq?.dsPhieu?.length) {
      thongBao(
        "Chúc mừng!",
        `Bạn trúng <b>${esc(kq.diengiai)}</b>:<br/>` + kq.dsPhieu.map((p) => "• " + esc(moTaPhieuThuong(p))).join("<br/>")
      )
    } else {
      thongBao("Rất tiếc", `Ô "${esc(kq?.diengiai || "")}" không có quà. Chúc bạn may mắn lần sau!`)
    }
    await taiThuong()
    taiBai().catch(() => {})
  }

  const chon = async (cho, t) => {
    setDangChon(true)
    try {
      const kq = await chonQua(khId, baiTapId, cho.ketQuaId, t.trakmId)
      thongBao(
        "Đã nhận quà",
        (kq?.dsPhieu || []).map((p) => "• " + esc(moTaPhieuThuong(p))).join("<br/>") || "Đã ghi nhận phần quà bạn chọn"
      )
      await taiThuong()
    } catch (e) {
      thongBao("Thông báo", esc(e.message))
    } finally {
      setDangChon(false)
    }
  }

  /* ---- Quay lại ---- */

  const quayLai = () => {
    if (buoc === "lam") {
      zmp.dialog
        .create({
          title: "Thoát bài kiểm tra",
          content: '<div class="dialog-text">Bài làm chưa nộp sẽ không được lưu. Bạn muốn thoát?</div>',
          buttons: [{ text: "Làm tiếp" }, { text: "Thoát", onClick: () => zmp.views.current.router.back() }],
        })
        .open()
      return
    }
    zmp.views.current.router.back()
  }

  /* ---------------------------------- Giao diện ---------------------------------- */

  const conLuot = bai && Number(bai.soLanDaLam) < Number(bai.soLanToiDa) && Number(bai.conHan) === 1
  const dat = Number(ketQua ? ketQua.dat : bai?.dat) === 1
  const tieuDe = baiHocRieng ? "Bài học" : buoc === "lam" ? "Làm bài kiểm tra" : buoc === "hoc" ? "Học bài" : "Học & nhận quà"

  const BuocHoc = () =>
    dsHoc.length > 0 && (
      <Card padding="p-3">
        <SectionTitle icon={<MdMenuBook size={16} />} className="!mb-1.5">
          Bài học ({dsHoc.filter((h) => Number(h.daHoc) === 1).length}/{dsHoc.length})
        </SectionTitle>
        {dsHoc.map((h, i) => (
          <button
            key={h.id}
            type="button"
            onClick={() => {
              setHocIdx(i)
              setBuoc("hoc")
            }}
            className="flex w-full items-center gap-2 border-0 border-t border-[#edf0f5] bg-transparent px-1 py-2 text-left first:border-t-0"
          >
            {Number(h.daHoc) === 1 ? (
              <MdCheckCircle size={18} className="shrink-0 text-[#1f8a4c]" />
            ) : (
              <MdRadioButtonUnchecked size={18} className="shrink-0 text-slate-300" />
            )}
            <span className="min-w-0 flex-1 text-[13px] text-slate-600">{h.tenBai}</span>
            <span className="shrink-0 text-[12px] font-semibold text-primary">{Number(h.daHoc) === 1 ? "Xem lại" : "Học"}</span>
          </button>
        ))}
      </Card>
    )

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-slate-50"
    >
      <AppHeader title={tieuDe} onBack={quayLai} />

      <div className="flex flex-col gap-3 px-4 pt-3" style={{ minHeight: "calc(100vh - 120px)" }}>
        {loading && <LoadingSpinner />}
        {!loading && !!error && <EmptyState title="Không mở được bài" desc={error} />}

        {/* Bài học riêng (không có bài kiểm tra) */}
        {!loading && !!baiHocRieng && (
          <LessonContent khId={khId} baiHocId={baiHocRieng} onDone={xongBaiHocRieng} dangLuu={dangLuu} />
        )}

        {!loading && !error && bai && (
          <>
            {/* Tên bài + thưởng (ẩn khi đang làm bài cho gọn) */}
            {buoc !== "lam" && (
              <Card>
                <div className="text-[14px] font-semibold leading-snug text-slate-700">{bai.tenBai}</div>
                {!!bai.thuong && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-[#fff8f0] px-2.5 py-2 text-[12px] text-[#9a5a00]">
                    <FaGift size={13} className="mt-0.5 shrink-0" />
                    <span className="min-w-0">Phần thưởng: {bai.thuong}</span>
                  </div>
                )}
              </Card>
            )}

            {buoc === "hoc" && dsHoc[hocIdx] && (
              <LessonContent
                key={dsHoc[hocIdx].id}
                khId={khId}
                baiHocId={dsHoc[hocIdx].id}
                daHoc={dsHoc[hocIdx].daHoc}
                buoc={`Bài học ${hocIdx + 1}/${dsHoc.length}`}
                onDone={xongBaiHoc}
                dangLuu={dangLuu}
              />
            )}

            {buoc === "batdau" && (
              <>
                <BuocHoc />
                <Card>
                  <SectionTitle icon={<MdQuiz size={16} />} className="!mb-1">
                    Bài kiểm tra
                  </SectionTitle>
                  <InfoRow label="Số câu hỏi" value={bai.tongcauhoi} divider={false} />
                  <InfoRow label="Cần trả lời đúng" value={`${Number(bai.socaucandat) > 0 ? bai.socaucandat : bai.tongcauhoi} câu`} />
                  {Number(bai.thoigianlambai) > 0 && <InfoRow label="Thời gian làm bài" value={`${bai.thoigianlambai} phút`} />}
                  <InfoRow label="Số lần đã làm" value={`${bai.soLanDaLam}/${bai.soLanToiDa}`} />
                  <InfoRow label="Hạn làm bài" value={fmtNgay(bai.denNgay)} />
                </Card>
                <div
                  className="sticky bottom-0 -mx-4 mt-auto border-t border-[#e6ebf2] bg-white px-4 pt-3"
                  style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
                >
                  <Button full disabled={!conLuot || dangLuu} onClick={batDauLam}>
                    {dangLuu ? "Đang tải câu hỏi..." : conLuot ? "Bắt đầu trả lời câu hỏi" : "Bạn đã hết lượt làm bài"}
                  </Button>
                </div>
              </>
            )}

            {buoc === "lam" && cauHoi.length > 0 && (
              <QuizView cauHoi={cauHoi} phut={bai.thoigianlambai} dangNop={dangLuu} onSubmit={nop} />
            )}

            {buoc === "ketqua" && (
              <>
                <Card tone={dat ? "success" : "danger"} className="text-center">
                  <div className="text-[13px] text-slate-600">{ketQua ? "Kết quả bài làm" : "Bạn đã hoàn thành bài kiểm tra"}</div>
                  {ketQua && (
                    <div className="mt-1 text-[28px] font-bold tabular-nums text-slate-700">
                      {ketQua.soCauDung}/{ketQua.tongSoCau}
                      <span className="ml-1 text-[13px] font-medium text-slate-500">câu đúng</span>
                    </div>
                  )}
                  <div className="mt-1.5">
                    <StatusBadge tone={dat ? "success" : "danger"}>{dat ? "Đạt" : "Chưa đạt"}</StatusBadge>
                  </div>
                  {!dat && (
                    <div className="mt-2 text-[12px] text-slate-500">
                      Cần đúng {Number(bai.socaucandat) > 0 ? bai.socaucandat : bai.tongcauhoi} câu để nhận quà.
                      {conLuot ? " Bạn có thể xem lại bài học và làm lại." : " Bạn đã hết lượt làm bài."}
                    </div>
                  )}
                </Card>

                {dat && thuong && Number(thuong.laVongQuay) === 1 && (
                  <Card>
                    <SectionTitle icon={<FaGift size={14} />}>Vòng quay may mắn</SectionTitle>
                    {(thuong.choChon || []).length > 0 ? (
                      <div className="flex flex-col gap-2.5">
                        {thuong.choChon.map((c) => (
                          <ChonQua key={c.ketQuaId} cho={c} dangChon={dangChon} onChon={chon} />
                        ))}
                      </div>
                    ) : (
                      <RewardWheel dsO={thuong.dsO || []} conLai={Number(thuong.conLai) || 0} onQuay={quay} onKetQua={sauKhiQuay} />
                    )}
                  </Card>
                )}

                {dat && (thuong?.dsPhieu || []).length > 0 && (
                  <Card>
                    <SectionTitle icon={<FaGift size={14} />}>Phiếu thưởng đã nhận</SectionTitle>
                    <DsPhieu ds={thuong.dsPhieu} />
                  </Card>
                )}

                {dat && (!thuong || (Number(thuong.laVongQuay) !== 1 && !(thuong.dsPhieu || []).length)) && (
                  <Card tone="info" className="text-[13px] text-slate-600">
                    Bạn đã đạt bài kiểm tra. Phiếu thưởng sẽ hiện trong mục Phiếu trả thưởng khi được ghi nhận.
                  </Card>
                )}

                {/* xem lại bài học (đã đạt vẫn xem được) */}
                <BuocHoc />

                <div
                  className="sticky bottom-0 -mx-4 mt-auto flex gap-2.5 border-t border-[#e6ebf2] bg-white px-4 pt-3"
                  style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
                >
                  {dat ? (
                    <Button full variant="outline" onClick={moPhieuThuong}>
                      Xem phiếu trả thưởng
                    </Button>
                  ) : conLuot ? (
                    <Button full onClick={() => setBuoc("batdau")}>
                      Làm lại
                    </Button>
                  ) : (
                    <Button full variant="ghost" onClick={() => zmp.views.current.router.back()}>
                      Quay lại
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Page>
  )
}

export default ElearningBai
