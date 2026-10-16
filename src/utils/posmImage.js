import { chooseImage } from "zmp-sdk/apis"

const MAX_BYTES = 1024 * 1024 // tối đa 1MB/ảnh
const MAX_SIDE = 1600

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

// Nén ảnh thành base64 jpeg <= 1MB, đóng dấu thời gian + mã KH ở góc dưới
const compressToBase64 = async (src, stampText) => {
  const img = await loadImage(src)
  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0, w, h)

  if (stampText) {
    const fontSize = Math.max(16, Math.round(w / 40))
    ctx.font = `bold ${fontSize}px sans-serif`
    const pad = Math.round(fontSize / 2)
    const textW = ctx.measureText(stampText).width
    ctx.fillStyle = "rgba(0,0,0,0.45)"
    ctx.fillRect(w - textW - pad * 2, h - fontSize - pad * 2, textW + pad * 2, fontSize + pad * 2)
    ctx.fillStyle = "#fff"
    ctx.textBaseline = "bottom"
    ctx.fillText(stampText, w - textW - pad, h - pad)
  }

  let quality = 0.85
  let data = canvas.toDataURL("image/jpeg", quality)
  // base64 dài hơn file gốc ~4/3
  while (data.length * 0.75 > MAX_BYTES && quality > 0.3) {
    quality -= 0.15
    data = canvas.toDataURL("image/jpeg", quality)
  }
  return data
}

const stampNow = (maKH) => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, "0")
  const time = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
  return maKH ? `${time} - ${maKH}` : time
}

// Mở camera chụp 1 ảnh POSM (chỉ camera, không chọn từ thư viện)
// Trả về { preview, base64 } hoặc null nếu người dùng huỷ
export const capturePosmImage = (maKH) =>
  new Promise((resolve, reject) => {
    chooseImage({
      sourceType: ["camera"],
      cameraType: "back",
      count: 1,
      success: async ({ filePaths }) => {
        const path = filePaths?.[0]
        if (!path) return resolve(null)
        try {
          const base64 = await compressToBase64(path, stampNow(maKH))
          resolve({ preview: base64, base64 })
        } catch (e) {
          reject(e)
        }
      },
      fail: (err) => {
        // -2003: người dùng huỷ
        if (String(err?.code) === "-2003") return resolve(null)
        reject(err)
      },
    })
  })
