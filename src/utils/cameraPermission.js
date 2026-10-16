import { checkZaloCameraPermission, requestCameraPermission } from "zmp-sdk/apis"
import { zmp } from "zmp-framework/react"

const showDeniedDialog = () => {
  zmp.dialog
    .create({
      title: "Cần quyền camera",
      content:
        '<div className="dialog-text">Bạn chưa cấp quyền camera cho Zalo. Vui lòng vào <b>Cài đặt</b> của điện thoại, cho phép Zalo dùng camera rồi thử lại.</div>',
      buttons: [{ text: "Đóng" }],
    })
    .open()
}

/**
 * Đảm bảo Zalo có quyền camera trước khi quét QR / chụp ảnh.
 * - Đã có quyền: trả true.
 * - Chưa có: hiện hộp thoại xin quyền của Zalo; đồng ý thì trả true.
 * - Từ chối: báo hướng dẫn mở Cài đặt, trả false.
 * Phiên bản Zalo cũ không hỗ trợ API kiểm tra quyền thì vẫn cho chạy tiếp (trả true)
 * để scanQRCode / chooseImage tự xử lý như trước.
 */
export const ensureCameraPermission = async () => {
  try {
    const { userAllow } = await checkZaloCameraPermission()
    if (userAllow) return true
  } catch (e) {
    console.log("checkZaloCameraPermission fail", e)
    return true
  }

  try {
    const { userAllow } = await requestCameraPermission()
    if (userAllow) return true
  } catch (e) {
    console.log("requestCameraPermission fail", e)
  }

  showDeniedDialog()
  return false
}
