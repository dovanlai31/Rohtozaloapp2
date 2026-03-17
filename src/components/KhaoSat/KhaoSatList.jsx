import Department from "@components/Icons/Department"
import Number from "@components/Icons/Number"
import { FaInbox } from "react-icons/fa6"
import { Box, List, ListItem, Text } from "zmp-framework/react"
import "../../styles/tailwind.css"
import { Pages } from "./Constants"

const KhaoSatList = (props) => {
  const { listKhaoSat, setPages, setCurrentItem } = props
  // const phoneNumber = useStore("getPhoneNumner")

  const handleSelectItem = (item) => {
    setCurrentItem(item)
    console.log(item)
    setPages((prev) => [...prev, Pages.Detail])
  }

  return (
    <Box className="w-full flex items-center flex-col" p="1">
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
      <List
        className="w-full rounded"
        style={{
          marginTop: 16,
          borderRadius: 8,
          borderColor: "#376aed",
          height: 500,
          overflow: "scroll",
        }}
      >
        {listKhaoSat.length > 0 &&
          listKhaoSat.map((item) => (
            <ListItem
              style={{ padding: "5px" }}
              className=""
              key={item.pK_SEQ}
              onClick={() => handleSelectItem(item)}
            >
              <div className="w-full">
                <Text style={{ fontSize: "14px" }} className="text-base">
                  {item?.diengiai}
                </Text>
                <div className="flex items-center justify-between">
                  <Text
                    className="m-0 flex items-center gap-2 text-sm"
                    style={{ color: "#555" }}
                  >
                    <Number height={30} width={30} fill="#555" />
                    {item?.socauhoi} câu hỏi
                  </Text>
                  <Text
                    className="m-0 flex items-center gap-2 text-sm"
                    style={{ color: "#555" }}
                  >
                    <Department height={25} width={25} fill="#555" />
                    {item?.bophan}
                  </Text>
                </div>
              </div>
            </ListItem>
          ))}
      </List>
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

      <Box
        className=""
        noSpace={true}
        flex
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex alignItems="center" m={5} py={7}></Box>
      </Box>
    </Box>
  )
}

export default KhaoSatList
