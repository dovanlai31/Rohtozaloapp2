import React from "react"
import propTypes, { any, string } from "prop-types"
import {
  Avatar,
  Box,
  Text,
  SkeletonBlock,
  SkeletonText,
  zmp,
  Link,
} from "zmp-framework/react"
import classNames from "classnames"
import colors from "tailwindcss/colors"
import { colorsArr } from "@static/values"

const DanhmucItemAll = ({ item, seen, loading, index, col }) => {
  if (loading) {
    return (
      <Box m="0" className="story" flex flexDirection="column" alignItems="center">
        <Box m="0" className="relative avatar-wrapper">
          <SkeletonBlock borderRadius="24px" width={68} height={68} />
        </Box>
        <SkeletonText className="story-name text-blue-dark-text"></SkeletonText>
      </Box>
    )
  }
  const classes = classNames("absolute avatar-border", {
    "avatar-seen": seen,
    "avatar-not-seen": !seen,
  })

  let vt = index % 21

  return (
    <Box
      m="0"
      className={col ? "story3" : "story2"}
      flex
      flexDirection="column"
      alignItems="center"
      style={{ width: "25%" }}
    >
      <Box
        pt="0"
        mt="0"
        flex
        justifyContent="center"
        alignItems='flex-center'
        style={{ width: "100%", }}
      >
        <Link
          // href="/pagedanhmuc?id="+index
          href={`/pagedanhmuc?index=${index}`}
          onClick={() => {
            // zmp.views.main.router.navigate("/search/?id=" + user.pk_seq+'&clten='+user.ten)
          }}
          //  animate
          //  transition='zmp-cover-v'
          noLinkClass
          className="avatar-wrapper rounded-2xl"
        >
          <Box
            m="0"
            p="1"
            my="2"
            className="rounded-2xl avatar-wrapperAll"
            style={{
              backgroundColor: item?.COLORS ? item.colors : (index % 2 == 0 ? '#005DAA' : '#00A3D5'),
              borderColor: "#F2F2F2",
            }}
          >
            <img loading="lazy" className="p-[20px]" src={item?.HINHANH}></img>
            <Box py={1}>
              <Text
                className="textline2   text-white "
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "16px",
                  textAlign: "center",
                  padding: 0,
                  margin: 0,
                }}
              >
                {item?.TEN || ""}
              </Text>
            </Box>
            {/* <div className={classes}></div> */}
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

DanhmucItemAll.propTypes = {
  item: propTypes.shape({
    avatar: any,
    name: string,
    [string]: any,
  }),
  seen: propTypes.bool,
}

export default DanhmucItemAll
