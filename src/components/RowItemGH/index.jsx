import store from "../../store"

import React, { useState, useEffect, forwardRef, useRef } from "react"
import {
  Page,
  Card,
  Box,
  Text,
  Button,
  zmp,
  Icon,
  Title,
  List,
  ListItem,
  Link,
} from "zmp-framework/react"
import "./../../styles/giohang.scss"
import icongiohang from "@static/images/shoppingbag.png"
import { formatCurrency } from "@utils/networking"
import Color from "@components/common/Color"

const RowItemGH = forwardRef((data, ref) => {
  const elRef = useRef(null)
  const { item, index, updateGiohang, tinhtien, length, ViewMore } = data
  const Giohang = store.getters.getGioHang.value || []
  const [soluong, updateItem] = useState(data.item.soluong)

  useEffect(() => {
    console.log("xxxx", item + " - ")
    updateItem(data.item.soluong)
  }, [item.soluong])

  const setSoluongsp = (sl, id) => {
    // let arrr =[].findIndex
    let a = item
    a.soluong = sl
    updateItem(sl)
    store.dispatch("updateGiohang", a)
    tinhtien()
  }

  const deleteP = (id) => {
    let arr = Giohang.filter((w) => w.id != id)
    updateGiohang(arr)
    store.dispatch("remoteItemGioHang", id)
  }

  console.log(item)

  return (
    <Box
      m="0"
      //className="shadow-md"
      key={index}
      style={{
        borderBottomColor:
          index == length - 1 || (!ViewMore && index == 2) ? "white" : "#eeee",
      }}
    >
      <Box flex alignItems="center" style={{ width: "100%", gap: 12 }}>
        <Box
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: "80px",
            height: "80px",
            objectFit: "cover",
            boxShadow: "0 0 0 1px #99a3ad2a",
          }}
        >
          <Box
            className="bg-cover"
            style={{
              backgroundImage: `url(${item.HinhAnh})`,
              width: "60px",
              height: "60px",
              objectFit: "cover",
              backgroundSize: "cover",
            }}
          />
        </Box>

        <Box p="0" style={{ width: "80%", margin: 0 }}>
          <Box className="w-10/12 mx-1 mt-2">
            <Text
              className="font-extrabold text-blue-imex "
              style={{
                width: "100%",
                fontSize: "13px",
                color: Color.textAPPBlack,
              }}
            >
              {item.title ? item.title : item?.ten}
            </Text>
            <Text
              className=""
              style={{
                fontSize: "11px",
                width: "100%",
                color: "#333",
              }}
            >
              Mã: {item?.ma}
            </Text>
          </Box>
          <Box
            className="w-10/12 mx-1 mt-2"
            p="0"
            flex
            flexDirection="column"
            style={{}}
          >
            {/* <Box
              className="w-full m-0 px-1"
              flex
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                size="small"
                style={{ color: Color.textAPPGray, fontSize: "13px" }}
              >
                Đơn Giá
              </Text>
              <Text
                style={{ color: Color.textAPPGray, fontSize: "13px" }}
                size="small"
              >
                {formatCurrency(item.dongia)}
              </Text>
            </Box> */}
            <Box
              className="w-full m-0 p-0 rounded"
              style={{ gap: "30%" }}
              flex
              alignItems="center"
            >
              <Text
                size="small"
                style={{ color: Color.textAPPBlack, fontSize: "13px" }}
              >
                Số lượng
              </Text>
              <Text
                size="small"
                style={{ color: Color.textAPPBlack, fontSize: "13px" }}
                className="font-semibold"
              >
                {formatCurrency(soluong, true)}
              </Text>
            </Box>
            {/* <Box
              className="w-full m-0 mt-1 px-1"
              flex
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                size="small"
                style={{ color: Color.textAPPGray, fontSize: "13px" }}
              >
                Chiết khấu
              </Text>
              <Text style={{ color: Color.textAPPGray, fontSize: "13px" }}>
                {item?.cksp || 1} %
              </Text>
            </Box> */}
            {/* <Box
              className="w-full m-0 mt-1 p-1 "
              style={{ backgroundColor: "#adb1b46b" }}
              flex
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                size="small"
                style={{ color: Color.textAPPGray, fontSize: "13px" }}
                className="font-semibold"
              >
                Thành tiền
              </Text>
              <Text
                size="small"
                style={{ color: Color.textAPPBlack, fontSize: "13px" }}
                className="font-semibold"
              >
                {formatCurrency(Number(soluong) * Number(item.dongia))}
              </Text>
            </Box> */}
          </Box>
        </Box>
      </Box>
      <Box
        m={0}
        p={0}
        style={{
          width: "100%",
          height: "5px",
          // backgroundColor: 'red',

          paddingBottom: "10px",
          WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
          boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
        }}
        className="BoxLine"
      ></Box>
    </Box>
  )
})
export default RowItemGH
