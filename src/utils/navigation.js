import { zmp } from "zmp-framework/react"

/**
 * Chuyển sang tab Giỏ hàng từ một trang con (chi tiết SP, chi tiết khuyến mãi, tìm kiếm...).
 * Đưa view hiện tại về trang gốc của tab bằng MỘT lệnh (back về history[0], force, không hiệu ứng)
 * rồi mới đổi tab. Không gọi back / clearPreviousHistory / navigate nối nhau: router zmp không cho
 * chuyển trang khi đang chạy hiệu ứng, gọi chồng sẽ làm kẹt router của tab (bấm lại tab không vào được).
 */
export const goToCartTab = () => {
  try {
    const router = zmp.views.current?.router
    const history = router?.history || []
    if (history.length > 1) router.back(history[0], { force: true, animate: false })
  } catch (e) {
    console.log("goToCartTab back fail", e)
  }
  try {
    zmp.toolbar.show("#main-nav")
  } catch (e) {}
  setTimeout(() => {
    try {
      zmp.tab.show("#view-giohang")
    } catch (e) {
      console.log("open cart tab fail", e)
    }
  }, 80)
}
