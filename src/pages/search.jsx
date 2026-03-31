import LoadingSpinner from "@components/LoadingSpinner"
import Color from "@components/common/Color"
import { requestWithAbortController } from "@utils/networking"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Box,
  Icon,
  Link,
  Page,
  Searchbar,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react"
import useDebounce from "../hooks/useDebounce"
import store from "../store"
import "./../styles/giohang.scss"
import withOverlay from "@components/HOC/withOverlay"
import { TiShoppingCart } from "react-icons/ti"
import Post from "@components/Product"
import {
  MdArrowDownward,
  MdArrowUpward,
  MdCheck,
  MdSearch,
  MdSwapVert,
} from "react-icons/md"
const SearchPage = ({ zmproute, showToast }) => {
  const abortController = useRef(new AbortController())

  const [keyword, setKeyword] = useState("")
  const [listData, setListData] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastPage, setLastPage] = useState(false)
  const [sortKey, setSortKey] = useState("default")
  const [sortOpen, setSortOpen] = useState(true)
  const SInput = useRef(null)
  const CusInfo = useStore("getCusInfo")
  const ListGiohang = useStore("getGioHang")
  const cartItemCount = useMemo(() => {
    const list = ListGiohang || []
    return list.reduce(
      (sum, it) => sum + (Number(it?.soluong) > 0 ? Number(it.soluong) : 1),
      0
    )
  }, [ListGiohang])
  console.log("zmproute.query", listData)
  const keywordDebounce = useDebounce(keyword, 400)
  const Giohangx = store.getters.getGioHang.value || []

  const parseDongia = (v) => {
    const s = String(v ?? "")
    // remove non-digit except dot/comma then convert
    const n = Number(s.replace(/[^\d]/g, ""))
    return Number.isNaN(n) ? 0 : n
  }

  const sortedListData = (() => {
    if (!Array.isArray(listData)) return []
    const arr = [...listData]
    if (sortKey === "lowToHigh") {
      arr.sort((a, b) => parseDongia(a?.dongia) - parseDongia(b?.dongia))
    } else if (sortKey === "highToLow") {
      arr.sort((a, b) => parseDongia(b?.dongia) - parseDongia(a?.dongia))
    }
    return arr
  })()
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
        <Box flex alignItems="center" m={5} style={{ width: "100%" }}>
          <Box className="center flex justify-between w-full" m="0">
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
                  className="text-primary"
                >
                  {quantity} Sản phẩm
                </Text>
              </Box>
            </Box>

            <Box flex alignItems="center">
              <span className="relative noti-icon-wrapper h-auto">
                {cartItemCount > 0 && (
                  <span className="absolute giohang-tab-badge border-2 border-white leading-none text-white bg-red">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
                <TiShoppingCart color={Color.primary} size={22} />
              </span>
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

      {/* Sort filter */}
      <Box px="5" className="mb-3 overflow-hidden w-[200px] p-0 hidden">
        <Box className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <Box
            className="flex items-center justify-between px-4 py-3"
            onClick={() => setSortOpen((v) => !v)}
          >
            <Box className="flex items-center gap-2">
              <MdSwapVert color={Color.primary} size={20} />
              <Text className="text-[16px] font-bold text-primary">Sắp xếp</Text>
            </Box>
            <MdArrowDownward
              color={Color.primary}
              size={20}
              className={sortOpen ? "" : "rotate-180"}
            />
          </Box>

          {sortOpen && (
            <Box>
              {[
                {
                  key: "default",
                  label: "Mặc định",
                  icon: <MdSwapVert color={Color.primary} size={20} />,
                },
                {
                  key: "lowToHigh",
                  label: "Giá thấp tới cao",
                  icon: <MdArrowDownward color={Color.primary} size={20} />,
                },
                {
                  key: "highToLow",
                  label: "Giá cao tới thấp",
                  icon: <MdArrowUpward color={Color.primary} size={20} />,
                },
              ].map((opt) => (
                <Box
                  key={opt.key}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background:
                      sortKey === opt.key ? "rgba(45,91,185,0.06)" : "transparent",
                  }}
                  onClick={() => setSortKey(opt.key)}
                >
                  <Box className="flex items-center gap-3">
                    {opt.icon}
                    <Text className="text-[15px] font-semibold text-[#222]">
                      {opt.label}
                    </Text>
                  </Box>
                  {sortKey === opt.key && (
                    <MdCheck color={Color.primary} size={22} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Box px="0" p="0" m="0">
        {sortedListData.length > 0 ? (
          <Box className="view-center-gh">
            <Box
              className="wrapCatalogs      
          justify-center 
          flex-wrap flex
         
          "
            >
              {sortedListData.map((item, index) => (
                <Post
                  key={item?.id || index + ""}
                  {...item}
                  CusInfo={CusInfo}
                  mucduyet={1}
                />
              ))}
            </Box>

            {loading && <LoadingSpinner />}

            {!loading && !lastPage && sortedListData.length > 0 && (
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
              <Box
                flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ width: "100%", minHeight: 200, gap: 10 }}
              >
                <MdSearch color="#808080" size={32} />
                <Text size="xSmall" className="text-[#808080]">
                  Không tìm thấy sản phẩm
                </Text>
              </Box>
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
        ></Link>
      )}
    </Page>
  )
}
const styles = {
  body: { width: "100%", height: "100%" },
}
export default withOverlay(SearchPage)
