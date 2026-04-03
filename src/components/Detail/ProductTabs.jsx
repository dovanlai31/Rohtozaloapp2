import {
  Box,
  Link,
  Tab,
  Tabbar,
  Tabs,
} from "zmp-framework/react"

const ProductTabs = ({ Product }) => {
  const activeTabClass = `[&.tab-link-active]:!border-b-2 [&.tab-link-active]:!border-[#0665b3]
   !font-extrabold detail-tab-link 
   h-full flex items-center 
   justify-center relative !text-[16px] 
    text-[#666] border-b border-[#e5e5e5] [&.tab-link-active]:!text-[#0665b3] [&.tab-link-active]:after:content-[''] [&.tab-link-active]:after:absolute [&.tab-link-active]:after:bottom-0 [&.tab-link-active]:after:left-0 [&.tab-link-active]:after:w-full [&.tab-link-active]:after:h-[2px] 
  [&.tab-link-active]:after:bg-[#0665b3] transition-all duration-300 `

  return (
    <>
      <Box m={0} p={0}>
        <Tabbar inner={false} m={0} p={0} className="CustomTabbar bg-transparent !bg-transparent border-b border-[#e5e5e5]">
          <Link tabLink="#tab-1" className={activeTabClass}>Mô tả</Link>
          <Link tabLink="#tab-2" className={activeTabClass}>Chi tiết</Link>
          <Link tabLink="#tab-3" className={activeTabClass}>Hướng dẫn</Link>
        </Tabbar>
      </Box>

      <Box m={0} p={0}>
        <Tabs animated swipeable>
          {/* Tab Mô tả */}
          <Tab id="tab-1" tabActive>
            <div className="p-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#f0f0f0]">
                <span className="text-[14px] text-[#666]">Quy cách</span>
                <span className="text-[14px] text-[#1a1a1a] font-medium">{Product?.donvi || "—"}</span>
              </div>
              {Product?.mota ? (
                <div className="mt-3.5">
                  <p className="m-0 mb-[6px] font-bold text-[14px] text-[#1a1a1a]">Chỉ định</p>
                  <p className="m-0 text-[14px] text-[#555] whitespace-pre-line leading-[1.6]">{Product.mota}</p>
                </div>
              ) : null}
            </div>
          </Tab>

          {/* Tab Chi tiết */}
          <Tab id="tab-2" >
            <div className="p-4">
              <p className="m-0 mb-1 font-bold text-[15px] text-[#1a1a1a]">Thành phần</p>
              <p className="m-0 mb-4 text-[14px] text-[#999] italic">{Product?.thanhphan || "Không có chi tiết"}</p>

              {Product?.ma && (
                <div className="flex justify-between py-3 border-t border-[#f0f0f0]">
                  <span className="text-[14px] text-[#888]">SKU</span>
                  <span className="text-[14px] text-[#1a1a1a]">{Product.ma}</span>
                </div>
              )}

              {Product?.nganhhang && (
                <div className="flex justify-between py-3 border-t border-[#f0f0f0]">
                  <span className="text-[14px] text-[#888]">Nhãn hàng</span>
                  <span className="text-[14px] text-[#1a1a1a]">{Product.nganhhang}</span>
                </div>
              )}

              {Product?.chungloai && (
                <div className="flex justify-between py-3 border-t border-[#f0f0f0]">
                  <span className="text-[14px] text-[#888]">Danh mục</span>
                  <span className="text-[14px] text-[#1a1a1a]">{Product.chungloai}</span>
                </div>
              )}
            </div>
          </Tab>

          {/* Tab Hướng dẫn */}
          <Tab id="tab-3">
            <div className="p-4">
              <p className="m-0 mb-2 font-bold text-[14px] text-[#1a1a1a]">Hướng dẫn sử dụng</p>
              <p className="m-0 text-[14px] text-[#555] whitespace-pre-line leading-[1.6]">
                {Product?.huongdan || "Chưa có thông tin hướng dẫn"}
              </p>
            </div>
          </Tab>
        </Tabs>
      </Box>
    </>
  )
}

export default ProductTabs
