import React from "react"
import { Box, Icon, Link, Text } from "zmp-framework/react"
import "../../styles/notifypage.scss"

import Color from "@components/common/Color"
import { File } from "@components/Icons"
import LoadingSpinner from "@components/LoadingSpinner"
import { FaInbox } from "react-icons/fa6"
import { formatCurrency } from "@utils/networking"
import FOBHorizontal from "@components/common/FOBHorizontal"
import { Button } from "zmp-ui"

type Props = {
  ListDonHang: any[]
  loading: boolean
  lastPage: boolean
  getListDonHang: () => void
  setLoai: (loai: number) => void
  setSelectedDH: (dhId: string) => void
}

const DonHangKiemTraDDH: React.FC<Props> = (props) => {
  const { ListDonHang, lastPage, loading, getListDonHang, setLoai, setSelectedDH } =
    props

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
            <div
              style={{ position: "relative", marginBottom: 16 }}
              className="list-item-container_v2 bg-white"
            >
              <Link
                key={index}
                href={
                  "/kiemtradonhangdetail/?id=" +
                  item.MADH +
                  "&tt=1&isgiaohang=" +
                  item.IS_GIAOHANG +
                  ""
                }
                animate
                transition="zmp-cover-v"
                noLinkClass
              >
                <Box className="list-item-donhang_v2" key={item.MADH}>
                  <Box
                    className="customText"
                    style={{ width: "70%" }}
                    flex
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <Box
                      m="0"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                      }}
                    >
                      {item.Trangthai === "Chờ xác nhận" ? (
                        <File
                          color={{
                            id: "blueGradient3",
                            start: "#0971ae",
                            end: "#82c0df",
                          }}
                        />
                      ) : item.Trangthai === "Đã xác nhận" ? (
                        <File
                          color={{
                            id: "greenGradient3",
                            start: "#70ac2d",
                            end: "#bdd5a2",
                          }}
                        />
                      ) : (
                        <File
                          color={{
                            id: "redGradient3",
                            start: "#dc3545",
                            end: "#f40005",
                          }}
                        />
                      )}
                      <Text
                        size="normal"
                        className="font-extrabold text-blue-imex "
                        style={{
                          width: "100%",
                          fontSize: "14px",
                        }}
                      >
                        Mã đơn hàng: {item.MADH}
                      </Text>
                    </Box>
                    <Box mx="0" alignItems="center">
                      <Text
                        className="desc text-blue-dark overflow-ellipsis "
                        style={{
                          width: "100%",
                          fontSize: "13px",
                          color: Color.textAPPGray,
                        }}
                        size="small"
                      >
                        <b>Trạng thái:</b> {item.Trangthai}
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
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        size="small"
                      >
                        <b>Người tạo:</b> {item.PG}
                      </Text>
                      <Text
                        className="desc text-blue-dark overflow-ellipsis "
                        style={{
                          width: "100%",
                          fontSize: "13px",
                          color: Color.textAPPGray,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        size="small"
                      >
                        <b>Cửa hiệu:</b> {item.CUAHIEU}
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
                        <b>Ngày Tạo:</b> {item.NGAYDH}
                      </Text>
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
                        <b>{formatCurrency(item.TONGGIATRI, false)}</b>
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Link>
              {item.Trangthai === "Chờ xác nhận" && (
                <div
                  style={{
                    right: 0,
                    bottom: -24,
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    paddingInline: 16,
                  }}
                >
                  <Button
                    variant="secondary"
                    style={{ backgroundColor: "#f8d7db", color: "#dc3545" }}
                    onClick={() => {
                      setLoai(2)
                      setSelectedDH(item.MADH + "")
                    }}
                  >
                    Từ chối
                  </Button>
                  <Button
                    style={{ backgroundColor: "#3e966c" }}
                    onClick={() => {
                      setLoai(1)
                      setSelectedDH(item.MADH + "")
                    }}
                  >
                    Xác nhận
                  </Button>
                </div>
              )}
            </div>
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

export default DonHangKiemTraDDH
