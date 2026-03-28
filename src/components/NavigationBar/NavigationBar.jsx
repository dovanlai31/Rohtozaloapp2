import React, { useRef, useState, useEffect } from "react"
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
   //console.log('CusInfo__log', CusInfo);
  // console.log('activeTabx', activeTab);
  return (
    <Tabbar id="main-nav" bottom className="app-tabbar shadow-1" hidden={true}>
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
      {CusInfo?.active !== '0' && (
        <Link noLinkClass className="flex flex-col items-center" tabLink="#view-giohang" badge="2">
          <span className="relative noti-icon-wrapper h-auto">
            {Giohangx?.length > 0 && (
              <span className="absolute rounded-full bg-red noti-badge border-2 border-white"></span>
            )}
            <Giohang active={activeTab === "giohang"} />
          </span>
          <Text size="xxxsmall" className="navbar-item-label text-gray-dark font-extrabold">
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
