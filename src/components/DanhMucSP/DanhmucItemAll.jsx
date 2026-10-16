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
import CategoryThumb from "./CategoryThumb"

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
  console.log("xxxxxxxxxxxtiem dm x ", item)

  return (
    <Link
      href={`/pagedanhmuc?index=${index}`}
      noLinkClass
      className="!flex min-w-0 flex-col items-center overflow-hidden px-1.5"
      style={{ width: "33.333%" }}
    >
      <CategoryThumb
        src={item?.HINHANH}
        name={item?.TEN}
        index={index}
        className="aspect-square w-full max-w-[84px] p-3"
        textClassName="text-xl"
      />
      <span
        className="mt-1.5 line-clamp-2 w-full text-center text-[12px] leading-tight text-slate-700"
        style={{ overflowWrap: "anywhere" }}
      >
        {item?.TEN || ""}
      </span>
    </Link>
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
