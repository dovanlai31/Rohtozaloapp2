import Color from "@components/common/Color"
import { colorsArr } from "@static/values"
import classNames from "classnames"
import propTypes, { any, string } from "prop-types"
import colors from "tailwindcss/colors"
import { Link, SkeletonBlock, SkeletonText } from "zmp-framework/react"
import { useState,useEffect  } from "react"
import CategoryThumb from "./CategoryThumb"




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

  // Lấy src đúng định dạng (object hoặc string)
  const toSrc = (x) => (typeof x === "object" && x !== null ? x.HINHANH : x)
  // Bỏ ảnh trùng (nhiều nhãn hàng có thể dùng chung 1 ảnh) để key không trùng và không xoay vòng ảnh giống nhau
  const srcList = Array.from(new Set(imgList.map(toSrc).filter(Boolean)))
  const [failed, setFailed] = useState({}) // ảnh tải lỗi thì bỏ qua khi xoay vòng
  const okList = srcList.filter((s) => !failed[s])

  useEffect(() => {
    setCurrentImgIdx(0) // reset về ảnh đầu khi đổi danh sách
    setFailed({})
    if (srcList.length < 2) return
    // Lệch nhịp giữa các ô để không đổi ảnh cùng lúc
    let interval
    const delay = setTimeout(() => {
      interval = setInterval(() => setCurrentImgIdx((prev) => prev + 1), 4000)
    }, (index % 4) * 350)
    return () => {
      clearTimeout(delay)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.jsonNHANHANG])

  const activeSrc = okList.length ? okList[currentImgIdx % okList.length] : null

  return (
    <Link
      href={`/pagedanhmuc?index=${i}&loai=${loai}`}
      noLinkClass
      className="!flex min-w-0 flex-col items-center overflow-hidden px-1"
      style={{ width: "25%" }}
    >
      {okList.length > 1 ? (
        // Nhiều ảnh: ảnh cũ mờ ra trước (300ms), xong mới hiện ảnh mới (trễ 300ms)
        // để 2 ảnh PNG nền trong suốt không bao giờ hiện chồng lên nhau
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#eef4fb]">
          {okList.map((src) => {
            const active = src === activeSrc
            return (
              <img
                key={src}
                src={src}
                alt={item?.TEN || ""}
                onError={() => setFailed((f) => ({ ...f, [src]: true }))}
                className="absolute left-0 top-0 h-full w-full object-contain p-2"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1)" : "scale(0.92)",
                  transition: active
                    ? "opacity 400ms ease-out 300ms, transform 400ms ease-out 300ms"
                    : "opacity 250ms ease-in, transform 250ms ease-in",
                }}
              />
            )
          })}
        </span>
      ) : (
        <CategoryThumb
          src={activeSrc || (srcList.length ? null : item?.HINHANH)}
          name={item?.TEN}
          index={index}
          className="h-14 w-14 p-2"
        />
      )}
      <span
        className="mt-1.5 line-clamp-2 w-full text-center text-[12px] leading-tight text-slate-700"
        style={{ overflowWrap: "anywhere" }}
      >
        {item.TEN || ""}
      </span>
    </Link>
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
