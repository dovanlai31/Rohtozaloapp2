import React from "react"
import { Box, Text } from "zmp-framework/react"
function SubTitle({ title, rightContent }) {
  return (
    <Box className="flex items-center justify-between gap-2 m-0 mx-4 my-4 ">
      <div className="flex items-center gap-2">
        <Box className="w-1 h-4 bg-[#08693D] rounded-[4px] m-0"></Box>
        <Text className="text-[16px] font-bold text-[#2d5bb9] m-0">{title}</Text>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </Box>
  )
}

export default SubTitle
