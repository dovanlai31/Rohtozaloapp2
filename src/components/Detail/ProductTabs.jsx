import { useState } from "react"
import { PillTabs } from "@components/ui"

const TABS = [
  { key: "mota", label: "Mô tả" },
  { key: "chitiet", label: "Chi tiết" },
  { key: "huongdan", label: "Hướng dẫn" },
]

const InfoRow = ({ label, value }) =>
  value ? (
    <div className="flex items-start justify-between gap-3 border-t border-[#edf0f5] py-2.5 text-[14px]">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right text-slate-700">{value}</span>
    </div>
  ) : null

const TextBlock = ({ title, text, empty }) => (
  <div>
    {title && <div className="mb-1.5 text-[14px] font-semibold text-slate-800">{title}</div>}
    <div className={`whitespace-pre-line text-[14px] leading-relaxed ${text ? "text-slate-600" : "italic text-slate-400"}`}>
      {text || empty}
    </div>
  </div>
)

const ProductTabs = ({ Product }) => {
  const [tab, setTab] = useState("mota")

  return (
    <div className="p-4">
      <PillTabs className="mb-3" tabs={TABS} value={tab} onChange={setTab} />

      {tab === "mota" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-slate-500">Quy cách</span>
            <span className="text-slate-700">{Product?.donvi || "—"}</span>
          </div>
          {Product?.mota && <TextBlock title="Chỉ định" text={Product.mota} />}
        </div>
      )}

      {tab === "chitiet" && (
        <div>
          <TextBlock title="Thành phần" text={Product?.thanhphan} empty="Không có chi tiết" />
          <div className="mt-3">
            <InfoRow label="SKU" value={Product?.ma} />
            <InfoRow label="Nhãn hàng" value={Product?.nganhhang} />
            <InfoRow label="Danh mục" value={Product?.chungloai} />
          </div>
        </div>
      )}

      {tab === "huongdan" && (
        <TextBlock title="Hướng dẫn sử dụng" text={Product?.huongdan} empty="Chưa có thông tin hướng dẫn" />
      )}
    </div>
  )
}

export default ProductTabs
