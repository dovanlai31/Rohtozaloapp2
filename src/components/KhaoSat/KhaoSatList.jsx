import Department from "@components/Icons/Department"
import Number from "@components/Icons/Number"
import { FaInbox } from "react-icons/fa6"
import { Box, List, ListItem, Text, zmp } from "zmp-framework/react"
import "../../styles/tailwind.css"
import { Pages } from "./Constants"
import BgSurvey from "@static/images/bg-survey.png"
import { AiOutlineArrowRight } from "react-icons/ai"
import { useState, useRef, useEffect } from "react"
const KhaoSatList = (props) => {
  const { listKhaoSat, setPages, setCurrentItem } = props
  // const phoneNumber = useStore("getPhoneNumner")
  const dialog = useRef(null)
  const handleSelectItem = (item) => {
    let msg = "Chưa có khảo sát nào"
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [
        {
          text: "Đóng",
        },
      ],
    })
return dialog.current.open()
    setCurrentItem(item)
    console.log("Selected item:", item)
    setPages((prev) => [...prev, Pages.Detail])
  }

  return (
    <Box className="w-full flex items-center flex-col m-0 px-2">
      {/* <div className="flex justify-around items-center w-full primary-background p-1 rounded shadow-lg">
          <Box className="m-0">
            <Text className="mb-3 text-sm" style={{ color: "#eee" }}>
              Imexpharm
            </Text>
            <Text className="text-2xl font-medium m-0" style={{ color: "#f8f8f8" }}>
              Khảo sát
            </Text>
          </Box>
          <Box className="RoundIcon">
            <FcSurvey size={32} />
          </Box>
        </div> */}
      {listKhaoSat.length == 0 && (
        <div className="flex flex-col justify-center items-center">
          <FaInbox size={25} color="#ccc" />
          <Text style={{ fontSize: 13, marginTop: 8, color: "#ccc" }}>
            Không có khảo sát
          </Text>
        </div>
      )}

      {listKhaoSat.length > 0 &&
        listKhaoSat.map((item) => (
          <div
            key={item.pK_SEQ}
            className="w-full bg-cover bg-center bg-no-repeat p-6 text-white min-h-[200px] flex flex-col items-between  justify-between"
            style={{
              backgroundImage: `url(${BgSurvey})`,
              backgroundSize: "100% 100%",
              height: "auto",
              borderRadius: 8,
              border: "1px solid #376aed",
            }}
          >
            <div className="flex flex-col gap-2">
              <p className="text-[24px] font-bold">Chia sẻ ý kiến của bạn</p>
              <p>Giúp chúng tôi cải thiện dịch vụ tốt hơn</p>
            </div>
            <div className="flex w-full justify-end items-end">
              <button
                className="bg-primary text-white px-4 py-3 rounded-full w-fit flex items-center gap-2 leading-2"
                onClick={() => handleSelectItem(item)}
              >
                Tham gia khảo sát
                <AiOutlineArrowRight size={15} />
              </button>
            </div>
          </div>
          // <ListItem
          //   style={{ padding: "5px" }}
          //   className=""
          //   key={item.pK_SEQ}
          //   onClick={() => handleSelectItem(item)}
          // >
          //   <div className="w-full">
          //     <Text style={{ fontSize: "14px" }} className="text-base">
          //       {item?.diengiai}
          //     </Text>
          //     <div className="flex items-center justify-between">
          //       <Text
          //         className="m-0 flex items-center gap-2 text-sm"
          //         style={{ color: "#555" }}
          //       >
          //         <Number height={30} width={30} fill="#555" />
          //         {item?.socauhoi} câu hỏi
          //       </Text>
          //       <Text
          //         className="m-0 flex items-center gap-2 text-sm"
          //         style={{ color: "#555" }}
          //       >
          //         <Department height={25} width={25} fill="#555" />
          //         {item?.bophan}
          //       </Text>
          //     </div>
          //   </div>
          // </ListItem>
        ))}

      {/* <button
          title="Lưu khảo sát"
          onClick={() => saveKhaoSat()}
          type="button"
          className="m-0 absolute p-3 shadow-lg rounded-full bottom-7 w-auto left-7 z-40"
          style={{ backgroundColor: Color.textAPPGreen }}
        >
          <AiOutlineFileDone size={30} color="#eee" />
        </button> */}
      {/* <SuccessButton title="Lưu khảo sát" onClick={saveKhaoSat} icon="zi-check-circle-solid" styles={{ marginTop: 8 }} /> */}
    </Box>
  )
}

export default KhaoSatList
