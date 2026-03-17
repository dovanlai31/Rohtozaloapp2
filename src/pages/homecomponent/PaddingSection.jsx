import React from 'react'
import { Box } from 'zmp-ui'


function PaddingSection({
    size= "4",
    height="10px",
 
}) {
  return (
    <Box
    m="0"
    my={size}
    noSpace={true}
    height={height}
   
  ></Box>
  )
}

export default PaddingSection