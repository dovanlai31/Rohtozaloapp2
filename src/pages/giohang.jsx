import React from "react"
import { Page, Box, useStore, zmp } from "zmp-framework/react"
import store from "../store"
import "./../styles/giohang.scss"

import CartHeader from "@components/Cart/CartHeader"
import CartProductList from "@components/Cart/CartProductList"
import CartPromotionList from "@components/Cart/CartPromotionList"
import CartEmpty from "@components/Cart/CartEmpty"
import CartFooter from "@components/Cart/CartFooter"
import KmSortSheet from "@components/Cart/KmSortSheet"
import CartRewards from "@components/Cart/CartRewards"
import TichLuySheet from "@components/Cart/TichLuySheet"
import TraThuongSheet from "@components/Cart/TraThuongSheet"

import { useCart } from "../hooks/useCart"
import { Button } from "zmp-ui"
import LuckyWheelModal from "@components/Vongquay/LuckyWheelModal"

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
    showWheel,
    prizes,
    targetPrize,
    maxSpins,

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
    setShowWheel,
    handleSpinEnd,
    handleShowvongQuay,
    rewards,
    dhDangSua,
    kmMode,
    setKmMode,
    kmCandidates,
    showKmSort,
    closeKmSort,
    confirmKmSort,
  } = useCart(CusInfo)

  return (
    <Page id="cart-page" className="home-page bg-slate-50">
      <div className="flex flex-col h-full">
        <div className="flex flex-col flex-1">
          <CartHeader cartLength={Giohang.length} CusInfo={CusInfo} />
          {/* <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Button
              size="large"
              onClick={() => setShowWheel(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '12px 32px',
              }}
            >
              🎡 QUAY THƯỞNG NGAY
            </Button>
          </div> */}
          {dhDangSua && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-[#cfe0f5] bg-[#f3f8fd] px-3 py-2.5">
              <span className="min-w-0 flex-1 text-[13px] text-slate-600">
                Đang sửa đơn hàng <b className="text-primary">#{dhDangSua}</b>
              </span>
              <button
                type="button"
                onClick={() =>
                  zmp.dialog.confirm("Thôi sửa đơn và xoá các sản phẩm đang có trong giỏ?", "Thông báo", () => {
                    store.dispatch("remoteAllGioHang")
                    store.dispatch("setDhDangSua", "")
                  })
                }
                className="w-auto shrink-0 rounded-full border border-[#d5e2f2] bg-white px-3 py-1 text-[12px] font-semibold text-slate-600"
              >
                Thôi sửa
              </button>
            </div>
          )}
          {Giohang.length > 0 ? (
            <div className="px-4 pb-4 pt-3">
              <CartProductList
                Giohang={Giohang}
                ViewMore={ViewMore}
                updateViewMore={updateViewMore}
                updateGiohang={updateGiohang}
                updateAppKm={updateAppKm}
                updateDatakm={updateDatakm}
                tinhtien={tinhtien}
                handleDeleteAll={handleDeleteAll}
              />
              <CartPromotionList
                handleShowvongQuay={handleShowvongQuay}
                datakm={datakm}
                appKm={appKm}
                setIsShowModalKm={setIsShowModalKm}
                updateGiohang={updateGiohang}
                tinhtien={tinhtien}
                updateItemKM={updateItemKM}
              />
              <CartRewards rewards={rewards} />
            </div>
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
              kmMode={kmMode}
              dhDangSua={dhDangSua}
              tienTL={rewards.tienTL}
              tienCanTru={rewards.tienCanTru}
              setKmMode={setKmMode}
            />
          )}
        </div>
      </div>
      {/* Xếp thứ tự ưu tiên khuyến mãi (luồng thủ công) */}
      <KmSortSheet visible={showKmSort} promotions={kmCandidates} onClose={closeKmSort} onConfirm={confirmKmSort} />

      {/* Thưởng tích lũy / phiếu trả thưởng */}
      <TichLuySheet
        visible={rewards.showTL}
        list={rewards.tlList}
        onClose={() => rewards.setShowTL(false)}
        onApply={(list) => {
          rewards.setTlChon(list)
          rewards.setShowTL(false)
        }}
      />
      <TraThuongSheet
        visible={rewards.showTT}
        list={rewards.ttList}
        daChon={rewards.ttChon}
        tongDon={Math.max(0, TongTien - TongtieKm - rewards.tienTL)}
        onClose={() => rewards.setShowTT(false)}
        onApply={(list) => {
          rewards.setTtChon(list)
          rewards.setShowTT(false)
        }}
      />

      {/* Modal vòng quay */}
      {prizes && prizes.length > 0 && (
        <LuckyWheelModal
          visible={showWheel}
          onClose={() => setShowWheel(false)}
          prizes={prizes}
          targetPrize={targetPrize}  // Set trước quà trúng
          handleSpinEnd={(v) => handleSpinEnd(v)}
          size={window.innerWidth * 0.7}
          maxSpins={maxSpins}
        />)}


    </Page>
  )
}

export default GiohangPage
