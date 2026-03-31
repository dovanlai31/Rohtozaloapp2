import React, { useState } from "react"
import { Box, Link, Page, Text } from "zmp-framework/react"

import store from "../store"

import HeaderBox from "@components/Header/HeaderBox"
import { MdDiscount, MdChevronRight, MdStorefront } from "react-icons/md"
import { FaInbox } from "react-icons/fa6"
import "../styles/notifypage.scss"

const KhuyenMaiPage = ({ zmproute }) => {
  const ListKM = store.getters.ListKM.value || []
  const [activeTab, setActiveTab] = useState("km")

  // Lưu lại originalIndex để khi chuyển trang không bị lỗi index
  const filteredList = ListKM.map((km, index) => ({ ...km, originalIndex: index })).filter((km) => {
    if (activeTab === "km") return km.loaict == 0 || km.loaict == null
    if (activeTab === "tichluy") return km.loaict == 2
    if (activeTab === "trungbay") return km.loaict == 1
    return false
  })

  return (
    <Page className="detail-page bg-[#f7f8fa]">
      <HeaderBox
        slot="fixed"
        icon={<MdDiscount size={25} className="text-[#4a73b9]" />}
        HeaderBoxName="Khuyến mãi"
      />

      <Box className="view-center-gh  px-4 pt-4 " m="0" p="0" style={{ paddingBottom: 150, margin: "auto" }}>
        {/* Tabs Container */}
        <div className="flex bg-[#f5f6f8] p-1 rounded-[10px] mb-5">
          <button
            onClick={() => setActiveTab("km")}
            className={`flex-1 py-2.5 text-center text-[13px] font-semibold rounded-lg transition-all duration-300 ${activeTab === "km"
              ? "bg-[#4a73b9] text-white shadow"
              : "text-[#8a92a3] bg-transparent"
              }`}
          >
            CT Khuyến Mãi
          </button>
          <button
            onClick={() => setActiveTab("tichluy")}
            className={`flex-1 py-2.5 text-center text-[13px] font-semibold rounded-lg transition-all duration-300 ${activeTab === "tichluy"
              ? "bg-[#4a73b9] text-white shadow"
              : "text-[#8a92a3] bg-transparent"
              }`}
          >
            CT Tích Lũy
          </button>
          <button
            onClick={() => setActiveTab("trungbay")}
            className={`flex-1 py-2.5 text-center text-[13px] font-semibold rounded-lg transition-all duration-300 ${activeTab === "trungbay"
              ? "bg-[#4a73b9] text-white shadow"
              : "text-[#8a92a3] bg-transparent"
              }`}
          >
            CT Trưng Bày
          </button>
        </div>

        {/* List Content */}
        {filteredList.length === 0 ? (
          <div className="flex flex-col justify-center items-center mt-20">
            <FaInbox size={40} color="#ccc" className="mb-3" />
            <Text className="text-[14px] text-[#999]">
              Không có chương trình nào
            </Text>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredList.map((km) => (
              <Link
                key={km.scheme || km.originalIndex}
                animate
                noLinkClass
                href={`/tichluydetail?loai=2&item=${km.pk_seq}&index=${km.originalIndex}`}
                className="w-full block"
              >
                <div className="bg-white rounded-[14px] p-4 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:bg-gray-50 transition-colors">
                  {/* Icon Left */}
                  <div className="w-[44px] h-[44px] min-w-[44px] rounded-xl bg-[#eef5ef] flex items-center justify-center mr-3.5">
                    <MdStorefront size={22} className="text-[#3c7882]" />
                  </div>

                  {/* Content Middle */}
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="m-0 text-[14px] font-bold text-[#2d5bb9] leading-[1.4] mb-1.5 break-words">
                      {km.scheme} {km.diengiai && km.scheme !== km.diengiai ? `- ${km.diengiai}` : ""}
                    </p>
                    <p className="m-0 text-[12px] text-[#888]">
                      {km.TUNGAY} đến {km.DENNGAY}
                    </p>
                  </div>

                  {/* Icon Right */}
                  <div className="flex items-center justify-center h-full">
                    <MdChevronRight size={22} className="text-[#3ea44e]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Box>
    </Page>
  )
}

export default KhuyenMaiPage
