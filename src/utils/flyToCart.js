// Hiệu ứng "bay vào giỏ": ảnh sản phẩm thu nhỏ bay tới biểu tượng giỏ hàng đang hiện trên màn hình
// (tab Giỏ hàng ở thanh menu dưới, hoặc thanh giỏ hàng nổi). Đích đánh dấu bằng thuộc tính data-cart-target.

const reduceMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch (e) {
    return false
  }
}

// Đích đang thấy được: có kích thước, nằm trong màn hình, không bị ẩn
const findTarget = () => {
  const els = Array.from(document.querySelectorAll("[data-cart-target]"))
  const vh = window.innerHeight
  const vw = window.innerWidth
  const visible = els.filter((el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return false
    if (r.bottom < 0 || r.top > vh - 2 || r.right < 0 || r.left > vw) return false
    const st = window.getComputedStyle(el)
    return st.visibility !== "hidden" && st.opacity !== "0"
  })
  // ưu tiên đích thấp nhất (thanh dưới cùng)
  return visible.sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0]
}

export const flyToCart = (imgEl) => {
  if (!imgEl || reduceMotion()) return
  const target = findTarget()
  if (!target) return

  const from = imgEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (from.width === 0) return

  const size = Math.min(64, Math.max(from.width, from.height))
  const ghost = document.createElement("img")
  ghost.src = imgEl.currentSrc || imgEl.src
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "contain",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 6px 18px rgba(15,45,90,0.25)",
    zIndex: 99999,
    pointerEvents: "none",
  })
  if (typeof ghost.animate !== "function") return // WebView cũ không hỗ trợ Web Animations
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  // bay theo đường cong: lên nhẹ rồi rơi xuống đích, thu nhỏ dần
  const anim = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 60}px) scale(0.7)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.6 },
    ],
    { duration: 650, easing: "cubic-bezier(.45,.05,.35,1)" }
  )
  const done = () => {
    ghost.remove()
    // đích nảy nhẹ khi "nhận" sản phẩm
    target.animate?.(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "ease-out" }
    )
  }
  if (anim?.finished) anim.finished.then(done, done)
  else setTimeout(done, 650)
}
