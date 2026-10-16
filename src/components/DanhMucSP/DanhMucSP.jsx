import React, { useEffect, useState } from "react"
import store from "../../store"
import {
  useStore,
  SkeletonBlock,
  SkeletonText,
  Tabbar,
  Icon,
  Link,
} from "zmp-framework/react"
import DanhmucItem from "./DanhmucItem"

import { TbBackground } from "react-icons/tb"

const Stories = () => {
  const loading = useStore("loadingStories")
  //const data = store.getters.categories.value || []
  const data = useStore("categories")
  const [listChungloai, setlistChungloai] = useState(data)


  console.log(data)




  if (data && data.length > 0)
    return (
      <div className="mx-4 my-3 rounded-2xl border border-[#E3EBF6] bg-white px-2 pb-3 pt-3">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-[15px] font-bold text-slate-800">Danh mục</span>
          <Link href="/pagedanhmucAll" noLinkClass className="!flex items-center gap-0.5 text-xs font-semibold text-primary">
            Tất cả <Icon zmp="zi-chevron-right" size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-y-3">
          {data.map(
            (item, index) =>
              index < 8 && (
                <DanhmucItem
                  key={index + ""}
                  seen={item.seen}
                  item={item}
                  index={index}
                />
              )
          )}
        </div>
      </div>
      //

      // <Box
      //   m="0"
      //   flex
      //   flexDirection="row"
      //   alignItems="center"
      //   //className="overflow-x-scroll whitespace-nowrap	flex-nowrap stories"
      //   //className="items-center flex-nowrap"
      //   style={{
      //     // width: '100%',
      //     justifyContent: "center",
      //   }}
      //   flexWrap
      // >
      //   <div
      //     className="wrapCatalogs
      //     items-center
      //     justify-center
      //     flex-wrap flex
      //     flex-shrink-1
      //     "
      //   >
      //     {data.map(
      //       (story, index) =>
      //         (
      //           <DanhmucItem
      //             key={index + ""}
      //             seen={story.seen}
      //             user={story}
      //             index={index}
      //           />
      //         )
      //     )}
      //   </div>
      // </Box>
    )
  return <SkeletonBlock style={{ height: 1 }} />
}

export default Stories
