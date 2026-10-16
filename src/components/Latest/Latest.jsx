import Post from "@components/Product"
import { EmptyState, Grid } from "@components/ui"
import { MdChevronRight, MdInventory2 } from "react-icons/md"
import { Link, useStore } from "zmp-framework/react"

// Mục "Sản phẩm" ở trang chủ: lưới 2 cột giống trang Tìm kiếm
const Latest = (props) => {
  const { data } = useStore("latestBlogs")
  const loading = useStore("loadingBlogs")
  const CusInfo = useStore("getCusInfo")

  return (
    <div className="px-4 pt-1">
      <div className="mb-2.5 flex items-center justify-between px-1">
        <span className="text-[15px] font-semibold text-slate-700">Sản phẩm</span>
        <Link href="/search?all=1c" noLinkClass className="!flex items-center gap-0.5 text-xs font-semibold text-primary">
          Tất cả <MdChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <Grid cols={2}>
          {[0, 1, 2, 3].map((i) => (
            <Post key={i} loading variant="grid" />
          ))}
        </Grid>
      ) : data?.length > 0 ? (
        <Grid cols={2}>
          {data.map((item) => (
            <Post {...item} CusInfo={CusInfo} key={item.id} mucduyet={props?.mucduyet || 1} variant="grid" />
          ))}
        </Grid>
      ) : (
        <div className="rounded-xl border border-[#E3EBF6] bg-white">
          <EmptyState
            icon={<MdInventory2 size={24} />}
            title="Chưa có sản phẩm"
            desc="Vui lòng đồng bộ tài khoản qua số điện thoại để xem sản phẩm và giá."
          />
        </div>
      )}
    </div>
  )
}

export default Latest
