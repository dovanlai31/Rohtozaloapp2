import Post from "@components/Product"
import { EmptyState, Grid, SectionTitle } from "@components/ui"
import { collectBrands } from "@utils/brands"
import { useEffect, useMemo, useRef, useState } from "react"
import { MdChevronRight, MdInventory2, MdLocalOffer, MdNewReleases, MdStorefront, MdThumbUp } from "react-icons/md"
import { Link, useStore } from "zmp-framework/react"
import { getProducts } from "../../services/productService"
import "../../styles/promo-motion.css"
import BuyAgainStrip from "./BuyAgainStrip"

const HOME_SIZE = 8 // số sản phẩm hiện ở trang chủ, xem thêm ở trang Tìm kiếm
const BRAND_STRIPS = 3 // số dải sản phẩm theo nhãn hàng

const CHIPS = [
  { key: "goiy", label: "Gợi ý", icon: MdThumbUp, params: { sort: "goiy" } },
  { key: "km", label: "Đang khuyến mãi", icon: MdLocalOffer, params: { sort: "goiy", loc: "km" } },
  { key: "new", label: "Mới nhất", icon: MdNewReleases, params: { sort: "new" } },
]

const hideScrollbar = { scrollbarWidth: "none", msOverflowStyle: "none" }

// Dải sản phẩm của 1 nhãn hàng: chỉ tải khi cuộn tới gần (đỡ gọi API khi khách không cuộn xuống)
const BrandStrip = ({ brand, khId, refres, CusInfo, mucduyet }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState(null) // null = chưa tải

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return setVisible(true)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "300px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    getProducts({ userId: khId, sort: "goiy", nhanhangId: brand.id, pageSize: 10 })
      .then(({ list }) => setList(list))
      .catch(() => setList([]))
  }, [visible, khId, refres, brand.id])

  if (list && list.length === 0) return <div ref={ref} />

  return (
    <div ref={ref} className="mt-4">
      <div className="px-4">
        <SectionTitle
          icon={<MdStorefront size={15} />}
          right={
            <Link
              href={`/search?brandId=${brand.id}`}
              noLinkClass
              className="!flex shrink-0 items-center gap-0.5 text-xs font-semibold text-primary"
            >
              Xem <MdChevronRight size={16} />
            </Link>
          }
        >
          {brand.ten}
        </SectionTitle>
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1" style={hideScrollbar}>
        {(list || [0, 1, 2]).map((item, i) =>
          list ? (
            <div key={item.id} className="promo-enter w-[150px] shrink-0" style={{ "--i": i }}>
              <Post {...item} CusInfo={CusInfo} mucduyet={mucduyet} variant="grid" style={{ height: "100%" }} />
            </div>
          ) : (
            <div key={i} className="w-[150px] shrink-0">
              <Post loading variant="grid" />
            </div>
          )
        )}
      </div>
    </div>
  )
}

// Mục sản phẩm ở trang chủ: Mua lại nhanh + lưới sản phẩm có chip lọc + dải sản phẩm theo nhãn hàng
const Latest = (props) => {
  const CusInfo = useStore("getCusInfo")
  const refres = useStore("refres")
  const categories = useStore("categories")
  const khId = CusInfo?.KHACHHANG_fk || ""
  const mucduyet = props?.mucduyet || 1
  const brands = useMemo(() => collectBrands(categories).slice(0, BRAND_STRIPS), [categories])

  const [chip, setChip] = useState("goiy")
  // kết quả đã tải: { [khách|lần làm mới|chip]: { list, total } } -> quay lại chip cũ không phải tải lại,
  // đổi KH / kéo làm mới thì khoá đổi nên tự tải lại
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const cacheKey = `${khId}|${refres}|${chip}`

  useEffect(() => {
    if (data[cacheKey]) return
    const c = CHIPS.find((x) => x.key === chip)
    let alive = true
    setLoading(true)
    getProducts({ userId: khId, pageSize: HOME_SIZE, ...c.params })
      .then((r) => alive && setData((d) => ({ ...d, [cacheKey]: r })))
      .catch(() => alive && setData((d) => ({ ...d, [cacheKey]: { list: [], total: 0 } })))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey])

  const current = data[cacheKey]
  const list = current?.list || []

  return (
    <>
      <BuyAgainStrip />

      <div className="mt-4 px-4">
        <SectionTitle icon={<MdInventory2 size={15} />}>Sản phẩm</SectionTitle>

        {/* Chip lọc nhanh */}
        <div className="-mx-4 mb-2.5 flex gap-2 overflow-x-auto px-4" style={hideScrollbar}>
          {CHIPS.map((c) => {
            const selected = c.key === chip
            const Icon = c.icon
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setChip(c.key)}
                className={`flex w-auto shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  selected ? "border-primary bg-primary text-white" : "border-[#d5e2f2] bg-white text-slate-600"
                }`}
              >
                <Icon size={14} />
                {c.label}
              </button>
            )
          })}
        </div>

        {loading && !current ? (
          <Grid cols={2}>
            {[0, 1, 2, 3].map((i) => (
              <Post key={i} loading variant="grid" />
            ))}
          </Grid>
        ) : list.length > 0 ? (
          <>
            {/* key theo chip: đổi chip thì thẻ chạy lại hiệu ứng hiện dần */}
            <Grid key={chip} cols={2}>
              {list.map((item, i) => (
                <div key={item.id} className="promo-enter flex" style={{ "--i": i }}>
                  <Post {...item} CusInfo={CusInfo} mucduyet={mucduyet} variant="grid" style={{ width: "100%" }} />
                </div>
              ))}
            </Grid>
            <Link
              href="/search?all=1"
              noLinkClass
              className="promo-press mt-3 !flex w-full items-center justify-center gap-1 rounded-xl border border-[#d5e2f2] bg-white py-2.5 text-[13px] font-semibold text-primary"
            >
              Xem tất cả sản phẩm
              {current?.total > list.length && <span className="font-normal text-slate-500">({current.total})</span>}
              <MdChevronRight size={18} />
            </Link>
          </>
        ) : (
          <div className="rounded-xl border border-[#E3EBF6] bg-white">
            <EmptyState
              icon={chip === "km" ? <MdLocalOffer size={24} /> : <MdInventory2 size={24} />}
              title={chip === "km" ? "Chưa có sản phẩm khuyến mãi" : "Chưa có sản phẩm"}
              desc={
                chip === "km"
                  ? "Các sản phẩm đang khuyến mãi sẽ hiển thị tại đây."
                  : "Vui lòng đồng bộ tài khoản qua số điện thoại để xem sản phẩm và giá."
              }
            />
          </div>
        )}
      </div>

      {/* Dải sản phẩm theo nhãn hàng */}
      {brands.map((b) => (
        <BrandStrip key={b.id} brand={b} khId={khId} refres={refres} CusInfo={CusInfo} mucduyet={mucduyet} />
      ))}
    </>
  )
}

export default Latest
