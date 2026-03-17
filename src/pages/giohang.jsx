import { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Icon,
  Link,
  Page,
  Text,
  Title,
  useStore,
  zmp,
} from "zmp-framework/react"
import { getPhoneNumber } from "zmp-sdk/apis"
import store from "../store"

import LoadingSpinner from "@components/LoadingSpinner"
import RowItemBanhang from "@components/RowItemBanHang"
import RowItemKM from "@components/RowItemKM"
import icongiohang from "@static/images/shoppingbag.png"
import opclogo from "@static/images/opclogo.png"
import { formatCurrency, request, request3 } from "@utils/networking"
import "./../styles/giohang.scss"
import HeaderBack from "@components/Header/HeaderBack"
import HeaderBox from "@components/Header/HeaderBox"
import { FaPlusCircle, FaShoppingCart } from "react-icons/fa"
import { FaBasketShopping } from "react-icons/fa6"
import { ConvertOpacity } from "@utils/ConvertOpacity"
import Color from "@components/common/Color"
import { BsCartX, BsCartXFill } from "react-icons/bs"
import { AiOutlineHome } from "react-icons/ai"
import { IoBagAddOutline, IoChevronBack, IoTrashOutline } from "react-icons/io5"
import { MdAddShoppingCart } from "react-icons/md"
import { IoIosAddCircleOutline } from "react-icons/io"
import RowItemKMBanhang from "@components/RowItemKMBanhang"
const GiohangPage = ({ zmproute }) => {
  const CusInfo = useStore("getCusInfo")
  console.log("__CusInfo", CusInfo);
  const accessToken = store.getters.Token.value || ""
  const PhoneNumner = store.getters.PhoneNumner.value || ""
  const Giohangx = store.getters.getGioHang.value || []
  const [Giohang, updateGiohang] = useState(Giohangx)
  const [TongTien, updateTongTien] = useState(0)
  const [datakm, updateDatakm] = useState([])
  const [loading, updateLoading] = useState(false)
  const [appKm, updateAppKm] = useState(true)
  const [TongtieKm, updateTongtieKm] = useState(0)
  const [ViewMore, updateViewMore] = useState(false)
  const [SanPhamSuDung, setSanPhamSuDung] = useState("")
  const [dieuchinh, setdieuchinh] = useState(0)
  const [promotions, setPromotions] = useState([])
  const dialog = useRef(null)
  const heightFooter = 180 // 80
  const refres = store.getters.refres.value || false
  const [isShowModalKm, setIsShowModalKm] = useState(false)
  const sampleItems = [
    {
      id: "sp001",
      ten: "Khuyến mãi bánh quy Oreo 200g",
      Scheme: "Mua 2 tặng 1 – Áp dụng đến hết tháng 8",
      soluong: 3,
      spTen: JSON.stringify([
        {
          TEN: "Oreo Vani 200g",
          HinhAnh: "https://placehold.co/400",
        },
        {
          TEN: "Oreo Socola 200g",
          HinhAnh: "https://placehold.co/400",
        },
      ]),
    },
    
  ]

  useEffect(() => {
    tinhtien()
    //updateGiohang(Giohangx)
    updateViewMore(false)
    let listsp = Giohangx.filter((item) => item.Scheme == "" || !item.Scheme)
    console.log("__useEffect", Giohangx)

    // let listkm = Giohangx.filter(item => item.Scheme != '');
    updateGiohang(listsp)
    // updateDatakm(listkm)
    // updateAppKm(true)
    if (listsp?.length == 0) {
      zmp.toolbar.show("#main-nav")
    }else{
      zmp.toolbar.hide("#main-nav")
    }
  }, [Giohangx, refres, datakm.length])

  useEffect(() => {
    dialog.current = zmp.dialog.create({
      title: "Thông báo",
      content: '<div className="dialog-text">Lưu đơn hàng thành công</div>',
      buttons: [
        {
          text: "Ok",
          onClick() {
            updateGiohang([])
            zmp.toolbar.show("#main-nav")
            store.dispatch("remoteAllGioHang")
          },
        },
      ],
    })
  }, [])

  const openDialog = () => {
    // zmp.tab.show("#view-main")
    // zmp.views.main.router.navigate('followoa/',
    //   {
    //     transition: 'zmp-cover',
    //     animate: true
    //   })

    // return
    if (dialog.current) {
      dialog.current.open()
    }
  }

  const tinhtien = () => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx tinhtien Giohangx ", Giohangx)
    let tt = 0
    Giohangx.map((item) => {
      tt += parseFloat(item.dongia) * parseFloat(item.soluong)
    })

    let ttckkm = 0;
    let tienvat=0;
    let tongTienCKGam=0;
    Giohangx.map((item) => {
      if (((item.chietkhauKM && item.chietkhauKM > 0) || (item.nhomCkGam && item.nhomCkGam > 0))) {
        ttckkm += (parseFloat(item.dongia) * parseFloat(item.soluong)) * ((item.chietkhauKM ?? 0) + (item.nhomCkGam ?? 0)) / 100;
      }
      tienvat += (parseFloat(item.soluong ?? 0) * parseFloat(item.dongia ?? 0)) * (1 - (parseFloat(item.nhomCkGam ?? 0) + parseFloat(item.chietkhauKM ?? 0)) / 100.0) * (parseFloat(item.vat ?? 0) / 100.0)
        //tienvat += (parseFloat(product.soluong ?? 0) * parseFloat(product.dongia ?? 0)) * (1 - (parseFloat(product.nhomCkGam ?? 0) + parseFloat(product.chietkhauKM ?? 0)) / 100.0) * (parseFloat(product.vat ?? 0) / 100.0)
      tongTienCKGam += (parseFloat(item.dongia) * parseFloat(item.soluong)) * (item.nhomCkGam ?? 0) / 100;
    })
    let ttkm = 0
    console.log("datakm", datakm)
    datakm.map((item) => {
      ttkm += item.trakhuyenmai.reduce((total, tkm) => {
        if (tkm.loai + '' == "1" || tkm.loai + '' == "2") {
          return total + parseFloat(tkm.tongtien || 0)
        }
        return total
      }, 0)
    })
    console.log("ttckkm", ttckkm, "ttkm", ttkm)


    tt += tienvat;
    updateTongTien(tt)
    //pdateAppKm(true)
    updateLoading(false)
    //updateDatakm([])
    updateTongtieKm(ttckkm + ttkm+ tongTienCKGam)
    setdieuchinh(0)
  }
  const onClickDangnhap = () => {
    const selectedMa = Giohangx.map((item) => item.id)
    console.log("selectedMa", Giohangx)

    let duplicates = selectedMa.reduce((acc, el, i, arr) => {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el)
      return acc
    }, [])

    if (duplicates.length > 0) {
      zmp.dialog
        .create({
          title: "OPC - Thông báo",
          content:
            "Có sản phẩm trùng, bạn muốn cộng dồn số lượng trước khi lên đơn không?",
          buttons: [
            {
              text: "Không",
              onClick() { },
            },
            {
              text: "Cộng dồn",
              onClick() {
                let arrNoDuplicate = []
                let arrDuplicate = {}

                Giohangx.forEach((value) => {
                  if (!duplicates.includes(value.id)) {
                    arrNoDuplicate.push(value)
                  } else {
                    if (arrDuplicate[value.id]) {
                      arrDuplicate[value.id].soluong =
                        parseInt(arrDuplicate[value.id].soluong) +
                        parseInt(value.soluong) +
                        ""
                    } else {
                      arrDuplicate[value.id] = { ...value }
                    }
                  }
                })

                let merged = [...arrNoDuplicate]
                duplicates.forEach((id) => {
                  merged.push(arrDuplicate[id])
                })
                store.dispatch("AddAllGioHang", merged)
                updateGiohang(merged)
              },
            },
          ],
        })
        .open()
    } else {
      Appkm("")
    }
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
  const getPhoneNumberByToken = async (token, accessToken) => {
    // gọi API Server của bạn để truy xuất thông tin từ token và user access token
    //your_user_access_token, your_token
    try {
      await request3(accessToken, token).then((result) => {
        console.log("khachhang/getPhoneNumberByToken: ", result)

        let sdt = "" + JSON.parse(result).data.number
        //showDialog(""+JSON.parse(result).data.number)
        if (sdt) {
          onClickLuu(sdt)
          store.dispatch("setPhoneNumber", sdt)
        }
      })
    } catch (error) {
      console.log("Error request api getPhoneNumberByToken ", error)
      return []
    }
  }

  const Appkm = async (ctkmSort = []) => {
    updateLoading(true)

    //let dgsauck = (value.dongia * (1 - (((value.chietkhauKM ?? 0) / 100.0 + (value.nhomCkGam ?? 0) / 100.0))));


    const listsp = Giohangx.map((s) => ({
      spId: s.id,
      soluong: s.soluong,
      vat: s.vat,
      thung: 0,
      id: s.id,
      dongia: (s.dongia * (1 - (((s.chietkhauKM ?? 0) / 100.0 + (s.nhomCkGam ?? 0) / 100.0)))),
      ma: s.ma,

    }))
    let donhang = {
      id: "",
      nppId: CusInfo?.nppId || "",
      kbhId: "",
      khoId: "100000",
      ngaydh: new Date().toISOString().split("T")[0],
      khId: CusInfo?.KHACHHANG_fk || "",
      loai: "0",
    }
    console.log('param__List', listsp);

    if (listsp.length <= 0)
      return showDialog("Giỏ hàng chưa có sản phẩm để áp dụng khuyến mãi!")


    if (appKm) {
      // ApKhuyenMaiKhachHang data { "chuoiSort": "", "dieuchinh": 0, 
      // "donhang": "{\"id\":\"\",\"nppId\":110429,\"kbhId\":\"\",\"khoId\":\"100000\",\"ngaydh\":\"2025-12-01\",\"khId\":384050,\"loai\":\"0\"}",
      // "sanpham": "[{\"id\":138938,\"ma\":\"1007961\",\"soluong\":3,\"dongia\":18333},{\"id\":138444,\"ma\":\"1000902\",\"soluong\":10,\"dongia\":36028.613},{\"id\":138445,\"ma\":\"1000903\",\"soluong\":10,\"dongia\":43419.043}]"}


      updateDatakm([])
      setSanPhamSuDung("")
      //const method = "khachhang/ApKhuyenMaiDonHangNew"
      const method = "khachhang/ApKhuyenMaiDonHangNew2"
      const params = {
        userId: String(CusInfo?.KHACHHANG_fk),
        sanpham: JSON.stringify(listsp),
        dieuchinh: dieuchinh + "",
        ctkmSort: JSON.stringify(ctkmSort),
        donhang: JSON.stringify(donhang),
      }

      console.log('param__KM ' + JSON.stringify(params));
      try {
        const response = await request("POST", method, params)
        const json = await response.json()
        console.log("response___Appkm", json)


        if (json) {
          let data = json;

          if (data && data.status == "1") {
            if (data.data.length == 0) {
              //lưu đơn 
              onClickLuu("")

            } else {
              //navigate to chon

              let promotions = JSON.parse(data.data);
              console.log('promotions:2 ' + JSON.stringify(promotions))
              let SanPhamSuDung = '';
              promotions = promotions.map(pro => {
                SanPhamSuDung += SanPhamSuDung.length <= 0 ? pro.SanPhamSuDung : (';' + pro.SanPhamSuDung);
                //pro.soluong = pro.soXuat;
                pro.dieukienkhuyenmai = JSON.parse(pro.dieukienkhuyenmai);
                pro.trakhuyenmai = JSON.parse(pro.trakhuyenmai);

                pro.trakhuyenmai.map((tkm, i) => {
                  if (tkm.loai + '' == "3") {
                    tkm.spTra = JSON.parse(tkm.spTra)
                    tkm.spTra.map((sp, j) => {
                      if (j == 0) {
                        sp.soluong = pro.sosuat * parseInt(tkm.tongluong)
                      }
                      else {
                        sp.soluong = 0
                      }
                      return sp;

                    })
                  }
                  if (pro.trakhuyenmai.length == 1) {
                    tkm.chontkm = true;
                    pro.chontkm = false;
                  }
                  else {

                    pro.chontkm = tkm.pheptoan == "2"

                    if (i > 0) {
                      tkm.chontkm = tkm.pheptoan == "1"
                    } else {
                      tkm.chontkm = true;
                    }

                  }
                  return tkm;
                }
                )
                return pro;
              });
              //xap xep theo  tongtienTungkm từ cao đến thấp
              console.log('dieuchinh: ' + dieuchinh)
              if (dieuchinh == 0) {
                promotions.sort((a, b) => b.tongtienTungkm - a.tongtienTungkm);
                console.log('promotions:3 ' + JSON.stringify(promotions))
                let chuoiSort = [];
                let index = 1;
                promotions && promotions.map(pro => {
                  if (pro)
                    pro.trakhuyenmai.map(tkm => {
                      let t = {};
                      t.ctkmId = tkm.ctkmId + '';
                      t.trakmId = tkm.id + '';
                      t.scheme = pro.scheme + '';
                      t.stt = index + '';
                      t.chon = tkm.chontkm ? "1" : "0";
                      chuoiSort.push(t);
                      index++;
                    })

                });

                setdieuchinh(1);
                Appkm_Dieuchinh(chuoiSort);

              }
              else {
                console.log('promotions:4 ' + JSON.stringify(promotions))
              }

              //setPromotions(promotions);
              //setdieuchinh(1);

            }
          }
          else {
            onClickLuu("")
          }
        } else {
          onClickLuu("")
        }

        return;


      } catch (error) {
        console.log("__request api:", error)
        updateLoading(false)
      }
    } else {
      onClickLuu("")
    }
  }
  const Appkm_Dieuchinh = async (ctkmSort = []) => {
    updateLoading(true)
    const listsp = Giohangx.map((s) => ({
      spId: s.id,
      soluong: s.soluong,
      vat: s.vat,
      thung: 0,
      id: s.id,
      dongia: (s.dongia * (1 - (((s.chietkhauKM ?? 0) / 100.0 + (s.nhomCkGam ?? 0) / 100.0)))),
      ma: s.ma,

    }))
    let donhang = {
      id: "",
      nppId: CusInfo?.nppId || "",
      kbhId: "",
      khoId: "100000",
      ngaydh: new Date().toISOString().split("T")[0],
      khId: CusInfo?.KHACHHANG_fk || "",
      loai: "0",
    }
    console.log('param__List', listsp);

    if (listsp.length <= 0) return

    if (appKm) {
      // ApKhuyenMaiKhachHang data { "chuoiSort": "", "dieuchinh": 0, 
      // "donhang": "{\"id\":\"\",\"nppId\":110429,\"kbhId\":\"\",\"khoId\":\"100000\",\"ngaydh\":\"2025-12-01\",\"khId\":384050,\"loai\":\"0\"}",
      // "sanpham": "[{\"id\":138938,\"ma\":\"1007961\",\"soluong\":3,\"dongia\":18333},{\"id\":138444,\"ma\":\"1000902\",\"soluong\":10,\"dongia\":36028.613},{\"id\":138445,\"ma\":\"1000903\",\"soluong\":10,\"dongia\":43419.043}]"}


      updateDatakm([])
      //const method = "khachhang/ApKhuyenMaiDonHangNew"
      const method = "khachhang/ApKhuyenMaiDonHangNew2"
      const params = {
        userId: String(CusInfo?.KHACHHANG_fk),
        sanpham: JSON.stringify(listsp),
        dieuchinh: 1 + "",
        ctkmSort: JSON.stringify(ctkmSort),
        donhang: JSON.stringify(donhang),
      }

      console.log('param__KM ' + JSON.stringify(params));
      try {
        const response = await request("POST", method, params)
        const json = await response.json()
        console.log("response___Appkm", json)


        if (json) {
          let data = json;

          if (data && data.status == "1") {
            if (data.data.length == 0) {
              //lưu đơn 

            } else {
              //navigate to chon

              let promotions = JSON.parse(data.data);
              console.log('promotions:2 ' + JSON.stringify(promotions))
              let SanPhamSuDung = '';
              promotions = promotions.map(pro => {

                pro.dieukienkhuyenmai = JSON.parse(pro.dieukienkhuyenmai);
                pro.trakhuyenmai = JSON.parse(pro.trakhuyenmai);
                pro.trakhuyenmai.map((tkm, i) => {
                  if (tkm.loai + '' == "3") {
                    tkm.spTra = JSON.parse(tkm.spTra)
                    tkm.spTra.map((sp, j) => {

                      if (tkm.hinhthuc == '2' && !tkm.IS_TRASP_HanMucTien == '1') {
                        if (j == 0) {
                          sp.soluong = pro.sosuat * parseInt(tkm.tongluong)
                        }
                        else {
                          sp.soluong = 0
                        }
                      }
                      else {
                        sp.soluong = parseInt(sp.SOLUONG)
                      }

                      return sp;

                    })




                  }
                  if (pro.trakhuyenmai.length == 1) {
                    tkm.chontkm = true;
                    pro.chontkm = false;
                  }
                  else {

                    pro.chontkm = tkm.pheptoan == "2"

                    if (i > 0) {
                      tkm.chontkm = tkm.pheptoan == "1"
                    } else {
                      tkm.chontkm = true;
                    }

                  }
                  if (tkm.spTraCK) {
                    tkm.spTraCK = JSON.parse(tkm.spTraCK)

                    tkm.spTraCK.forEach(spCK => {
                      // So với sản phẩm trong đơn hàng
                      listsp.forEach((spDonHang, idx) => {
                        // Nếu mã trùng với mã của sản phẩm đơn hàng

                        if (spDonHang.ma === spCK.MA) {
                          // Gắn chiết khấu vào sản phẩm đơn hàng
                          console.log('spDonHang', spDonHang, 'spCK', spCK, 'tkm.loai', tkm.loai)
                          let chietkhauKM_ViewChoi = 0;
                          let chietkhau = spCK.chietkhau;
                          let chietkhaicuS = 0;
                          if (tkm.loai + '' == 3) {
                            chietkhauKM_ViewChoi = spCK.chietkhau
                            chietkhau = 0;
                          }

                          let TongchietkhauKM = (spDonHang.chietkhauKM ?? 0) ? parseFloat((spDonHang.chietkhauKM ?? 0) + chietkhau) : chietkhau
                          TongchietkhauKM = TongchietkhauKM > 100 ? 100 : TongchietkhauKM;

                          let a = spDonHang
                          a.chietkhauKM = TongchietkhauKM
                          a.chietkhauKM_ViewChoi = chietkhauKM_ViewChoi
                          a.ctkmId = pro.id
                          a.nhomCkGam = (parseFloat(TongchietkhauKM) >= 100 ? 0 : spDonHang.nhomCkGam)
                          store.dispatch("updateGiohang", a)


                        }
                      });
                    });
                    updateGiohang(listsp)
                  }

                  return tkm;
                }
                )
                pro.dieukienkhuyenmai.map(dkkm => {
                  // dkkm.spList = JSON.parse(dkkm.spList);
                  dkkm.spList.map(sp => {
                    let spsd = dkkm.ctkmId + " # " + dkkm.dkkmId + " # " + sp.ma + " # " + sp.soluong + " # " + sp.dongia
                    SanPhamSuDung += SanPhamSuDung.length <= 0 ? spsd : (';' + spsd);

                  })
                  return dkkm
                })
                return pro;
              });
              //xap xep theo  tongtienTungkm từ cao đến thấp
              console.log('dieuchinh: ' + dieuchinh)
              console.log('promotions:5 điều chỉnh ', promotions)
              setSanPhamSuDung(SanPhamSuDung);

              updateDatakm(promotions);
              updateAppKm(false)
              updateLoading(false)

              //update updateDatakm mới gọi hàm tính tiền

              // Sau khi cập nhật datakm, gọi lại hàm tinhtien để cập nhật tổng tiền

              // tinhtien()


              //setdieuchinh(1);

            }
          }
          else {


          }
        } else {
        }

        return;


      } catch (error) {
        console.log("__request api:", error)
        updateLoading(false)
      }
    } else {
      onClickLuu("")
    }
  }

  const handleDeleteAll = () => {
    zmp.dialog
      .create({
        title: "Xóa sản phẩm",
        content: "Bạn muốn xóa toàn bộ sản phẩm lên đơn ?",
        buttons: [
          {
            text: "Hủy",
            onClick() { },
          },
          {
            text: "Xóa",
            onClick() {
              updateGiohang([])
              store.dispatch("remoteAllGioHang")
              setTimeout(() => {
                zmp.toolbar.show("#main-nav")
              }, 200);
            },
          },
        ],
      })
      .open()
  }
  const onClickLuu = async (number) => {

    // kiểm tra chọn sp trả km chưa 
    // trong cái trakm có spTra_xuly 
    let checkChonSpTraKm = "";
    datakm.forEach(pro => {
      pro.trakhuyenmai.forEach(tkm => {
        if (tkm.loai == 3 && tkm.IS_TRASP_HanMucTien == 1) {
          if (tkm.chontkm) {
            let spTra_Choix = tkm.spTra_xuly ? tkm.spTra_xuly.filter(sp => sp.soluong > 0) : [];
            if (spTra_Choix.length == 0) {
              //checkChonSpTraKm = false;
              checkChonSpTraKm += ' ' + tkm.diengiai;
            }
          }
        }
      })
    })
    if (checkChonSpTraKm !== "") {
      showDialog("Bạn chưa chọn sản phẩm trả khuyến mãi!" + checkChonSpTraKm)
      updateLoading(false)
      return;
    }

    //tạo chuoi khuyenmai dung cho api tao don hang bên servieReact
    let chuoikm = "";
    datakm.map(pro => {
      console.log('saveEditKhuyenMa pro', pro)

      pro.trakhuyenmai.map(tkm => {
        if (tkm.chontkm) {
          console.log('saveEditKhuyenMa 222', tkm.spTra, 'pro.scheme', pro.scheme,)
          if (tkm.loai + '' == '3') {
            if (tkm.IS_TRASP_HanMucTien == '1') {
              tkm.spTra_xuly.map(sp => {
                let tt = 0;
                tt = sp.soluong * sp.gia
                if (parseInt(sp.soluong) > 0)
                  chuoikm += pro.scheme + "#" + tkm.id + "#" + pro.sosuat + "#" + tt + "#" + sp.spId + "#" + sp.soluong + ";";

              })
            }
            else {
              if (tkm.hinhthuc == 2) {//bat ky trong 
                tkm.spTra.map((sp, i) => {
                  if (i == 0) {// trả sp dau tien cho nhanh 
                    let tt = 0;
                    
                      chuoikm += pro.scheme + "#" + tkm.id + "#" + pro.sosuat + "#" + tt + "#" + sp.spId + "#" +(tkm.tongluong * pro.sosuat) + ";";
                  }
                })

              } else {
                tkm.spTra.map(sp => {
                  let tt = 0;
                  if (parseInt(sp.soluong) > 0)
                    chuoikm += pro.scheme + "#" + tkm.id + "#" + pro.sosuat + "#" + tt + "#" + sp.spId + "#" + sp.soluong + ";";

                })
              }
            }
          }
          else {
            chuoikm += pro.scheme + "#" + tkm.id + "#" + (pro.soXuat ?? pro.sosuat) + "#" + tkm.tongtien + "#-1#-1;";
          }
        }

      })

    });


    console.log('chuoikm', chuoikm);
    //return;



    if (chuoikm.length > 0)
      chuoikm = chuoikm.slice(0, chuoikm.length - 1);

    ///km json 
    let khuyenmai = []
    if (datakm.length > 0) {
      //console.log('datakm',datakm)
      datakm.map((s) => {
        if (s.Loai === "3") {
          if (s.HinhThuc === "2") {
            if (JSON.parse(s.spTen)[0].AVAILABLE > 0)
              khuyenmai.push({
                id: s.Scheme,
                tkmId: s.TraKhuyenMai,
                sosuat: s.soXuat || s.sosuat,
                TongGiaTri: 0,
                spId: JSON.parse(s.spTen)[0].spId,
                soluong: parseFloat(s.TongLuong) * parseFloat(s.sosuat),
              })
          } else {
            khuyenmai.push({
              id: s.Scheme,
              tkmId: s.TraKhuyenMai,
              sosuat: s.soXuat || s.sosuat,
              TongGiaTri: 0,
              spId: JSON.parse(s.spTen)[0].spId,
              soluong: JSON.parse(s.spTen)[0].SOLUONG,
            })
          }
        } else {
          khuyenmai.push({
            id: s.Scheme,
            tkmId: s.TraKhuyenMai,
            sosuat: s.soXuat || s.sosuat,
            TongGiaTri: s.TongTien,
            spId: 0,
            soluong: 0,

          })
        }
      })
    }



    updateLoading(true)
    let listsp = []

    Giohangx.map((s) => {
      if (s.id && !s.Scheme)
        listsp.push({ spId: s.id, soluong: s.soluong, dongia:  s.dongia*(1- ((s.chietkhauKM ? s.chietkhauKM / 100 : 0) + (s.nhomCkGam ? s.nhomCkGam / 100 : 0)))  , vat: s.vat, thung: 0, nhomCkGam: s.nhomCkGam ? s.nhomCkGam : 0, chietkhauKM: s.chietkhauKM ? s.chietkhauKM : 0, spMa: s.ma })
    })
    {
      /* [{"id":"100099","SanPhamSuDung":"100246","Scheme":"2019.GAC.THANG2","DienGiai":"2019.GAC.THANG2","sosuat":"2","Loai":"3","HinhThuc":"2","spTen":"[{\\"spId\\":100104,\\"TEN\\":\\"PHARHAMAXE G2\\",\\"HinhAnh\\":\\"http://210.245.21.162:2222/AnhChupPDA/AnhChupAppShop/sanpham/01NM0905.jpg\\",\\"SOLUONG\\":0}]","TongLuong":"1","TongTien":"0","ChonSanPham":"0","DungSanPham":"0","TraKhuyenMai":"100099"}]' } ]    */
    }



    let params = {
      sodienthoai: number,
      id: "", //CusInfo?.KHACHHANG_fk,
      userId: String(CusInfo?.KHACHHANG_fk),
      sanpham: JSON.stringify(listsp),
      khuyenmai: JSON.stringify(khuyenmai),

      ghichu: "Đơn Zalo miniapp",
      khuyenmai_chuoi: chuoikm,
      SanPhamSuDung: SanPhamSuDung,
    }
    console.log('prasm_daonhang', params);
    console.log("params km ", JSON.stringify(khuyenmai))

    // http://1.53.252.173:1991/DMS_OPC_Test/WebServiceReact.asmx POST createDonHang_JSON data {"Httt": "2", "ListSp_Lo": "[]", "SanPhamSuDung": "117600 # 114586 # 1000886 # 10 # 59800;117601 # 114586 # 1000886 # 10 # 59800;117602 # 114586 # 1000886 # 10 # 59800;117603 # 114586 # 1000886 # 8.779322938614975 # 59800;117604 # 114586 # 1000886 # 8.779322938614975 # 59800", "chietkhau": 0, "chot": 0, "ctkmIdUpLoad": "", "datatichluy": "", "datatichluy_chitiet": "[]", "datatrungbay": "", "ddkdId": 112023, "dsTichluyStr": "", "ghichu": "", "khId": 350855, "khoId": "100000", "khuyenmai": "CK_SP_MA#114574#5#0#-1#-1;CK_QDSP_MA#114590#1#3900#138776#1;CK_MA#114668#5#28476#-1#-1;TT_MA#114670#5#100000#-1#-1", "lat": 20.9794367, "lon": 105.7099217, "ngaydh": "2025-12-05", "nppId": 110429, "sanpham": "1000886#10#54104.399999999994#5#5#0", "tiengiamtru": 0, "toBill": undefined, "tonggiatri": 0}

    let method = "khachhang/TaoMoiDonHangNew2"

    try {
      const response = await (await request("POST", method, params)).json()
      if (response) {
        console.log("xxxxxxxxxx  TaoMoiDonHang", response)
        let p = response
        updateLoading(false)

        console.log("xxxxxxxxxx ", response)
        //[{"RESULT":"1","MSG":"Lưu đơn hàng thành công!\nSố đơn hàng: 722118.\n","SODONHANG":" 722118","LISTGAME":"[]"}]
        showDialog(p[0].MSG)
        if (p[0].RESULT == 1) {
          //xóa giỏ hàng
          updateGiohang([])
          store.dispatch("remoteAllGioHang")
          //xóa khuyến mãi
          updateDatakm([])
          //về trang chủ

          backHome()
          // openDialog()
          //
        } else {
          //  [{"RESULT":"0","MSG":"Không lấy được thông tin NVB…HANG":"","HETTONKHO":"","DATA":"","NGAYNHAP":""}]
          // showDialog(p[0].MSG)
        }
        // let p = JSON.parse(response.message)
        // console.log(method, p)
        //}
      } else {
        updateLoading(false)
      }
    } catch (error) {
      console.log("Error request api x ", error)
      updateLoading(false)
    }
  }
  const updateItemKM = (item) => {
    let listkm = [...datakm]
    let index = listkm.findIndex((x) => x.id == item.id)
    listkm[index] = item
    console.log("updateItemKM", listkm)
    updateDatakm(listkm)
  }
  const backHome = () => {
    console.log("backHome")
    zmp.toolbar.show("#main-nav")
    zmp.tab.show("#view-main")
    zmp.views.main.router.navigate("/", {
      animate: true,
      transition: "zmp-cover-v",
    })
  }
  // const goListSP = () => {
  //   zmp.views.main.router.navigate("/search/?id=")
  // }
  return (
    <Page
      className="home-page "
      // onPageBeforeIn={() => {

      //   console.log("onPageBeforeIn giohang", Giohangx?.length)
      //   if (Giohangx?.length > 0) {
      //     console.log('vaoday');

      //     zmp.toolbar.hide("#main-nav")
      //   } else {
      //     zmp.tab.show("#view-giohang")
      //     console.log('vaodayshow1');
      //     zmp.toolbar.show("#main-nav")
      //   }
      // }}
      // onPageAfterIn={() => {

      //   console.log("onPageAfterIn giohang")
      //   if (Giohangx?.length > 0) {
      //     console.log('vaoday');
      //     zmp.toolbar.hide("#main-nav")
      //   } else {
      //     zmp.tab.show("#view-giohang")
      //     console.log('vaodayshow2');
      //     zmp.toolbar.show("#main-nav")
      //   }
      // }}
    >
      {/* {loading && <LoadingSpinner />} */}
      <HeaderBox
        slot="fixed"
        icon={<FaBasketShopping size={25} className="text-blue-imex" />}
        HeaderBoxName={"Giỏ hàng "}
      />
      {Giohang.length > 0 ? (
        <Box className="view-center-gh" style={{}}>
          <Box
            className="borderradius1"
            style={{ border: `0.5px solid ${Color.BackGroundNuti_gray}` }}
          >
            <Box m="0" p="4" flex justifyContent="center" style={{ width: "100%" }}>
              <Box m="0" p="0" className="logo-imex "></Box>
            </Box>
            <Box
              m={0}
              p={0}
              style={{
                width: "100%",
                height: "5px",
                // backgroundColor: 'red',

                paddingBottom: "10px",
                WebkitBoxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
              }}
              className="BoxLine"
            ></Box>
            {Giohang.map((item, index) => {
              if (index < 3) {
                return (
                  <>
                    <RowItemBanhang
                      key={index}
                      item={item}
                      index={index}
                      ViewMore={ViewMore}
                      updateGiohang={(a) => {
                        updateAppKm(true)
                        updateGiohang(a)
                      }}
                      Refeshkm={() => {
                        updateAppKm(true)
                        updateDatakm([])
                      }}
                      tinhtien={() => tinhtien()}
                      length={Giohang.length}
                    ></RowItemBanhang>
                    {index > 0 && index < Giohang.length - 1 && (
                      <Box
                        m={0}
                        p={0}
                        style={{
                          width: "100%",
                          height: "5px",
                          // backgroundColor: 'red',

                          paddingBottom: "10px",
                          WebkitBoxShadow:
                            "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                          boxShadow: "inset 0 -1px 0 0 rgba(100, 121, 143, 0.122)",
                        }}
                        className="BoxLine"
                      ></Box>
                    )}
                  </>
                )
              } else {
                if (index == 3 && !ViewMore)
                  return (
                    <Box
                      p="0"
                      m="0"
                      className="center"
                      flex
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <Button onClick={() => updateViewMore(true)}>
                        <Text
                          style={{
                            color: Color.textAPPDefault,
                            fontSize: 13,
                            fontWeight: "500",
                          }}
                        >
                          Xem thêm
                        </Text>
                      </Button>

                      {/* <Icon color='gray' size='18' zmp='zi-chevron-up'></Icon> */}
                    </Box>
                  )
                if (ViewMore)
                  return (
                    <RowItemBanhang
                      key={index}
                      item={item}
                      index={index}
                      ViewMore={ViewMore}
                      updateGiohang={(a) => updateGiohang(a)}
                      tinhtien={() => tinhtien()}
                      length={Giohang.length}
                    ></RowItemBanhang>
                  )
              }
            })}
          </Box>

          {datakm.length > 0 ? (
            <Box className="borderradius1">
              <Box p="0" m="0" flex justifyContent="center" alignItems="center"
                style={{
                  width: "100%",
                  flexDirection: "column",
                }}
                className="text-center">

                <Text

                  className="text-blue-dark text-wrap"
                  style={{
                    color: ConvertOpacity(Color.primary, 1),
                    fontSize: 13,
                    paddingTop: 14,
                    fontWeight: "bold",
                  }}
                >
                  KHUYẾN MÃI
                </Text>
                <Text

                  className="text-blue-dark text-wrap"
                  style={{
                    color: ConvertOpacity(Color.textAPPDefault, 0.8),
                    fontSize: 12,
                  }}
                >
                  Khuyến mãi áp dụng cho đơn hàng
                </Text>
              </Box>
              {datakm.map((item, index) => {
                return (
                  <RowItemKMBanhang
                  setIsShowModalKm={setIsShowModalKm}
                    key={index}
                    item={item}
                    index={index}
                    length={datakm.length}
                    updateGiohang={(a) => updateGiohang(a)}
                    tinhtien={() => tinhtien()}
                    updateItemKM={(km) => updateItemKM(km)}
                  ></RowItemKMBanhang>
                )
              })}
            </Box>
          ) : !appKm ? (
            <Box flex justifyContent="center" alignItems="center"
              style={{
                width: "100%",
                backgroundColor: Color.BackGroundLightWhite,
                border: `0.5px solid ${Color.BackGroundNuti_gray}`
              }} className="text-center">

              <Text

                className="text-blue-dark text-wrap"
                style={{
                  color: ConvertOpacity(Color.textAPPGray, 0.5),
                  fontSize: 13,
                  padding: 10,
                }}
              >
                Không có Khuyến mãi áp dụng
              </Text>
            </Box>
          ) : null}
        </Box>
      ) : (
        <Box
          mx="0"
          my="0"
          flex
          className="view-center-gh"
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 200,
          }}
        >
          <Box
            className="box-shadow-Pure"
            style={{
              textAlign: "center",
              padding: 20,
              backgroundColor: Color.BackGroundLightWhite,
              borderRadius: 12,
              maxWidth: 320,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img
              src={opclogo}
              alt="Giỏ hàng trống"
              style={{ width: 120, marginBottom: 16 }}
            />
            <Text
              className="text-blue-dark-text-size8"
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: Color.textAPPDefault,
              }}
            >
              Giỏ hàng của bạn đang trống
            </Text>
            <Text
              style={{
                color: Color.textAPPDefault,
                fontSize: 14,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              Vui lòng thêm sản phẩm vào giỏ hàng
            </Text>
            <Link href="/search">
              <Box
                className="filter-button-luu view-center borderradius5"
                style={{
                  backgroundColor: ConvertOpacity(Color.ColorNutiLight, 1),
                  borderRadius: 3,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Thêm sản phẩm
                </Text>
              </Box>
            </Link>
          </Box>
        </Box>
      )}

      {/* Animation footer giỏ hàng */}
      {Giohang.length > 0 && (
        <Box
          m="0"
          className={`mx-0 animated-footer ${!isShowModalKm ? 'slide-up' : 'slide-down'}`}
          slot="fixed"
          style={{
            minHeight: heightFooter,
            width: "100%",
            position: "fixed",
            bottom: 0,
            zIndex: 999,
            justifyContent: "center",
            background: Color.BackGroundLightWhite,
            borderTop: `1px solid ${Color.BackGroundNuti_gray}`,
            padding: 10,
            transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s',
            willChange: 'transform, opacity',
          }}
        >
          <Box
            m="0"
            flex
            justifyContent="space-between"
            alignItems="center"
            style={{ width: "100%", flexWrap: "wrap" }}
          >
            <Box
              flex
              style={{
                flexDirection: "column",
                flexWrap: "wrap",
              }}
            >
              <Text
                className="break-words whitespace-normal"
                style={{
                  color: ConvertOpacity(Color.textAPPGray, 1),
                  fontSize: 13,
                }}
              >
                Tổng tiền: {formatCurrency(TongTien, true)}
              </Text>
              <Text
                style={{
                  color: ConvertOpacity(Color.textAPPGray, 1),
                  fontSize: 13,
                }}
              >
                Khuyến mãi:{" "}
                {TongtieKm > 0
                  ? formatCurrency(TongtieKm * -1, true)
                  : formatCurrency(0, true)}
              </Text>
              <Text
                size="normal"
                style={{
                  fontSize: 14,
                  color: ConvertOpacity(Color.textAPPGreen2, 1),
                  fontWeight: "700",
                }}
              >
                {formatCurrency(
                  TongTien - TongtieKm < 0 ? 0 : TongTien - TongtieKm,
                  true
                )}
              </Text>
            </Box>
            <Box
              m="0"
              flex
              style={{ gap: 5, justifyContent: "center", alignItems: "center" }}
            >
              <Link onClick={() => handleDeleteAll()}>
                <Box
                  m="0"
                  p="0"
                  flex
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    backgroundColor: ConvertOpacity(Color.textAPPCopper, 0.1),
                    borderRadius: 5,
                    padding: "10px 12px",
                    // border: `1px solid ${ConvertOpacity(Color.textAPPCopper, 0.2)}`,
                  }}
                >
                  <IoTrashOutline color={Color.textAPPRedChill} style={{}} />
                </Box>
              </Link>
              <Link href="/search">
                <Box
                  m="0"
                  p="0"
                  flex
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    backgroundColor: ConvertOpacity(Color.textAPPGreen, 0.1),
                    borderRadius: 5,
                    padding: "8px 12px",
                    gap: 5,
                    //  border: `1px solid ${ConvertOpacity(Color.textAPPGreen, 0.2)}`,
                  }}
                >
                  {/* <MdAddShoppingCart color={Color.textAPPDefault} style={{}} /> */}
                  <Text
                    noSpace
                    style={{
                      color: Color.textAPPGreen2,
                      // fontWeight: "bold",
                      fontSize: 13,
                    }}
                  >
                    Thêm SP
                  </Text>
                </Box>
              </Link>
            </Box>
          </Box>

          <Box
            m="0"
            style={{
              marginTop: 10,
              width: "100%",
            }}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Box m="0" p="0" flex style={{ width: "100%", gap: 5 }}>
                <Link onClick={() => backHome()}>
                  <Box
                    m="0"
                    p="0"
                    flex
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      backgroundColor: ConvertOpacity(Color.textAPPGreen, 0.1),
                      borderRadius: 5,
                      width: "50px",
                      height: "50px",
                      border: `1px solid ${ConvertOpacity(Color.textAPPGreen, 0.1)}`,
                    }}
                  >
                    <IoChevronBack color={Color.textAPPGreen} style={{}} />
                  </Box>
                </Link>
                <Button
                  className="view-center"
                  fill
                  style={{
                    backgroundColor: ConvertOpacity(Color.textAPPGreen2, 1),
                    color: "white",
                    fontSize: 16,
                    borderRadius: 5,
                    height: 50,
                    flexGrow: 1,
                  }}
                  onClick={onClickDangnhap}
                >
                  <Box flex alignItems="center" justifyContent="center">
                    <FaShoppingCart style={{ marginRight: 8 }} />
                    <Text style={{ color: "white", fontSize: 13 }}>
                      {appKm ? "Đặt hàng" : "Xác nhận đặt hàng"}
                    </Text>
                  </Box>
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
      {/* CSS animation cho footer giỏ hàng */}
      <style>{`
        .animated-footer {
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
        }
        .animated-footer.slide-up {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .animated-footer.slide-down {
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
      <Box
        className=""
        noSpace={true}
        flex
        style={{ width: "100%", minHeight: Giohang.length > 0 ? heightFooter : 0 }}
        alignItems="center"
        justifyContent="space-between"
      ></Box>
    </Page>
  )
}
export default GiohangPage
