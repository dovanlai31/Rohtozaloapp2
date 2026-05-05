import React, { useMemo, useRef, useState, useEffect, use } from "react"
import propTypes from "prop-types"
import { Link, Tabbar, Text, zmp, Icon, Box, useStore } from "zmp-framework/react"
import {
  ArticleIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  Giohang,
  Bookmark,
  Like,
  ChatIcon,
  Time,
} from "@components/Icons"
import store from "../../store"

const NavigationBar = ({ activeTab, NotifyGH }) => {
  //const Giohangw = store.getters.getGioHang.value || []
  const Giohangx = useStore("getGioHang")
  const ListKM = useStore("ListKM")
  const ListCTTLXu = useStore("ListCTTLXu")
  const ListCTTLDiem = useStore("ListCTTLDiem")
  const CusInfo = useStore("getCusInfo")
  const cartItemCount = useMemo(() => {
    const list = Giohangx || [];
    return list.reduce(
      (sum, it) => sum + (Number(it.soluong) > 0 ? Number(it.soluong) : 1),
      0
    );
  }, [Giohangx, JSON.stringify(Giohangx)]);


  //console.log('CusInfo__log', CusInfo);
  // console.log('activeTabx', activeTab);
  return (
    <Tabbar id="main-nav" bottom className="app-tabbar " hidden={true}>
      <Link
        noLinkClass
        className="flex flex-col items-center	"
        tabLink="#view-main"
        tabLinkActive
      >
        <HomeIcon active={activeTab === "main"} />
        <Text
          size="xxxsmall"
          className="navbar-item-label navbar-item-label text-gray-dark font-extrabold"
        >
          Trang chủ
        </Text>
      </Link>

      <Link
        noLinkClass
        className="flex flex-col items-center	"
        tabLink="#view-search"
        force={
          ListKM.length == 0 || ListCTTLDiem.length == 0 || ListCTTLXu.length == 0
        }
      >
        <Bookmark active={activeTab === "khuyenMaiList"} />
        <Text
          size="xxxsmall"
          className="navbar-item-label text-gray-dark font-extrabold"
        >
          Khuyến mãi
        </Text>
      </Link>
      {/* <Link
        noLinkClass
        className="flex flex-col items-center	"
        tabLink="#view-menu"
        badge="2"
      >

          <Giohang active={activeTab === "menu"} />

        <Text
          size="xxxsmall"
          className="navbar-item-label text-gray-dark font-extrabold"
        >
          Đơn hàng
        </Text>
      </Link> */}
      {CusInfo?.active !== "0" && (
        <Link
          noLinkClass
          className="flex flex-col items-center"
          tabLink="#view-giohang"
        >
          <span className="relative noti-icon-wrapper h-auto">
            {cartItemCount > 0 && (
              <span className="absolute giohang-tab-badge border-2 border-white  leading-none text-white bg-red">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
            <Giohang active={activeTab === "giohang"} />
          </span>
          <Text
            size="xxxsmall"
            className="navbar-item-label text-gray-dark font-extrabold"
          >
            Giỏ hàng
          </Text>
        </Link>
      )}

      <Link noLinkClass className="flex flex-col items-center	" tabLink="#khachhang">
        <ChatIcon active={activeTab === "khachhang"} />
        <Text
          size="xxxsmall"
          className="navbar-item-label text-gray-dark font-extrabold"
        >
          Khách hàng
        </Text>
      </Link>
      <Link
        noLinkClass
        className="flex flex-col items-center	"
        tabLink="#view-account"
      >
        <MenuIcon active={activeTab === "taikhoan"} />
        <Text
          size="xxxsmall"
          className="navbar-item-label text-gray-dark font-extrabold"
        >
          Tài khoản
        </Text>
      </Link>
    </Tabbar>
  )
}
NavigationBar.propTypes = {}
NavigationBar.displayName = "zmp-toolbar"
export default NavigationBar
