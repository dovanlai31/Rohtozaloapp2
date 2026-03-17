import React, { useEffect, useRef, useState } from "react"
import {
  Page,
  Card,
  Text,
  Box,
  zmp,
  useStore,
  Link,
  Icon,
  Navbar,
  Button,
  Swiper,
  SwiperSlide,
  Title,
  Picker,
} from "zmp-framework/react"
import "../../styles/output.css"
import CameraLens from "@components/Icons/CameraLens"
import Image from "@components/Image"
import ImageIcon from "@components/Icons/ImageIcon"
import { chooseImage, requestCameraPermission } from "zmp-sdk/apis"
import SuccessButton from "@components/common/SuccessButton"

requestCameraPermission({
  success: ({ userAllow, message }) => {
    if (userAllow) {
      // được phép sử dụng camera
    }
  },
  fail: (err) => {
    // xử lý khi gọi api thất bại
    console.log(err)
  },
})

const ChupAnh = (props) => {
  const { cttrungbay } = props
  const [image, setImage] = useState("")

  const requestCamera = () => {
    console.log("Camera request")
    try {
      chooseImage({
        sourceType: ["camera", "album"],
        cameraType: "back",
        success: ({ filePaths, tempFiles }) => {
          console.log(filePaths)
          console.log(tempFiles)
          setImage(filePaths)
        },
        fail: (err) => {
          console.log(err)
        },
      })
    } catch (ex) {
      console.log(ex)
    }
  }

  const saveImage = () => {
    try {
      console.log("Save image")
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <Box flex flexDirection="column" justifyContent="center" alignContent="center">
      <Picker
        style={{ width: 300, marginTop: 12 }}
        placeholder="Chọn chương trình trưng bày"
        title="Chọn chương trình trưng bày"
        data={[
          {
            textAlign: "center",
            values: cttrungbay.map((item) => item.pk_seq),
            displayValues: cttrungbay.map((item) => item.label),
          },
        ]}
        formatValue={(values, displayValues) => {
          return `${displayValues[0]}`
        }}
      ></Picker>
      <Button
        type="button"
        className="w-full"
        style={{
          minHeight: 300,
          borderWidth: 2,
          borderColor: "#376aed",
          borderStyle: "dashed",
          marginTop: 16,
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "space-around",
        }}
        onClick={requestCamera}
      >
        <Box flex flexDirection="row" m="1">
          <CameraLens fill="#376aed" width="30" height="30" />
          <Text
            size="14"
            style={{
              color: "#376aed",
              margin: 0,
              marginLeft: 16,
              alignSelf: "center",
            }}
            bold
          >
            Chụp ảnh
          </Text>
        </Box>
        {!!image ? (
          <img loading="lazy" src={image} className="image-contains"></img>
        ) : (
          <Box flex flexDirection="row" style={{ alignSelf: "center" }}>
            <ImageIcon fill="#eee" height="200" width="200" />
          </Box>
        )}
      </Button>
      <SuccessButton
        title="Lưu ảnh trưng bày"
        onClick={saveImage}
        icon="zi-check-circle-solid"
        styles={{ marginTop: 16 }}
      />
    </Box>
  )
}

export default ChupAnh
