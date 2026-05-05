import { Box, Icon, Link, Text } from "zmp-framework/react"

const SearchBox = () => {
  return (
    <Box className="box-shadow-5 m-0 flex w-full justify-center p-0">
      <Link
        href="/search?all=1"
        className="box-border block w-[95%] max-w-full rounded-2xl border-2 border-[#D6E3D9] bg-white no-underline"
      >
        <div className="flex  w-full items-center justify-between gap-2 p-[13px]">
          <Box className="m-0 flex min-w-0 flex-1 items-center gap-1 p-0">
            <Icon zmp="zi-search" className="shrink-0 text-[#ffffff]" />
            <Text className="min-w-0 ml-2 text-[#98A1B3]">Tìm kiếm sản phẩm...</Text>
          </Box>
          <div className="iconsearchWrap shrink-0">
            <Icon className="iconsearch text-[#98A1B3]" zmp="zi-tune" />
          </div>
        </div>
      </Link>
    </Box>
  )
}

export default SearchBox
