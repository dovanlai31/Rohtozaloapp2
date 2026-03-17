import Color from "@components/common/Color"
import { formatCurrency } from "@utils/networking"
import { BiSolidDiscount } from "react-icons/bi"
import { FaInbox } from "react-icons/fa6"
import {
  Box,
  Link,
  SkeletonBlock,
  Tab,
  Tabbar,
  Tabs,
  Text,
} from "zmp-framework/react"
import "../../styles/notifypage.scss"

const CTTichLuy = ({ loai, data, tenCTTL }) => {
  const main = data[0]?.main.length > 0 ? JSON.parse(data[0]?.main) : []
  const sub = data[0]?.sub.length > 0 ? JSON.parse(data[0]?.sub) : []

  const RenderItemXu = () => {
    return (
      <div
        className="p-3 mx-3 my-1 shadow-lg"
        style={{ backgroundColor: "white", borderRadius: 12 }}
      >
        <div
          className="p-4 my-2 flex items-center font-semibold"
          style={{
            backgroundColor: Color.textAPPGray2,
            borderRadius: 4,
            color: "white",
            gap: 8,
          }}
        >
          <span style={{ width: 100 }}>Mã</span>
          <span style={{ width: 250 }}>Tên</span>
          <span style={{ width: 100 }}>Xu</span>
        </div>
        {main.map((item) => (
          <div
            key={item.pK_SEQ}
            className="p-4 my-2 flex items-center"
            style={{
              backgroundColor: "#eee",
              borderRadius: 4,
              color: "black",
              gap: 8,
            }}
          >
            <span style={{ width: 100 }}>{item.MA}</span>
            <span style={{ width: 250, wordBreak: "break-all" }}>{item.TEN}</span>
            <span style={{ width: 100 }}>{formatCurrency(item.XU, true)}</span>
          </div>
        ))}
      </div>
    )
  }

  const RenderItemDiem = () => {
    return (
      <Tabs m={5} animated swipeable style={{ marginTop: 24 }}>
        <Tab id={"tieuchiDiem"} tabActive style={{ paddingInline: 4 }}>
          <Box
            className="view-center-gh px-4 py-2 shadow-lg"
            style={{
              marginBottom: 24,
              background: "#fff",
              width: "96%",
              borderRadius: 10,
            }}
          >
            <div className="p-4 my-2 flex items-center common-table-header">
              <Text
                className="font-semibold"
                style={{ width: 120, fontSize: 13, color: "#333" }}
              >
                Mức
              </Text>
              <Text
                className="font-semibold"
                style={{ width: 120, fontSize: 13, color: "#333" }}
              >
                Từ mức
              </Text>
              <Text
                className="font-semibold"
                style={{ width: 120, fontSize: 13, color: "#333" }}
              >
                Đến mức
              </Text>
            </div>
            {main.map((item) => (
              <div
                key={item.pk_seq}
                className="p-4 my-2 flex items-center"
                style={{ color: "black" }}
              >
                <Text style={{ width: 120, fontSize: 13 }}>{item.muc}</Text>
                <Text style={{ width: 120, fontSize: 13 }}>
                  {formatCurrency(item.tumuc)}
                </Text>
                <Text style={{ width: 120, fontSize: 13 }}>
                  {formatCurrency(item.denmuc)}
                </Text>
              </div>
            ))}
          </Box>
        </Tab>
        <Tab id={"sanphamDiem"}>
          <Box
            className="view-center-gh p-2 m-0"
            style={{
              marginBottom: 24,
              width: "100%",
              overflow: "scroll",
              paddingBottom: 100,
            }}
          >
            {sub.length == 0 && (
              <div className="flex flex-col justify-center items-center">
                <FaInbox size={25} color="#ccc" />
                <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                  Không có sản phẩm
                </Text>
              </div>
            )}
            {sub.map((item, index) => (
              <Box
                mb="2"
                m="0"
                p="2"
                key={index}
                className="shadown-app-2"
                style={{ borderRadius: 10, background: "white", width: "100%" }}
              >
                <Box flex alignItems="center" m="0" p="0">
                  <Box
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      boxShadow: "0 0 0 1px #99a3ad2a",
                    }}
                  >
                    <Box
                      className="bg-cover"
                      style={{
                        backgroundImage: `url(${encodeURI(item?.HINHANH)})`,
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        backgroundSize: "cover",
                      }}
                    />
                  </Box>

                  <Link
                    style={{ width: "80%" }}
                    href={"/detail/?id=" + item?.PK_SEQ}
                    animate
                    transition="zmp-cover-v"
                    noLinkClass
                  >
                    <Box style={{ width: "95%", margin: 0 }}>
                      <Box alignItems="center">
                        <Text
                          size="normal"
                          className="font-extrabold text-blue-imex "
                          style={{
                            width: "100%",
                            fontSize: "13px",
                            marginBottom: 8,
                          }}
                        >
                          {item.TEN}
                        </Text>

                        <Box m="0">
                          <Text
                            className="desc text-blue-dark overflow-ellipsis "
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              color: Color.textAPPGray,
                            }}
                          >
                            Mã: {item.MA}
                          </Text>
                          <Text
                            className="desc text-blue-dark overflow-ellipsis "
                            style={{
                              width: "100%",
                              fontSize: "13px",
                              color: Color.textAPPGray,
                            }}
                          >
                            Đơn vị: {item.DONVI}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                </Box>
              </Box>
            ))}
          </Box>
        </Tab>
      </Tabs>
    )
  }

  return (
    <>
      <Box
        className="latest relative"
        m="0"
        px="5"
        py="0"
        flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <div
          className="flex justify-around items-center w-full p-1 rounded"
          style={{
            background: "#02a388",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <Box className="m-0">
            <Text
              className="text-lg font-medium m-0 p-0"
              style={{ color: "#f8f8f8", lineHeight: "normal" }}
            >
              {tenCTTL}
            </Text>
          </Box>
          <Box className="RoundIcon">
            <BiSolidDiscount fill="#ff6a5b" size={32} />
          </Box>
        </div>
        {loai == 0 && (
          <Box
            m="0"
            p="0"
            className="bg-white shadow-lg"
            style={{
              borderBottomLeftRadius: "0.25rem",
              borderBottomRightRadius: "0.25rem",
            }}
            width={"100%"}
          >
            <Tabbar
              inner={false}
              m={0}
              p={0}
              className="CustomTabbar"
              style={{ backgroundColor: "transparent", margin: 0, height: 48 }}
            >
              <Link
                style={{ fontSize: "14px" }}
                tabLink="#tieuchiDiem"
                tabLinkActive
              >
                Tiêu chí
              </Link>
              <Link style={{ fontSize: "14px" }} tabLink="#sanphamDiem">
                Sản phẩm
              </Link>
            </Tabbar>
          </Box>
        )}
      </Box>
      <Box
        className="latest"
        mt="1"
        flex
        flexDirection="column"
        justifyContent="space-between"
      >
        {data.length == 0 ? (
          <SkeletonBlock
            tag="div"
            width="100%"
            height="100px"
            borderRadius="8px"
            effect="wave"
            className="mt-5"
          ></SkeletonBlock>
        ) : loai == 0 ? (
          RenderItemDiem()
        ) : (
          RenderItemXu()
        )}
      </Box>
    </>
  )
}

export default CTTichLuy
