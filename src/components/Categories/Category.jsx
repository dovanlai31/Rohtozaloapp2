import React, { forwardRef, useRef, useImperativeHandle } from "react"
import { SkeletonBlock, Text } from "zmp-framework/react"
import { Box } from "zmp-ui"
import "../../styles/banner.scss"
const Category = forwardRef(({ loading, url }, ref) => {
  const elRef = useRef(null)
  // console.log('url      ccccccccccccccccc ',url)
  useImperativeHandle(ref, () => elRef.current)
  if (loading) {
    return (
      <Box my={0} mr={0} ml={10} ref={elRef} className="banner image-card">
        <SkeletonBlock className="image-card"></SkeletonBlock>
      </Box>
    )
  }

  return <img loading="lazy" className="image-card" src={url} />
})

export default Category
