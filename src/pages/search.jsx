import LoadingSpinner from "@components/LoadingSpinner"
import Color from "@components/common/Color"
import { formatCurrency, requestWithAbortController } from "@utils/networking"
import { BiSolidCartAdd } from "react-icons/bi"
import { useEffect, useRef, useState } from "react"
import {
  Box,
  Icon,
  Link,
  Page,
  Searchbar,
  Text,
  useStore,
  zmp,
  zmpready,
} from "zmp-framework/react"
import useDebounce from "../hooks/useDebounce"
import store from "../store"
import "./../styles/giohang.scss"
import withOverlay from "@components/HOC/withOverlay"
import { TiShoppingCart } from "react-icons/ti"
import { ConvertOpacity } from "@utils/ConvertOpacity"
const SearchPage = ({ zmproute, showToast }) => {
  const abortController = useRef(new AbortController())

  const [keyword, setKeyword] = useState("")
  const [listData, setListData] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastPage, setLastPage] = useState(false)
  const SInput = useRef(null)
  const CusInfo = useStore("getCusInfo")
  const ListGiohang = useStore("getGioHang")
  console.log("zmproute.query", listData)
  const keywordDebounce = useDebounce(keyword, 400)
  const Giohangx = store.getters.getGioHang.value || []
  useEffect(() => {
    console.log("zmproute.query__", zmproute.query)
    if (Giohangx?.length > 0) {
      zmp.toolbar.hide("#main-nav")
    }
    Searching(false)
  }, [])

  const Searching = (isLoadMore) => {
    abortController.current.abort()
    abortController.current = new AbortController()

    if (zmproute.query && zmproute.query.id) {
      setTimeout(() => {
        setdataSearch(
          keyword,
          zmproute.query.clten,
          zmproute.query.id,
          isLoadMore,
          abortController
        )
      }, 200)
    } else if (zmproute.query && zmproute.query.ctkmid) {
      setTimeout(() => {
        setdataSearch(
          keyword,
          "",
          zmproute.query.ctkmid,
          isLoadMore,
          abortController
        )
      }, 200)
    } else {
      setTimeout(() => {
        setdataSearch(keyword, "", "", isLoadMore, abortController)
      }, 200)
    }
  }

  const addToCar = (Product) => {
    let p = Product
    p.soluong = 1
    p.title = Product.ten
    p.thumbnail = Product.HinhAnh
    console.log("addToCar__", p)
    store.dispatch("SetAddGioHang", p)
    showToast("Thêm vào giỏ hàng thành công.", "success", 1000, "top")
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

  const setdataSearch = async (
    keySearch,
    idchungloai,
    ctkmid,
    isLoadMore,
    abortController
  ) => {
    // console.log('keySearch',keySearch)
    setLoading(true)
    let queryString = {
      userId: CusInfo?.KHACHHANG_fk,
      spId: idchungloai ? "" : keySearch,
      idchungloai: idchungloai ? idchungloai : "",
      ctkmid: ctkmid ? ctkmid : "",
      lastId:
        listData.length > 0 && isLoadMore ? listData[listData.length - 1]?.id : "",
    }
    console.log("queryString", queryString)
    //getdata api
    try {
      const response = await (
        await requestWithAbortController(
          "POST",
          "khachhang/getListSP/?",
          {
            userId: CusInfo?.KHACHHANG_fk,
            spId: idchungloai ? "a" : keySearch,
            idchungloai: idchungloai ? idchungloai : "",
            ctkmid: ctkmid ? ctkmid : "",
            lastId:
              listData.length > 0 && isLoadMore
                ? listData[listData.length - 1]?.id
                : "",
          },
          queryString,
          abortController
        )
      ).json()
      console.log("response__-", response)
      if (response) {
        setLoading(false)
        let p = JSON.parse(response.message)
        if (isLoadMore) {
          setListData((prev) => [...prev, ...p])
        } else {
          setListData(p)
        }

        console.log("__logcheck", p.length, listData.length, response.content, p)

        if (p.length + listData.length >= (response.content || 0)) {
          setLastPage(true)
        } else {
          setLastPage(false)
        }

        setQuantity(response.content || 0)
      }
    } catch (error) {
      setLoading(false)
      console.log("Error request api x ", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLastPage(false)
    Searching(false)
  }, [keywordDebounce])

  return (
    <Page
      // className="menu-page"
      onPageBeforeIn={() => {
        console.log("views___", zmp.views)
        zmp.toolbar.hide("#main-nav")
      }}
      onPageAfterIn={() => {
        console.log("views___", zmp.views)
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      {/* <NavigationBar active={zmproute.path} /> */}
      <Box
        className="HeaderBox pt-st"
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
        slot="fixed"
        // style={{ height: 150 }}
      >
        <Box flex alignItems="center" m={5}>
          <Box flex justifyContent="space-between" m="0">
            <Box m={0} flex justifyContent="center" alignItems="center">
              <Link
                back
                animate
                onClick={() => {
                  store.dispatch("SetCurentProduct", {})
                }}
                className="RoundIcon3"
              >
                <Icon color="black" size={20} zmp="zi-chevron-left-header"></Icon>
              </Link>
              <Box pl={2}>
                <Text
                  alignContent="center"
                  size="large"
                  style={{ fontWeight: "800" }}
                  className=" text-blue-imex"
                >
                  {quantity} Sản phẩm
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        px="5"
        pb="5"
        m="0"
        slot="fixed"
        style={{ backgroundColor: "transparent" }}
      >
        <Searchbar
          ref={SInput}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          placeholder="Nhập mã sản phẩm cần tìm"
          clearButton
          // onSearchbarClear={() => setKeyword('')}
          init
        />
      </Box>

      <Box px="0" p="0" m="0">
        {listData.length > 0 ? (
          <Box className="view-center-gh">
            {listData.map((item, index) => (
              <Box
                className="box-shadow-Pure"
                key={index}
                mb="3"
                p="2"
                style={{ borderRadius: 10, background: "white" }}
              >
                <Box flex alignItems="center" className="gap-1">
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
                      style={{
                        width: 60,
                        height: 60,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${encodeURI(
                            item?.HinhAnh ||
                              item?.HinhAnh1 ||
                              item?.HinhAnh2 ||
                              item?.HinhAnhgoc
                          )})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    </Box>
                  </Box>
                  <Link
                    style={{ width: "100%" }}
                    onClick={() => {
                      console.log("checker_", zmp.views)

                      // zmpready(() => {
                      //   store.dispatch("SetCurentProduct", {
                      //     title: item.ten,
                      //     thumbnail: item.HinhAnh,
                      //     ...item,
                      //   })
                      // })
                      zmp.views.current.router.navigate("/detail/?id=" + item.id)
                    }}
                    animate
                    transition="zmp-cover-v"
                    noLinkClass
                  >
                    <Box style={{ width: "100%", margin: 0 }}>
                      <Box alignItems="center">
                        <Text
                          size="normal"
                          className="font-extrabold text-blue-imex "
                          style={{
                            width: "100%",
                            fontSize: "13px",
                            marginBottom: 12,
                          }}
                        >
                          {item.ten}
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
                            Mã {item.ma}
                          </Text>
                          <Text
                            className="desc overflow-ellipsis "
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              color: Color.textAPPGreen,
                            }}
                          >
                            {formatCurrency(item.dongia, true) + "₫"}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                  <Box mx="0" my="0" style={{}}>
                    {CusInfo?.active !== "0" && (
                      <Link onClick={() => addToCar(item)} className="btnAdd">
                        <BiSolidCartAdd
                          size={20}
                          color={ConvertOpacity(Color.textAPPCopper3, 0.8)}
                        />
                      </Link>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            {loading && <LoadingSpinner />}
            {!loading && !lastPage && listData.length > 0 && (
              <button
                className="py-3 flex flex-row items-center justify-center"
                onClick={() => Searching(true)}
              >
                <Text
                  style={{
                    color: Color.textAPPDefault,
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  Xem thêm
                </Text>
                {/* <Icon color={Color.textAPPDefault} zmp="zi-arrow-down"></Icon> */}
              </button>
            )}
          </Box>
        ) : (
          <Box className="flex-1 flex justify-center items-center pb-24">
            {loading ? (
              <Box
                flex
                className="view-center-gh"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <LoadingSpinner></LoadingSpinner>
              </Box>
            ) : (
              <Text size="xSmall" className="text-gray">
                Không tìm thấy kết quả. Vui lòng thử lại
              </Text>
            )}
          </Box>
        )}
      </Box>
      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
      {CusInfo?.active !== "0" && (
        <Link
          onClick={() => {
            zmp.views.main?.router?.clearPreviousHistory()
            if (zmp.views.main?.router?.currentRoute?.path !== "/") {
              zmp.views.main.router.navigate("/", {
                reloadCurrent: true,
              })
            }

            setTimeout(() => {
              zmp.toolbar.hide("#main-nav")
              zmp.tab.show("#view-giohang")

              zmp.views.giohang?.router?.navigate("/giohang/", {
                animate: true,
                transition: "zmp-cover-v",
                // clearPreviousHistory: true,
              })
            }, 150)
          }}
        >
          <Box
            className="floating-cart-btn box-shadow-Pure"
            style={{
              position: "fixed",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: Color.textAPPCopper,
              borderRadius: 5,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",

              zIndex: 999,
            }}
          >
            <TiShoppingCart color="white" size={20} style={{ marginRight: 8 }} />
            <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
              Giỏ hàng ({ListGiohang.length})
            </Text>
          </Box>
        </Link>
      )}
    </Page>
  )
}
const styles = {
  body: { width: "100%", height: "100%" },
}
export default withOverlay(SearchPage)
