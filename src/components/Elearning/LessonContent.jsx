import LoadingSpinner from "@components/LoadingSpinner"
import { Button, Card, EmptyState } from "@components/ui"
import { duoiFile, laAnh, laVideo, linkFile, linkXemFile, youtubeId } from "@utils/elearning"
import { useEffect, useMemo, useState } from "react"
import { MdCheckCircle, MdDescription, MdOpenInNew, MdPlayCircle } from "react-icons/md"
import { zmp } from "zmp-framework/react"
import { openWebview } from "zmp-sdk/apis"
import { getBaiHoc } from "../../services/elearningService"

const YOUTUBE_GIAY = 20 // youtube không biết lúc xem hết: cho xác nhận sau 20 giây

const boTheHtml = (s) =>
  String(s || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()

// Gom tất cả nội dung của bài học thành danh sách mục: video / youtube / ảnh / tài liệu
const dsNoiDung = (bai) => {
  const files = bai?.Files || {}
  const ds = []
  ;[...(files.Loai1 || []), ...(files.Loai2 || []), ...(files.Loai3 || [])].forEach((f, i) => {
    const url = linkFile(f.LinkFile || f.FileDinhKem)
    if (!url) return
    const yt = youtubeId(url) || youtubeId(f.FileDinhKem)
    const ten = f.FileDinhKem || ""
    const loai = yt ? "youtube" : laVideo(url) || laVideo(ten) ? "video" : laAnh(url) || laAnh(ten) ? "anh" : "file"
    ds.push({ key: `${loai}_${i}`, loai, url, yt, ten })
  })
  // bỏ trùng link
  return ds.filter((x, i) => ds.findIndex((y) => y.url === x.url) === i)
}

/**
 * Nội dung 1 bài học. onDone() khi khách bấm "Đã học xong" (chỉ bấm được khi đã xem hết:
 * video mp4 phát đến hết, tài liệu đã mở, youtube xem tối thiểu 20 giây).
 */
const LessonContent = ({ khId, baiHocId, daHoc, buoc, onDone, dangLuu }) => {
  const [bai, setBai] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [daXem, setDaXem] = useState({})
  const [giay, setGiay] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError("")
    setDaXem({})
    setGiay(0)
    getBaiHoc(khId, baiHocId)
      .then((d) => alive && setBai(d))
      .catch((e) => alive && setError(e.message || "Không tải được bài học"))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [baiHocId])

  const noiDung = useMemo(() => dsNoiDung(bai), [bai])
  const coYoutube = noiDung.some((x) => x.loai === "youtube")

  useEffect(() => {
    if (!coYoutube) return
    const t = setInterval(() => setGiay((g) => g + 1), 1000)
    return () => clearInterval(t)
  }, [coYoutube, baiHocId])

  const xem = (key) => setDaXem((d) => (d[key] ? d : { ...d, [key]: true }))

  const conLai = noiDung.filter((x) => {
    if (x.loai === "anh") return false
    if (x.loai === "youtube") return giay < YOUTUBE_GIAY
    return !daXem[x.key]
  })
  const xemXong = Number(daHoc) === 1 || conLai.length === 0

  const moTaiLieu = (x) => {
    xem(x.key)
    openWebview({ url: linkXemFile(x.url), config: { style: "normal", leftButton: "back" } }).catch(() => {
      zmp.toast.create({ text: "Không mở được tài liệu", position: "center", closeTimeout: 2000 }).open()
    })
  }

  if (loading) return <LoadingSpinner />
  if (error || !bai) return <EmptyState title="Không tải được bài học" desc={error} />

  const moTa = boTheHtml(bai.MoTa)

  return (
    <div className="flex flex-col gap-3">
      <Card>
        {buoc && <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">{buoc}</div>}
        <div className="text-[15px] font-semibold leading-snug text-slate-700">{bai.TenBaiHoc}</div>
        {!!moTa && <div className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-slate-600">{moTa}</div>}
      </Card>

      {!noiDung.length && <EmptyState title="Bài học chưa có nội dung đính kèm" />}

      {noiDung.map((x) => (
        <Card key={x.key} padding="p-0" className="overflow-hidden">
          {x.loai === "video" && (
            <video
              src={x.url}
              controls
              playsInline
              preload="metadata"
              className="block w-full bg-black"
              style={{ maxHeight: "60vh" }}
              onEnded={() => xem(x.key)}
            />
          )}

          {x.loai === "youtube" && (
            <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
              <iframe
                title={x.ten || "video"}
                src={`https://www.youtube.com/embed/${x.yt}?playsinline=1&rel=0`}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {x.loai === "anh" && <img src={x.url} alt={x.ten} className="block w-full bg-white object-contain" />}

          {x.loai === "file" && (
            <button
              type="button"
              onClick={() => moTaiLieu(x)}
              className="flex w-full items-center gap-3 border-0 bg-white p-3 text-left active:bg-[#f7faff]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef4fb] text-primary">
                <MdDescription size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-slate-700">{x.ten || "Tài liệu"}</span>
                <span className="block text-[11px] uppercase text-slate-400">{duoiFile(x.url) || "file"}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-primary">
                {daXem[x.key] ? "Xem lại" : "Mở"} <MdOpenInNew size={15} />
              </span>
            </button>
          )}

          {x.loai !== "anh" && (
            <div className="flex items-center gap-1.5 border-t border-[#edf0f5] px-3 py-2 text-[12px]">
              {(x.loai === "youtube" ? giay >= YOUTUBE_GIAY : daXem[x.key]) || Number(daHoc) === 1 ? (
                <span className="flex items-center gap-1 text-[#1f7a45]">
                  <MdCheckCircle size={15} /> Đã xem
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500">
                  <MdPlayCircle size={15} />
                  {x.loai === "video"
                    ? "Xem hết video để tiếp tục"
                    : x.loai === "youtube"
                    ? `Xem video (${Math.max(0, YOUTUBE_GIAY - giay)} giây)`
                    : "Mở tài liệu để xem"}
                </span>
              )}
            </div>
          )}
        </Card>
      ))}

      <div
        className="sticky bottom-0 -mx-4 border-t border-[#e6ebf2] bg-white px-4 pt-3"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Button full disabled={!xemXong || dangLuu} onClick={() => xemXong && onDone()}>
          {dangLuu ? "Đang lưu..." : xemXong ? "Đã học xong" : "Xem hết nội dung để tiếp tục"}
        </Button>
      </div>
    </div>
  )
}

export default LessonContent
