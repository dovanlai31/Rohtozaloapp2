import store from "../../store"
import { formatCurrency } from "@utils/networking"
import {
  Box,
  Card,
  Link,
  SkeletonBlock,
  SkeletonText,
  Text,
  Title,
  zmp,
  zmpready,
} from "zmp-framework/react"

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
  } = item
  if (loading) {
    return (
      <Box style={style} mx="0" my="3" className="post">
        <Card inset className="overflow-hidden 	p-0">
          <Link noLinkClass>
            <Box m="0" flex flexDirection="row" alignItems="stretch">
              <div className="img-sanpham-thumbnail overflow-hidden">
                <SkeletonBlock width={"100%"} height={120} effect="fade" />
              </div>
              <Box
                m="0"
                py="5"
                mx="5"
                flex
                flexDirection="column"
                className="flex-1"
                height={261}
              >
                <SkeletonText effect="fade"></SkeletonText>
                <SkeletonText effect="fade"></SkeletonText>
                <SkeletonText effect="fade"></SkeletonText>
              </Box>
            </Box>
          </Link>
        </Card>
      </Box>
    )
  }

  return (
    <Box style={style} mx="0" my="3" className="post">
      <Card inset className="overflow-hidden shadow-3	p-0">
        <Link
          onClick={() => {
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
            zmp.views.main.router.navigate("/detail/?id=" + id)
          }}
          //  animatepdetail
          //  transition='zmp-cover-v'
          noLinkClass
        >
          <Box
            m="0"
            justifyContent="center"
            flex
            flexDirection="column"
            alignItems="stretch"
            height={261}
          >
            <div
              className="img-sanpham-thumbnail overflow-hidden"
              style={{
                backgroundImage: `url(${encodeURI(HinhAnh)})`,
                height: "100%",
                width: "auto",
                margin: 8,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            ></div>

            <Box
              m="0"
              py="5"
              mx="5"
              flex
              flexDirection="column"
              justifyContent="center"
              className="flex-1"
            >
              <Title className="post-title text-Green-Nuti font-extrabold">
                {ten}
              </Title>
             {CusInfo?.active !== "0" ?<Text
                style={{ paddingTop: "5px" }}
                className="desc  text-left text-Red-BrandChill text-base overflow-ellipsis "
              >
                { formatCurrency(dongia, true) + "₫"}
              </Text> :<Text
                style={{ paddingTop: "5px" }}
                className="desc  text-left text-Red-BrandChill text-base overflow-ellipsis "
              >
                Liên hệ
              </Text>}
            </Box>
          </Box>
        </Link>
      </Card>
    </Box>
  )
}

export default Product
