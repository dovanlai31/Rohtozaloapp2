import store from "../../store"
import { formatCurrency } from "@utils/networking"
import { FaMinus } from "react-icons/fa"
import {
  Box,
  SkeletonBlock,
  SkeletonText,
  Title,
  useStore,
  zmp,
  zmpready,
} from "zmp-framework/react"
import { FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react"

const Product = (item) => {
  let {
    loading,
    ten,
    id,
    description,
    thumbnail,
    style,
    dongia,
    donvi,
    title,
    HinhAnh,
    HinhAnh1,
    HinhAnh2,
    ma,
    qcThung,
    mota,
    chidinh,
    huongdan,
    thanhphan,
    mucduyet,
    CusInfo,
    showToast,
    variant, // "grid": thẻ dọc dùng cho lưới 2 cột; mặc định: thẻ ngang
  } = item
  const isGrid = variant === "grid"
  const [soluong, setSoluong] = useState(0)


  const Giohangx = store.getters.getGioHang.value || []
  useEffect(() => {
    console.log("Giohang in Product: ", Giohangx)
    if (Giohangx && Giohangx.length > 0) {
      const foundItem = Giohangx.find((it) => it.id === id)
      if (foundItem) {
        setSoluong(foundItem.soluong)
      }
    } else {
      setSoluong(0)
    }
    console.log("Giohang changed: ", Giohangx)
    // Reload the page when Giohang changes
    //window.location.reload();
  }, [JSON.stringify(Giohangx)])




  const onClickAddGH = async (soluong) => {
    console.log("them vao gio hang: ", soluong)
    // e.stopPropagation()
    // e.preventDefault()
    if (soluong <= 0) {
      //xoa sp ra giohang
      store.dispatch("remoteItemGioHang", id)
      setSoluong(0)
      return
    }
    const product = {
      id,
      ten,
      dongia,
      donvi,
      HinhAnh,
      HinhAnh1,
      HinhAnh2,
      ma,
      qcThung,
      mota,
      chidinh,
      huongdan,
      thanhphan,
      soluong: soluong || 1,
    }
    try {
      const result = await store.dispatch("SetAddGioHang", product)
      if (result) {
        if (soluong === 0) {
          showToast
            ? showToast("Đã xóa khỏi giỏ hàng", "success", 1000, "top")
            : zmp.toast.show({
              text: "Đã xóa khỏi giỏ hàng!",
              position: "top",
              closeTimeout: 1500,
            })
        } else {
          showToast
            ? showToast("Thêm vào giỏ hàng thành công", "success", 1000, "top")
            : zmp.toast.show({
              text: "Đã thêm vào giỏ hàng!",
              position: "top",
              closeTimeout: 1500,
            })
        }
        setSoluong(soluong)
      }
    } catch (err) {
      showToast
        ? showToast("Lỗi khi thêm giỏ hàng", "danger", 1500, "top")
        : zmp.toast.show({
          text: "Lỗi khi thêm giỏ hàng",
          position: "top",
          closeTimeout: 1500,
        })
    }
  }

  if (loading && isGrid) {
    return (
      <div style={style} className="flex flex-col gap-2 rounded-xl border border-[#E3EBF6] bg-white p-2.5">
        <SkeletonBlock height="110px" effect="fade" className="w-full rounded-lg" />
        <SkeletonText effect="fade"></SkeletonText>
        <SkeletonText effect="fade"></SkeletonText>
      </div>
    )
  }

  if (loading) {
    return (
      <Box style={style} mx="0" my="1" className="post w-full">
        <div className="mx-3 flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white px-3 py-2.5">
          <SkeletonBlock width={64} height={64} effect="fade" className="flex-shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonText effect="fade"></SkeletonText>
            <SkeletonText effect="fade"></SkeletonText>
            <SkeletonText effect="fade"></SkeletonText>
          </div>
        </div>
      </Box>
    )
  }

  const openDetail = () => {
    zmpready(() => {
      store.dispatch("SetCurentProduct", {
        id,
        title: ten,
        thumbnail: HinhAnh,
        dongia,
        HinhAnh,
        HinhAnh1,
        HinhAnh2,
        ten,
        donvi,
        ma,
        qcThung,
        mota,
        chidinh,
        huongdan,
        thanhphan,
      })
    })
    // Mở trong view (tab) đang hiển thị: từ Giỏ hàng > Thêm > tìm kiếm thì trang chi tiết phải nằm ở view Giỏ hàng,
    // không đẩy vào view Trang chủ đang ẩn (sẽ bị chìm phía dưới và chồng nhiều trang khi quay về Trang chủ).
    const router = zmp.views.current?.router || zmp.views.main.router
    router.navigate("/detail/?id=" + id)
  }

  const priceText = CusInfo?.active !== "0" ? formatCurrency(dongia, true) + "đ" : "Liên hệ"

  const addButton = (
    <button
      type="button"
      aria-label="Thêm vào giỏ hàng"
      onClick={() => onClickAddGH(soluong + 1)}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-[#e5232a] text-white active:opacity-80"
    >
      <FaPlus size={12} />
    </button>
  )

  const stepper = (
    <div className={`flex shrink-0 items-center rounded-full border border-[#d5e2f2] bg-white ${isGrid ? "w-full justify-between" : ""}`}>
      <button
        type="button"
        aria-label="Giảm số lượng"
        className="flex h-8 w-8 items-center justify-center border-0 bg-transparent text-primary"
        onClick={() => {
          let a = soluong - 1
          onClickAddGH(a < 0 ? 0 : a)
        }}
      >
        <FaMinus size={10} />
      </button>
      <span className="min-w-[24px] text-center text-sm font-semibold tabular-nums text-slate-700">{soluong}</span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        className="flex h-8 w-8 items-center justify-center border-0 bg-transparent text-primary"
        onClick={() => onClickAddGH(soluong + 1)}
      >
        <FaPlus size={10} />
      </button>
    </div>
  )

  // Thẻ dọc cho lưới 2 cột: ảnh trên, tên, giá + nút thêm giỏ
  if (isGrid) {
    return (
      <div style={style} className="flex min-w-0 flex-col rounded-xl border border-[#E3EBF6] bg-white p-2.5">
        <button
          type="button"
          onClick={openDetail}
          className="flex h-[110px] w-full items-center justify-center overflow-hidden rounded-lg !border-0 !bg-transparent !p-0 !shadow-none outline-none"
        >
          <img src={HinhAnh} alt={ten} loading="lazy" className="h-full w-full object-contain" />
        </button>

        <button
          type="button"
          onClick={openDetail}
          className="mt-2 line-clamp-2 min-h-[36px] border-0 bg-transparent p-0 text-left text-[13px] font-medium leading-snug text-slate-700"
        >
          {ten}
        </button>
        <div className="mt-0.5 truncate text-[11px] text-slate-500">{[ma, donvi].filter(Boolean).join(" · ")}</div>

        <div className="mt-auto pt-2">
          {soluong == 0 ? (
            <div className="flex items-center justify-between gap-1">
              <span className="min-w-0 truncate text-[14px] font-bold tabular-nums text-primary">{priceText}</span>
              {addButton}
            </div>
          ) : (
            <>
              <div className="mb-1.5 truncate text-[14px] font-bold tabular-nums text-primary">{priceText}</div>
              {stepper}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <Box style={style} mx="0" my="1" className="post w-full">
      <div className="mx-3 flex items-center gap-3 rounded-xl border border-[#E3EBF6] bg-white px-3 py-2.5">
        {/* Hình ảnh */}
        <button
          type="button"
          onClick={openDetail}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg !border-0 !bg-transparent !p-0 !shadow-none outline-none"
        >
          <img src={HinhAnh} alt={ten} loading="lazy" className="h-full w-full object-contain" />
        </button>

        {/* Nội dung */}
        <div className="flex min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={openDetail}
            className="line-clamp-2 border-0 bg-transparent p-0 text-left text-[14px] font-medium leading-snug text-slate-700"
          >
            {ten}
          </button>
          <div className="mt-0.5 truncate text-xs text-slate-500">
            {[ma, donvi].filter(Boolean).join(" · ")}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
            <span className="text-[15px] font-bold tabular-nums text-primary">{priceText}</span>

            {soluong == 0 ? addButton : stepper}
          </div>
        </div>
      </div>
    </Box>
  )
}

export default Product
