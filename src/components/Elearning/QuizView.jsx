import { Button, Card } from "@components/ui"
import { linkFile } from "@utils/elearning"
import { useEffect, useRef, useState } from "react"
import { MdCheck, MdTimer } from "react-icons/md"
import { zmp } from "zmp-framework/react"

const anhCauHoi = (q) => {
  const p = String(q.hinhAnh || "").trim()
  if (!p) return ""
  if (/^https?:\/\//i.test(p)) return p
  return q.linkUrl ? `${String(q.linkUrl).replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}` : linkFile(p)
}

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

/**
 * Làm bài kiểm tra: từng câu một, chọn 1 đáp án (loai "1") hoặc nhiều đáp án.
 * phut > 0: đếm ngược, hết giờ tự nộp. onSubmit(chon) với chon = { [cauHoiId]: [dapAnId] }.
 */
const QuizView = ({ cauHoi, phut = 0, dangNop, onSubmit }) => {
  const [idx, setIdx] = useState(0)
  const [chon, setChon] = useState({})
  const [conGiay, setConGiay] = useState(Number(phut) > 0 ? Number(phut) * 60 : 0)
  const daNop = useRef(false)
  const chonRef = useRef(chon)
  chonRef.current = chon

  const nop = (c) => {
    if (daNop.current) return
    daNop.current = true
    onSubmit(c)
  }

  useEffect(() => {
    if (!(Number(phut) > 0)) return
    const t = setInterval(() => {
      setConGiay((s) => {
        if (s <= 1) {
          clearInterval(t)
          zmp.toast.create({ text: "Hết giờ, hệ thống tự nộp bài", position: "center", closeTimeout: 2000 }).open()
          nop(chonRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!dangNop) daNop.current = false
  }, [dangNop])

  const q = cauHoi[idx]
  const motDapAn = String(q?.loai) === "1"
  const daChon = chon[q?.id] || []
  const soDaTraLoi = cauHoi.filter((x) => (chon[x.id] || []).length > 0).length
  const cuoi = idx === cauHoi.length - 1

  const chonDapAn = (dapAnId) => {
    const cu = chon[q.id] || []
    const moi = motDapAn ? [dapAnId] : cu.includes(dapAnId) ? cu.filter((x) => x !== dapAnId) : [...cu, dapAnId]
    setChon({ ...chon, [q.id]: moi })
  }

  const xacNhanNop = () => {
    const thieu = cauHoi.length - soDaTraLoi
    zmp.dialog
      .create({
        title: "Nộp bài",
        content: `<div class="dialog-text">${
          thieu > 0 ? `Bạn còn <b>${thieu}</b> câu chưa trả lời. ` : ""
        }Bạn chắc chắn muốn nộp bài?</div>`,
        buttons: [{ text: "Làm tiếp" }, { text: "Nộp bài", bold: true, onClick: () => nop(chon) }],
      })
      .open()
  }

  if (!q) return null
  const anh = anhCauHoi(q)

  return (
    <div className="flex flex-col gap-3">
      {/* Tiến độ */}
      <Card padding="px-3.5 py-2.5">
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <span>
            Câu <b className="text-slate-700">{idx + 1}</b>/{cauHoi.length} · đã trả lời {soDaTraLoi}
          </span>
          {Number(phut) > 0 && (
            <span className={`flex items-center gap-1 font-semibold tabular-nums ${conGiay <= 60 ? "text-[#e5232a]" : "text-primary"}`}>
              <MdTimer size={15} /> {mmss(conGiay)}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cauHoi.map((x, i) => {
            const xong = (chon[x.id] || []).length > 0
            return (
              <button
                key={x.id}
                type="button"
                onClick={() => setIdx(i)}
                className={`h-7 w-7 rounded-full border text-[11px] font-semibold ${
                  i === idx
                    ? "border-primary bg-primary text-white"
                    : xong
                    ? "border-[#bcd3ee] bg-[#e7effa] text-primary"
                    : "border-[#E3EBF6] bg-white text-slate-500"
                }`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Câu hỏi */}
      <Card>
        <div className="text-[11px] font-semibold text-primary">{motDapAn ? "Chọn một đáp án" : "Chọn một hoặc nhiều đáp án"}</div>
        <div className="mt-1 whitespace-pre-line text-[14px] font-semibold leading-snug text-slate-700">{q.noiDung}</div>
        {!!anh && <img src={anh} alt="" className="mt-2.5 block max-h-[40vh] w-full rounded-lg object-contain" />}

        <div className="mt-3 flex flex-col gap-2">
          {(q.dapAn || []).map((a, i) => {
            const on = daChon.includes(a.id)
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => chonDapAn(a.id)}
                className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left ${
                  on ? "border-primary bg-[#f3f8fd]" : "border-[#E3EBF6] bg-white active:bg-[#f7faff]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-bold ${
                    motDapAn ? "rounded-full" : "rounded-md"
                  } ${on ? "border-primary bg-primary text-white" : "border-[#c5d3e6] bg-white text-slate-400"}`}
                >
                  {on ? <MdCheck size={13} /> : String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0 text-[13px] leading-snug text-slate-600">{a.noiDung}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <div
        className="sticky bottom-0 -mx-4 flex gap-2.5 border-t border-[#e6ebf2] bg-white px-4 pt-3"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Button variant="ghost" className="flex-1" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          Câu trước
        </Button>
        {cuoi ? (
          <Button className="flex-1" disabled={dangNop} onClick={xacNhanNop}>
            {dangNop ? "Đang nộp..." : "Nộp bài"}
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setIdx(idx + 1)}>
            Câu tiếp
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuizView
