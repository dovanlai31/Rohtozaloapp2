import Color from "@components/common/Color"
import { colorsArr } from "@static/values"
import classNames from "classnames"
import propTypes, { any, string } from "prop-types"
import colors from "tailwindcss/colors"
import { Box, Link, SkeletonBlock, SkeletonText, Text } from "zmp-framework/react"

const DanhmucItem = ({ item, seen, loading, index, col }) => {
  const classes = classNames("absolute avatar-border", {
    "avatar-seen": seen,
    "avatar-not-seen": !seen,
  })

  let vt = index % 21

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

  return (
    <Box
      m="0"
      px="0"
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
        alignItems="center"
        style={{ width: "100%" }}
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
          className="avatar-wrapper"
        >
          <Box
            m="0"
            p="1"
            className=" avatar-wrapperHome"
            style={{
              backgroundColor: item.COLORS ? item.COLORS : colorsArr[vt],
              borderColor: colors.amber,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 5,


            }}
          >
            <img loading="lazy" className="imgCatalog" src={item?.HINHANH}></img>
          </Box>
        </Link>
      </Box>
      <Box>
        <Text
          className="textline2"
          style={{ fontSize: 12, textAlign: "center", padding: 0, margin: 0 ,  }}
        >
          {item.TEN || ""}
        </Text>
      </Box>
    </Box>
  )
}

DanhmucItem.propTypes = {
  item: propTypes.shape({
    avatar: any,
    name: string,
    [string]: any,
  }),
  seen: propTypes.bool,
}

export default DanhmucItem
