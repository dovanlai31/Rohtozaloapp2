import { request } from "@utils/networking"
import { useEffect, useRef, useState } from "react"
import { zmp } from "zmp-framework/react"
import { openChat } from "zmp-sdk/apis"
import config from "../config"
import store from "../store"

export function useKhachhangPage() {
  const dialog = useRef(null)
  const CusInfo = store.getters.getCusInfo.value || []
  const [loading, setLoading] = useState(true)
  const [dataTichLuy, setDataTichLuy] = useState([])
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const hotline = "02877752275"
  const hotlineText =
    hotline.length > 3 ? `${hotline.slice(0, 3)} ${hotline.slice(3)}` : hotline

  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: `<div className="dialog-text">${msg}</div>`,
      buttons: [{ text: "Đóng" }],
    })
    dialog.current?.open()
  }

  const getTichLuyTham = async () => {
    try {
      const post = await request("POST", "khuyenmai/GetTichLuyTham", {
        userId: String(CusInfo?.KHACHHANG_fk),
      })
      const response = await post.json()
      if (response?.result && response?.message) {
        const list = JSON.parse(response.message)
        setDataTichLuy(Array.isArray(list) ? list : [])
      } else {
        setDataTichLuy([])
      }
    } catch (error) {
      console.log("Lỗi API GetTichLuyTham:", error)
      setDataTichLuy([])
    } finally {
      setLoading(false)
    }
  }

  const openChatScreen = async () => {
    try {
      await openChat({
        type: "oa",
        id: config.OA_ID,
        message: "Xin Chào",
      })
    } catch (error) {
      console.log(error)
      showDialog("Không thể mở màn hình chat. Vui lòng thử lại.")
    }
  }

  const openCallScreen = () => {
    setIsCallModalOpen(true)
  }

  const closeCallModal = () => {
    setIsCallModalOpen(false)
  }

  const confirmCall = () => {
    setIsCallModalOpen(false)
    globalThis.location.href = `tel:${hotline}`
  }

  useEffect(() => {
    getTichLuyTham()
  }, [])

  return {
    CusInfo,
    loading,
    dataTichLuy,
    isCallModalOpen,
    hotlineText,
    openCallScreen,
    closeCallModal,
    confirmCall,
    openChatScreen,
  }
}
