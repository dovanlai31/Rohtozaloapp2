import React from "react"
import { Box, Text } from "zmp-framework/react"

const NoDataMessage = () => {
  return (
    <Box flex justifyContent="center" style={{ width: '100%' }}>
      <Text size="Small" className="text-primary">
        Chưa có dữ liệu
      </Text>
    </Box>
  )
}

export default NoDataMessage
