import { FaShoppingCart } from "react-icons/fa"
import { MdLocalOffer } from "react-icons/md"
import { formatCurrency } from "@utils/networking"
import LoadingSpinner from "@components/LoadingSpinner"
import { Button, PillTabs } from "@components/ui"

const CartFooter = ({ isShowModalKm, TongtieKm, TongTien, loading, appKm, onClickDangnhap, kmMode = "auto", setKmMode, tienTL = 0, tienCanTru = 0, dhDangSua = "" }) => {
  const tienThuong = tienTL + tienCanTru
  const thanhToan = Math.max(0, TongTien - TongtieKm - tienThuong)

  return (
    <div
      className={`w-full border-t border-[#e6ebf2] bg-white px-4 pt-3 transition-transform duration-[350ms] ease-[cubic-bezier(.4,0,.2,1)] ${
        !isShowModalKm ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
    >
      {(TongtieKm > 0 || tienThuong > 0) && (
        <>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-slate-500">Tạm tính</span>
            <span className="tabular-nums text-slate-600">{formatCurrency(TongTien, true)}đ</span>
          </div>
          {TongtieKm > 0 && (
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-slate-500">Khuyến mãi</span>
              <span className="font-semibold tabular-nums text-[#1f8a4c]">-{formatCurrency(TongtieKm, true)}đ</span>
            </div>
          )}
          {tienTL > 0 && (
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-slate-500">Thưởng tích lũy</span>
              <span className="font-semibold tabular-nums text-[#1f8a4c]">-{formatCurrency(tienTL, true)}đ</span>
            </div>
          )}
          {tienCanTru > 0 && (
            <div className="mt-1 flex items-center justify-between text-[13px]">
              <span className="text-slate-500">Cấn trừ phiếu thưởng</span>
              <span className="font-semibold tabular-nums text-[#1f8a4c]">-{formatCurrency(tienCanTru, true)}đ</span>
            </div>
          )}
        </>
      )}
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-[14px] font-semibold text-slate-700">Tổng thanh toán</span>
        <span className="text-[19px] font-bold tabular-nums text-[#e5232a]">{formatCurrency(thanhToan, true)}đ</span>
      </div>

      {/* Đặt hàng 2 bước: (1) áp dụng khuyến mãi, (2) đặt hàng. Đổi giỏ hàng thì quay lại bước 1 */}
      {loading ? (
        <div className="flex justify-center py-2">
          <LoadingSpinner />
        </div>
      ) : appKm ? (
        <>
          {setKmMode && (
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <span className="shrink-0 text-[12px] text-slate-500">Thứ tự khuyến mãi</span>
              <PillTabs
                variant="segmented"
                className="max-w-[230px] flex-1"
                tabs={[
                  { key: "auto", label: "Tự động" },
                  { key: "manual", label: "Tự sắp xếp" },
                ]}
                value={kmMode}
                onChange={setKmMode}
              />
            </div>
          )}
          <Button full className="mt-2.5" icon={<MdLocalOffer size={16} />} onClick={onClickDangnhap}>
            {kmMode === "manual" ? "Chọn khuyến mãi" : "Áp dụng khuyến mãi"}
          </Button>
          <div className="mt-1.5 text-center text-[11px] text-slate-500">
            {kmMode === "manual"
              ? "Bước 1/2 · Xem các khuyến mãi phù hợp và tự xếp thứ tự ưu tiên"
              : "Bước 1/2 · Tự động ưu tiên khuyến mãi có giá trị cao nhất"}
          </div>
        </>
      ) : (
        <>
          <Button full className="mt-2.5" icon={<FaShoppingCart size={15} />} onClick={onClickDangnhap}>
            {dhDangSua ? "Cập nhật đơn" : "Đặt hàng"} · {formatCurrency(thanhToan, true)}đ
          </Button>
          <div className="mt-1.5 text-center text-[11px] text-slate-500">
            Bước 2/2 · Đã áp dụng khuyến mãi, kiểm tra lại đơn và đặt hàng
          </div>
        </>
      )}
    </div>
  )
}

export default CartFooter
