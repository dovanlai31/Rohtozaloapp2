import Color from "@components/common/Color"
import Header from "@components/Header"
import iconSalesUp from "@static/images/salesup.png"
import { getAPI } from "@utils/networking"
import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  List,
  ListInput,
  Page,
  Preloader,
  useStore,
  zmp,
} from "zmp-framework/react"
import store from "../store"
const UpdateCus = ({ zmproute }) => {
  const token = useStore("Token")
  const user = useStore("user")
  const [loading, setLoading] = useState(false)
  const PhoneNumner = store.getters.getPhoneNumner.value || []
  const accessToken = store.getters.Token.value || ""
  const [isLoading, setIsLoading] = useState(false)
  const [dataForm, setDataForm] = useState({
    dienthoai: "",
    hoten: "",
    diachigiaohang: "",
    diachixuathoadon: "",
    masothue: "",
    id: "",
  })

  useEffect(() => {
    getUserInfo()
  }, [])

  const handleFillForm = (e) => {
    //e.preventDefault();
  }
  const handleOnSubmitForm = (e) => {
    // setIsLoading(true);

    e.preventDefault()

    let param = {
      ...dataForm,
      sodienthoai: dataForm.dienthoai,
    }

    let userCopy = user

    console.log(param)

    return getAPI("khachhang/UpdateUserInfo", "POST", param, param)
      .then(({ data, error }) => {
        if (error) {
          zmp.dialog
            .create({
              title: "Thông báo",
              content: '<div className="dialog-text">' + data?.message + "</div>",
              buttons: [
                {
                  text: "Đóng",
                },
              ],
              destroyOnClose: true,
            })
            .open()
          setIsLoading(false)
        } else {
          if (!data?.result) {
            zmp.dialog
              .create({
                title: "Thông báo",
                content: '<div className="dialog-text">' + data?.message + "</div>",
                buttons: [
                  {
                    text: "Đóng",
                  },
                ],
                destroyOnClose: true,
              })
              .open()
          } else {
            userCopy.name = dataForm.hoten
            store.dispatch("setUser", userCopy)
            store.dispatch(
              "setPhoneNumber",
              zmp.form.convertToData("#my-form").sodienthoai
            )

            zmp.dialog
              .create({
                title: "Thông báo",
                content: '<div className="dialog-text">Cập nhật thành công</div>',
                buttons: [
                  {
                    text: "Đóng",
                  },
                ],
                destroyOnClose: true,
              })
              .open()
            zmproute.back("/updatecustomer", { animate: true })
          }

          setIsLoading(false)
        }
      })
      .catch((err) => {
        zmp.dialog
          .create({
            title: "Thông báo",
            content:
              '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
            buttons: [
              {
                text: "Đóng",
              },
            ],
            destroyOnClose: true,
          })
          .open()
        setIsLoading(false)
      })
  }

  const showDialog = (msg) => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">' + msg + "</div>",
      buttons: [
        {
          text: "Đóng",
        },
      ],
    })
    if (dialog.current) {
      dialog.current.open()
    }
  }

  const getUserInfo = () => {
    let param = {
      phoneNumber: PhoneNumner,
    }

    return getAPI("khachhang/GetUserInfo", "POST", param, param)
      .then(({ data, error }) => {
        if (error) {
          zmp.dialog
            .create({
              title: "Thông báo",
              content: '<div className="dialog-text">' + data?.message + "</div>",
              buttons: [
                {
                  text: "Đóng",
                },
              ],
              destroyOnClose: true,
            })
            .open()
        } else {
          setDataForm({
            dienthoai: data?.content[0]?.dienthoai,
            hoten: data?.content[0]?.ten,
            diachigiaohang: data?.content[0]?.diaChiGiaoHang,
            diachixuathoadon: data?.content[0]?.diachixhd,
            masothue: data?.content[0]?.masothue,
            id: data?.content[0]?.pk_seq,
          })
        }
      })
      .catch((Err) => {
        zmp.dialog
          .create({
            title: "Thông báo",
            content:
              '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
            buttons: [
              {
                text: "Đóng",
              },
            ],
            destroyOnClose: true,
          })
          .open()
      })
  }

  return (
    <Page
      //className="menu-page"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
        //zmp.tab.show("#view-giohang")
      }}
      className="detail-page"
    >
      {/* <NavigationBar active={zmproute.path} /> */}
      <Header back>Cập nhật thông tin</Header>
      {/* <Box className="btnClose">
        <Link back>
          <Icon color="black" zmp="zi-chevron-left-header"></Icon>
        </Link>
      </Box> */}
      <Box>
        <Card inset title="Thông tin của bạn">
          {/* <View style={{ position: "absolute", width: "100%", backgroundColor: "green", height: 100 }}></View> */}
          <List
            style={{ listStyle: "none" }}
            form
            id="my-form"
            onSubmit={handleOnSubmitForm}
            noHairlines
          >
            <ListInput
              label="Mã hệ thống"
              type="text"
              min={9}
              // placeholder='Enter your age'
              // clearButton
              required
              name="id"
              value={dataForm.id}
              readonly
              // validate
            ></ListInput>
            <ListInput
              label="Số điện thoại"
              type="text"
              min={9}
              // placeholder='Enter your age'
              // clearButton
              required
              name="sodienthoai"
              onChange={(e) =>
                setDataForm({ ...dataForm, dienthoai: e.target.value })
              }
              value={dataForm.dienthoai}
              readonly
              // validate
            ></ListInput>
            <ListInput
              label="Họ và tên "
              type="text"
              placeholder="Enter your full name"
              //clearButton
              info="Tên đầy đủ của bạn"
              name="hoten"
              value={dataForm.hoten}
              onChange={(e) => setDataForm({ ...dataForm, hoten: e.target.value })}
              // pattern='^[a-zA-Z]{2,30}$'
              // pattern='^[Aa-zA-Z ]{2,50}$'
              required
              errorMessage="Invalid"
              validate
              min={1}
              readonly={isLoading}
            ></ListInput>
            <ListInput
              label="Địa chỉ giao hàng "
              type="text"
              placeholder="Địa chỉ giao hàng"
              clearButton={!isLoading}
              info="Địa chỉ giao hàng của bạn"
              name="diachigiaohang"
              value={dataForm.diachigiaohang}
              onChange={(e) =>
                setDataForm({ ...dataForm, diachigiaohang: e.target.value })
              }
              // pattern='^[a-zA-Z]{2,30}$'
              //pattern='^[Aa-zA-Z ]{2,50}$'
              required
              // errorMessage='Invalid'
              validate
              //min={1}
              readonly={isLoading}
            ></ListInput>
            <ListInput
              label="Địa chỉ xuất hóa đơn "
              type="text"
              placeholder="Địa chỉ xuất hóa đơn"
              clearButton={!isLoading}
              info="Địa chỉ xuất hóa đơn"
              name="diachixuathoadon"
              value={dataForm.diachixuathoadon}
              onChange={(e) =>
                setDataForm({ ...dataForm, diachixuathoadon: e.target.value })
              }
              // pattern='^[a-zA-Z]{2,30}$'
              //pattern='^[Aa-zA-Z ]{2,50}$'
              required
              // errorMessage='Invalid'
              validate
              readonly={isLoading}
              //min={1}
            ></ListInput>
            <ListInput
              label="Mã số thuế"
              type="text"
              placeholder="Mã số thuế"
              clearButton={!isLoading}
              info="Mã số thuế"
              name="masothue"
              value={dataForm.masothue}
              onChange={(e) =>
                setDataForm({ ...dataForm, masothue: e.target.value })
              }
              readonly={isLoading}
              // pattern='^[a-zA-Z]{2,30}$'
              //pattern='^[Aa-zA-Z ]{2,50}$'
              //required
              // errorMessage='Invalid'
              validate
              //min={1}
            ></ListInput>
            {/* <ListInput
              label='Tuổi'
              type='number'
              min={1}
              placeholder='Enter your age'
              clearButton
              required
              name='age'
              validate
            ></ListInput> */}
            {/* <ListInput
              label='Địa chỉ'
              type='text'
              min={9}
              // placeholder='Enter your age'
              // clearButton
              required
              name='diachi'
            // validate
            ></ListInput> */}
            {/* <ListInput
              label='Password'
              type='password'
              placeholder='Enter your password'
              clearButton
              required
              info='Password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter'
              name='password'
              errorMessage='Password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter'
              pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$'
              validate
            ></ListInput> */}
            {/* <ListInput
              label='City'
              type='select'
              placeholder='Select your city'
              name='city'
              validate
            >
              <option value='1'>Hồ Chí Minh</option>
              <option value='2'>Hà Nội</option>
            </ListInput> */}
            <Box>
              <Button
                type="submit"
                typeName="secondary"
                responsive
                className="filter-button3"
                style={{ backgroundColor: Color.textAPPBlue }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Preloader logo={iconSalesUp} size={20} />
                ) : (
                  "Lưu đăng ký"
                )}
              </Button>
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
            {/* <Box>
              <Button typeName='secondary' responsive onClick={handleFillForm}>
                Fill Form
              </Button>
            </Box> */}
          </List>
        </Card>
      </Box>
    </Page>
  )
}
export default UpdateCus
