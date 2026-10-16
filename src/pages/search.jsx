import LoadingSpinner from "@components/LoadingSpinner"
import { PillTabs } from "@components/ui"
import Color from "@components/common/Color"
import { formatCurrency, requestWithAbortController } from "@utils/networking"
import { useEffect, useMemo, useRef, useState } from "react"
import { Box, Page, useStore, zmp } from "zmp-framework/react"
import useDebounce from "../hooks/useDebounce"
import store from "../store"
import "./../styles/giohang.scss"
import withOverlay from "@components/HOC/withOverlay"
import AppHeader from "@components/Header/AppHeader"
import { TiShoppingCart } from "react-icons/ti"
import Post from "@components/Product"
import { MdArrowDownward, MdArrowUpward, MdChevronRight, MdClose, MdFilterList, MdHistory, MdSearch } from "react-icons/md"
import BrandPickerSheet from "@components/Search/BrandPickerSheet"

const PAGE_SIZE_SEARCH = 20

const SORTS = [
  { key: "new", label: "Mới nhất" },
  { key: "priceAsc", label: "Giá", icon: MdArrowUpward },
  { key: "priceDesc", label: "Giá", icon: MdArrowDownward },
]

// Lịch sử tìm kiếm lưu trên máy (localStorage có thể bị chặn nên luôn try/catch)
const HISTORY_KEY = "search_history"
const HISTORY_MAX = 8
const readHistory = () => {
  try {
    const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
    return Array.isArray(v) ? v : []
  } catch (e) {
    return []
  }
}
const writeHistory = (list) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
  } catch (e) {}
}

