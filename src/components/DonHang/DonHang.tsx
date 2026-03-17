import React from "react"
import { Box, Icon, Link, Text } from "zmp-framework/react"
import "../../styles/notifypage.scss"

import Color from "@components/common/Color"
import { File } from "@components/Icons"
import LoadingSpinner from "@components/LoadingSpinner"
import { FaInbox } from "react-icons/fa6"
import { formatCurrency } from "@utils/networking"

type Props = {
  ListDonHang: any[]
  loading: boolean
  lastPage: boolean
  getListDonHang: () => void
}

const DonHang: React.FC<Props> = (props) => {
  const { ListDonHang, lastPage, loading, getListDonHang } = props

  return (
    <Box
      m="0"
      p="5"
      pb="8"
      className="w-full"
      style={{
        flex: 1,
        overflow: "scroll",
        flexDirection: "column",
      }}
    >
      {ListDonHang.length == 0 && !loading && (
        <div className="flex flex-col justify-center items-center">
          <FaInbox size={25} color="#ccc" />
          <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
            Đang tải hoặc không có đơn hàng
          </Text>
        </div>
      )}
      {ListDonHang &&
        ListDonHang.map((item, index) => {
          return (
            <Link
              key={index}
              href={
                "/capnhatdonhang/?id=" +
                item.MADH +
                "&tt=1&isgiaohang=" +
                item.trangthai_syn +
                ""
              }
              animate
              transition="zmp-cover-v"
              noLinkClass
            >
              <Box mb="3" className="list-item-donhang bg-white" key={item.MADH}>
                <Box className="list-icon2" style={{ width: "20%" }}>
                  <Box className="RoundIcon4">
                    {item.Trangthai === "Chờ xác nhận" ? (
                      <File
                        color={{
                          id: "blueGradient3",
                          start: "#0971ae",
                          end: "#82c0df",
                        }}
                      />
                    ) : (
                      <File
                        color={{
                          id: "greenGradient3",
                          start: "#dc3545",
                          end: "#f40005",
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box
                  className="customText"
                  style={{ width: "80%" }}
                  flex
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Box m="0">
                    <Text
                      size="normal"
                      className="font-extrabold text-blue-imex "
                      style={{
                        width: "100%",
                        fontSize: "14px",
                      }}
                    >
                      Mã đơn: {item.MADH}
                    </Text>
                  </Box>
                  <Box mx="0" alignItems="center">
                    <Text
                      className="desc text-blue-dark overflow-ellipsis "
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        color: Color.textAPPCopper,
                      }}
                      size="small"
                    >
                      {item.Trangthai}
                    </Text>

                    {/* <Text  mx="5" size="small">
                  Đến: {km.DENNGAY}
                  </Text> */}

                    <Text
                      className="desc text-blue-dark overflow-ellipsis "
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        color: Color.textAPPGray,
                      }}
                      size="small"
                    >
                      Ngày Tạo: {item.NGAYDH}
                    </Text>
                    {/* <Text
                      className="desc text-blue-dark overflow-ellipsis "
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        color: Color.textAPPGray,
                      }}
                      size="small"
                    >
                      {item.trangthai}
                    </Text> */}
                    {(item.tt === 1 || item?.kiemTraDDH === 1) && (
                      <>
                        <Text
                          className="desc text-blue-dark overflow-ellipsis "
                          style={{
                            width: "100%",
                            fontSize: "13px",
                            color: Color.textAPPGray,
                          }}
                          size="small"
                        >
                          Ký hiệu hoá đơn: {item.KYHIEU}
                        </Text>
                        <Text
                          className="desc text-blue-dark overflow-ellipsis "
                          style={{
                            width: "100%",
                            fontSize: "13px",
                            color: Color.textAPPGray,
                          }}
                          size="small"
                        >
                          Số hoá đơn: {item.SOHOADON}
                        </Text>
                      </>
                    )}
                    {item?.kiemTraDDH === 1 && (
                      <Text
                        className="desc text-blue-dark overflow-ellipsis "
                        style={{
                          width: "100%",
                          fontSize: "13px",
                          color: Color.textAPPGreen,
                          marginTop: 8,
                        }}
                        size="small"
                      >
                        {formatCurrency(item.TONGGIATRI, false)}
                      </Text>
                    )}
                  </Box>
                </Box>
              </Box>
            </Link>
          )
        })}
      {loading && <LoadingSpinner />}
      {!loading && !lastPage && ListDonHang.length > 0 && (
        <button
          className="py-3 flex flex-row items-center justify-center"
          onClick={() => getListDonHang()}
        >
          <Text
            style={{
              color: Color.textAPPDefault,
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            Xem thêm
          </Text>
          {/* <Icon color={Color.textAPPDefault} zmp="zi-arrow-down"></Icon> */}
        </button>
      )}
    </Box>
  )
}

export default DonHang
