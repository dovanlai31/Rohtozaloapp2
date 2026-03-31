import { request, request3 } from "@utils/networking"

export const cartService = {
  getPhoneNumberByToken: async (token, accessToken) => {
    try {
      const result = await request3(accessToken, token)
      return JSON.parse(result)?.data?.number
    } catch (error) {
      console.log("Error request api getPhoneNumberByToken ", error)
      return null
    }
  },

  applyPromotion: async (params) => {
    try {
      const response = await request("POST", "khachhang/ApKhuyenMaiDonHangNew2", params)
      const json = await response.json()
      return json
    } catch (error) {
      console.log("__request appKhuyenMai api error:", error)
      throw error
    }
  },

  createOrder: async (params) => {
    try {
      const response = await request("POST", "khachhang/TaoMoiDonHangNew2", params)
      const json = await response.json()
      return json
    } catch (error) {
      console.log("__request createOrder api error:", error)
      throw error
    }
  }
}
