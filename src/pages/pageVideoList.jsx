import { useEffect, useRef, useState } from "react"
import { Box, Page, Text, useStore, zmp } from "zmp-framework/react"
import store from "../store"

import AutoPlaySilentVideo from "@components/common/AutoPlaySilentVideo"
import VideoItem from "@components/DanhMucVideo/VideoItem"
import HeaderBack from "@components/Header/HeaderBack"
import LoadingSpinner from "@components/LoadingSpinner"
import { FaInbox, FaVideo } from "react-icons/fa6"
import Color from "../components/common/Color"
import "../styles/app.scss"
import { getAPI } from "../utils/networking"
import { validateString } from "@utils/util"

const VideoList = ({ zmproute }) => {
  const CusInfo = useStore("getCusInfo")
  const [videos, setVideos] = useState([])

  const [loading, setLoading] = useState(false)

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const videoRef = useRef(null)

  const handleVideoEnd = (item) => {
    return getAPI(
      "banner/tichXuVideo",
      "POST",
      {
        id: item.videoName,
        userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
        xu: item.xuNumber,
      },
      {}
    )
      .then(({ data, error }) => {
        if (error) {
          zmp.dialog
            .create({
              title: "Thông báo",
              content: '<div className="dialog-text">Lỗi lấy chi tiết video.</div>',
              buttons: [
                {
                  text: "Đóng",
                },
              ],
              destroyOnClose: true,
            })
            .open()
        } else {
          store.dispatch("setCusInfo", {
            ...CusInfo,
            xu: Number(CusInfo.xu) + Number(data.content),
          })
        }
      })
      .catch((ex) => {
        console.log(ex)
      })
      .finally(() => {})
  }

  const handleVideoSelect = (item) => {
    setLoading(true)
    setCurrentVideoIndex(item)
  }

  useEffect(() => {
    const handleTimeUpdate = (e) => {
      if (Math.abs(e.target.currentTime - e.target.oldTime) > 1) {
        e.target.currentTime = e.target.oldTime
      } else {
        e.target.oldTime = e.target.currentTime
      }
    }

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate)
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      }
    }
  }, [])

  const getListVideos = async () => {
    const url = "video/getListVideos"
    return getAPI(url, "POST", {}, {})
      .then(({ data, error }) => {
        if (error || !data.result) {
          console.error(data.message)
        } else {
          setVideos(JSON.parse(data.content || []))
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <Page
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
      }}
      className="detail-page"
    >
      <HeaderBack slot="fixed" title={"Video tích xu"} />
      {videos && videos?.length > 0 ? (
        <>
          <Box>
            <div
              style={{ marginBottom: 12 }}
              className="flex items-center justify-center gap-2"
            >
              {!loading ? (
                <>
                  <FaVideo size={20} color={Color.BackgrondLightAPPGreen} />
                  <span style={{ fontSize: 13 }}>Now Playing</span>
                </>
              ) : (
                <LoadingSpinner isMargin={false} />
              )}
            </div>
            {/* <video 
              ref={videoRef}
              width={"100%"} 
              height={"auto"} 
              controls 
              src={encodeURI(currentVideoIndex.link) || ""}
              type="video/mp4" 
              onLoadedData={() => setLoading(false)}
              onCanPlay={() => setLoading(false)}
              onCanPlayThrough={() => setLoading(false)}
              onEnded={() => handleVideoEnd(currentVideoIndex)}
            >
            </video> */}
            <AutoPlaySilentVideo
              onCanPlay={() => setLoading(false)}
              onCanPlayThough={() => setLoading(false)}
              onEnded={() => handleVideoEnd(currentVideoIndex)}
              className=""
              video={encodeURI(currentVideoIndex.link) || ""}
            />
          </Box>
          <Box className="wrapCatalogs items-center flex-wrap flex">
            <VideoItem onVideoSelect={handleVideoSelect} videos={videos} />
          </Box>
          <Box
            className=""
            noSpace={true}
            flex
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex alignItems="center" m={5} py={7}></Box>
          </Box>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <FaInbox size={25} color="#ccc" />
          <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
            Không có video tích xu còn hiệu lực
          </Text>
        </div>
      )}
    </Page>
  )
}

export default VideoList
