import React from "react"
import { FC, PropsWithChildren } from "react"

import { Box, Text } from "zmp-ui"
import { Link } from "zmp-framework/react"

export const Section = ({
  children,
  titleSecondShow,
  title,
  titleSecond = "Tất cả",
  RouterSecond,
  padding = "all",
  ...props
}) => {
  //console.log('xxxyy',RouterSecond );
  return (
    <Box
      className={`bg-background ${padding === "all" ? "p-4 space-y-4" : ""} ${padding === "title-only" ? "py-4 space-y-4" : ""
        }`}
      {...props}
    >
      <Box flex justifyContent="space-between" alignItems="center">
        <Text.Title
          size="Large"
          className={`!font-extrabold text-primary ${padding === "title-only" ? "px-4" : ""}`}
        >
          {title}
        </Text.Title>
        {titleSecondShow && (
          <Text.Title
            size="Large"
            className={` ${padding === "title-only" ? "px-4" : ""}`}
          >
            <Link
              className="!text-primary !font-extrabold"
              href={RouterSecond}> {titleSecond}</Link>
          </Text.Title>
        )}
      </Box>

      {children}
    </Box>
  )
}
