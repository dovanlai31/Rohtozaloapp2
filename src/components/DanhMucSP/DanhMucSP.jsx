import React, { useEffect, useState } from "react"
import store from "../../store"
import {
  useStore,
  SkeletonBlock,
  SkeletonText,
  Tabbar,
  Box,
} from "zmp-framework/react"
import DanhmucItem from "./DanhmucItem"

import { Section } from "@components/common/Section"
import { TbBackground } from "react-icons/tb"

const Stories = () => {
  const loading = useStore("loadingStories")
  //const data = store.getters.categories.value || []
  const data = useStore("categories")
  const [listChungloai, setlistChungloai] = useState(data)


  console.log(data)




  if (data && data.length > 0)
    return (
      <Section
        title="Danh mục"
        titleSecondShow={true}
        titleSecond="Tất cả"
        RouterSecond="/pagedanhmucAll"
        padding="title-only"
        style={{  padding: "0 0px"   }}
    
      >
        <Box
          className="wrapCatalogs      
          justify-center 
          flex-wrap flex
 
         
          "
        >
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
        </Box>
      </Section>
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
