import React, { useRef, useEffect, useState } from "react"

type IProps = {
  className: string
  video: string
  onEnded: () => Promise<void>
  onCanPlayThough: () => Promise<void>
  onCanPlay: () => Promise<void>
}

const AutoPlaySilentVideo: React.FC<IProps> = ({
  className = "",
  video = "",
  onCanPlay = () => {},
  onCanPlayThough = () => {},
  onEnded = () => {},
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [video])

  return (
    <video
      className={className}
      ref={videoRef}
      onCanPlay={onCanPlay}
      onCanPlayThrough={onCanPlayThough}
      onEnded={onEnded}
      autoPlay
      muted
      playsInline
      width={"100%"}
      height={"auto"}
      controls
    >
      <source src={video} type="video/mp4" />
    </video>
  )
}

export default AutoPlaySilentVideo
