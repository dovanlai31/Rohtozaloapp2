import React, { useEffect, useState } from "react"
import {
  Tabs,
  Tab,
  Tabbar,
  Box,
  Link,
  Card,
  Text,
  zmp,
  zmpready,
  useStore,
} from "zmp-framework/react"
import "../../styles/notifypage.scss"
import { request } from "@utils/networking"
import { Voucher } from "@components/Icons"
import Color from "@components/common/Color"
import { BiSolidDiscount } from "react-icons/bi"
import { FaInbox, FaStar } from "react-icons/fa6"
import { BsCartFill } from "react-icons/bs"
import { BsReceipt } from "react-icons/bs"
import { formatDateToDDMMYYYY } from "@utils/util"
import store from "../../store"
import { Icon } from "zmp-ui"
import { showToast } from "zmp-sdk"


//import { C } from "../../../www/assets/index.a2bfea25.module"
const CTKhuyenMai = ({ data, CTKM, listSP }) => {
  const CusInfo = useStore("getCusInfo")
  console.log("CusInfo ", CusInfo)
  let dieukien = []
  let tra = []
  let sanphamdk = []
  let sanphamtra = []

  if (data.length > 0) {
    console.log(data)

    if (data[0].hasOwnProperty("dieukien")) {
      dieukien = JSON.parse(data[0].dieukien)
    }

    if (data[0].hasOwnProperty("tra")) {
      tra = JSON.parse(data[0].tra)
    }

    if (data[1].hasOwnProperty("dieukien")) {
      sanphamdk = JSON.parse(data[1].dieukien)
    }

    if (data[1].hasOwnProperty("tra")) {
      sanphamtra = JSON.parse(data[1].tra)
    }
  }
  const GodonhangKM = () => {
    console.log("data...  ", data)
    if (dieukien.length > 0) {
      console.log("dieukien", dieukien)
      let loaikm = dieukien[0].LOAI
      if (loaikm == "1" || loaikm == "2") {// tiền
        if (dieukien[0].TONGTIEN.length > 1) {
          if (sanphamdk.length > 0) {
            //console.log("sanphamdk", sanphamdk)
            let Product = sanphamdk[0]
            console.log("spmua", Product)

            let p = Product
            p.soluong = Math.ceil(dieukien[0].TONGTIEN_DKKM||0 / p.dongia);
            p.title = Product.ten
            p.thumbnail = Product.HinhAnh
            store.dispatch("SetAddGioHang", p)
            showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")

          }
        }


      } else if (dieukien[0].TONGLUONG > 0) {// số lượng
        if (sanphamdk.length > 0) {
            //console.log("sanphamdk", sanphamdk)
            let Product = sanphamdk[0]
            console.log("spmua", Product)

            let p = Product
            p.soluong = dieukien[0].TONGLUONG_DKKM;
            p.title = Product.ten
            p.thumbnail = Product.HinhAnh
            store.dispatch("SetAddGioHang", p)
            showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")

          } 

      }


    }
    backHome();

  }
  const backHome = () => {
    zmp.views.current.router.back()
    zmp.views.main?.router?.clearPreviousHistory()
    if (zmp.views.main?.router?.currentRoute?.path !== "/") {
      zmp.views.main.router.navigate("/", {
        reloadCurrent: true,
      })
    }
    setTimeout(() => {
      zmp.tab.show("#view-giohang")
    }, 250)

  }
  return (
    <>
      <Box m={0} p={0}>
        <div className="flex justify-around items-center w-auto primary-background p-1 m-2 rounded shadow-lg">

          <Box className="m-0">
            <Text className="text-sm font-medium m-0" style={{ color: "#f8f8f8" }}>
              {CTKM?.diengiai}
            </Text>
            <Text className="text-sm font-normal m-0" style={{ color: "#f8f8f8" }}>
              {CTKM?.loaict}
            </Text>
            <Text className="text-sm font-normal m-0" style={{ color: "#f8f8f8" }}>
              {formatDateToDDMMYYYY(CTKM?.TUNGAY || "", "/")} -{" "}
              {formatDateToDDMMYYYY(CTKM?.DENNGAY || "", "/")}
            </Text>


          </Box>
          <Box className="RoundIcon">
            <BiSolidDiscount fill="#ff6a5b" size={32} />
          </Box>

        </div>

        <Box className="bg-white">
          <Tabbar
            inner={false}
            m={0}
            p={0}
            className="CustomTabbar"
            style={{ backgroundColor: "transparent", height: 70 }}
          >
            <Link
              style={{
                fontSize: "13px",
                textWrap: "wrap",
                whiteSpace: "break-spaces",
                textAlign: "center",
                width: 300,
              }}
              text="Điều kiện"
              tabLink="#dieukien"
              tabLinkActive
            ></Link>
            <Link
              style={{
                fontSize: "13px",
                textWrap: "wrap",
                whiteSpace: "break-spaces",
                textAlign: "center",
                width: 300,
              }}
              text="Sản phẩm điều kiện"
              tabLink="#sanphamdk"
            ></Link>
            <Link
              style={{
                fontSize: "13px",
                textWrap: "wrap",
                whiteSpace: "break-spaces",
                textAlign: "center",
                width: 300,
              }}
              text="Trả"
              tabLink="#tra"
            ></Link>
            <Link
              style={{
                fontSize: "13px",
                textWrap: "wrap",
                whiteSpace: "break-spaces",
                textAlign: "center",
                width: 300,
              }}
              text="Sản phẩm trả"
              tabLink="#sanphamtra"
            ></Link>
          </Tabbar>
        </Box>


      </Box>

      <Box
        className="latest"
        mt="5"
        flex
        flexDirection="column"
        justifyContent="space-between"
      >
        <Tabs m={5} animated swipeable>
          <Tab id={"dieukien"} tabActive>
            <Box className="view-center-gh">
              {dieukien.length == 0 && (
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có điều kiện khuyến mãi
                  </Text>
                </div>
              )}
              {dieukien.length > 0 &&
                dieukien.map((item) => (
                  <Box
                    key={item.PK_SEQ}
                    className="list-item-km2 shadown-app-2"
                    style={{ padding: 0, borderRadius: 10, background: "white" }}
                  >
                    <Box flex alignItems="center">
                      <Box className="list-icon2" style={{ width: "20%" }}>
                        <span className="RoundIcon4">
                          <FaStar fill={Color.textAPPGold} size={25} />
                        </span>
                      </Box>

                      <Box
                        className="customText"
                        style={{ width: "100%" }}
                        flex
                        flexDirection="column"
                        justifyContent="flex-start"
                        flexWrap
                      >
                        <Box>
                          <Text
                            size="small"
                            style={{ color: Color.textAPPBlue }}
                            className="font-extrabold bg-text-second"
                          >
                            {item?.DIENGIAI}
                          </Text>
                        </Box>

                        <Box alignItems="center">
                          <Text
                            style={{ color: Color.textAPPGray, width: 203 }}
                            mx="0"
                            size="small"
                            className="flex"
                          >
                            <span>Loại</span>
                            <span
                              style={{
                                flexGrow: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {item?.LOAI_DIENGIAI}
                            </span>
                          </Text>
                          <Text
                            style={{ color: Color.textAPPGray, width: 203 }}
                            mx="0"
                            size="small"
                            className="flex"
                          >
                            <span>{item?.HINHTHUC_DIENGIAI || "Giá trị"}</span>
                            <span
                              style={{
                                flexGrow: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {item?.TONGTIEN}
                            </span>
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Tab>
          <Tab id={"sanphamdk"}>
            <Box className="view-center-gh">
              {sanphamdk.length == 0 && (
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có sản phẩm
                  </Text>
                </div>
              )}
              {sanphamdk.length > 0 &&
                sanphamdk.map((item, index) => (
                  <Box
                    //  className=" shadown-app-1"
                    key={index}
                    style={{ borderRadius: 10, background: "white" }}
                  >
                    <Box flex alignItems="center">
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
                            backgroundImage: `url(${encodeURI(item?.HINHANH)})`,
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            backgroundSize: "cover",
                          }}
                        />
                      </Box>

                      <Link
                        style={{ width: "80%" }}
                        href={"/detail/?id=" + item?.SANPHAM_FK}
                        animate
                        transition="zmp-cover-v"
                        noLinkClass
                      >
                        <Box style={{ width: "95%", margin: 0 }}>
                          <Box alignItems="center">
                            <Text
                              size="normal"
                              className="font-extrabold text-blue-imex "
                              style={{
                                width: "100%",
                                fontSize: "13px",
                                marginBottom: 8,
                              }}
                            >
                              {item?.TEN_SP}
                            </Text>

                            <Box m="0">
                              <Text
                                className="desc text-blue-dark overflow-ellipsis "
                                style={{
                                  width: "100%",
                                  fontSize: "13px",
                                  color: Color.textAPPGray,
                                }}
                              >
                                Mã: {item?.MA_SP}
                              </Text>
                              <Text
                                className="desc text-blue-dark overflow-ellipsis "
                                style={{
                                  width: "100%",
                                  fontSize: "13px",
                                  color: Color.textAPPGray,
                                }}
                              >
                                Đơn vị: {item?.DVDL}
                              </Text>
                              {item?.SOLUONG != "-1" && (
                                <Text
                                  className="desc text-blue-dark overflow-ellipsis "
                                  style={{
                                    width: "100%",
                                    fontSize: "13px",
                                    color: Color.textAPPGray,
                                  }}
                                >
                                  Số lượng: {item?.SOLUONG}
                                </Text>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Tab>
          <Tab id={"tra"}>
            <Box className="view-center-gh">
              {tra.length == 0 && (
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có trả khuyến mãi
                  </Text>
                </div>
              )}
              {tra.length > 0 &&
                tra.map((item) => (
                  <Box
                    key={item.PK_SEQ}
                    className="list-item-km2 shadown-app-2"
                    style={{ padding: 0, borderRadius: 10, background: "white" }}
                  >
                    <Box flex alignItems="center">
                      <Box className="list-icon2" style={{ width: "20%" }}>
                        <span className="RoundIcon4">
                          <BsReceipt fill={Color.BackgrondLightAPP4} size={25} />
                        </span>
                      </Box>

                      <Box
                        className="customText"
                        style={{ width: "100%" }}
                        flex
                        flexDirection="column"
                        justifyContent="flex-start"
                        flexWrap
                      >
                        <Box>
                          <Text
                            size="small"
                            style={{ color: Color.textAPPBlue }}
                            className="font-extrabold bg-text-second"
                          >
                            {item?.DIENGIAI}
                          </Text>
                        </Box>

                        <Box alignItems="center">
                          <Text
                            style={{ color: Color.textAPPGray, width: 203 }}
                            mx="0"
                            size="small"
                            className="flex"
                          >
                            <span>Loại</span>
                            <span
                              style={{
                                flexGrow: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {item?.LOAI_DIENGIAI}
                            </span>
                          </Text>
                          <Text
                            style={{ color: Color.textAPPGray, width: 203 }}
                            mx="0"
                            size="small"
                            className="flex"
                          >
                            <span>Hình thức</span>
                            <span
                              style={{
                                flexGrow: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {item?.HINHTHUC_DIENGIAI}
                            </span>
                          </Text>
                          <Text
                            style={{ color: Color.textAPPGray, width: 203 }}
                            mx="0"
                            size="small"
                            className="flex"
                          >
                            <span>{item?.LOAI_TEXT || "Giá trị"}</span>
                            <span
                              style={{
                                flexGrow: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {item?.TONGTIEN}
                            </span>
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Tab>
          <Tab id={"sanphamtra"}>
            <Box className="view-center-gh">
              {sanphamtra.length == 0 && (
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có sản phẩm
                  </Text>
                </div>
              )}
              {sanphamtra.length > 0 &&
                sanphamtra.map((item, index) => (
                  <Box
                    //  className=" shadown-app-1"
                    key={index}
                    style={{ borderRadius: 10, background: "white" }}
                  >
                    <Box flex alignItems="center">
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
                            backgroundImage: `url(${encodeURI(item?.HINHANH)})`,
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            backgroundSize: "cover",
                          }}
                        />
                      </Box>

                      <Link
                        style={{ width: "80%" }}
                        href={"/detail/?id=" + item?.SANPHAM_FK}
                        animate
                        transition="zmp-cover-v"
                        noLinkClass
                      >
                        <Box style={{ width: "95%", margin: 0 }}>
                          <Box alignItems="center">
                            <Text
                              size="normal"
                              className="font-extrabold text-blue-imex "
                              style={{
                                width: "100%",
                                fontSize: "13px",
                                marginBottom: 8,
                              }}
                            >
                              {item?.TEN_SP}
                            </Text>

                            <Box m="0">
                              <Text
                                className="desc text-blue-dark overflow-ellipsis "
                                style={{
                                  width: "100%",
                                  fontSize: "13px",
                                  color: Color.textAPPGray,
                                }}
                              >
                                Mã: {item?.MA_SP}
                              </Text>
                              <Text
                                className="desc text-blue-dark overflow-ellipsis "
                                style={{
                                  width: "100%",
                                  fontSize: "13px",
                                  color: Color.textAPPGray,
                                }}
                              >
                                Đơn vị: {item?.DVDL}
                              </Text>
                              {item?.SOLUONG != "-1" && (
                                <Text
                                  className="desc text-blue-dark overflow-ellipsis "
                                  style={{
                                    width: "100%",
                                    fontSize: "13px",
                                    color: Color.textAPPGray,
                                  }}
                                >
                                  Số lượng: {item?.SOLUONG}
                                </Text>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Tab>
        </Tabs>
      </Box>

      {/* Flag Button dưới cùng */}
    {CusInfo?.active !== "0"  != 0 && (
      <Box style={{ position: "fixed", bottom: 0, left: 0, width: "96%", zIndex: 1000, background: "transparent" }} display="flex" justifyContent="center" alignItems="center" p={2}>
        <button
          onClick={() => {
            GodonhangKM()
          }}
          style={{
            background: Color.textAPPGreen2,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 2px 8px #0001",
            cursor: "pointer"
          }}
        >
          Lên đơn hàng gợi ý theo khuyến mãi này
        </button>
      </Box>
    )}
    </>
  )
}

export default CTKhuyenMai
