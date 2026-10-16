import { useEffect, useState } from "react"
import { Page, useStore, zmp } from "zmp-framework/react"
import { MdDateRange, MdInventory2, MdStars } from "react-icons/md"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { Card, EmptyState, SectionTitle, StatusBadge } from "@components/ui"
import { formatCurrency, request } from "@utils/networking"

const SP_LIMIT = 10

const money = (n) => `${formatCurrency(Number(n) || 0, true)} ₫`

const Stat = ({ label, value, strong }) => (
  <div className="min-w-0">
    <div className="text-[11px] text-slate-500">{label}</div>
    <div className={`truncate text-[13px] font-semibold tabular-nums ${strong || "text-slate-700"}`}>{value}</div>
  </div>
)

const PageTichLuyDetail = ({ zmproute }) => {
  const CusInfo = useStore("getCusInfo") || {}
  const { pk_seq } = zmproute.query

  const [info, setInfo] = useState(null)
  const [sanPham, setSanPham] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    request("POST", "khuyenmai/getCTTLKH_info", { userId: String(CusInfo?.KHACHHANG_fk), CTTL_FK: String(pk_seq) })
      .then((r) => r.json())
      .then((r) => {
        if (!r?.result) {
          console.log("Lỗi getCTTLKH_info", r?.message)
          return
        }
        const data = JSON.parse(r.message)
        setInfo(data.ThongTinCT?.[0] || null)
        setSanPham(data.SanPham || [])
      })
      .catch((e) => console.log("Lỗi getCTTLKH_info", e))
      .finally(() => setLoading(false))
  }, [pk_seq])

  const pct = Math.max(0, Number(info?.PhanTram) || 0)
  const target = Number(info?.DoanhThuCamKet) || 0
  const done = Number(info?.DoanhThuThucHien) || 0
  const reached = pct >= 100
  const ended = Number(info?.DaKetThuc) === 1
  const [tone, label] = reached
    ? ["success", "Đã đạt"]
    : ended
    ? ["neutral", "Chưa đạt"]
    : ["info", "Đang diễn ra"]

  const shownSP = showAll ? sanPham : sanPham.slice(0, SP_LIMIT)

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#f5f7fb]"
    >
      <HeaderBack slot="fixed" title="Chi tiết tích lũy" />

      {loading ? (
        <LoadingSpinner />
      ) : !info ? (
        <EmptyState icon={<MdStars size={28} />} title="Không tìm thấy thông tin chương trình" />
      ) : (
        <div className="flex flex-col gap-3 px-4 pb-10 pt-3">
          {/* Tổng quan chương trình */}
          <Card>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 text-[15px] font-semibold leading-snug text-slate-800">{info.TenChuongTrinh}</div>
              <StatusBadge tone={tone}>{label}</StatusBadge>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MdDateRange size={13} className="shrink-0 text-slate-400" />
              {info.TuNgay} – {info.DenNgay}
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Tiến độ</span>
              <span className={`text-lg font-bold tabular-nums ${reached ? "text-[#1f7a45]" : "text-primary"}`}>
                {pct.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#edf1f7]">
              <div
                className={`h-full rounded-full ${reached ? "bg-[#2e9e5b]" : "bg-primary"}`}
                style={{ width: `${Math.min(100, pct)}%`, transition: "width 400ms ease-out" }}
              />
            </div>

            <div
              className="mt-3 grid gap-2 rounded-lg bg-[#f7f9fc] px-3 py-2.5"
              style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
            >
              <Stat label="Cam kết" value={money(target)} />
              <Stat label="Đã thực hiện" value={money(done)} />
              <Stat
                label={reached ? "Vượt" : "Còn thiếu"}
                value={money(Math.abs(target - done))}
                strong={reached ? "text-[#1f7a45]" : "text-[#c26a00]"}
              />
            </div>
          </Card>

          {/* Sản phẩm thuộc chương trình */}
          <Card padding="p-0">
            <div className="px-3.5 pt-3.5">
              <SectionTitle
                icon={<MdInventory2 size={16} />}
                right={<span className="text-xs text-slate-500">{sanPham.length} sản phẩm</span>}
              >
                Sản phẩm áp dụng
              </SectionTitle>
            </div>
            {sanPham.length === 0 ? (
              <div className="px-3.5 pb-4 pt-2 text-[13px] text-slate-500">Chương trình chưa có sản phẩm áp dụng</div>
            ) : (
              <>
                <div className="mt-1">
                  {shownSP.map((sp) => (
                    <div
                      key={sp.SANPHAM_FK || sp.MaSP}
                      className="flex items-center justify-between gap-3 border-t border-[#edf0f5] px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium leading-snug text-slate-700">{sp.TenSP}</div>
                        <div className="mt-0.5 text-[11px] text-slate-400">{sp.MaSP}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div
                          className={`text-[13px] font-semibold tabular-nums ${
                            Number(sp.DoanhSo) > 0 ? "text-slate-700" : "text-slate-400"
                          }`}
                        >
                          {money(sp.DoanhSo)}
                        </div>
                        {Number(sp.SoLuong) > 0 && (
                          <div className="mt-0.5 text-[11px] text-slate-500">SL {formatCurrency(sp.SoLuong, true)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {sanPham.length > SP_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="w-full border-0 border-t border-[#edf0f5] bg-transparent py-2.5 text-[13px] font-semibold text-primary"
                  >
                    {showAll ? "Thu gọn" : `Xem tất cả ${sanPham.length} sản phẩm`}
                  </button>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </Page>
  )
}

export default PageTichLuyDetail