// Gom nhãn hàng từ danh mục trong store (jsonNHANHANG), bỏ trùng theo PK_SEQ
const collectBrands = (categories) => {
  const map = new Map()
  ;(categories || []).forEach((c) => {
    let list = []
    try {
      list = JSON.parse(c?.jsonNHANHANG || "[]")
    } catch (e) {}
    ;(Array.isArray(list) ? list : []).forEach((b) => {
      if (b?.PK_SEQ && !map.has(b.PK_SEQ)) map.set(b.PK_SEQ, { id: b.PK_SEQ + "", ten: b.TEN || "", hinhAnh: b.HINHANH || "" })
    })
  })
  return Array.from(map.values())
}

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-auto shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
      active ? "border-primary bg-primary text-white" : "border-[#d5e2f2] bg-white text-slate-600"
    }`}
  >
    {children}
  </button>
)

const SearchPage = ({ zmproute, showToast }) => {
  const abortController = useRef(new AbortController())

  const [keyword, setKeyword] = useState("")
  const [listData, setListData] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastPage, setLastPage] = useState(false)
  const [sortKey, setSortKey] = useState("new")
  const [brandId, setBrandId] = useState("")
  const [brandSheet, setBrandSheet] = useState(false)
  const [history, setHistory] = useState(readHistory)
  const SInput = useRef(null)
  const CusInfo = useStore("getCusInfo")
  const ListGiohang = useStore("getGioHang")
  const categories = useStore("categories")
  const brands = useMemo(() => collectBrands(categories), [categories])

  const cartItemCount = useMemo(() => {
    const list = ListGiohang || []
    return list.reduce((sum, it) => sum + (Number(it?.soluong) > 0 ? Number(it.soluong) : 1), 0)
  }, [ListGiohang])
  const cartTotal = useMemo(
    () => (ListGiohang || []).reduce((sum, it) => sum + (Number(it?.dongia) || 0) * (Number(it?.soluong) || 1), 0),
    [ListGiohang]
  )
  const keywordDebounce = useDebounce(keyword, 400)
  const Giohangx = store.getters.getGioHang.value || []
  const canBuy = CusInfo?.active !== "0"

  useEffect(() => {
    if (Giohangx?.length > 0) {
      zmp.toolbar.hide("#main-nav")
    }
  }, [])

  // Ref giữ giá trị mới nhất để hàm tải thêm (gọi từ IntersectionObserver) không đọc phải state cũ
  const listRef = useRef([])
  const loadingRef = useRef(false)
  const lastPageRef = useRef(false)
  const keywordRef = useRef("")
  const sortRef = useRef("new")
  const brandRef = useRef("")
  const requestIdRef = useRef(0)
  listRef.current = listData
  loadingRef.current = loading
  lastPageRef.current = lastPage
  keywordRef.current = keyword
  sortRef.current = sortKey
  brandRef.current = brandId

  const Searching = (isLoadMore) => {
    if (isLoadMore && (loadingRef.current || lastPageRef.current)) return
    // tìm mới thì huỷ request đang chạy
    abortController.current.abort()
    abortController.current = new AbortController()

    const q = zmproute.query || {}
    if (brandRef.current) {
      // Lọc theo chip nhãn hàng: vẫn kết hợp với từ khoá
      setdataSearch(keywordRef.current, brandRef.current, q.ctkmid || "", isLoadMore, true)
    } else if (q.id) {
      setdataSearch(keywordRef.current, q.clten, q.id, isLoadMore, false)
    } else if (q.ctkmid) {
      setdataSearch(keywordRef.current, "", q.ctkmid, isLoadMore, false)
    } else {
      setdataSearch(keywordRef.current, "", "", isLoadMore, false)
    }
  }

  const saveHistory = (kw) => {
    const k = (kw || "").trim()
    if (k.length < 2) return
    setHistory((prev) => {
      const next = [k, ...prev.filter((x) => x.toLowerCase() !== k.toLowerCase())].slice(0, HISTORY_MAX)
      writeHistory(next)
      return next
    })
  }

  const clearHistory = () => {
    writeHistory([])
    setHistory([])
  }

  const setdataSearch = async (keySearch, idchungloai, ctkmid, isLoadMore, keepKeyword) => {
    const reqId = ++requestIdRef.current
    setLoading(true)
    loadingRef.current = true
    if (!isLoadMore) setListData([])
    const current = isLoadMore ? listRef.current : []
    const sort = sortRef.current
    const lastId = sort === "new" && current.length > 0 ? current[current.length - 1]?.id : ""
    const pageNumber = Math.floor(current.length / PAGE_SIZE_SEARCH) + 1
    try {
      const response = await (
        await requestWithAbortController(
          "POST",
          "khachhang/searchSP",
          {
            userId: (CusInfo?.KHACHHANG_fk || "") + "",
            keyword: idchungloai && !keepKeyword ? "" : keySearch || "",
            nhanhangId: (idchungloai || "") + "",
            ctkmid: (ctkmid || "") + "",
            lastId: (lastId || "") + "",
            pageNumber,
            pageSize: PAGE_SIZE_SEARCH,
            sort,
          },
          null,
          abortController
        )
      ).json()
      if (reqId !== requestIdRef.current) return // đã có request mới hơn
      if (response?.result) {
        const p = JSON.parse(response.message || "[]")
        if (isLoadMore) {
          setListData((prev) => [...prev, ...p])
        } else {
          setListData(p)
          setQuantity(Number(response.content) || 0)
          if (p.length > 0) saveHistory(keySearch)
        }
        // trang trả về ít hơn pageSize là đã hết
        setLastPage(p.length < PAGE_SIZE_SEARCH)
      }
    } catch (error) {
      // request bị huỷ khi gõ tìm kiếm mới: bỏ qua
      if (error?.name !== "AbortError") console.log("Error request api x ", error)
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false)
        loadingRef.current = false
      }
    }
  }

  // Tìm lại khi đổi từ khoá / sắp xếp / nhãn hàng
  useEffect(() => {
    setLastPage(false)
    Searching(false)
  }, [keywordDebounce, sortKey, brandId])

  // Tải thêm khi cuộn tới cuối: theo dõi mốc ở cuối danh sách
  // (trang cuộn trong .page-content chứ không phải window nên không dùng window.scroll)
  const sentinelRef = useRef(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) Searching(true)
      },
      { rootMargin: "0px 0px 300px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [listData.length > 0])

  // Sang tab Giỏ hàng giống Banner / CTKhuyenMai: quay lại trang trước rồi chuyển tab.
  // Không gọi navigate("/giohang/") trên router của tab giỏ hàng: router đó chỉ được tạo khi tab hiện lần đầu
  // (initRouterOnTabShow) và tab tự cập nhật URL trong onTabShow.
  const goToCart = () => {
    try {
      zmp.views.current?.router?.back()
    } catch (e) {
      console.log("back fail", e)
    }
    setTimeout(() => {
      try {
        zmp.tab.show("#view-giohang")
      } catch (e) {
        console.log("open cart tab fail", e)
      }
    }, 250)
  }

  const brandName = brands.find((b) => b.id === brandId)?.ten
  const showHistory = !keyword && history.length > 0
  const showCartBar = canBuy && cartItemCount > 0

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      onPageAfterIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-slate-50"
    >
      <AppHeader
        title={`${quantity} Sản phẩm`}
        back
        bordered={false}
        onBackClick={() => {
          store.dispatch("SetCurentProduct", {})
        }}
        right={
          <button
            type="button"
            aria-label="Giỏ hàng"
            onClick={canBuy ? goToCart : undefined}
            className="relative noti-icon-wrapper h-auto w-auto shrink-0 border-0 bg-transparent p-0"
          >
            {cartItemCount > 0 && (
              <span className="absolute giohang-tab-badge border-2 border-white leading-none text-white bg-red">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
            <TiShoppingCart color={Color.primary} size={22} />
          </button>
        }
      />

      {/* Ô tìm kiếm + sắp xếp + nhãn hàng: cố định dưới header */}
      <Box m="0" p="0" slot="fixed" className="border-b border-[#e6ebf2] bg-white pb-2">
        {/* Ô tìm kiếm */}
        <div className="px-3 pt-1">
          <div className="flex h-10 items-center gap-2 rounded-full border border-[#E3EBF6] bg-[#f1f5fa] pl-3.5 pr-1.5 transition-colors focus-within:border-primary focus-within:bg-white">
            <MdSearch size={20} className="shrink-0 text-slate-400" />
            <input
              ref={SInput}
              type="text"
              inputMode="search"
              enterKeyHint="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur() // ẩn bàn phím, kết quả đã tự tìm khi gõ
              }}
              placeholder="Tìm tên hoặc mã sản phẩm"
              // tắt viền/bóng mặc định của zmp-ui và app.scss (input[type=text], :focus)
              style={{ border: "none", boxShadow: "none", borderRadius: 0, padding: 0, background: "transparent", outline: "none" }}
              className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
            />
            {keyword && (
              <button
                type="button"
                aria-label="Xoá từ khoá"
                onClick={() => {
                  setKeyword("")
                  SInput.current?.focus()
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-0 bg-[#e2e8f0] text-slate-500"
              >
                <MdClose size={14} />
              </button>
            )}
          </div>
        </div>
        {/* Sắp xếp (chia đều 3 phần) + nút chọn nhãn hàng, cùng 1 hàng */}
        <div className="flex items-center gap-2 px-3 pt-2">
          <PillTabs className="min-w-0 flex-1" variant="segmented" tabs={SORTS} value={sortKey} onChange={setSortKey} />

          {brands.length > 0 &&
            (brandId ? (
              // Đã chọn: hiện tên nhãn hàng + nút bỏ lọc
              <div className="flex max-w-[42%] shrink-0 items-center rounded-full border border-primary bg-[#f3f8fd] text-primary">
                <button
                  type="button"
                  onClick={() => setBrandSheet(true)}
                  className="flex w-auto min-w-0 items-center gap-1 border-0 bg-transparent py-1.5 pl-3 pr-1 text-[12px] font-semibold"
                >
                  <MdFilterList size={14} className="shrink-0" />
                  <span className="truncate">{brandName}</span>
                </button>
                <button
                  type="button"
                  aria-label="Bỏ lọc nhãn hàng"
                  onClick={() => setBrandId("")}
                  className="flex h-7 w-7 shrink-0 items-center justify-center border-0 bg-transparent"
                >
                  <MdClose size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setBrandSheet(true)}
                className="flex w-auto shrink-0 items-center gap-1 rounded-full border border-[#d5e2f2] bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600"
              >
                <MdFilterList size={14} />
                Nhãn hàng
              </button>
            ))}
        </div>
      </Box>

      <BrandPickerSheet
        visible={brandSheet}
        onClose={() => setBrandSheet(false)}
        brands={brands}
        value={brandId}
        onChange={setBrandId}
      />

      <div className="px-3" style={{ paddingBottom: showCartBar ? 110 : 40 }}>
        {/* Tìm kiếm gần đây */}
        {showHistory && (
          <div className="mt-3 rounded-xl border border-[#E3EBF6] bg-white px-3 py-2.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[13px] font-semibold text-slate-700">
                <MdHistory size={16} className="text-slate-400" />
                Tìm kiếm gần đây
              </span>
              <button type="button" onClick={clearHistory} className="w-auto border-0 bg-transparent p-0 text-xs text-slate-400">
                Xoá
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setKeyword(h)}
                  className="w-auto rounded-full border-0 bg-[#f1f5fa] px-3 py-1 text-[12px] text-slate-600"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {listData.length > 0 ? (
          <>
            {/* Lưới 2 cột: dùng style trực tiếp vì giohang.scss có rule .grid (3 cột) ghi đè class grid của Tailwind */}
            <div
              className="pt-3"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}
            >
              {listData.map((item, index) => (
                <Post key={item?.id || index + ""} {...item} CusInfo={CusInfo} mucduyet={1} variant="grid" />
              ))}
            </div>

            {/* Mốc cuối danh sách: cuộn tới đây thì tự tải thêm */}
            <div ref={sentinelRef} className="h-px w-full" />

            {loading && (
              <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
                <LoadingSpinner />
              </div>
            )}

            {/* Dự phòng khi máy không hỗ trợ tự tải thêm */}
            {!loading && !lastPage && typeof IntersectionObserver === "undefined" && (
              <button
                type="button"
                className="mx-auto block w-auto border-0 bg-transparent py-3 text-[13px] font-medium text-primary"
                onClick={() => Searching(true)}
              >
                Xem thêm
              </button>
            )}

            {!loading && lastPage && (
              <div className="py-4 text-center text-xs text-slate-400">Đã hiển thị tất cả sản phẩm</div>
            )}
          </>
        ) : loading ? (
          // Khung xương 2 cột trong lúc tìm
          <div className="pt-3" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Post key={i} loading variant="grid" />
            ))}
          </div>
        ) : (
          // Không có kết quả
          <div className="flex flex-col items-center px-4 pt-16 text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4fb]">
              <MdSearch size={28} className="text-primary" />
            </span>
            <div className="text-[15px] font-semibold text-slate-800">Không tìm thấy sản phẩm</div>
            <div className="mt-1 text-[13px] text-slate-500">
              {keyword || brandName
                ? `Không có kết quả cho ${[keyword && `"${keyword}"`, brandName].filter(Boolean).join(" trong ")}. Thử từ khoá khác nhé.`
                : "Thử nhập tên hoặc mã sản phẩm."}
            </div>
            {(keyword || brandId) && (
              <button
                type="button"
                onClick={() => {
                  setKeyword("")
                  setBrandId("")
                }}
                className="mt-4 w-auto rounded-full border border-primary bg-white px-4 py-2 text-[13px] font-semibold text-primary"
              >
                Xoá bộ lọc
              </button>
            )}
            {brands.length > 0 && (
              <>
                <div className="mb-2 mt-6 text-xs text-slate-400">Hoặc xem theo nhãn hàng</div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {brands.slice(0, 6).map((b) => (
                    <Chip
                      key={b.id}
                      active={false}
                      onClick={() => {
                        setKeyword("")
                        setBrandId(b.id)
                      }}
                    >
                      {b.ten}
                    </Chip>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Thanh giỏ hàng nổi */}
      {showCartBar && (
        <div
          className="fixed bottom-0 left-0 z-[999] w-full px-3 pt-2"
          style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            type="button"
            onClick={goToCart}
            className="flex w-full items-center gap-3 rounded-2xl border-0 bg-primary px-4 py-3 text-white shadow-[0_6px_16px_rgba(0,93,170,0.35)] active:opacity-90"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <TiShoppingCart size={20} />
              <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#e5232a] px-1 text-[10px] font-bold leading-[18px]">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[11px] text-white/80">{cartItemCount} sản phẩm trong giỏ</span>
              <span className="block text-[15px] font-bold tabular-nums">{formatCurrency(cartTotal, true)}đ</span>
            </span>
            <span className="flex items-center gap-0.5 text-[13px] font-semibold">
              Xem giỏ hàng <MdChevronRight size={18} />
            </span>
          </button>
        </div>
      )}
    </Page>
  )
}

export default withOverlay(SearchPage)
