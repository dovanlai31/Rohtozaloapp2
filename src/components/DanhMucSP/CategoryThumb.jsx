import { useEffect, useState } from "react"

// Màu nền + chữ nhạt cho danh mục không có ảnh (xoay vòng theo vị trí)
const PALETTE = [
  ["#eef4fb", "#005DAA"],
  ["#e9f6f1", "#1f7a55"],
  ["#fdf3e6", "#a8620a"],
  ["#f3effb", "#6b4bb3"],
  ["#fdeeee", "#b23a3a"],
  ["#eaf6fa", "#1c7a96"],
]

// Lấy tối đa 2 chữ cái đầu của tên, vd. "Hada Labo" -> "HL", "V.Rohto" -> "VR"
const initials = (name = "") => {
  const words = String(name)
    .split(/[\s.,\-_/&()+]+/)
    .filter(Boolean)
  if (!words.length) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// Ô ảnh danh mục: có ảnh thì hiện ảnh, không có / lỗi ảnh thì hiện chữ viết tắt
const CategoryThumb = ({ src, name, index = 0, className = "", imgClassName = "", textClassName = "text-base" }) => {
  const [error, setError] = useState(false)
  useEffect(() => setError(false), [src])

  const [bg, fg] = PALETTE[Math.abs(index) % PALETTE.length]
  const hasImg = !!src && !error

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: hasImg ? "#eef4fb" : bg }}
    >
      {hasImg ? (
        <img
          loading="lazy"
          alt={name || ""}
          src={src}
          onError={() => setError(true)}
          className={`h-full w-full object-contain ${imgClassName}`}
        />
      ) : (
        <span className={`font-bold ${textClassName}`} style={{ color: fg }}>
          {initials(name)}
        </span>
      )}
    </span>
  )
}

export default CategoryThumb
