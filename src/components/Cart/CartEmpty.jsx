import React from "react"
import { Box, Button, Text, Link } from "zmp-framework/react"
import opclogo from "@static/images/opclogo.png"

const CartEmpty = () => {
  return (
    <Box className="flex flex-col justify-center items-center h-full pt-[100px] px-4 pb-[200px]">
      <Box className="bg-white rounded-2xl shadow-sm w-full max-w-[320px] p-6 flex flex-col items-center">
        <img src={opclogo} alt="Giỏ hàng trống" className="w-[120px] mb-4" />
        <Text className="text-[16px] font-bold text-[#1a1a1a] m-0 mb-2">Giỏ hàng đang trống</Text>
        <Text className="text-[14px] text-[#8a92a3] m-0 mb-6 text-center">Vui lòng thêm sản phẩm vào giỏ hàng</Text>
        <Link href="/search" className="w-full">
          <Button className="w-full bg-[#2d5bb9] rounded-xl text-white font-bold h-12 m-0 flex justify-center items-center">
            Thêm sản phẩm
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default CartEmpty
