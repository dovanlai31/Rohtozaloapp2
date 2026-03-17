import Header from "../components/Header"
import store from "../store"
import {
  Box,
  Card,
  Page,
  SkeletonBlock,
  SkeletonText,
  Text,
  useStore,
  zmp,
} from "zmp-framework/react"
import { BrowserRouter as Router } from "react-router-dom"
import { getAPI } from "../utils/networking"
import { useEffect, useState } from "react"
import { formatNumWhenTyping, validateString } from "@utils/util"
import withOverlay, { withOverlayProps } from "@components/HOC/withOverlay"
import { FaInbox } from "react-icons/fa6"

type Props = {}

const Voucher: React.FC<Props & withOverlayProps> = (props) => {
  const { showToast } = props
  const CusInfo = useStore(store, "getCusInfo")

  const [loading, setLoading] = useState<boolean>(false)
  const [voucher, setVoucher] = useState<any[]>([])

  const _getVoucher = async () => {
    try {
      setLoading(true)
      const { data, error }: any = await getAPI("khuyenmai/voucher", "POST", {
        userId: validateString(CusInfo.KHACHHANG_fk + "", true),
      })

      if (error || !data.result) {
        console.error(data.message)
        showToast("Lỗi truy xuất voucher", "danger")
      }

      console.log(JSON.parse(data.content))
      setVoucher(JSON.parse(data.content))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    _getVoucher()
  }, [])

  return (
    <Router>
      <Page
        onPageBeforeIn={() => {
          zmp.toolbar.hide("#main-nav")
        }}
        className="detail-page"
      >
        <Box
          m="0"
          p="0"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Header title={"Voucher"} back>
            Voucher
          </Header>
          <Box m="0" p="0" slot="fixed">
            {loading &&
              [1, 2, 3].map((item) => (
                <SkeletonBlock
                  key={item + ""}
                  borderRadius="12"
                  effect="wave"
                  height="120px"
                  tag="div"
                  width="auto"
                  style={{ margin: 12 }}
                ></SkeletonBlock>
              ))}
            {!loading && voucher.length === 0 && (
              <div className="flex flex-col justify-center items-center">
                <FaInbox size={25} color="#ccc" />
                <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
                  Bạn không có voucher. Hãy thu thập voucher ngay
                </Text>
              </div>
            )}
            <Box m="0" px="6" py="3" style={{ paddingBottom: 64 }}>
              {!loading &&
                voucher &&
                voucher.length > 0 &&
                voucher.map((item: any, index: number) => (
                  <Card
                    key={index + ""}
                    style={{
                      borderRadius: 12,
                      paddingInline: 32,
                      position: "relative",
                      marginBottom: 16,
                    }}
                    className="coupon-background"
                  >
                    <div
                      style={{
                        left: 6.9,
                      }}
                      className="absolute-center half-circle-left"
                    ></div>
                    <div
                      style={{
                        left: "auto",
                        right: -7.7,
                      }}
                      className="absolute-center half-circle-right"
                    ></div>
                    <Text style={{ color: "#f7f9ff", fontSize: 12 }}>
                      {item.dienGiai}
                    </Text>
                    <Text
                      style={{
                        color: "#f7f9ff",
                        fontSize: 24,
                        fontWeight: "bold",
                        marginTop: 24,
                      }}
                    >
                      Mã số: {item.id}
                    </Text>
                    {/* <Text
                      style={{
                        color: "#f7f9ff",
                        fontSize: 13,
                        marginTop: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {item.dienGiai}
                    </Text> */}
                    <Box m="0" p="0" style={{ marginTop: 32 }}>
                      <Text
                        style={{
                          color: "#f7f9ff",
                          fontSize: 12,
                        }}
                      >
                        {item.tuNgay + " > " + item.denNgay}
                      </Text>
                    </Box>
                  </Card>
                ))}
            </Box>
          </Box>
        </Box>
      </Page>
    </Router>
  )
}

export default withOverlay(Voucher)
