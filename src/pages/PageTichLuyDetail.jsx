import { Box, Button, Page, Text, zmp } from "zmp-framework/react"
import { useEffect, useState } from "react"
import {
  MdCardGiftcard,
  MdShoppingCart,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md"
import { FaGift, FaInbox } from "react-icons/fa"
import { formatCurrency, request } from "@utils/networking"
import store from "../store"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import KhachhangTichLuyCard from "@components/Account/KhachhangTichLuyCard"


const PageTichLuyDetail = ({ zmproute }) => {
  const CusInfo = store.getters.getCusInfo.value || {}
  const { pk_seq } = zmproute.query
  const CTTL_FK = pk_seq

  const [dataCT, setDataCT] = useState(null)
  const [quaChuaNhan, setQuaChuaNhan] = useState([])
  const [quaDaNhan, setQuaDaNhan] = useState([])
  const [loading, setLoading] = useState(true)

  const [showQuaChuaNhan, setShowQuaChuaNhan] = useState(true)
  const [showQuaDaNhan, setShowQuaDaNhan] = useState(true)

  const getCTTLKHInfo = async () => {
    const method = "khuyenmai/getCTTLKH_info"
    const params = {
      userId: String(CusInfo?.KHACHHANG_fk),
      CTTL_FK,
    }

    try {
      const post = await request("POST", method, params)
      const response = await post.json()
        const result = JSON.parse(response.message)
        const info = result.ThongTinCT?.[0]
        setDataCT(info)
        setQuaChuaNhan(result.QuaChuaNhan || [])
        setQuaDaNhan(result.QuaDaNhan || [])
    } catch (error) {
      console.log("❌ Lỗi getCTTLKH_info:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCTTLKHInfo()
  }, [])

  const renderQuaSection = ({
    title,
    expanded,
    onToggle,
    list,
    emptyText,
    isDaNhan,
  }) => {
    const arrowIcon = expanded ? (
      <MdOutlineArrowDropDown color="#9ca3af" size={24} />
    ) : (
      <MdOutlineArrowDropUp color="#9ca3af" size={24} />
    )

    let sectionContent = null
    if (list.length === 0) {
      sectionContent = (
        <Box className="flex min-h-[160px] flex-col items-center justify-center gap-2">
          <MdShoppingCart size={34} color="#9c9c9c" />
          <Text className="text-[16px] font-bold text-[#8b8b8b]">{emptyText}</Text>
        </Box>
      )
    } else if (isDaNhan) {
      sectionContent = (
        <Box className="py-1">
          {list.map((item, index) => (
            <Box
              key={`${item?.TenSP || "gift"}-${index}`}
              className="border-b border-[#eceef1] py-3"
            >
              <Text className="text-[16px] font-semibold text-[#2d2f43]">
                {item?.TenSP}
              </Text>
              <Text className="mt-1 text-[13px] text-[#525460]">
                SL {item?.SOLUONG} x {formatCurrency(item?.DONGIA, true)}
              </Text>
            </Box>
          ))}
        </Box>
      )
    } else {
      sectionContent = (
        <Box className="pt-3 m-0">
          <div className="overflow-hidden rounded-lg  border-[#eceef1]">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-[#f3f5f8]">
                  <th className="w-[58%] px-3 py-2 text-left text-[11px] font-bold text-[#a0a5ad]">
                    TÊN QUÀ
                  </th>
                  <th className="w-[14%] px-2 py-2 text-center text-[11px] font-bold text-[#a0a5ad]">
                    SL
                  </th>
                  <th className="w-[28%] px-3 py-2 text-right text-[11px] font-bold text-[#a0a5ad]">
                    THÀNH TIỀN
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, index) => (
                  <tr
                    key={`${item?.TenSP || "gift"}-${index}`}
                    className="border-t border-[#eceef1]"
                  >
                    <td className="px-3 py-3 align-top">
                      <div className="flex items-start gap-2">
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#2f61b6]" />
                        <Text className="text-[16px] font-semibold leading-tight text-[#2d2f43]">
                          {item?.TenSP}
                        </Text>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center align-top">
                      <Text className="text-[16px] font-semibold text-[#474b57]">
                        {item?.SOLUONG}
                      </Text>
                    </td>
                    <td className="px-3 py-3 text-right align-top">
                      <Text className="text-[16px] font-bold text-[#2f61b6]">
                        {formatCurrency(item?.THANHTIEN, true)}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#eceef1] bg-white">
                  <td className="px-3 py-3 text-[18px] font-bold text-[#4b4f59]">
                    Tổng cộng
                  </td>
                  <td />
                  <td className="px-3 py-3 text-right text-[18px] font-bold text-[#2f61b6]">
                    {formatCurrency(
                      list.reduce((sum, it) => sum + Number(it?.THANHTIEN || 0), 0),
                      true
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Box>
      )
    }

    return (
      <Box className="my-4 rounded-2xl bg-white m-0 p-2">
        <Button
          className="w-full cursor-pointer !p-0"
          style={{ justifyContent: "space-between" }}
          flex
          alignItems="center"
          onClick={onToggle}
        >
          <Box className="flex items-center gap-2 m-0">
            <Box
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                isDaNhan ? "bg-[#2f61b6]" : "bg-[#e6ab2f]"
              }`}
            >
              {isDaNhan ? (
                <FaGift size={16} color="#fff" />
              ) : (
                <MdCardGiftcard size={18} color="#fff" />
              )}
            </Box>
            <Text className="text-[21px] font-bold text-[#202239]">{title}</Text>
            <Box className="min-w-6 rounded-full bg-[#e8eef7] px-2 py-[1px] text-center">
              <Text className="text-[12px] font-bold text-[#2f61b6]">
                {list.length}
              </Text>
            </Box>
          </Box>
          {arrowIcon}
        </Button>
        {expanded && (
          <Box mt={3}>
            <Box className="h-px w-full bg-[#ebedf0]" />
            {sectionContent}
          </Box>
        )}
      </Box>
    )
  }

  let pageBody = null
  if (loading) {
    pageBody = (
      <div className="flex items-center justify-center gap-2">
        <LoadingSpinner />
        <span className="font-semibold">Đang tải dữ liệu...</span>
      </div>
    )
  } else if (!dataCT) {
    pageBody = (
      <div className="flex flex-col items-center justify-center">
        <FaInbox size={25} color="#ccc" />
        <Text className="mt-2 text-[13px] text-[#ccc]">
          Không có chương trình đang tham gia
        </Text>
      </div>
    )
  } else {
    pageBody = (
      <Box p={0} className="px-1">
        <KhachhangTichLuyCard
          loading={false}
          dataTichLuy={{ ...dataCT, PK_SEQ: dataCT?.PK_SEQ || CTTL_FK }}
          cusInfo={CusInfo}
        />
        {renderQuaSection({
          title: "Quà đã nhận",
          expanded: showQuaDaNhan,
          onToggle: () => setShowQuaDaNhan((v) => !v),
          list: quaDaNhan,
          emptyText: "Chưa có quà đã nhận",
          isDaNhan: true,
        })}

        {renderQuaSection({
          title: "Quà chưa nhận",
          expanded: showQuaChuaNhan,
          onToggle: () => setShowQuaChuaNhan((v) => !v),
          list: quaChuaNhan,
          emptyText: "Không có quà chưa nhận",
          isDaNhan: false,
        })}
      </Box>
    )
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      <HeaderBack
        slot="fixed"
        icon={<MdCardGiftcard size={25} className="text-blue-imex" />}
        title="Chi tiết tích lũy"
      />

      {pageBody}
      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
    </Page>
  )
}

export default PageTichLuyDetail
