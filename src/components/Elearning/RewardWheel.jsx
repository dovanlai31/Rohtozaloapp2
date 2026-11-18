import { Button } from "@components/ui"
import { useRef, useState } from "react"

// Màu ô: dịu, xen kẽ (theo DESIGN.md, không dùng màu đậm)
const MAU_O = ["#e7effa", "#fff1de", "#e3f4ea", "#fdecec", "#eef0fb", "#fdf6d8"]
const QUAY_MS = 4200

const catDong = (s, max = 16) => {
  const t = String(s || "").trim()
  if (t.length <= max) return [t]
  let cat = t.lastIndexOf(" ", Math.min(max, Math.floor(t.length / 2) + 4))
  if (cat < 4) cat = max
  const d2 = t.slice(cat).trim()
  return [t.slice(0, cat).trim(), d2.length > max ? d2.slice(0, max - 1) + "…" : d2]
}

/**
 * Vòng quay may mắn E-learning. Server chọn ô trúng (ELN_VongQuay_Quay) rồi vòng quay chạy tới đúng ô đó.
 * dsO: [{ id, thutu, diengiai }]; onQuay(): Promise<{ viTri, ... }> (throw = không quay); onKetQua(kq) sau khi dừng.
 */
const RewardWheel = ({ dsO = [], conLai = 0, onQuay, onKetQua, size = 290 }) => {
  const [dangQuay, setDangQuay] = useState(false)
  const [goc, setGoc] = useState(0)
  const gocRef = useRef(0)

  const n = Math.max(dsO.length, 1)
  const gocO = 360 / n
  const r = size / 2

  const quay = async () => {
    if (dangQuay || conLai <= 0) return
    setDangQuay(true)
    let kq
    try {
      kq = await onQuay()
    } catch (e) {
      setDangQuay(false)
      return
    }
    const viTri = Math.min(Math.max(Number(kq?.viTri) || 0, 0), n - 1)
    // mũi tên ở 12h: đưa giữa ô viTri lên đỉnh, lệch ngẫu nhiên trong ô cho tự nhiên
    const lech = (Math.random() - 0.5) * gocO * 0.6
    const dich = (((360 - (viTri * gocO + gocO / 2) + lech) % 360) + 360) % 360
    const hienTai = ((gocRef.current % 360) + 360) % 360
    let them = dich - hienTai
    if (them <= 0) them += 360
    const moi = gocRef.current + 360 * 5 + them
    gocRef.current = moi
    setGoc(moi)
    setTimeout(() => {
      setDangQuay(false)
      onKetQua && onKetQua(kq)
    }, QUAY_MS + 100)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="h-full w-full rounded-full border-4 border-white"
          style={{
            transform: `rotate(${goc}deg)`,
            transition: dangQuay ? `transform ${QUAY_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)` : "none",
            boxShadow: "0 4px 16px rgba(15,45,90,0.12)",
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
            {dsO.map((o, i) => {
              const a1 = ((i * gocO - 90) * Math.PI) / 180
              const a2 = (((i + 1) * gocO - 90) * Math.PI) / 180
              const giua = i * gocO + gocO / 2 - 90
              const tx = r + r * 0.62 * Math.cos((giua * Math.PI) / 180)
              const ty = r + r * 0.62 * Math.sin((giua * Math.PI) / 180)
              const dong = catDong(o.diengiai || `Ô ${o.thutu}`)
              const lon = gocO > 180 ? 1 : 0
              return (
                <g key={o.id || i}>
                  <path
                    d={
                      n === 1
                        ? `M ${r} 0 A ${r} ${r} 0 1 1 ${r - 0.01} 0 Z`
                        : `M ${r} ${r} L ${r + r * Math.cos(a1)} ${r + r * Math.sin(a1)} A ${r} ${r} 0 ${lon} 1 ${r + r * Math.cos(a2)} ${r + r * Math.sin(a2)} Z`
                    }
                    fill={MAU_O[i % MAU_O.length]}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#334155"
                    transform={`rotate(${giua}, ${tx}, ${ty})`}
                  >
                    {dong.map((d, k) => (
                      <tspan key={k} x={tx} dy={k === 0 ? (dong.length > 1 ? "-6" : "0") : "13"}>
                        {d}
                      </tspan>
                    ))}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* mũi tên */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -10,
            width: 0,
            height: 0,
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
            borderTop: "26px solid #e5232a",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.15))",
          }}
        />
        {/* nút giữa */}
        <button
          type="button"
          onClick={quay}
          disabled={dangQuay || conLai <= 0}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-primary p-0 text-[12px] font-bold text-white shadow-md disabled:opacity-60"
        >
          QUAY
        </button>
      </div>

      <div className="mt-4 w-full">
        <Button full disabled={dangQuay || conLai <= 0} onClick={quay}>
          {dangQuay ? "Đang quay..." : conLai > 0 ? `Quay ngay (còn ${conLai} lượt)` : "Đã hết lượt quay"}
        </Button>
      </div>
    </div>
  )
}

export default RewardWheel
