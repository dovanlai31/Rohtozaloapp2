import { Box, Icon, Link, Text } from "zmp-framework/react"

const SearchBox = () => {
  return (
    <Box className="box-shadow-5" m="0" p="0" flex={true} style={{ width: `95%` }}>
      <Link href="/search?all=1" flex alignItems="center" style={styles.boxsearch}>
        <Box m="0" p="0" flex alignItems="center" className="gap-1">
          <Icon zmp="zi-search" style={{ color: "#98A1B3" }}></Icon>
          <Text style={{ color: "#98A1B3" }}>Tìm kiếm</Text>
        </Box>
        <div className="iconsearchWrap">
          <Icon className="iconsearch" color="#98A1B3" zmp="zi-tune"></Icon>
        </div>
      </Link>
    </Box>
  )
}

const styles = {
  boxsearch: {
    width: "100%",
    padding: 13,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}

export default SearchBox
