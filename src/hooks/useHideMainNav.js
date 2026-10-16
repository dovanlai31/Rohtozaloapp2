import { useEffect } from "react"
import { zmp } from "zmp-framework/react"

// Ẩn thanh menu dưới (#main-nav) khi đang mở bảng trượt, để nút cuối bảng không bị che. Đóng bảng thì hiện lại.
export const useHideMainNav = (visible) => {
  useEffect(() => {
    if (!visible) return
    zmp.toolbar.hide("#main-nav")
    return () => {
      zmp.toolbar.show("#main-nav")
    }
  }, [visible])
}
