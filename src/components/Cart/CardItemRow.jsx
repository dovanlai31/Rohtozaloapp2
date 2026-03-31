import store from "../../store"

import React, { useState, useEffect, forwardRef, useRef } from "react"
import {
  Box,
  Text,
 
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
      style={{
        borderBottomColor:
          index == length - 1 || (!ViewMore && index == 2) ? "white" : "#eeee",
      }}
    >
      <Box flex className="gap-1 w-full" alignItems="center">
        <Box className="bg-white rounded-lg  w-[150px] object-cover shadow-[0_0_0_1px_#99a3ad2a] m-0 bg-[#F7F7F8] border-[#F7F7F8]">
          <img src={item.HinhAnh} alt={item.title ? item.title : item.ten} />
        </Box>

        <Box p="0" className="w-full m-0">
          <Box className=" mx-1 mt-2 flex flex-col gap-3">
            {/* name */}
            <div className="flex  gap-1">
              <Text
                size="normal"
                className="font-extrabold   text-[16px]"
                style={{ color: Color.textAPPBlack }}
              >
                {item.title ? item.title : item.ten}
              </Text>
              <div>
                <button onClick={() => deleteP(item.id)} className=" w-6 h-6">
                  <IoClose size={16} color="#9B9B9B" />
                </button>
              </div>
            </div>
            {/* end name */}

            <div className="flex w-full justify-between gap-2 px-2 ">
              <div className="text-[18px] text-primary font-bold  ">
                {formatCurrency(
                  item.dongia *
                    (1 -
                      ((item.chietkhauKM ? item.chietkhauKM / 100 : 0) +
                        (item.nhomCkGam ? item.nhomCkGam / 100 : 0))) *
                    soluong,
                  true
                )}
                đ
              </div>
              <div>
                <Box
                  m="0"
                  p="0"
                  flex
                  alignItems="center"
                  className="mt-1 text-[14px] text-[#808080]"
                >
                  {(item.chietkhauKM && item.chietkhauKM >= 0) ||
                  (item.nhomCkGam && item.nhomCkGam >= 0) ? (
                    <p className="line-through ml-[5px]">
                      Giá: {formatCurrency(item.dongia)}
                    </p>
                  ) : null}

                  <p>
                    Giá:{" "}
                    {formatCurrency(
                      item.dongia *
                        (1 -
                          ((item.chietkhauKM ? item.chietkhauKM / 100 : 0) +
                            (item.nhomCkGam ? item.nhomCkGam / 100 : 0))),
                      true
                    )}
                    đ/{item.donvi}
                  </p>
                </Box>

                {(item.chietkhauKM && item.chietkhauKM > 0) ||
                (item.nhomCkGam && item.nhomCkGam > 0) ? (
                  <Text
                    className="text-[10px]"
                    style={{ color: Color.textAPPRed2 }}
                    size="small"
                  >
                    CK-{(item.chietkhauKM ?? 0) + (item.nhomCkGam ?? 0)}%
                  </Text>
                ) : null}
              </div>
            </div>
          </Box>

          <Box className=" m-0  p-0  flex justify-end p-2 pt-0 ">
            <div className="flex items-center  border border-[#E0E0E0] p-0 rounded-md">
              <button
                className=" flex items-center justify-center p-2 w-8 h-8 "
                onClick={() => {
                  let a = soluong - 1
                  setSoluongsp(a <= 0 ? 1 : a, item.id)
                }}
              >
                <FaMinus
                  size={12}
                  color={ConvertOpacity(Color.textAPPDefault, 0.4)}
                />
              </button>
              <div className="w-12 h-8 m-0 px-1 text-center  border-[#E0E0E0] border border-y-0 flex items-center justify-center">
                <Text size="xlarge" className=" text-center ">
                  {" "}
                  {soluong}{" "}
                </Text>
              </div>
              <button
                className=" flex items-center justify-center  p-2 w-8 h-8 "
                onClick={() => {
                  let a = item.soluong + 1
                  setSoluongsp(a, item.id)
                }}
              >
                <FaPlus
                  size={12}
                  color={ConvertOpacity(Color.textAPPDefault, 0.4)}
                />
              </button>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})
export default RowItemBanhang
