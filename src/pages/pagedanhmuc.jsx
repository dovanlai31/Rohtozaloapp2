import CartFloatingBar, { CART_BAR_SPACE, useCartSummary } from "@components/Cart/CartFloatingBar"
import CategoryThumb from "@components/DanhMucSP/CategoryThumb"
import DanhmucItem from "@components/DanhMucSP/DanhmucItem"
import AppHeader from "@components/Header/AppHeader"
import { EmptyState, SectionTitle } from "@components/ui"
import { useEffect, useMemo, useRef, useState } from "react"
import { MdCategory, MdSearch, MdStorefront } from "react-icons/md"
import { Box, Page, useStore, zmp } from "zmp-framework/react"
import "../styles/promo-motion.css"

const parseBrands = (category) => {
  try {
    const list = JSON.parse(category?.jsonNHANHANG || "[]")
    return Array.isArray(list) ? list : []
  } catch (e) {
    return []
  }
}

// Trang danh mục: chip đổi danh mục + mô tả + lưới nhãn hàng (bấm nhãn hàng -> trang sản phẩm của nhãn hàng)
const PageDanhMuc = ({ zmproute }) => {
  const categories = useStore("categories") || []
  const { visible: showCartBar } = useCartSummary()
  const [active, setActive] = useState(() => {
    const i = Number(zmproute?.query?.index)
    return Number.isInteger(i) && i >= 0 ? i : 0
  })

  const category = categories[active]
  const brands = useMemo(() => parseBrands(category), [category])

  // Chip đang chọn luôn nằm giữa thanh chip
  const chipBarRef = useRef(null)
  useEffect(() => {
    const bar = chipBarRef.current
    const chip = bar?.querySelector(`[data-chip="${active}"]`)
    if (!bar || !chip) return
    const left = chip.offsetLeft - (bar.clientWidth - chip.clientWidth) / 2
    bar.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }, [active, categories.length])

  // Đổi danh mục thì cuộn lên đầu trang
  const contentRef = useRef(null)
  const selectCategory = (i) => {
    if (i === active) return
    setActive(i)
    contentRef.current?.closest(".page-content")?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-slate-50"
    >
      <AppHeader
        title={category?.TEN || "Danh mục sản phẩm"}
        back
        bordered={false}
        right={
          <button
            type="button"
            aria-label="Tìm kiếm"
            onClick={() => zmp.views.current.router.navigate("/search?all=1")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 bg-[#f1f5fa] p-0 text-slate-600"
          >
            <MdSearch size={20} />
          </button>
        }
      />

      {/* Thanh chip danh mục: cố định dưới header, trượt ngang */}
      {categories.length > 1 && (
        <Box m="0" p="0" slot="fixed" className="border-b border-[#e6ebf2] bg-white">
          <div
            ref={chipBarRef}
            className="flex gap-2 overflow-x-auto px-3 pb-2.5 pt-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((c, i) => {
              const selected = i === active
              return (
                <button
                  key={c.PK_SEQ || i}
                  type="button"
                  data-chip={i}
                  onClick={() => selectCategory(i)}
                  className={`w-auto shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-[#d5e2f2] bg-white text-slate-600 active:bg-[#f3f8fd]"
                  }`}
                >
                  {c.TEN}
                </button>
              )
            })}
          </div>
        </Box>
      )}

      {/* key theo danh mục: đổi danh mục thì nội dung chạy lại hiệu ứng hiện dần */}
      <div
        key={active}
        ref={contentRef}
        className="px-4 pt-3"
        style={{ paddingBottom: showCartBar ? CART_BAR_SPACE : 32 }}
      >
        {!category ? (
          <EmptyState
            className="promo-enter"
            icon={<MdCategory size={24} />}
            title="Không tìm thấy danh mục"
            desc="Vui lòng quay lại trang chủ và chọn danh mục khác."
          />
        ) : (
          <>
            {/* Mô tả danh mục */}
            <div
              className="promo-enter flex items-start gap-3 rounded-xl border border-[#E3EBF6] bg-white p-3"
              style={{ "--i": 0 }}
            >
              <CategoryThumb
                src={category.HINHANH}
                name={category.TEN}
                index={active}
                className="h-16 w-16 p-2"
                textClassName="text-xl"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold leading-snug text-slate-700">
                  {category.DIENGIAI || category.TEN}
                </div>
                {category.MOTA && (
                  <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{category.MOTA}</div>
                )}
                {brands.length > 0 && (
                  <div className="mt-1.5 text-[12px] text-slate-500">{brands.length} nhãn hàng</div>
                )}
              </div>
            </div>

            {/* Lưới nhãn hàng */}
            {brands.length > 0 ? (
              <div className="mt-3">
                <SectionTitle icon={<MdStorefront size={15} />}>Nhãn hàng</SectionTitle>
                <div className="flex flex-wrap gap-y-3 rounded-xl border border-[#E3EBF6] bg-white px-1 py-3">
                  {brands.map((item, i) => (
                    <div
                      key={item.PK_SEQ || i}
                      className="promo-enter promo-press flex"
                      style={{ width: "25%", "--i": i + 1 }}
                    >
                      <DanhmucItem item={item} index={i} loai="NHANHANG" fullWidth />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                className="promo-enter"
                icon={<MdStorefront size={24} />}
                title="Danh mục chưa có nhãn hàng"
                desc="Bạn có thể tìm sản phẩm theo tên hoặc mã."
              />
            )}
          </>
        )}
      </div>

      <CartFloatingBar />
    </Page>
  )
}

export default PageDanhMuc
