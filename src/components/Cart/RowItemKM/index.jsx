import store from "../../../store"

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
import "./../../../styles/giohang.scss"
import icongiohang from "@static/images/shoppingbag.png"
import { formatCurrency } from "@utils/networking"
import icongif2 from "@static/images/gift.png"
import Color from "@components/common/Color"

const RowItemKM = forwardRef((data, ref) => {
  const elRef = useRef(null)
  const { item, index, updateGiohang, tinhtien, length } = data
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

  return (
    <Box
      p="0"
      m="0"
      key={index}
      style={{
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        background: "linear-gradient(90deg,#f8fafc 60%,#e0e7ff 100%)",
        border: "1px solid #e0e7ff",
        marginBottom: 16,
        transition: "box-shadow 0.2s",
        borderBottomColor: index == length - 1 ? "white" : "#eeee",
        //width: "100%",
      }}
      className="km-item-hover"
    >
      <Box p="0" m="0" flex alignItems="center" style={{ width: "100%", gap: 16 }}>
        <Box p="0" m="2" style={{ width: "100%" }}>
          <Box p="0" m="0" mb="4" flex alignItems="center" style={{ gap: 8 }}>
            <img src={icongif2} alt="gift" style={{ width: 32, height: 32, marginRight: 8 }} />
            <Text
              size="normal"
              className="font-extrabold"
              style={{
                fontSize: "14px",
                color: Color.textAPPGreen2,
                letterSpacing: 0.5,
                flex: 1,
              }}
            >
              {item?.ten}
            </Text>
          </Box>
          <Text
            key={item?.Scheme}
            size="small"
            style={{ color: Color.textAPPGray, fontSize: "13px", marginBottom: 6 }}
            className="desc text-blue-dark overflow-ellipsis text-wrap "
          >
            🎁 <span style={{ color: Color.textAPPBlueHeavy }}>{item?.Scheme}</span>
          </Text>
          {item.spTen &&
            JSON.parse(item.spTen).length > 0 &&
            JSON.parse(item.spTen).map((spkm) => (
              <Box key={spkm.TEN} flex style={{ gap: 8, marginBottom: 4, background: '#f1f5f9', borderRadius: 8, padding: '4px 8px' }} alignItems="center" m="0" p="0">
                <Icon zmp="zi-gift" size="18px" style={{ color: Color.textAPPBlueHeavy }} />
                <Text
                  size="small"
                  style={{ color: Color.textAPPBlack, fontSize: "13px", fontWeight: 500 }}
                  className="desc text-blue-dark overflow-ellipsis text-wrap "
                >
                  {spkm.TEN}
                </Text>
              </Box>
            ))}
          <Box
            className="w-full m-0 mt-1 p-2 "
            style={{ backgroundColor: "#e0e7ff", borderRadius: 8, marginTop: 8 }}
            flex
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              size="small"
              style={{ color: Color.textAPPGray, fontSize: "12px", fontWeight: 600 }}
            >
             {item?.soluong>0 ? "Số lượng" : "Tổng tiền"}
            </Text>
            <Text
              size="small"
              style={{ color: Color.textAPPGreen2, fontSize: "15px", fontWeight: 700 }}
            >
              {item?.soluong>0 ? formatCurrency(item?.soluong || 0, true) : formatCurrency(item?.TongTien || 0, true)}
            </Text>
          </Box>
        </Box>
      </Box>
      {/* <Box
        m={0}
        p={0}
        style={{
          width: "100%",
          height: "5px",
          paddingBottom: "10px",
          WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
          boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
        }}
        className="BoxLine"
      ></Box> */}
      {/* <style>{`
        .km-item-hover:hover {
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          border: 1.5px solid #38bdf8;
        }
      `}</style> */}
    </Box>
  )
})
export default RowItemKM
