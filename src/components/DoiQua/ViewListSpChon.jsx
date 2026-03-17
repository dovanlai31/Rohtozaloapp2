import React, { useRef, useEffect, useState, memo } from "react"
import { Button, Sheet, Text, Box, Page, Icon, List, Checkbox, Input } from "zmp-ui"
import { AiOutlineClose, AiOutlineLine, AiOutlinePlus } from "react-icons/ai"
import { formatCurrency } from "@utils/networking"
import { Card } from "zmp-framework/react"
import { Link } from "zmp-framework/react"

// const itemCh = (sl) => {
//     useEffect(() => {
//         console.log("xxxxxx ")
//         setdata(sl)
//     }, [sl])

//     const [data, setdata] = useState(sl)

//     return (<Box flex alignItems="center">
//         <Text size="large" bold>
//             {data}
//         </Text>
//     </Box>)
// }

const ViewListSpChon = ({ dataListChose, plus, diff, removeItem }) => {
  // useEffect(() => {
  //     console.log("xxxxxx ")
  //     setdata(dataListChose)
  // }, [refresh, dataListChose.length])
  // const [data, setdata] = useState(dataListChose)

  return (
    // <Box style={{ overflowY: "auto",height:'100%',  marginBottom: 260, }}>
    <Box m="0" style={{}}>
      {dataListChose &&
        dataListChose.map((g, index) => {
          return (
            <Card inset key={index}>
              <Box
                m={0}
                flex
                justifyContent="space-between"
                mt={1}
                key={index}
                className="list-item-donhang "
              >
                <Box className="list-icon2" style={{ width: "20%" }}>
                  <img
                    loading="lazy"
                    className="doiquarow-img"
                    src={
                      g.HinhAnh
                        ? g.HinhAnh
                        : "https://dms1.imexpharm.com:9443/AnhSanPham/NOIMAGEGESO.png"
                    }
                  />
                  {/* <img className="giohang-img"
                      style={{ width: 55, height: 55, }} src={icongif2}></img> */}
                </Box>

                <Box p={3} style={{ width: "75%" }}>
                  <Text.Header className="item-text color-ten ">
                    {g.ten.toLocaleUpperCase()}
                  </Text.Header>
                  <Text bold size="small" className="item-text ">
                    {g.thongtin}
                  </Text>
                  <Text bold size="small" className="item-text color-gia">
                    Điểm/Xu: {formatCurrency(g.gia, true)}
                  </Text>
                  <Box
                    p={3}
                    className="w-9/24"
                    justifyContent="space-between"
                    flex
                    style={{
                      margin: 0,
                      borderColor: "#eeee",
                      borderWidth: 1,
                      borderRadius: 5,
                      width: "45%",
                    }}
                  >
                    <Link onClick={() => diff(g, index)}>
                      <AiOutlineLine size={20} color="black" />
                    </Link>
                    {/* {itemCh(g.soluong)} */}

                    <Box flex alignItems="center">
                      <Text size="large" bold>
                        {g.soluong}
                      </Text>
                    </Box>

                    <Link
                      onClick={() => {
                        plus(g, index)
                      }}
                    >
                      <AiOutlinePlus size={20} color="black" />
                    </Link>
                  </Box>
                </Box>
                <Box style={{ width: "10%", height: "100%" }}>
                  <Link onClick={() => removeItem(g, index)}>
                    <AiOutlineClose color="gray" />
                  </Link>
                </Box>
              </Box>
            </Card>
          )
        })}
    </Box>
    // </Box>
  )
}

export default ViewListSpChon
