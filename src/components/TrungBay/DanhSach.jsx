import { Box, Button, Icon, List, ListItem, Text } from "zmp-framework/react"
import "../../styles/output.css"
import { PlusIcon } from "@components/Icons"
import SuccessButton from "@components/common/SuccessButton"
import { zmp } from "zmp-framework/react"

const DanhSach = (props) => {
    const { trungbay } = props

    const handleSave = () => {
        console.log("save")
    }

    return(
        <Box flex flexDirection="column" justifyContent="space-between" style={{ marginTop: 16, borderWidth: 2, borderStyle: "dashed", borderRadius: 8, borderColor: "#376aed", minHeight: 620, padding: 8 }}>
            <Box>
                <Box flex alignContent="center" mt="3">
                    <Box style={{ background: "#" }}><PlusIcon fill="#376aed" /></Box>
                    <Text style={{ color: "#376aed", margin: 0, marginLeft: 16 }} bold>Chọn chương trình đăng ký</Text>
                </Box>
                <List className="w-full my-0" style={{ maxHeight: 550, overflow: "scroll" }}>      
                    {trungbay && trungbay.map(item => (
                        <ListItem checkbox id={item.id} key={item.id}>{item.label}</ListItem>
                    ))}
                </List>
            </Box>
            <SuccessButton icon="zi-check-circle-solid" title="Đăng ký trưng bày" onClick={handleSave} />
        </Box>
    )
}

export default DanhSach