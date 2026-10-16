import { Link } from "zmp-framework/react"
import { MdSearch } from "react-icons/md"

// Ô tìm kiếm ở trang chủ: chỉ là lối vào, bấm để mở trang Tìm kiếm (cùng kiểu với <TextInput>)
const SearchBox = () => {
  return (
    <Link
      href="/search?all=1"
      noLinkClass
      className="!flex h-11 w-full items-center gap-2 rounded-full border border-[#E3EBF6] bg-white px-4 active:bg-[#f7faff]"
    >
      <MdSearch size={20} className="shrink-0 text-slate-400" />
      <span className="min-w-0 flex-1 truncate text-[14px] text-slate-400">Tìm tên hoặc mã sản phẩm</span>
    </Link>
  )
}

export default SearchBox
