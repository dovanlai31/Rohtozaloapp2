import Color from "@components/common/Color"
import { colorsArr } from "@static/values"
import classNames from "classnames"
import propTypes, { any, string } from "prop-types"
import colors from "tailwindcss/colors"
import { Box, Link, SkeletonBlock, SkeletonText, Text } from "zmp-framework/react"

const DanhmucItem = ({ item, seen, loading, index, col,loai }) => {
  const classes = classNames("absolute avatar-border", {
    "avatar-seen": seen,
    "avatar-not-seen": !seen,
  })

  let vt = index % 21

  console.log('xxxxxxxxxxxtiem x ',item)
  let i = (loai ? item.PK_SEQ : index)
  

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
        style={{ width: "100%", }}
      >
        <Link
          // href="/pagedanhmuc?id="+index
          href={`/pagedanhmuc?index=${i}&loai=${loai}`}
          onClick={() => {
            // zmp.views.main.router.navigate("/search/?id=" + user.pk_seq+'&clten='+user.ten)
          }}
          //  animate
          //  transition='zmp-cover-v'
          noLinkClass
          className="avatar-wrapper"
          style={{
            backgroundColor: item?.COLORS ? item.colors : (index % 2 == 0 ? '#005DAA' : '#00A3D5'),
            borderColor: "#F2F2F2",
            borderRadius: 20,
          }}
        >
          <div className="flex flex-col">
            <div className="border border-[#E0E0E0] border-2 rounded-2xl p-3">
              <img loading="lazy" className="max-h-[65px]" src={item?.HINHANH}></img>
            </div>

            {/* <Box
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
            </Box> */}
          </div>
        </Link>
      </Box>
      <Box>
        <Text className="font-normal text-sm" style={{ textAlign: "center" }}>{item.TEN || ""}</Text>
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
