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
import icongif2 from "@static/images/gift.png"
import Color from "@components/common/Color"
import { ConvertOpacity } from "@utils/ConvertOpacity"

const RowItemKMBanhang = forwardRef((data, ref) => {
  const elRef = useRef(null)
  const { item, index, updateGiohang, tinhtien, length, updateItemKM, setIsShowModalKm } = data
  const Giohang = store.getters.getGioHang.value || []
  const [soluong, updateItem] = useState(data.item.soluong)
  const [MaxTT, setMaxTT] = useState(0)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProductRow, setSelectedProductRow] = useState(null)
  const [tempSpTra, setTempSpTra] = useState([])
  const [searchText, setSearchText] = useState("")


  const dialog = useRef(null)
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
  const handleShowSpKm = (value, item, index, i, MaxTT) => {
    setIsShowModalKm(true)
    setMaxTT(MaxTT)
    setShowProductModal(true)

    setSelectedProductRow({ value, item, index, i })
    //xếp value.spTra có giá từ thápn đến cao
    value.spTra.sort((a, b) => a.gia - b.gia)
    //gán lại số lượng trong sptra = với spTra_xuly nếu có
    if (value.spTra_xuly && value.spTra_xuly.length > 0) {
      let newArr = value.spTra.map(sp => {
        let spXuly = value.spTra_xuly.find(x => x.MA === sp.MA);
        return spXuly ? { ...sp, soluong: spXuly.soluong } : { ...sp, soluong: 0 };
      });
      //xếp value.spTra có nhâp số lương từ thấp đến cao
      newArr.sort((a, b) => b.soluong - a.soluong)
      setTempSpTra(newArr);
    } else {
      setTempSpTra(value.spTra.map(sp => ({ ...sp, soluong: 0 })))
    }
  }

  // Xử lý nhập số lượng cho từng sản phẩm trả
  const handleChangeSoluong = (sp, val) => {
    let newArr = [...tempSpTra]
    val = Math.max(0, Number(val) || 0)
    const idx = newArr.findIndex(item => item.MA === sp.MA);
    if (idx !== -1) {
      newArr[idx].soluong = val
    }
    // Tổng số lượng không vượt quá MaxTT
    const total = newArr.reduce((sum, sp) => sum + (Number(sp.soluong * sp.gia) || 0), 0)
    if (total > MaxTT) {
      showDialog(`Tổng giá trị sản phẩm trả không được vượt quá ${formatCurrency(MaxTT, true)} đ`)
      newArr[idx].soluong = Math.floor((MaxTT - (total - (Number(newArr[idx].soluong * newArr[idx].gia) || 0))) / newArr[idx].gia);
      //  return // Không cho nhập vượt
    }
    setTempSpTra(newArr)
  }
  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [
        {
          text: "Đóng",
        },
      ],
    })
    if (dialog.current) {
      dialog.current.open()
    }
  }
  // Xác nhận chọn sản phẩm trả
  const handleConfirmSpTra = () => {
    // TODO: xử lý lưu lại lựa chọn vào store hoặc callback

    if (selectedProductRow) {
      const { value, item, index, i } = selectedProductRow
      let datax = tempSpTra.filter(sp => Number(sp.soluong) > 0).map(sp => ({
        ...sp,
      }))
      item.trakhuyenmai[i].spTra_xuly = datax
      item.trakhuyenmai[i].chontkm = true
      // Cập nhật lại sp trả vào item khuyến mãi
      console.log("Selected products for return:", item)
    }

    updateItemKM(item)
    setSelectedProductRow(null)
    setShowProductModal(false)
    setIsShowModalKm(false)
  }

  return (
    <>
      <Box
        p="0"
        m="0"
        key={index}
        style={{ borderBottomColor: index == length - 1 ? "white" : "#eeee" }}
      >
        <Box p="0" m="0" flex alignItems="center" style={{ width: "100%", gap: 12 }}>
          <Box p="0" m="2" style={{ width: "100%" }}>
            <Box p="0" m="0">
              <Text
                size="xsmall"
                style={{ color: Color.textAPPBlueHeavy, }}
              >
                {index + 1}. {item.diengiai}
              </Text>
              <Text
                size="xxxsmall"
                style={{ color: Color.textAPPGray, marginTop: 4 }}
              >
                Mã: {item.scheme}
              </Text>
            </Box>

            {item.trakhuyenmai.map((value, i) => {
              if (value.loai != 5)
                return (
                  <Box key={i} flex style={{ gap: 8 }} alignItems="center" m="0" p="0">
                    <Icon
                      style={{ color: Color.textAPPGreen2 }}
                      zmp={value.loai == 1 || value.loai == 2 ? "zi-star-solid" : "zi-send-solid"}
                      size="14px"
                    />
                    <Link
                      //onClick={() => handleShowSpKm(value, item, index, i, (value.HanMucTien || 0))}
                    >
                      <Box m="0" p="0">
                        <Text
                          size="small"
                          style={{ color: Color.textAPPGray, fontSize: "13px", padding: '10px 0px' }}
                          className="desc text-blue-dark overflow-ellipsis text-wrap "
                        >
                          Trả: {value.diengiai}
                          {value.loai == 2 || value.loai == 1
                            ? <Text
                              style={{ color: Color.textAPPRed, fontSize: "10px", }}
                              className="desc text-blue-dark overflow-ellipsis text-wrap "
                            >
                              -{formatCurrency(value.tongtien || 0, true)} đ
                            </Text>
                            : null}
                        </Text>
                        {/* "Chiết khấu từng dòng quy đổi sản phẩm" */}
                        {value.loai == 3 && value.IS_TRASP_HanMucTien == 1 ? (
                          //thêm btn chọn sp trả
                          <Link onClick={() => handleShowSpKm(value, item, index, i, (value.HanMucTien || 0))}>
                            <Box m="0" p="0">

                              <Text
                                style={{ color: Color.textAPPBlueHeavy, fontSize: "10px", cursor: "pointer" }}
                                className="desc text-blue-dark overflow-ellipsis text-wrap "
                              >
                                Có nhiều lựa chọn
                                với tổng trị: {formatCurrency(value.HanMucTien, true)} đ {" "}
                                <Icon
                                  zmp="zi-chevron-down"
                                  size="22px"
                                />

                              </Text>
                              {value.spTra_xuly && value.spTra_xuly.length > 0 ? (
                                value.spTra_xuly.map((sp, idx) =>
                                  <Text
                                    key={i}
                                    style={{ color: Color.textAPPBlueHeavy, fontSize: "10px", }}
                                    className="desc text-blue-dark overflow-ellipsis text-wrap "
                                  >
                                    - Đã chọn: {sp.TEN}, số lượng: {sp.soluong}
                                  </Text>
                                )
                              ) : null}
                            </Box>
                          </Link>
                        ) : value.loai == 3 && value.IS_TRASP_HanMucTien == 0 && value.pheptoan == 1 ? (
                          //hiện sp trả theo số lượng  phép toán 1 là trả and(trả tất cả)
                          value.spTra.map((sp, i) => {
                            if (value.hinhthuc == 2)// bất kỳ trong là hienj 1 dòng thôi khỏi chọn cho nhanh
                            {
                              if (i == 0) {
                                return (
                                  <Text
                                    key={i}
                                    style={{ color: Color.textAPPBlueHeavy, fontSize: "10px", }}
                                    className="desc text-blue-dark overflow-ellipsis text-wrap "
                                  >
                                    - Trả SP: {sp.TEN}, số lượng: {value.tongluong * item.sosuat}
                                  </Text>
                                )
                              }



                            } else {

                              return (
                                <Text
                                  key={i}
                                  style={{ color: Color.textAPPBlueHeavy, fontSize: "10px", }}
                                  className="desc text-blue-dark overflow-ellipsis text-wrap "
                                >
                                  - Trả SP: {sp.TEN}, số lượng: {value.tongluong * item.sosuat}
                                </Text>
                              )
                            }
                          }

                          )
                        ) : null}
                      </Box>
                    </Link>
                  </Box>
                )
              return null
            })}
          </Box>
        </Box>
        <Box
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
        ></Box>
      </Box>
      {/* Modal chọn sản phẩm trả */}
      {showProductModal && selectedProductRow && (
        <>
          {/* Overlay nhẹ, không che toàn bộ */}
          <Box
            m='0'
            p='0'
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.08)",
              zIndex: 999,
            }}
            onClick={() => {
              setShowProductModal(false);
              setIsShowModalKm(false);
            }}
          />
          {/* Popup modal nhỏ */}
          <Box
            m='0'
            p='0'

            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90vw",
              maxWidth: "90vw",
              minWidth: 280,
              maxHeight: "67vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              // padding: 18,
              zIndex: 1000,
              animation: "fadeInModal 0.25s",
              marginTop: "-5vh",
            }}
          >
            <Box
              flex
              justifyContent="space-between"
              alignItems="center"
              m='0'
              p='0'
              style={{
                padding: "12px 18px",
                marginBottom: 8,
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
                paddingBottom: 4,
                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
              }}
            >
              <Title size="small">Danh sách quà tặng</Title>
              <Button
                iconZMP="zi-close"
                style={{ borderRadius: 12, padding: "10px", color: "#333", fontWeight: 600, fontSize: 13 }}
                onClick={() => {
                  setShowProductModal(false);
                  setIsShowModalKm(false);
                }}
              >

              </Button>
            </Box>
            <Text style={{
              fontSize: 12,
              color: Color.textAPPCopper3,
              marginBottom: 8,
              position: "sticky",
              top: 38,
              background: "#fff",
              zIndex: 2,
              paddingBottom: 4,
              padding: "0 18px",
              width: "77%",
            }}>Tối đa: {formatCurrency(MaxTT, true)}
            </Text>
            {/* //thêm ô  tìm kiếm */}
            <Box p="0" m="0" style={{ padding: "0 18px", marginBottom: 8 }}>

              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  fontSize: 13,
                  marginBottom: 4,
                }}

                value={searchText || ""}
                onChange={e => {
                  const searchText = e.target.value;
                  // Lọc sản phẩm theo tên hoặc mã
                  if (typeof setSearchText === "function") setSearchText(searchText);
                }}
              />
            </Box>

            <List>
              {tempSpTra.filter(sp =>
                sp.TEN.toLowerCase().includes(searchText.toLowerCase()) ||
                sp.MA?.toLowerCase().includes(searchText.toLowerCase())
              ).map((sp, idx) => (
                <ListItem key={sp.MASP || idx}>

                  <Box p="0" m="0" flex alignItems="center" justifyContent="space-between"
                    style={{ width: '100%' }}>
                    <Box style={{ width: '80%' }} >
                      <Text style={{ fontSize: 12, fontWeight: 500 }}>{sp.TEN}</Text>
                      <Text style={{ fontSize: 11, color: '#888' }}>
                        Mã: {sp.MA}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#888' }}>
                        Giá: {formatCurrency(sp.gia, true)} đ
                      </Text>
                    </Box>

                    <input
                      type="number"
                      min={0}
                      max={MaxTT}
                      value={sp.soluong == '0' ? '' : sp.soluong}
                      style={{ width: 48, padding: "2px 4px", borderRadius: 8, border: "1px solid #eee", fontSize: 12 }}
                      onChange={e => handleChangeSoluong(sp, e.target.value)}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                zIndex: 2,
                boxShadow: "0 -1px 0 rgba(0,0,0,0.04)",
                padding: "8px",
                width: "100%",


              }}
            >

              <Link onClick={handleConfirmSpTra} style={{ width: '96%' }}>
                <Box
                  m="0"
                  p="0"
                  flex
                  alignItems="center"

                  style={{
                    backgroundColor: ConvertOpacity(Color.textAPPGreen, 0.1),
                    borderRadius: 5,
                    padding: "8px 12px",
                    justifyContent: 'space-between',
                    gap: 18,
                    width: '100%',

                  }}
                >

                  <Text style={{ fontSize: 11, color: '#888', marginTop: 0, flex: 1, textAlign: 'left' }}>
                    Tổng: {formatCurrency(tempSpTra.reduce((sum, sp) => sum + (Number(sp.soluong * sp.gia) || 0), 0), true)}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#888', marginTop: 0, flex: 1, textAlign: 'center' }}>
                    Còn lại: {formatCurrency(MaxTT - tempSpTra.reduce((sum, sp) => sum + (Number(sp.soluong * sp.gia) || 0), 0), true)}
                  </Text>
                  <Text
                    noSpace
                    style={{
                      color: Color.textAPPGreen2,
                      fontSize: 13,
                      flex: 1,
                      textAlign: 'right',
                    }}
                  >
                    Xác nhận
                  </Text>
                </Box>
              </Link>
              {/* <Button
                style={{ borderRadius: 12, background: Color.textAPPGreen, color: "#fff", fontWeight: 600, fontSize: 13, }}
                onClick={handleConfirmSpTra}
              >Xác nhận</Button> */}

            </Box>
          </Box>
          {/* CSS animation cho modal */}
          <style>{`
            @keyframes fadeInModal {
              from { opacity: 0; transform: translate(-50%, -60%) scale(0.95); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `}</style>
        </>
      )}
    </>



  )
})
export default RowItemKMBanhang
