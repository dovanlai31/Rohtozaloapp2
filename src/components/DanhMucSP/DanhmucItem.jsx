import Color from "@components/common/Color"
import { colorsArr } from "@static/values"
import classNames from "classnames"
import propTypes, { any, string } from "prop-types"
import colors from "tailwindcss/colors"
import { Box, Link, SkeletonBlock, SkeletonText, Text } from "zmp-framework/react"
import { useState,useEffect  } from "react"




const DanhmucItem = ({ item, seen, loading, index, col,loai }) => {
  const classes = classNames("absolute avatar-border", {
    "avatar-seen": seen,
    "avatar-not-seen": !seen,
  })

  let vt = index % 21

  //console.log('xxxxxxxxxxxtiem dm x ',item)
  let i = (loai ? item.PK_SEQ : index)
  

  // Hiển thị ảnh từ danh sách jsonNHANHANG nếu có, tự động chuyển mỗi 3s
  const [currentImgIdx, setCurrentImgIdx] =useState(0);
  let imgList = [];
  try {
    if (item?.jsonNHANHANG) {
      imgList = JSON.parse(item.jsonNHANHANG);
     // console.log("Parsed imgList: ", imgList);
      if (!Array.isArray(imgList)) imgList = [];
    }
  } catch (e) {
    imgList = [];
  }

  useEffect(() => {
    if (!imgList.length) return;
    setCurrentImgIdx(0); // reset về ảnh đầu khi đổi danh sách
    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % imgList.length);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.jsonNHANHANG]);

  const showImg = imgList.length > 0 ? imgList[currentImgIdx] : item?.HINHANH;
  const [fade, setFade] = useState(true);
  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timeout);
  }, [currentImgIdx]);

  // Lấy src đúng định dạng (object hoặc string)
  const imgSrc = typeof showImg === 'object' && showImg !== null ? showImg.HINHANH : showImg;

  return (
    <Box
      m="0"
      px="0"
      className={col ? "story3" : "story2"}
      flex
      flexDirection="column"
      alignItems="center"
      style={{ width: "25%", height: 110 }}
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
          href={`/pagedanhmuc?index=${i}&loai=${loai}`}
          onClick={() => {
            // zmp.views.main.router.navigate("/search/?id=" + user.pk_seq+'&clten='+user.ten)
          }}
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
              <img
                loading="lazy"
                className={`max-h-[65px] transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
                src={imgSrc}
                // alt={item?.TEN || ''}
                style={{ transition: 'opacity 0.5s' }}
              />
            </div>
          </div>
        </Link>
      </Box>
      <Box>
        <Text className="font-normal text-sm" style={{ textAlign: "center" }}>{item.TEN || ""}</Text>
      </Box>
    </Box>
  )
  //           >
  //             <img loading="lazy" className="imgCatalog" src={item?.HINHANH}></img>
  //           </Box> */}
  //         </div>
  //       </Link>
  //     </Box>
  //     <Box>
  //       <Text className="font-normal text-sm" style={{ textAlign: "center" }}>{item.TEN || ""}</Text>
  //     </Box>
  //   </Box>
  // )
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
