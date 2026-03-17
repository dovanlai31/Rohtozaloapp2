import React, { useRef, useState } from "react"
import { Button, Sheet, Text, Box, Page, Icon } from "zmp-ui"
import Color from "@components/common/Color"
import { FaStar } from "react-icons/fa"
import { FaCoins } from "react-icons/fa6";

const Sheet_TypeGift = ({
  setActionSheetVisible,
  actionSheetVisible,
  SheetActions,
}) => {
  return (
    <Sheet
      visible={actionSheetVisible}
      onClose={() => setActionSheetVisible(false)}
      autoHeight
      mask
      handler
      swipeToClose
   
      title="Chọn Đổi Xu/Điểm"
    >
      <Box p={4} className="custom-bottom-sheet" flex flexDirection="column">
        <Box className="bottom-sheet-body" style={{ overflowY: "auto" }}>
          {/* <Text>
          các sản phẩm tương ứng sẽ được tải khi chọn loại điển hoặc Xu
        </Text> */}
          <Box
            style={{ flex: 1, borderBottomWidth: 1, borderColor: "#eeee" }}
            pr={1}
            mb={4}
          >
            <Button
              type="neutral"
              prefixIcon={<FaCoins size={25} color="#016CF5" />}
              fullWidth
              variant="tertiary"
              onClick={() => {
                SheetActions(0)
              }}
            >
              {"Đổi quà từ xu".toLocaleUpperCase()}
            </Button>
          </Box>
          <Box style={{ flex: 1, borderColor: "#eeee" }} pr={1}>
            <Button
              fullWidth
              variant="tertiary"
              type="neutral"
              prefixIcon={<FaStar size={22} color={Color.textAPPRed} />}
              onClick={() => {
                SheetActions(1)
              }}
            >
              {"Đổi quà từ điểm".toLocaleUpperCase()}
            </Button>
          </Box>
        </Box>
        <Box flex flexDirection="row" mt={1}>
          <Box style={{ flex: 1 }} pl={1}>
            <Button
              fullWidth
              onClick={() => {
                setActionSheetVisible(false)
              }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Box>
    </Sheet>

    //   <Sheet.Actions
    //     mask
    //     visible={actionSheetVisible}
    //     title="Chọn Đổi Xu/Điểm"
    //     onClose={() => setActionSheetVisible(false)}
    //     onClick={e=>console.log('xxxxxxxxxxx ','xxxxx'+e)}
    //     swipeToClose
    //     actions={[
    //       [
    //         {key:1, text: "Đổi quà từ điểm".toLocaleUpperCase(), close: true,onClick:()=>console.log('xxxxxxxxx',1) },
    //         {key:2, text: "Đổi quà từ xu".toLocaleUpperCase(), close: true ,onClick:()=>console.log('xxxxxxxxx',2)},
    //         // {
    //         //   text: "Negative Menu",
    //         //   danger: true,
    //         //   close: true,
    //         // },
    //       ],

    //       [{ text: "Cancel", close: true ,danger: true,}],
    //     ]}
    //   />
  )
}

export default Sheet_TypeGift
