import {
  Box,
  Link,
  Page,
  Tab,
  Tabbar,
  Tabs,
  Text,
  useStore,
} from "zmp-framework/react"

import store from "../store"

import HeaderBox from "@components/Header/HeaderBox"
import { Voucher } from "@components/Icons"
import Color from "@components/common/Color"
import { formatDateToDDMMYYYY } from "@utils/util"
import { FaInbox } from "react-icons/fa6"
import { MdDiscount } from "react-icons/md"
import "../styles/notifypage.scss"

const KhuyenMaiPage = ({ zmproute }) => {
  const ListKM = store.getters.ListKM.value || []
  const ListCTTLXu = store.getters.ListCTTLXu.value || []
  const ListCTTLDiem = store.getters.ListCTTLDiem.value || []
  const CusInfo = store.getters.getCusInfo.value || {}
  const userInfo = useStore("user")

  // useEffect(() => {
  //   if(ListKM.length == 0) {
  //     getListKM(CusInfo?.KHACHHANG_fk)
  //   }

  //   if(ListCTTLXu.length == 0) {
  //     getListCTTLXu(CusInfo?.KHACHHANG_fk)
  //   }

  //   if(ListCTTLDiem.length == 0) {
  //     getListCTTLDiem(CusInfo?.KHACHHANG_fk)
  //   }
  // }, [])

  return (
    <Page className="detail-page">
      <HeaderBox
        slot="fixed"
        icon={<MdDiscount size={25} className="text-blue-imex" />}
        HeaderBoxName={"Khuyến Mãi"}
      />
            <Box
              className="view-center-gh"
              m="0"
              p="0"
              style={{ paddingBottom: 200 }}
            >
              {/* {CusInfo?.mucduyet != 2 && (
                <div className="flex flex-col justify-center items-center">
                  <RiUserForbidFill size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Duyệt để xem chương trình khuyến mãi
                  </Text>
                </div>
              )} */}
              {ListKM?.length == 0 && (
                // && CusInfo?.mucduyet == 2
                <div className="flex flex-col justify-center items-center">
                  <FaInbox size={25} color="#ccc" />
                  <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                    Không có khuyến mãi
                  </Text>
                </div>
              )}
              {ListKM?.length > 0 &&
                // CusInfo?.mucduyet == 2 &&
                ListKM.map((km, index) => {
                  return (
                    <Box
                      className="list-item-km2 shadown-app-2"
                      key={km.scheme}
                      style={{
                        padding: 0,
                        borderRadius: 10,
                        background: "white",
                        width: "100%",
                        marginBottom: 12,
                      }}
                    >
                      <Link
                        animate
                        noLinkClass
                        href={`/tichluydetail?loai=2&item=${km.pk_seq}&index=${index}`}
                        //  onClick={() => {
                        //   zmp.views.main.router.navigate("/search/?ctkmid=" + km.scheme+'')
                        //   zmp.tab.show("#view-main")
                        // }}
                      >
                        <Box flex alignItems="center">
                          <Box className="list-icon2" style={{ width: "20%" }}>
                            <span className="RoundIcon4">
                              <Voucher
                                color={{
                                  id: "RedGradientx",
                                  start: "#e60f0f",
                                  end: "#e0887d",
                                }}
                              />
                            </span>

                            {/* <img className="giohang-img"
                          style={{ width: 55, height: 55, }} src={icongif2}></img> */}
                          </Box>

                          <Box
                            className="customText"
                            style={{ width: "100%" }}
                            flex
                            flexDirection="column"
                            justifyContent="flex-start"
                            flexWrap
                          >
                            <Box>
                              <Text
                                size="small"
                                style={{ color: Color.textAPPBlue }}
                                className="font-extrabold bg-text-second"
                              >
                                {km.scheme}
                              </Text>
                            </Box>

                            <Box alignItems="center">
                              <Text
                                style={{ color: Color.textAPPDefault, fontSize: 12 }}
                                mx="0"
                              
                              >
                                {km.TUNGAY + " đến " + km.DENNGAY}
                              </Text>

                              {/* <Text  mx="5" size="small">
                          Đến: {km.DENNGAY}
                          </Text> */}
                              <Text
                                style={{ color: Color.textTra, fontSize: 13 }}
                                mx="0"
                                size="small"
                              >
                                {km.diengiai}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  )
                })}
              <Box
                className=""
                noSpace={true}
                flex
                alignItems="center"
                justifyContent="space-between"
              >
                <Box flex alignItems="center" m={5} py={7}></Box>
              </Box>
            </Box>
      {/* <Header  title = {'Khuyến mãi'}></Header> */}

    </Page>
  )
}
const styles = {
  ButtonBack: {
    position: "absolute",
    top: 17,
    left: 17,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(82, 130, 255, 0.2)",
  },
  btnViewGiohang: {
    width: "93%",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderColor: "#dbdfe2",
  },
}
export default KhuyenMaiPage
