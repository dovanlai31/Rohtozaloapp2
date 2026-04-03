import React from "react"
import { Box, Text } from "zmp-framework/react"
import { FaBasketShopping } from "react-icons/fa6"

const CartHeader = ({ cartLength, CusInfo }) => {
  return (
    <Box className="bg-white pt-st px-4 shadow-sm m-0 z-[100]" slot="fixed">
      <Box className="flex justify-between items-center m-0 p-0">
        <Box className="flex items-center gap-2">
          <Box className="w-1 h-5 bg-[#2d5bb9] rounded-[4px] ml-0 "></Box>
          <Text className="text-[18px] font-bold text-[#2d5bb9] m-0">Giỏ Hàng</Text>
        </Box>
        <Text className="text-[13px] text-[#8a92a3] m-0">{cartLength} sản phẩm</Text>
      </Box>
    </Box>
  )
}

export default CartHeader
