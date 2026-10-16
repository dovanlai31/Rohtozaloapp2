import LoadingSpinner from "@components/LoadingSpinner"
import PosmHeader from "@components/Posm/PosmHeader"
import { validateString } from "@utils/util"
import { useEffect, useState } from "react"
import { BsQrCodeScan } from "react-icons/bs"
import { FaPen } from "react-icons/fa"
import { Box, Page, Text, useStore, zmp } from "zmp-framework/react"
import { getListPosm } from "../services/posmService"

// Danh sách POSM tại shop (giống màn KiemtraTu của app sale).
// Mỗi dòng có 2 nút: QR -> màn chi tiết và mở camera quét ngay; bút -> màn chi tiết, chọn lý do không quét được
const KiemTraPosm = () => {
  const CusInfo = useStore("getCusInfo")
  const refres = useStore("refres")
  const userId = validateString(CusInfo?.KHACHHANG_fk + "", true)
  const isSynced = !!CusInfo?.KHACHHANG_fk && CusInfo?.KHACHHANG_fk !== 0

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const loadList = async () => {
    if (!isSynced) return
    setLoading(true)
    try {
      setList(await getListPosm(userId))
    } catch (e) {
      console.log("Error getListPosm", e)
      zmp.toast.create({ text: e.message || "Không tải được danh sách POSM", position: "center", closeTimeout: 2000 }).open()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadList()
  }, [refres])

  const openDetail = (item, autoScan) => {
    zmp.views.current.router.navigate(
      `/kiemtraposmdetail/?uploadCtId=${item.uploadCtId}&scan=${autoScan ? 1 : 0}`,
      { transition: "zmp-cover", animate: true }
    )
  }

  const daQuet = list.filter((x) => Number(x.daKtToday) === 1).length

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page bg-[#e4ecf5]"
    >
      <PosmHeader title="Kiểm tra sản phẩm POSM" rightText="Tải lại" onRightClick={loadList} />

      {!isSynced ? (
        <Box className="min-h-[45vh] flex items-center justify-center px-6">
          <Text className="text-center text-sm text-slate-400">
            Chưa có dữ liệu, vui lòng đồng bộ qua số điện thoại
          </Text>
        </Box>
      ) : (
        <Box mx="4" mt="3" pb="8" className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#E2E9F3] bg-white px-3 pb-2.5 pt-3">
            <div className="text-sm font-bold leading-snug text-primary">
              KH: {CusInfo?.mafast ? `${CusInfo.mafast} - ` : ""}
              {CusInfo?.tenkh || ""}
            </div>
            <div className="my-2 h-px bg-[#E6EEF9]" />
            <div className="flex items-center justify-between text-[13px]">
              <b className="text-slate-600">Danh sách POSM</b>
              <span className="text-[#1f8a4c]">
                Hôm nay đã quét: {daQuet}/{list.length}
              </span>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {!loading &&
            list.map((item) => {
              const daKt = Number(item.daKtToday) === 1
              return (
                <div key={item.uploadCtId} className="rounded-xl border border-[#E2E9F3] bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 text-[15px] font-bold leading-snug text-slate-800">{item.name}</div>
                    {daKt ? (
                      <span className="shrink-0 rounded-full bg-[#e3f4ea] px-2 py-0.5 text-[11px] font-semibold text-[#1f7a45]">
                        Đã kiểm tra
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-[#fdecec] px-2 py-0.5 text-[11px] font-semibold text-[#c23a3a]">
                        Chưa kiểm tra
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs leading-relaxed text-slate-500">
                    <div>
                      Mã: <span className="text-slate-700">{item.maSp}</span>
                    </div>
                    <div>
                      KT lần cuối: <span className="text-slate-700">{item.ngayKtCuoi || "—"}</span>
                      {!!item.ngayKtCuoi && ` · ${item.lydo ? "Nhập tay" : "Tự động"}`}
                    </div>
                    {!!item.ngayKtCuoi && !!item.lydo && (
                      <div className="text-[#c23a3a]">Lý do: {item.lydo}</div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openDetail(item, true)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-0 bg-primary py-2 text-[13px] font-semibold text-white active:opacity-80"
                    >
                      <BsQrCodeScan size={14} />
                      Quét QR
                    </button>
                    <button
                      type="button"
                      onClick={() => openDetail(item, false)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#d5e2f2] bg-white py-2 text-[13px] font-semibold text-primary active:bg-[#f3f7fc]"
                    >
                      <FaPen size={11} />
                      Không quét được
                    </button>
                  </div>
                </div>
              )
            })}

          {!loading && !list.length && (
            <Box className="min-h-[30vh] flex items-center justify-center">
              <Text className="text-sm text-slate-400">Không có POSM nào được kiểm tra</Text>
            </Box>
          )}

          <button
            type="button"
            onClick={() =>
              zmp.views.current.router.navigate("/phieutrathuong/", {
                transition: "zmp-cover",
                animate: true,
              })
            }
            className="w-full rounded-xl border border-primary bg-white p-3 text-sm font-semibold text-primary active:opacity-70"
          >
            Xem phiếu trả thưởng
          </button>
        </Box>
      )}
    </Page>
  )
}

export default KiemTraPosm
