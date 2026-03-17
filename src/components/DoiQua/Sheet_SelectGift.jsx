import React, { useRef, useState } from "react"
import { Button, Sheet, Text, Box, Page, Icon, List, Checkbox } from "zmp-ui"
import { AiFillFire, AiFillSketchCircle, AiOutlineCheckSquare } from "react-icons/ai"
import { formatCurrency } from "@utils/networking"
import { Card } from "zmp-framework/react"
const Sheet_SelectGift = ({
  SheetGiftVisible,
  setSheetGiftVisible,
  dataList,
  dataListChose,
  saveDataChose,
  setChose,
  xu_diem,
}) => {
  return (
    <Sheet
      visible={SheetGiftVisible}
      onClose={() => setSheetGiftVisible(false)}
      height={"auto"}
      mask
      handler
      title="Chọn các quà tặng"
      swipeToClose
    >
      <Box p="5" className="custom-bottom-sheet" flex flexDirection="column">
        <Box m="0" style={{ height: "400px", overflowY: "scroll" }}>
          <Box m="0" className="detail-page" style={{}}>
            {dataList &&
              dataList.map((g, index) => {
                let isValid = xu_diem >= (g?.tumuc || 0)

                return (
                  <span onClick={() => isValid && setChose("", index)} key={index}>
                    <Card
                      inset
                      className={`${
                        !isValid && "item-donhang-card-disabled relative"
                      }`}
                    >
                      <Box
                        m={0}
                        flex
                        justifyContent="space-between"
                        mt={1}
                        key={index}
                        className="list-item-donhang"
                      >
                        <Box className="list-icon2" style={{ width: "20%" }}>
                          <img
                            loading="lazy"
                            className="doiquarow-img"
                            src={
                              g?.HinhAnh || g?.hinhanh
                                ? encodeURI(g?.HinhAnh || g?.hinhanh)
                                : "https://dms1.imexpharm.com:9443/AnhSanPham/NOIMAGEGESO.png"
                            }
                          />
                          {/* <img className="giohang-img"
                        style={{ width: 55, height: 55, }} src={icongif2}></img> */}
                        </Box>
                        <Box p={3} style={{ width: "75%" }}>
                          <Text.Header className="item-text ">
                            {g.ten.toLocaleUpperCase()}
                          </Text.Header>
                          <Text bold size="small" className="item-text ">
                            {g.thongtin}
                          </Text>
                          <Text bold size="small" className="item-text color-gia">
                            Điểm/Xu: {formatCurrency(g.gia, true)}
                          </Text>
                        </Box>
                        <Box style={{ width: "12%" }}>
                          <Checkbox checked={!!g.isChose}></Checkbox>
                        </Box>
                      </Box>
                    </Card>
                  </span>
                )
              })}
          </Box>
        </Box>
        <Box flex flexDirection="row" mt={1}>
          <Box style={{ flex: 1 }} pl={1}>
            <Button
              fullWidth
              onClick={() => {
                saveDataChose()
              }}
            >
              Lưu chọn
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

export default Sheet_SelectGift
