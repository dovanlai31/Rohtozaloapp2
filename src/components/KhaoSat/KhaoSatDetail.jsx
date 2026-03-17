import { getAPI } from "@utils/networking"
import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Fab,
  FabButton,
  Icon,
  Input,
  List,
  ListItem,
  Radio,
  SkeletonBlock,
  Text,
  useStore,
} from "zmp-framework/react"
import "../../styles/tailwind.css"
import Survey from "@components/Icons/Survey"
import { zmp } from "zmp-framework/react"
import { FcSurvey } from "react-icons/fc"
import Color from "@components/common/Color"
import { AiOutlineFileDone } from "react-icons/ai"
import store from "../../store"
import { validateString } from "@utils/util"
import withOverlay from "@components/HOC/withOverlay"

const KhaoSatDetail = (props) => {
  const { currentItem, setPages, loading, setLoading, showToast } = props
  const [cauHoi, setCauHoi] = useState([])
  const [result, setResult] = useState({})

  const phoneNumber = useStore("getPhoneNumner")
  const CusInfo = useStore("getCusInfo")

  useEffect(() => {
    getListCauHoi()
  }, [currentItem])

  useEffect(() => {
    if (cauHoi.length > 0) {
      cauHoi.map((item) => {
        let obj = JSON.parse(item.THUCHIEN)[0]
        let arr = []
        if (!!obj) {
          for (let i = 0; i < 5; i++) {
            if (obj[`luachon${i + 1}_chon`] == "1") {
              arr.push(i + 1 + "")
            }
          }
        }

        setResult((prev) => ({
          ...prev,
          [item.PK_SEQ]: {
            ksChId: item.PK_SEQ,
            value:
              result[currentItem.PK_SEQ]?.listCauHoi?.[item.PK_SEQ]?.value ||
              JSON.parse(item.THUCHIEN)[0]?.traloi ||
              "",
            valueArray:
              result[currentItem.PK_SEQ]?.listCauHoi?.[item.PK_SEQ]?.valueArray ||
              arr ||
              [],
            loaicauhoi: item.LOAICAUHOI,
          },
        }))
      })
    }
  }, [cauHoi])

  const getListCauHoi = () => {
    const param = {
      ksId: validateString(currentItem.PK_SEQ + "", true),
      userId: validateString(CusInfo?.KHACHHANG_fk + "", true),
      phoneNumber: "",
    }

    return getAPI("khaosat/getKhaoSatCauHoi", "POST", param, {})
      .then(({ data, error }) => {
        if (error || !data.result) {
          showToast(data.message, "danger")
        } else {
          // console.log(JSON.parse(data.content))
          setCauHoi(JSON.parse(data.content))
        }
      })
      .catch((err) => {
        showToast(data.message, "danger")
        console.log(err)
      })
  }

  const handleChangeInput = (e, id) => {
    setResult((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        value: e.target.value,
      },
    }))
  }

  const handleOnChangedCheckBox = (e, id) => {
    const { checked, value } = e.target
    const _result = result[id]
    if (checked) {
      if (_result?.valueArray.indexOf(value) < 0) {
        _result?.valueArray.push(value)
      }
    } else {
      _result?.valueArray.splice(_result?.valueArray.indexOf(value), 1)
    }

    setResult((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        valueArray: _result?.valueArray,
      },
    }))
  }

  const saveKhaoSat = () => {
    setLoading(true)
    let ks = [
      {
        ksId: validateString(currentItem.PK_SEQ + "", true),
        listCauHoi: Object.values(result).map((item) => {
          if (item.LOAICAUHOI == 2) {
            item.value = item.valueArray.join(",")
          }
          return item
        }),
      },
    ]

    let param = {
      userId: validateString(CusInfo.KHACHHANG_fk + "", true),
      phoneNumber: phoneNumber,
      khaoSats: ks,
    }

    return getAPI("khaosat/saveKhaoSat", "POST", param, param)
      .then(({ data, error }) => {
        setLoading(false)
        if (error || !data.result) {
          showToast(data.message, "danger")
        } else {
          showToast(data.message, "success")
          setPages((prev) => prev.slice(0, -1))
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const renderCauHoi = (item) => {
    const dapan = JSON.parse(item.DAPAN)[0]

    return (
      <Box
        m="0"
        mb="5"
        p="3"
        key={item?.PK_SEQ}
        className="common-table-header shadown-app-2"
      >
        <Text className="flex items-center gap-1 text-base font-semibold">
          {item?.STT}. {item?.CAUHOI}
          {/* <Icon
            zmp="zi-info-circle-solid"
            tooltip={item?.HUONGDANTRALOI}
            color={Color.textAPPBlue}
          /> */}
        </Text>
        {item?.LOAICAUHOI == "0" ? (
          <Input
            placeholder="Câu trả lời"
            type="textarea"
            minRows={2}
            clearButton
            inputStyle={{ padding: 8, backgroundColor: "#fff", marginTop: 12 }}
            onChange={(e) => handleChangeInput(e, item.PK_SEQ)}
            value={result?.[item.PK_SEQ]?.value}
          />
        ) : item?.LOAICAUHOI == "1" ? (
          <List>
            {["1", "2", "3", "4", "5"].map((i) => (
              <ListItem
                key={i}
                radioIcon="start"
                radio
                name={dapan.PK_SEQ}
                value={i}
                checked={result?.[item.PK_SEQ]?.value == i}
                onChange={(e) => handleChangeInput(e, item.PK_SEQ)}
              >
                <Text className="text-sm m-0">{dapan[`LUACHON${i}`]}</Text>
              </ListItem>
            ))}
          </List>
        ) : (
          <List>
            {["1", "2", "3", "4", "5"].map((i) => (
              <ListItem
                key={i}
                checkbox
                name={dapan.PK_SEQ}
                value={i}
                checked={result?.[item.PK_SEQ]?.valueArray.includes(i)}
                onChange={(e) => handleOnChangedCheckBox(e, item.PK_SEQ)}
              >
                <Text className="text-sm m-0">{dapan[`LUACHON${i}`]}</Text>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    )
  }

  return (
    <Box m="0" className="w-full relative" px="4" py="1">
      <button
        onClick={saveKhaoSat}
        type="button"
        style={{
          backgroundColor: Color.textAPPGreen,
          zIndex: 99,
          borderRadius: "50%",
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        className="w-auto flex items-center justify-center p-4 shadow-lg"
      >
        <AiOutlineFileDone size={35} color="#eee" />
      </button>
      <div className="mt-4 flex flex-col" style={{ overflow: "scroll" }}>
        {cauHoi?.length == 0 &&
          [1, 2, 3].map(() => (
            <SkeletonBlock
              tag="div"
              width="100%"
              height="100px"
              borderRadius="8px"
              effect="wave"
              className="shadown-app-2"
              style={{ marginBottom: 8 }}
            ></SkeletonBlock>
          ))}
        {cauHoi?.length > 0 && cauHoi.map((item) => renderCauHoi(item))}
      </div>
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

export default withOverlay(KhaoSatDetail)
