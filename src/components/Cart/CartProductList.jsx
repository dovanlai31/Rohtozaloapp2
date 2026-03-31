import React from "react"
import { Box, Button, Text, Link } from "zmp-framework/react"
import { FaPlus } from "react-icons/fa"
import CardItemRow from "@components/Cart/CardItemRow"

const CartProductList = ({ 
  Giohang, 
  ViewMore, 
  updateViewMore, 
  updateGiohang, 
  updateAppKm, 
  updateDatakm, 
  tinhtien 
}) => {
  return (
    <Box>
      <Box className="flex justify-between items-center mb-3 mt-4 ">
        <Box className="flex items-center gap-2 m-0">
          <Box className="w-1 h-4 bg-[#2d5bb9] rounded-[4px] m-0"></Box>
          <Text className="text-[16px] font-bold text-[#2d5bb9] m-0">
            Danh sách sản phẩm
          </Text>
        </Box>
        <Link
          href="/search"
          className="flex items-center justify-center bg-[#f0f4ff] border border-[#d2dff6] rounded-md w-[28px] h-[28px]"
        >
          <FaPlus className="text-[#2d5bb9]" size={16} />
        </Link>
      </Box>

      {/* Product Items List Component */}
      <Box className="flex flex-col gap-3 m-0">
        {Giohang.map((item, index) => {
          if (index < 3) {
            return (
              <Box
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm m-0"
              >
                <CardItemRow
                  item={item}
                  index={index}
                  ViewMore={ViewMore}
                  updateGiohang={(a) => {
                    updateAppKm(true)
                    updateGiohang(a)
                  }}
                  Refeshkm={() => {
                    updateAppKm(true)
                    updateDatakm([])
                  }}
                  tinhtien={() => tinhtien()}
                  length={Giohang.length}
                />
              </Box>
            )
          } else {
            if (index === 3 && !ViewMore)
              return (
                <Box key="viewmore" className="flex justify-center mt-1">
                  <Button
                    onClick={() => updateViewMore(true)}
                    className="bg-[#f0f4ff] border border-[#d2dff6] rounded-xl py-2 px-8"
                  >
                    <Text className="text-[13px] font-semibold text-[#2d5bb9] m-0">
                      Xem thêm {Giohang.length - 3} sản phẩm
                    </Text>
                  </Button>
                </Box>
              )
            if (ViewMore)
              return (
                <Box
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <CardItemRow
                    item={item}
                    index={index}
                    ViewMore={ViewMore}
                    updateGiohang={(a) => updateGiohang(a)}
                    tinhtien={() => tinhtien()}
                    length={Giohang.length}
                  />
                </Box>
              )
          }
        })}
      </Box>
    </Box>
  )
}

export default CartProductList
