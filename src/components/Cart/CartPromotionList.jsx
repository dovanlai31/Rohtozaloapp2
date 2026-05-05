import React from "react"
import { Box, Text } from "zmp-framework/react"
import RowItemKMBanhang from "@components/Cart/RowItemKMBanhang"

const CartPromotionList = ({ 
  datakm, 
  appKm, 
  setIsShowModalKm, 
  updateGiohang, 
  tinhtien, 
  updateItemKM ,
  handleShowvongQuay

}) => {
  if (datakm.length > 0) {
    return (
      <Box className="bg-white rounded-xl mt-4 shadow-sm overflow-hidden">
        <Box className="border-b border-gray-100 p-3">
          <Text className="text-[13px] font-bold text-[#2d5bb9] uppercase m-0">Khuyến Mãi</Text>
          <Text className="text-xs text-gray-500 m-0 mt-1">Khuyến mãi áp dụng cho đơn hàng</Text>
        </Box>
        {datakm.map((item, index) => (
          <RowItemKMBanhang
            setIsShowModalKm={setIsShowModalKm}
            key={index}
            item={item}
            index={index}
            length={datakm.length}
            updateGiohang={(a) => updateGiohang(a)}
            tinhtien={() => tinhtien()}
            updateItemKM={(km) => updateItemKM(km)}
            handleShowvongQuay={handleShowvongQuay}
          />
        ))}
      </Box>
    )
  }
  
  if (!appKm) {
    return (
      <Box className="bg-white rounded-xl mt-4 shadow-sm p-4 flex justify-center items-center">
        <Text className="text-[13px] text-gray-500 m-0">Không có khuyến mãi áp dụng</Text>
      </Box>
    )
  }

  return null
}

export default CartPromotionList
