import React from "react"
import { Page, Box, useStore } from "zmp-framework/react"
import "./../styles/giohang.scss"

import CartHeader from "@components/Cart/CartHeader"
import CartProductList from "@components/Cart/CartProductList"
import CartPromotionList from "@components/Cart/CartPromotionList"
import CartEmpty from "@components/Cart/CartEmpty"
import CartFooter from "@components/Cart/CartFooter"

import { useCart } from "../hooks/useCart"

const GiohangPage = ({ zmproute }) => {
  const CusInfo = useStore("getCusInfo")

  const {
    Giohang,
    TongTien,
    datakm,
    loading,
    appKm,
    TongtieKm,
    ViewMore,
    isShowModalKm,

    updateGiohang,
    updateViewMore,
    updateAppKm,
    updateDatakm,
    setIsShowModalKm,
    tinhtien,
    handleDeleteAll,
    backHome,
    onClickDangnhap,
    updateItemKM,
  } = useCart(CusInfo)

  return (
    <Page id="cart-page" className="home-page bg-[#f5f6f8] ">
      <div className="flex flex-col h-full">
        <div className="flex flex-col flex-1">
          <CartHeader cartLength={Giohang.length} CusInfo={CusInfo} />
          {Giohang.length > 0 ? (
            <Box className={` `}>
              <CartProductList
                Giohang={Giohang}
                ViewMore={ViewMore}
                updateViewMore={updateViewMore}
                updateGiohang={updateGiohang}
                updateAppKm={updateAppKm}
                updateDatakm={updateDatakm}
                tinhtien={tinhtien}
              />
              <CartPromotionList
                datakm={datakm}
                appKm={appKm}
                setIsShowModalKm={setIsShowModalKm}
                updateGiohang={updateGiohang}
                tinhtien={tinhtien}
                updateItemKM={updateItemKM}
              />
            </Box>
          ) : (
            <CartEmpty />
          )}
        </div>
        <div className="">
          {Giohang.length > 0 && (
            <CartFooter
              isShowModalKm={isShowModalKm}
              TongtieKm={TongtieKm}
              TongTien={TongTien}
              loading={loading}
              appKm={appKm}
              handleDeleteAll={handleDeleteAll}
              backHome={backHome}
              onClickDangnhap={onClickDangnhap}
            />
          )}
        </div>
      </div>
    </Page>
  )
}

export default GiohangPage
