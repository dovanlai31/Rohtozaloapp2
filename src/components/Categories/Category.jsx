import { forwardRef } from "react"
import "../../styles/banner.scss"

// Tỉ lệ khung banner cố định (rộng : cao = 16 : 7) để khung không co giãn theo từng ảnh khi tự chuyển
export const BANNER_RATIO = "43.75%"

// Ảnh banner: khung cố định tỉ lệ, ảnh phủ kín khung
const Category = forwardRef(({ url }, ref) => (
  <div ref={ref} className="relative w-full overflow-hidden bg-[#eef4fb]" style={{ paddingTop: BANNER_RATIO }}>
    <img loading="lazy" src={url} alt="" className="absolute left-0 top-0 h-full w-full object-cover" />
  </div>
))

export default Category
