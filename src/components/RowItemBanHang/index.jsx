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
import { IoIosRemoveCircle } from "react-icons/io"
import { ConvertOpacity } from "@utils/ConvertOpacity"
import { IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io"
import { AiFillMinusCircle } from "react-icons/ai"
import { FaMinus, FaPlus } from "react-icons/fa"
const RowItemBanhang = forwardRef((data, ref) => {
  const elRef = useRef(null)
  const { item, index, updateGiohang, tinhtien, length, ViewMore, Refeshkm } = data
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
    a.chietkhauKM=0
    updateItem(sl)
    store.dispatch("updateGiohang", a)
    tinhtien()
    Refeshkm()
  }

  const deleteP = (id) => {
    let arr = Giohang.filter((w) => w.id != id)
    updateGiohang(arr)
    store.dispatch("remoteItemGioHang", id)
  }

  return (
    <Box
      // className="list-item"
      key={index}
      mb="1"
      p="2"
      style={{
        borderBottomColor:
          index == length - 1 || (!ViewMore && index == 2) ? "white" : "#eeee",
      }}
    >
      <Box flex className="gap-1" alignItems="center" style={{ width: "100%" }}>
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
            p="0"
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

        <Box p="0" style={{ width: "100%", margin: 0 }}>
          <Box className="w-100 mx-1 mt-2">
            <Text
              size="normal"
              className="font-extrabold text-blue-imex "
              style={{
                width: "100%",
                fontSize: "13px",
                color: Color.textAPPBlack,
              }}
            >
              {item.title ? item.title : item.ten}
            </Text>
            <Text
              className="desc text-blue-dark overflow-ellipsis "
              style={{
                width: "100%",
                fontSize: "11px",
                color: Color.textAPPGray,
              }}
            >
              Mã: {item.ma}
            </Text>
            <Box m="0" p="0" flex alignItems="center" className="mt-1">
              {((item.chietkhauKM && item.chietkhauKM >= 0)||(item.nhomCkGam&& item.nhomCkGam >= 0)) ? (
                <Text
                  style={{ textDecorationLine: "line-through", marginLeft: 5, color: Color.textAPPGray }}
                  size='xxsmall'
                >
                {formatCurrency(item.dongia)}
                </Text>
              ) : null}
              <Text
                style={{ color: Color.textAPPGreen, fontSize: "13px" , marginLeft: 15}}
                size="small"
              >
                {formatCurrency(item.dongia * (1 - ((item.chietkhauKM ? item.chietkhauKM / 100 : 0) + (item.nhomCkGam ? item.nhomCkGam / 100 : 0))), true  ) }

              </Text>
            </Box>


            {((item.chietkhauKM && item.chietkhauKM > 0) || (item.nhomCkGam && item.nhomCkGam > 0)) ? (
              <Text
                style={{ color: Color.textAPPRed2, fontSize: "10px" }}
                size="small"
              >
                CK-{(item.chietkhauKM?? 0) + (item.nhomCkGam ?? 0)}%
              </Text>
            ) : null}

          </Box>

          <Box p="0" flex style={{ margin: 0, alignItems: "center" }}>
            <Link
              onClick={() => {
                let a = soluong - 1
                setSoluongsp(a <= 0 ? 1 : a, item.id)
              }}
            >
              <Box
                className="filter-button-plus view-center"
                style={{
                  backgroundColor: ConvertOpacity(Color.textAPPDefault, 0.1),
                  borderRadius: "4px",
                  padding: 8,
                }}
              >
                <FaMinus
                  size={12}
                  color={ConvertOpacity(Color.textAPPDefault, 0.4)}
                />
              </Box>
            </Link>
            <Box px="5" flex alignItems="center">
              <Text
                size="xlarge"
                style={{
                  minWidth: 40,
                  color: Color.textAPPGreen,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {" "}
                {soluong}{" "}
              </Text>
            </Box>
            <Link
              onClick={() => {
                let a = item.soluong + 1
                setSoluongsp(a, item.id)
              }}
            >
              <Box
                className="filter-button-plus view-center"
                style={{
                  backgroundColor: ConvertOpacity(Color.textAPPDefault, 0.1),
                  borderRadius: "4px",
                  padding: 8,
                }}
              >
                <FaPlus size={12} color={ConvertOpacity(Color.textAPPDefault, 0.4)} />
              </Box>
            </Link>
          </Box>
        </Box>

        <Box mx="0" my="0" style={{}}>
          <Link onClick={() => deleteP(item.id)} className="btnAdd" style={{ width: "24px", height: "24px" }}>
            <IoClose size={14} color={ConvertOpacity(Color.textAPPRed2, 0.8)} />
          </Link>

          {/* <Box flex alignItems="center">
                <Text size="xlarge">
                  {" "}
                  {soluong}{"  "}
                </Text>
              </Box> */}
        </Box>
      </Box>

    </Box>
  )
})
export default RowItemBanhang
