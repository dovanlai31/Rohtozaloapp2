import Color from "@components/common/Color"
import { FaCirclePlay } from "react-icons/fa6"
import { Box, Link, Text } from "zmp-framework/react"
import "../../styles/swiper.css"

const VideoItem = ({ videos, onVideoSelect }) => {
  return (
    <Box
      m="0"
      flex
      flexDirection="column"
      alignItems="center"
      style={{ width: "100%" }}
    >
      <Box
        pt="0"
        mt="0"
        flex
        justifyContent="center"
        alignItems="center"
        style={{ width: "100%" }}
      >
        <Box
          m={0}
          p={0}
          width={"100%"}
          style={{ maxHeight: 400, overflow: "scroll", padding: 8 }}
        >
          {videos.map((video, index) => (
            <Link
              className="w-full"
              onClick={() => onVideoSelect(video)}
              key={index}
            >
              <Box
                className="flex shadow-lg rounded items-center"
                p="3"
                m="0"
                my="3"
                style={{ width: "100%", flex: 1 }}
              >
                <FaCirclePlay size={50} />
                <Box
                  ml="4"
                  py="2"
                  flex
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Text
                    className=" textline2 typo-body typo-body-normal font-medium text-base"
                    style={{}}
                  >
                    {(video.ten || "No name").replaceAll(".mp4", "")}
                  </Text>

                  <Text style={{ color: Color.textAPPGreen }} className="text-xs">
                    <b>+ {video.xuNumber} xu</b>
                  </Text>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default VideoItem
