import React, { useEffect, useMemo, useRef } from "react"
import { Link, Tabbar, useStore } from "zmp-framework/react"
import {
  IoCart,
  IoCartOutline,
  IoHome,
  IoHomeOutline,
  IoPeople,
  IoPeopleOutline,
  IoPersonCircle,
  IoPersonCircleOutline,
} from "react-icons/io5"
import { TbRosetteDiscount, TbRosetteDiscountFilled } from "react-icons/tb"

// Khuyến mãi: huy hiệu có dấu % (ký hiệu sale quen thuộc), nét mỏng lại cho đều với bộ Ionicons của các tab khác
const KhuyenMaiIcon = (props) => <TbRosetteDiscount strokeWidth={1.6} {...props} />

// Một ô trên thanh tab: icon viền khi chưa chọn, icon đặc + màu primary khi đang chọn (kiểu app thương mại điện tử)
const TabItem = ({ tabLink, active, Icon, IconActive, label, badge, ...rest }) => (
  <Link noLinkClass tabLink={tabLink} className={"app-tabbar-item" + (active ? " is-active" : "")} {...rest}>
    <span className="app-tabbar-pill">
      <span className="relative flex h-6 w-6 items-center justify-center">
        {active ? <IconActive size={22} /> : <Icon size={22} />}
        {badge > 0 && (
          // key đổi theo số lượng để hiệu ứng "nảy" chạy lại mỗi khi thêm/bớt sản phẩm
          <span key={badge} className="app-tabbar-badge">{badge > 99 ? "99+" : badge}</span>
        )}
      </span>
    </span>
    <span className="app-tabbar-label">{label}</span>
  </Link>
)

const SCROLL_TOP_ALWAYS_SHOW = 40 // gần đầu trang thì luôn hiện
const SCROLL_DISTANCE = 24 // phải cuộn liên tục quá khoảng này mới đổi trạng thái, tránh nhấp nháy khi cuộn nhẹ

// Cuộn xuống thì ẩn thanh tab, cuộn lên hoặc cuộn tới cuối trang thì hiện lại (kiểu app thương mại điện tử).
// Dùng class riêng (không gọi zmp.toolbar.hide/show) để không đụng tới các trang đang cố ý ẩn thanh tab
// như chi tiết sản phẩm, tìm kiếm...
// Bật/tắt class thẳng trên DOM, KHÔNG qua className của <Tabbar>: Tabbar có hidden={true} nên mỗi lần React
// render lại sẽ gắn lại class `toolbar-hidden`, đè lên zmp.toolbar.show() và làm thanh tab mất hẳn.
const useHideOnScroll = (activeTab) => {
  const hiddenRef = useRef(false)

  const update = (value) => {
    if (hiddenRef.current === value) return
    hiddenRef.current = value
    document.getElementById("main-nav")?.classList.toggle("is-scroll-hidden", value)
  }

  // đổi tab thì luôn hiện lại
  useEffect(() => update(false), [activeTab])

  useEffect(() => {
    const anchors = new WeakMap() // mỗi vùng cuộn nhớ vị trí bắt đầu đổi hướng

    const onScroll = (e) => {
      const el = e.target
      // chỉ xét vùng cuộn chính của trang trong các tab, bỏ qua sheet/popup và các slider cuộn ngang
      if (!(el instanceof Element) || !el.classList.contains("page-content")) return
      if (!el.closest(".view") || el.closest(".sheet-modal, .popup, .popover, .dialog")) return
      // giỏ hàng có thanh thanh toán cố định ở đáy, ẩn thanh tab sẽ lộ dải trống bên dưới nên giữ nguyên
      if (el.closest("#cart-page")) return

      const top = el.scrollTop
      const maxTop = el.scrollHeight - el.clientHeight
      if (top < 0 || top > maxTop) return // bỏ qua hiệu ứng nảy khi kéo quá đầu/cuối trang (iOS)

      // gần đầu trang, hoặc đã tới cuối trang (thanh tab lấp đúng khoảng chừa sẵn ở cuối, không để trống)
      if (top < SCROLL_TOP_ALWAYS_SHOW || top >= maxTop - SCROLL_DISTANCE) {
        anchors.set(el, top)
        update(false)
        return
      }

      const anchor = anchors.has(el) ? anchors.get(el) : top
      const delta = top - anchor
      if (hiddenRef.current) {
        // đang ẩn: nhớ điểm sâu nhất, cuộn ngược lên đủ xa thì hiện
        if (delta > 0) anchors.set(el, top)
        else if (-delta > SCROLL_DISTANCE) {
          anchors.set(el, top)
          update(false)
        }
      } else {
        // đang hiện: nhớ điểm cao nhất, cuộn xuống đủ xa thì ẩn
        if (delta < 0) anchors.set(el, top)
        else if (delta > SCROLL_DISTANCE) {
          anchors.set(el, top)
          update(true)
        }
      }
    }

    // sang trang mới thì hiện lại
    const onPageIn = () => update(false)

    // sự kiện scroll không nổi bọt nên phải bắt ở pha capture
    document.addEventListener("scroll", onScroll, true)
    document.addEventListener("page:beforein", onPageIn)
    return () => {
      document.removeEventListener("scroll", onScroll, true)
      document.removeEventListener("page:beforein", onPageIn)
    }
  }, [])
}

const NavigationBar = ({ activeTab }) => {
  const Giohangx = useStore("getGioHang")
  // đổi số lượng trong giỏ chỉ sửa phần tử của mảng, theo dõi thêm phiên bản để badge cập nhật ngay
  const gioHangVer = useStore("gioHangVer")
  const ListKM = useStore("ListKM")
  const ListCTTLXu = useStore("ListCTTLXu")
  const ListCTTLDiem = useStore("ListCTTLDiem")
  const CusInfo = useStore("getCusInfo")
  const cartItemCount = useMemo(() => {
    const list = Giohangx || []
    return list.reduce((sum, it) => sum + (Number(it.soluong) > 0 ? Number(it.soluong) : 1), 0)
  }, [Giohangx, gioHangVer, JSON.stringify(Giohangx)])
  useHideOnScroll(activeTab)

  return (
    <Tabbar id="main-nav" bottom className="app-tabbar" hidden={true}>
      <TabItem
        tabLink="#view-main"
        tabLinkActive
        active={activeTab === "main"}
        Icon={IoHomeOutline}
        IconActive={IoHome}
        label="Trang chủ"
      />
      <TabItem
        tabLink="#view-search"
        force={ListKM.length == 0 || ListCTTLDiem.length == 0 || ListCTTLXu.length == 0}
        active={activeTab === "khuyenMaiList"}
        Icon={KhuyenMaiIcon}
        IconActive={TbRosetteDiscountFilled}
        label="Khuyến mãi"
      />
      {CusInfo?.active !== "0" && (
        <TabItem
          tabLink="#view-giohang"
          active={activeTab === "giohang"}
          Icon={IoCartOutline}
          IconActive={IoCart}
          label="Giỏ hàng"
          badge={cartItemCount}
        />
      )}
      <TabItem
        tabLink="#khachhang"
        active={activeTab === "khachhang"}
        Icon={IoPeopleOutline}
        IconActive={IoPeople}
        label="Khách hàng"
      />
      <TabItem
        tabLink="#view-account"
        active={activeTab === "taikhoan"}
        Icon={IoPersonCircleOutline}
        IconActive={IoPersonCircle}
        label="Tài khoản"
      />
    </Tabbar>
  )
}
NavigationBar.propTypes = {}
NavigationBar.displayName = "zmp-toolbar"
export default NavigationBar
