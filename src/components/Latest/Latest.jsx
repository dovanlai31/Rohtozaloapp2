import React from "react"
import Post from "@components/Product"
import { Title, Box, Link, SkeletonText, useStore } from "zmp-framework/react"
import { Section } from "@components/common/Section"
import { Text } from "zmp-ui"
import Color from "@components/common/Color"

const Latest = (props) => {
  const { data } = useStore("latestBlogs")
  const loading = useStore("loadingBlogs")
  const CusInfo = useStore("getCusInfo")

  if (loading) {
    return (
      <Box className="latest bg-slate-50">
        <Box m="0" flex flexDirection="row" justifyContent="space-between">
          <SkeletonText effect="fade">Sản phẩm</SkeletonText>
        </Box>
        <div className="posts">
          <Post loading />
        </div>
      </Box>
    )
  }
  return (
    <Section
      title="Sản phẩm"
      titleSecondShow={true}
      titleSecond="Tất cả"
      RouterSecond="/search?all=1c"
      padding="title-only"
    >
      {data?.length > 0 ? (
        <Box flexWrap m="0" flex flexDirection="row" justifyContent="space-between">
          {data.map((item) => (
            <Post
              {...item}
              CusInfo={CusInfo}
              key={item.id}
              mucduyet={props?.mucduyet || 1}
            />
          ))}
        </Box>
      ) : (
        <Box m="0" flex flexDirection="row" justifyContent="space-between">
          <Text
            style={{
              textAlign: "center",
              padding: "0 25",
              margin: "0 25",
              fontSize: "12px",
              // fontWeight: "bold",
              color: Color.textAPPGray2,
            }}
            size="normal"
            className="text-center  w-full"
          >
            Không có sản phẩm nào, vui lòng đồng bộ qua số điện thoại
          </Text>
        </Box>
      )}
    </Section>
  )
}

export default Latest
