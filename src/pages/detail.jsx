import { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Card,
  Icon,
  Link,
  Page,
  SkeletonBlock,
  Swiper,
  SwiperSlide,
  Tab,
  Tabbar,
  Tabs,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react"
import { getAppInfo, openShareSheet } from "zmp-sdk/apis"

import Color from "@components/common/Color"
import Image from "@components/Image"
import { formatCurrency, getAPI, request } from "@utils/networking"
import { validateString } from "@utils/util"
import { FaChevronRight, FaSquareShareNodes } from "react-icons/fa6"
import { RiMessage2Fill } from "react-icons/ri"
import store from "../store"
import "../styles/app.scss"
import "../styles/swiper.css"
import withOverlay from "@components/HOC/withOverlay"
import { FaCartPlus, FaEye, FaMinus, FaPlus } from "react-icons/fa"
import { ConvertOpacity } from "@utils/ConvertOpacity"
import { IoChevronBack } from "react-icons/io5"
import config from "../config"
const Detail = ({ zmproute, showToast }) => {
  const toast = useRef(null)
  const topToast = useRef(null)

  const [soluong, setSoluongsp] = useState(1)
  const [list_sp_tt, setlist_sp_tt] = useState([])
  const [activeIndex, setactiveIndex] = useState(0)
  const [Product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)

  const user = useStore("user")
  const CusInfo = useStore("getCusInfo")
  const heightFooter = 200
  useEffect(() => {
    console.log("zmproute", zmproute)

    setLoading(true)
    const timeOut = setTimeout(() => {
      getInfoProduct(zmproute.query.id)
    }, 500)

    return () => {
      clearTimeout(timeOut)
    }
  }, [])

  //{id,title,thumbnail}
  const getInfoProduct = async (id) => {
    let queryString = {
      userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
      spId: validateString(id + "", true),
      idchungloai: "",
      loai: "2",
    }
    //getdata api
    try {
      const response = await (
        await request("POST", "khachhang/getListSP", {}, queryString)
      ).json()

      if (response) {
        let p = JSON.parse(response.message)
        setlist_sp_tt(p)
      } else {
        setlist_sp_tt([])
      }

      const { data, error } = await getAPI(
        "khachhang/getSpDetail",
        "POST",
        {},
        queryString
      )

      if (!data.result || error) {
        showToast("Lỗi truy xuất sản phẩm", "info")
      }

      setProduct(JSON.parse(data.content)[0])
    } catch (error) {
      console.log("Error request api x ", error)
      //setListData([])
    } finally {
      setLoading(false)
    }
  }

  const onClickAddGH = async () => {
    let p = { ...Product, soluong }

    try {
      const result = await store.dispatch("SetAddGioHang", p)
      console.log("result__add", result)
      if (result) {
        showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")

        setTimeout(() => {
          zmp.views.main.router.back()
        }, 500)
      }
    } catch (err) {
      showToast("Lỗi khi thêm giỏ hàng", "danger", 1500, "top")
    }
  }

  const openToast = (pos, message) => {
    // Tạo toast
    switch (pos) {
      case "top":
        if (!topToast.current) {
          topToast.current = zmp.toast.create({
            text: message,
            position: "top",
            closeTimeout: 2000,
          })
        }
        // Mở
        topToast.current.open()
        break
      default: {
        if (!toast.current) {
          toast.current = zmp.toast.create({
            text: message,
            position: "bottom",
            closeTimeout: 2000,
          })
        }
        // Mở
        toast.current.open()
      }
    }
  }
  const backHome = () => {
    setTimeout(() => {
      zmp.views.current.router.back()
    }, 500)
  }
  const onPageBeforeOut = () => {
    if (toast.current) {
      toast.current.close()
      toast.current.destroy()
    }
    if (topToast.current) {
      topToast.current.close()
      topToast.current.destroy()
    }
  }
  const openChatScreen = async () => {
    try {
      await openChat({
        type: "oa", // chat với Official Account
        id: config.OA_ID, // OA_ID lấy trong config
        message: "Xin Chào", // tin nhắn mặc định khi mở
      })
    } catch (error) {
      console.log("Open chat error: ", error)
    }
  }
  const openShareWindow = (img, tensp, idsp) => {
    console.log(zmproute)
    getAppInfo({})
      .then(({ appUrl }) => {
        openShareSheet({
          type: "zmp_deep_link",
          data: {
            thumbnail: img,
            title: tensp,
            path: appUrl + `/detail/?id=${idsp}`,
          },
          success: (data) => {
            console.log(data)
          },
          fail: (err) => {
            console.log(err)
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  console.log(
    validateString(Product.thanhphan).length === 0 &&
      validateString(Product.mota).length === 0
  )
  console.log("Product____________", Product)
  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      style={{ background: "white" }}
      className="detail-page"
    >
      <Box m="0" p="0" id="topSection" className="banner_page_detai2">
        {!loading && (
          <Swiper
            onSlideChange={(sw) => {
              console.log("activeIndex: ", sw.activeIndex)
              setactiveIndex(sw.activeIndex)
            }}
          >
            <SwiperSlide>
              <Box m="0" p="0" className="banner_page_detai">
                <Image
                  className="image-card2"
                  src={Product?.HinhAnh}
                  style={{ height: 310, backgroundColor: "#fff" }}
                  alt="Hình ảnh sản phẩm"
                />
              </Box>
            </SwiperSlide>
            {Product?.HinhAnh1 && Product?.HinhAnh1.length > 59 && (
              <SwiperSlide>
                <Box m="0" p="0" className="banner_page_detai">
                  <Image
                    className="image-card2"
                    src={Product?.HinhAnh1}
                    style={{ height: 310, backgroundColor: "#fff" }}
                  />
                </Box>
              </SwiperSlide>
            )}
            {Product?.HinhAnh2 && Product?.HinhAnh2.length > 59 && (
              <SwiperSlide>
                <Box m="0" p="0" className="banner_page_detai">
                  <Image
                    className="image-card2"
                    src={Product?.HinhAnh2}
                    style={{ height: 310, backgroundColor: "#fff" }}
                  />
                </Box>
              </SwiperSlide>
            )}
          </Swiper>
        )}
        {loading && (
          <SkeletonBlock
            height="310px"
            width="247px"
            effect="wave"
            className="banner_page_detai"
          />
        )}
        {/* <Text className="open-time">
          {" "}
          {activeIndex + 1}/{tonghinh}{" "}
        </Text> */}
        <Box style={{ position: "absolute", top: "40px", left: "20px" }}>
          <Link
            back
            onClick={() => {
              store.dispatch("SetCurentProduct", {})
              setProduct({})
            }}
            className="RoundIcon3"
          >
            <Icon color="black" size={20} zmp="zi-chevron-left-header"></Icon>
          </Link>
        </Box>
      </Box>

      {/* <Box className="p-3">
        <Text className="text-lg font-semibold">Chi tiết sản phẩm</Text>
      </Box> */}
      <Box mx={5}>
        <Card className="" inset>
          <Box className="p-3 BoxLine ">
            {!loading && (
              <Text className="text-lg text-Green-Nuti font-semibold">
                {Product?.ten || "Tên sản phẩm"}
              </Text>
            )}
            {loading && (
              <SkeletonBlock
                height="28px"
                width="100%"
                borderRadius="10px"
                effect="wave"
              />
            )}
            {Product.sodangky && (
              <Text
                style={{
                  // borderWidth: 0.5,
                  borderColor: "red",
                  borderRadius: 4,
                  padding: 2,
                  paddingVertical: 2,

                  fontSize: 14,
                  color: Color.textAPPDefault,
                  // color: 'red',
                }}
              >
                {Product.sodangky}
              </Text>
            )}
            <Box flex flexWrap="wrap" m="0" p="0" style={{ marginTop: 10 }}>
              {Product.nganhhang && (
                <Text
                  style={{
                    borderWidth: 0.5,
                    borderColor: Color.textAPPGreen,
                    borderRadius: 4,
                    padding: 2,
                    paddingVertical: 2,
                    marginRight: 6,
                    marginBottom: 6,
                    fontSize: 14,
                    color: Color.textAPPGreen,
                  }}
                >
                  {Product.nganhhang}
                </Text>
              )}

              {Product.chungloai && (
                <Text
                  style={{
                    borderWidth: 0.5,
                    borderColor: Color.textAPPGreen,
                    borderRadius: 4,
                    padding: 2,
                    paddingVertical: 2,
                    marginRight: 6,
                    marginBottom: 6,
                    fontSize: 14,
                    color: Color.textAPPGreen,
                  }}
                >
                  {Product.chungloai}
                </Text>
              )}
            </Box>

            {CusInfo?.active !== "0" && (
              <Text
                style={{ color: Color.primary, fontWeight: "bold" }}
                className=" text-lg desc overflow-ellipsis "
              >
                {formatCurrency(Product.dongia)}
              </Text>
            )}
          </Box>
          <Box
            m={0}
            p={0}
            style={{
              width: "100%",
              height: "5px",
              // backgroundColor: 'red',
              paddingBottom: "10px",
              // paddingTop: "10px",
              WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
              boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
            }}
            className="BoxLine"
          ></Box>
          <Box m={0} p={0}>
            <Tabbar inner={false} m={0} p={0} className="CustomTabbar">
              <Link tabLink="#tab-1" tabLinkActive>
                Mô tả
              </Link>
              <Link tabLink="#tab-2">Chi tiết</Link>
              <Link tabLink="#tab-3">Hướng dẫn</Link>
            </Tabbar>
          </Box>
          <Box m={0} p={0}>
            <Tabs m={5} animated swipeable>
              <Tab id="tab-1" tabActive>
                <Box className="TabSanPham">
                  <Box style={{ minHeight: "100px", overflow: "scroll" }}>
                  
                    <Text className=" text-sm font-semibold  flex">
                      Quy cách : &nbsp;
                      <Text
                        // size="small"
                        // className="desc text-blue-dark overflow-ellipsis "
                      >
                       {Product.donvi}
                      </Text>
                    </Text>

                    {Product && Product?.mota ? (
                      <>
                        <Text className="text-sm font-semibold mt-2">Chỉ định:</Text>
                        <Text className="text-sm desc text-blue-dark overflow-ellipsis mt-1 whitespace-pre-line">
                          {Product?.mota}
                        </Text>{" "}
                      </>
                    ) : (
                      <Text className="text-sm  mt-2"></Text>
                    )}
                  </Box>
                </Box>
              </Tab>
              <Tab id="tab-2">
                <Box className="TabSanPham">
                  <Box style={{ maxHeight: "300px", overflow: "scroll" }}>
                    <Text className="text-sm font-semibold mt-2">Thành phần</Text>
                    {(Product.hasOwnProperty("thanhphan") ||
                      Product.hasOwnProperty("mota")) &&
                      (validateString(Product.thanhphan).length === 0 &&
                      validateString(Product.mota).length === 0 ? (
                        <Text className="text-sm desc text-blue-dark overflow-ellipsis mt-1 whitespace-pre-line">
                          Không có thông tin chi tiết
                        </Text>
                      ) : (
                        <>
                          <Text className="text-sm desc text-blue-dark overflow-ellipsis mt-1 whitespace-pre-line">
                            {Product && Product?.thanhphan ? Product?.thanhphan : ""}
                          </Text>
                          {/* <Text className="text-sm desc text-blue-dark overflow-ellipsis mt-1 whitespace-pre-line">
                            {Product ? Product?.chitiet : ""}
                          </Text> */}
                        </>
                      ))}
                  </Box>
                </Box>
              </Tab>
              <Tab id="tab-3">
                <Box className="TabSanPham">
                  <Box style={{ maxHeight: "300px", overflow: "scroll" }}>
                    <Text className="text-sm font-semibold mt-2">Sử dụng</Text>
                    <Text className="text-sm desc text-blue-dark overflow-ellipsis mt-1 whitespace-pre-line">
                      {Product && Product?.huongdan
                        ? Product.huongdan
                        : "Chưa có thông tin hướng dẫn"}
                    </Text>
                  </Box>
                </Box>
              </Tab>
            </Tabs>
          </Box>
          <Box
            m={0}
            p={0}
            style={{
              width: "100%",
              height: "5px",
              // backgroundColor: 'red',

              WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
              boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
            }}
            className="BoxLine"
          ></Box>
          <Box
            mt={5}
            className="p-3 flex justify-between items-center"
            style={{
              background: "#f2f2f40",
              borderRadius: 10,
              border: `1px solid rgb(211 229 186)`,
            }}
          >
            <p
              className="m-0 flex gap-2 items-center"
              onClick={() =>
                openShareWindow(Product?.HinhAnh, Product?.ten, Product?.id)
              }
            >
              <FaSquareShareNodes size={30} fill={Color.textAPPGreen} />
              <Text
                className="text-base  "
                style={{ color: Color.textAPPGreen, height: 20 }}
              >
                Chia sẻ ngay cho bạn bè
              </Text>
            </p>
            <FaChevronRight color={Color.textAPPGreen} style={{ marginTop: 3 }} />
          </Box>
        </Card>
        <Card>
          <Box
            flex
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            style={{ flex: 1 }}
          >
            <Box
              flex
              justifyContent="space-between"
              alignItems="center"
              style={{ width: "100%" }}
              m="0"
              p="0"
            >
              <Box m="0" p="0" className="logo-imex "></Box>
              <span
                style={{ fontSize: "13px" }}
                className="text-base font-normal  mt-2 text-green-imex"
              >
                SẢN PHẨM CÙNG LOẠI
              </span>
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
            <Box m={0} py={0} width={"100%"}>
              <Swiper
                pagination
                slidesPerView={3}
                spaceBetween={16}
                className="px-4"
                // speed={10000}
                loop={true}
                // autoplay={true}
                effect={"cards"}
              >
                {list_sp_tt.map((sp, index) => (
                  <SwiperSlide
                    className="customx"
                    style={{ width: "100px", minHeight: "200px" }}
                    key={index + ""}
                  >
                    <div
                      key={index + ""}
                      onClick={() => {
                        let x = sp
                        x.title = sp.ten
                        x.HinhAnh = sp.HinhAnh
                        setProduct(sp)
                        document
                          .getElementById("topSection")
                          .scrollIntoView({ behavior: "smooth" })
                      }}
                      //  animate
                      //  transition='zmp-cover-v'
                    >
                      <Box p="0" m="0" key={index + ""} style={{ width: "100%" }}>
                        <Box
                          className="bg-cover "
                          style={{
                            backgroundImage: `url(${sp.HinhAnh})`,
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            backgroundSize: "cover",
                          }}
                        ></Box>
                        <Box m="0" p="0">
                          <Text
                            className=" textline2 typo-body typo-body-normal"
                            style={{ fontSize: "10px" }}
                          >
                            {sp.ten}
                          </Text>
                          {/* <Text
                            style={{ color: Color.textAPPGreen, fontSize: "11px" }}
                            className="font-sm "
                          >
                            {CusInfo?.mucduyet == 2 &&
                              formatCurrency(sp.dongia, true) + "đ"}
                          </Text> */}
                        </Box>
                      </Box>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box
        className=""
        noSpace={true}
        flex
        style={{ width: "100%", height: heightFooter + 45 }}
        alignItems="center"
        justifyContent="space-between"
      ></Box>
      {/* FOOTER — GIỮ NGUYÊN UI, CHỈ SỬA LOGIC */}
      {!loading && CusInfo ? (
        CusInfo.active !== "0" ? (
          <Box
            m="0"
            className="mx-0 "
            slot="fixed"
            style={{
              minHeight: heightFooter,
              width: "100%",
              position: "fixed",
              bottom: 0,
              zIndex: 999,
              justifyContent: "center",
              background: Color.BackGroundLightWhite,
              borderTop: `1px solid ${Color.BackGroundNuti_gray}`,
              padding: 20,
            }}
          >
            <Box
              flex
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              m="0"
              p="0"
            >
              <Box>
                <Text style={{ fontSize: 13, color: Color.textAPPGreen }}>
                  Đơn giá
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Color.primary,
                  }}
                >
                  {formatCurrency((Product?.dongia || 0) * soluong)}
                </Text>
              </Box>

              <Box
                flex
                alignItems="center"
                style={{
                  gap: 10,
                  border: `0.5px solid ${ConvertOpacity(
                    Color.BackGroundNuti_gray3,
                    0.0
                  )}`,
                  borderRadius: 8,
                  padding: 5,
                }}
              >
                <Button
                  className="filter-button-plus view-center"
                  color="white"
                  style={{
                    backgroundColor: ConvertOpacity(
                      Color.BackGroundLightWhite,
                      0.5
                    ),
                    color: "#333",
                    padding: 10,
                  }}
                  onClick={() =>
                    setSoluongsp((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  <FaMinus color={Color.textAPPGreen} size={14} />
                </Button>

                <Text
                  size="xlarge"
                  style={{
                    minWidth: 40,
                    color: Color.textAPPGreen,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {soluong}
                </Text>

                <Button
                  className="filter-button-plus view-center"
                  color="white"
                  style={{
                    backgroundColor: ConvertOpacity(
                      Color.BackGroundLightWhite,
                      0.5
                    ),
                    color: "#fff",
                    padding: 10,
                  }}
                  onClick={() => setSoluongsp((prev) => prev + 1)}
                >
                  <FaPlus color={Color.textAPPGreen} size={14} />
                </Button>
              </Box>
            </Box>

            <Box m="0" p="0" flex style={{ width: "100%", gap: 5 }}>
              <Link onClick={backHome}>
                <Box
                  m="0"
                  p="0"
                  flex
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    backgroundColor: ConvertOpacity(Color.textAPPGreen, 0.1),
                    borderRadius: 5,
                    width: "50px",
                    height: "50px",
                    border: `1px solid ${ConvertOpacity(
                      Color.textAPPGreen,
                      0.2
                    )}`,
                  }}
                >
                  <IoChevronBack color={Color.textAPPGreen} />
                </Box>
              </Link>

              <Button
                small
                className="filter-button view-center"
                style={{
                  backgroundColor: Color.textAPPGreen2,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  borderRadius: 5,
                }}
                onClick={onClickAddGH}
              >
                <Text
                  style={{
                    color: Color.BackGroundLightWhite,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Thêm vào giỏ
                </Text>
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            m="0"
            className="mx-0 "
            slot="fixed"
            style={{
              minHeight: 100,
              width: "100%",
              position: "fixed",
              bottom: 0,
              zIndex: 999,
              justifyContent: "center",
              background: Color.BackGroundLightWhite,
              borderTop: `1px solid ${Color.BackGroundNuti_gray}`,
              padding: 20,
            }}
          >
            <Box m="0" p="0" flex style={{ width: "100%", gap: 5 }}>
              <Link onClick={backHome}>
                <Box
                  m="0"
                  p="0"
                  flex
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    backgroundColor: ConvertOpacity(Color.textAPPGreen, 0.1),
                    borderRadius: 5,
                    width: "50px",
                    height: "50px",
                    border: `1px solid ${ConvertOpacity(
                      Color.textAPPGreen,
                      0.2
                    )}`,
                  }}
                >
                  <IoChevronBack color={Color.textAPPGreen} />
                </Box>
              </Link>

              <Button
                small
                className="filter-button view-center"
                style={{
                  backgroundColor: Color.textAPPGreen2,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  borderRadius: 5,
                }}
                onClick={openChatScreen}
              >
                <RiMessage2Fill
                  color={Color.BackGroundLightWhite}
                  style={{ margin: 5 }}
                />
                <Text
                  style={{
                    color: Color.BackGroundLightWhite,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Liên hệ qua Zalo
                </Text>
              </Button>
            </Box>
          </Box>
        )
      ) : (
        <></>
      )}

    </Page>
  )
}
const styles = {
  ButtonBack: {
    position: "absolute",
    top: 17,
    left: 17,
    width: 40,
    height: 40,
    borderRadius: 20,

    // backgroundColor: "rgba(82, 130, 255, 0.2)",
  },
  BoxLine: {
    boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);",
  },

  btnViewGiohang: {
    width: "100%",
    // position: "absolute",
    // bottom: 0,
    // borderTopWidth: 1,
    // borderColor: "#dbdfe2",
    // backgroundColor:"white"
  },
}
export default withOverlay(Detail)
