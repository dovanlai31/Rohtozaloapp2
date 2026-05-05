import React from "react"
import { Box, Button, Text } from "zmp-framework/react"
import { IoChevronBack, IoTrashOutline } from "react-icons/io5"
import { FaShoppingCart } from "react-icons/fa"
import { formatCurrency } from "@utils/networking"
import LoadingSpinner from "@components/LoadingSpinner"

const CartFooter = ({
  isShowModalKm,
  TongtieKm,
  TongTien,
  loading,
  appKm,
  handleDeleteAll,
  backHome,
  onClickDangnhap,
}) => {
  return (
    <Box
      className={`bg-white border-t border-[#f0f0f0] px-4 pt-4 x w-full z-[999] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] h-full m-0
        transition-transform duration-[350ms] ease-[cubic-bezier(.4,0,.2,1)] ${!isShowModalKm
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
        }`}
    >
      <Box className=" justify-between items-end m-0  ">
        <Box className="flex flex-col gap-1 w-full justify-between items-end m-0 p-0">
          {TongtieKm > 0 && (
            <Box className="flex gap-1 w-full justify-between items-center m-0 p-0">
              <Text className="text-[13px] text-[#8a92a3] m-0">  Khuyến mãi:</Text>
              <Text className="text-[13px] text-[#e74c3c] font-bold m-0">
                -{formatCurrency(TongtieKm, true)}
              </Text>
            </Box>
          )}
        </Box>
        <Box className="flex gap-1 w-full justify-between items-center m-0 p-0">
          <Text className="text-[18px] text-primary font-bold m-0">
          Tổng tiền TT:
          </Text>
          <Text className="text-[18px] font-bold text-primary m-0">
            {formatCurrency(
              TongTien - TongtieKm < 0 ? 0 : TongTien - TongtieKm,
              true
            )}{" "}
            VNĐ
          </Text>
        </Box>

      </Box>

      {loading ? (
        <Box className="flex justify-center py-2">
          <LoadingSpinner />
        </Box>
      ) : (
        <Box className="flex  w-full mx-0 ">
          {/* <Box
            onClick={() => handleDeleteAll()}
            className="w-12 h-12 flex items-center justify-center bg-[#fff0f0] border border-[#ffd5d5] rounded-xl shrink-0 cursor-pointer"
          >
            <IoTrashOutline className="text-[#e74c3c] text-xl" />
          </Box>
          <Box
            onClick={() => backHome()}
            className="w-12 h-12 flex items-center justify-center bg-[#f0f8f0] border border-[#c3e6c3] rounded-xl shrink-0 cursor-pointer"
          >
            <IoChevronBack className="text-[#27ae60] text-xl" />
          </Box> */}
          <Button
            className="flex-1 bg-[#2d5bb9] text-white rounded-xl h-12 m-0 font-bold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(45,91,185,0.25)]"
            onClick={onClickDangnhap}
          >
            <FaShoppingCart size={16} />
            <Text className="text-white text-[14px] m-0">
              {appKm ? "Đặt hàng" : "Xác nhận đặt hàng"}
            </Text>
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default CartFooter
