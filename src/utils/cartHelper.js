export const calculateTotals = (Giohangx, datakm) => {
  let tt = 0
  Giohangx.forEach((item) => {
    tt += parseFloat(item.dongia || 0) * parseFloat(item.soluong || 0)
  })

  let ttckkm = 0
  let tienvat = 0
  let tongTienCKGam = 0

  Giohangx.forEach((item) => {
    if (((item.chietkhauKM && item.chietkhauKM > 0) || (item.nhomCkGam && item.nhomCkGam > 0))) {
      ttckkm += (parseFloat(item.dongia || 0) * parseFloat(item.soluong || 0)) * ((item.chietkhauKM ?? 0) + (item.nhomCkGam ?? 0)) / 100
    }
    tienvat += (parseFloat(item.soluong ?? 0) * parseFloat(item.dongia ?? 0)) * (1 - (parseFloat(item.nhomCkGam ?? 0) + parseFloat(item.chietkhauKM ?? 0)) / 100.0) * (parseFloat(item.vat ?? 0) / 100.0)
    tongTienCKGam += (parseFloat(item.dongia || 0) * parseFloat(item.soluong || 0)) * (item.nhomCkGam ?? 0) / 100
  })

  let ttkm = 0
  datakm.forEach((item) => {
    ttkm += item.trakhuyenmai.reduce((total, tkm) => {
      if (tkm.loai + '' == "1" || tkm.loai + '' == "2") {
        if (!tkm.spTra_vongquay || tkm.spTra_vongquay.length == 0) {
          return total + parseFloat(tkm.tongtien || 0)
        }
      }
      return total
    }, 0)
    if (item.ketqua_vongquay) {
      console.log("ketqua_vongquay tinh tiền: ", item.ketqua_vongquay)
      ttkm += item.ketqua_vongquay?.reduce((total, tkm) => {
        if (tkm.LOAI + '' == "1") {
          return total + parseFloat(tkm.tongTien || 0)
        }
        if (tkm.LOAI + '' == "2") {
          return total + parseFloat(tkm.chietKhau * item.tonggiatriCK / 100.0 || 0)
        }
        return total
      }, 0)
    }
  })

  return {
    tienvat,
    ttckkm,
    tongTienCKGam,
    ttkm,
    tongTien: tt + tienvat,
    tongTieKm: ttckkm + ttkm + tongTienCKGam
  }
}

export const getDuplicatesInCart = (Giohangx) => {
  const selectedMa = Giohangx.map((item) => item.id)
  return selectedMa.reduce((acc, el, i, arr) => {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el)
    return acc
  }, [])
}

export const mergeDuplicateCartItems = (Giohangx, duplicates) => {
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
  return merged
}

export const prepareOrderPayload = (Giohangx, datakm, number, CusInfo, SanPhamSuDung) => {
  let chuoikm = ""
  datakm.forEach(pro => {
    if (pro.ketqua_vongquay?.length > 0) {
      pro.ketqua_vongquay.map((tkm => {
        if (tkm.LOAI + '' == "1" || tkm.LOAI + '' == "2") {//tien
          chuoikm += pro.scheme + "#" + tkm.pk_seq + "#" + 1 + "#" + (tkm.LOAI + '' == "1" ? tkm.tongTien : tkm.chietKhau * pro.tonggiatriCK / 100.0) + "#-1#-1;"
        } if (tkm.LOAI + '' == "3") {//san pham
          chuoikm += pro.scheme + "#" + tkm.pk_seq + "#" + 1 + "#" + 0 + "#" + sp.spId + "#" + sp.tongLuong + ";"
        }


      }))
    } else {
      pro.trakhuyenmai.forEach(tkm => {
        if (tkm.chontkm) {
          if (tkm.loai + '' == '3') {
            if (tkm.IS_TRASP_HanMucTien == '1') {
              tkm.spTra_xuly?.forEach(sp => {
                let tt = sp.soluong * sp.gia
                if (parseInt(sp.soluong) > 0)
                  chuoikm += pro.scheme + "#" + tkm.id + "#" + pro.sosuat + "#" + tt + "#" + sp.spId + "#" + sp.soluong + ";"
              })
            } else {
              if (tkm.hinhthuc == 2) {
                tkm.spTra?.forEach((sp, i) => {
                  if (i == 0) {
                    chuoikm += pro.scheme + "#" + tkm.id + "#" + pro.sosuat + "#0#" + sp.spId + "#" + (tkm.tongluong * pro.sosuat) + ";"
                  }
                })
              } else {
                tkm.spTra?.forEach(sp => {
                  if (parseInt(sp.soluong) > 0)
                    chuoikm += pro.scheme + "#" + tkm.id + "#" + pro.sosuat + "#0#" + sp.spId + "#" + sp.soluong + ";"
                })
              }
            }
          } else {
            chuoikm += pro.scheme + "#" + tkm.id + "#" + (pro.soXuat ?? pro.sosuat) + "#" + tkm.tongtien + "#-1#-1;"
          }
        }
      })
    }

  })

  if (chuoikm.length > 0) {
    chuoikm = chuoikm.slice(0, chuoikm.length - 1)
  }

  let khuyenmai = []
  if (datakm.length > 0) {
    datakm.forEach((s) => {
      if (s.Loai === "3") {
        if (s.HinhThuc === "2") {
          let spTenParsed = JSON.parse(s.spTen || "[]");
          if (spTenParsed[0]?.AVAILABLE > 0)
            khuyenmai.push({
              id: s.Scheme,
              tkmId: s.TraKhuyenMai,
              sosuat: s.soXuat || s.sosuat,
              TongGiaTri: 0,
              spId: spTenParsed[0]?.spId,
              soluong: parseFloat(s.TongLuong) * parseFloat(s.sosuat),
            })
        } else {
          let spTenParsed = JSON.parse(s.spTen || "[]");
          khuyenmai.push({
            id: s.Scheme,
            tkmId: s.TraKhuyenMai,
            sosuat: s.soXuat || s.sosuat,
            TongGiaTri: 0,
            spId: spTenParsed[0]?.spId,
            soluong: spTenParsed[0]?.SOLUONG,
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

  let listsp = []
  Giohangx.forEach((s) => {
    if (s.id && !s.Scheme)
      listsp.push({
        spId: s.id,
        soluong: s.soluong,
        dongia: s.dongia * (1 - ((s.chietkhauKM ? s.chietkhauKM / 100 : 0) + (s.nhomCkGam ? s.nhomCkGam / 100 : 0))),
        vat: s.vat,
        thung: 0,
        nhomCkGam: s.nhomCkGam ? s.nhomCkGam : 0,
        chietkhauKM: s.chietkhauKM ? s.chietkhauKM : 0,
        spMa: s.ma,
        dvdl_fk: s.dvdl_fk
      })
  })

  return {
    sodienthoai: number,
    id: "",
    userId: String(CusInfo?.KHACHHANG_fk),
    sanpham: JSON.stringify(listsp),
    khuyenmai: JSON.stringify(khuyenmai),
    ghichu: "Đơn Zalo miniapp",
    khuyenmai_chuoi: chuoikm,
    SanPhamSuDung: SanPhamSuDung ? SanPhamSuDung : "",
  }
}

export const checkMissingPromoProducts = (datakm) => {
  let checkChonSpTraKm = ""
  datakm.forEach(pro => {
    pro.trakhuyenmai.forEach(tkm => {
      if (tkm.loai == 3 && tkm.IS_TRASP_HanMucTien == 1) {
        if (tkm.chontkm) {
          let spTra_Choix = tkm.spTra_xuly ? tkm.spTra_xuly.filter(sp => sp.soluong > 0) : []
          if (spTra_Choix.length == 0) {
            checkChonSpTraKm += ' ' + tkm.diengiai
          }
        }
      }
      if (tkm.spTra_vongquay && tkm.spTra_vongquay.length > 0) {
        if (pro.ketqua_vongquay == null) {
          checkChonSpTraKm += ' ' + tkm.diengiai
        }
      }
    })
  })
  return checkChonSpTraKm === "" ? "" : "Bạn chưa chọn sản phẩm trả/quay thưởng khuyến mãi cho khuyến mãi: " + checkChonSpTraKm
}

export const formatPromotionData = (dataArray, dieuchinh, listsp_original, storeObj) => {
  console.log("formatPromotionData input", { dataArray, dieuchinh, listsp_original })
  let SanPhamSuDung = ''
  let chuoiSort = []
  let prizes = []

  let promotions = dataArray.map(pro => {
    SanPhamSuDung += SanPhamSuDung.length <= 0 ? pro.SanPhamSuDung : (';' + pro.SanPhamSuDung)
    pro.dieukienkhuyenmai = typeof pro.dieukienkhuyenmai === 'string' ? JSON.parse(pro.dieukienkhuyenmai) : pro.dieukienkhuyenmai
    pro.trakhuyenmai = typeof pro.trakhuyenmai === 'string' ? JSON.parse(pro.trakhuyenmai) : pro.trakhuyenmai

    pro.trakhuyenmai.map((tkm, i) => {
      if (tkm.loai + '' == "3") {
        tkm.spTra = typeof tkm.spTra === 'string' ? JSON.parse(tkm.spTra) : tkm.spTra
        tkm.spTra.map((sp, j) => {
          if (dieuchinh === 1) {
            if (tkm.hinhthuc == '2' && tkm.IS_TRASP_HanMucTien != '1') {
              if (j == 0) {
                sp.soluong = pro.sosuat * parseInt(tkm.tongluong)
              } else {
                sp.soluong = 0
              }
            } else {
              sp.soluong = parseInt(sp.SOLUONG || 0)
            }
          } else {
            if (j == 0) {
              sp.soluong = pro.sosuat * parseInt(tkm.tongluong)
            } else {
              sp.soluong = 0
            }
          }
          return sp
        })
      }
      if (tkm.spTra_vongquay.length > 0) {
        tkm.spTra_vongquay = typeof tkm.spTra_vongquay === 'string' ? JSON.parse(tkm.spTra_vongquay) : tkm.spTra_vongquay
        let prizesForTkm = []
        tkm.spTra_vongquay.map((sp, j) => {
          if (dieuchinh === 1) {
            prizesForTkm.push({ ...sp, name: sp.traDIENGIAI, value: sp.chietKhau, weight: sp.TYLETRUNGTHUONG })
          }
          return sp
        })
        tkm.prizes = prizesForTkm
        prizes = prizesForTkm
      }

      if (pro.trakhuyenmai.length == 1) {
        tkm.chontkm = true
        pro.chontkm = false
      } else {
        pro.chontkm = tkm.pheptoan == "2"
        if (i > 0) {
          tkm.chontkm = tkm.pheptoan == "1"
        } else {
          tkm.chontkm = true
        }
      }

      if (dieuchinh === 1 && tkm.spTraCK) {
        tkm.spTraCK = typeof tkm.spTraCK === 'string' ? JSON.parse(tkm.spTraCK) : tkm.spTraCK
        tkm.spTraCK.forEach(spCK => {
          listsp_original.forEach((spDonHang) => {
            if (spDonHang.ma === spCK.MA) {
              let chietkhauKM_ViewChoi = 0
              let chietkhau = spCK.chietkhau
              if (tkm.loai + '' == 3) {
                chietkhauKM_ViewChoi = spCK.chietkhau
                chietkhau = 0
              }
              let TongchietkhauKM = (spDonHang.chietkhauKM ?? 0) ? parseFloat((spDonHang.chietkhauKM ?? 0) + chietkhau) : chietkhau
              TongchietkhauKM = TongchietkhauKM > 100 ? 100 : TongchietkhauKM

              let a = { ...spDonHang }
              a.chietkhauKM = TongchietkhauKM
              a.chietkhauKM_ViewChoi = chietkhauKM_ViewChoi
              a.ctkmId = pro.id
              a.nhomCkGam = (parseFloat(TongchietkhauKM) >= 100 ? 0 : spDonHang.nhomCkGam)
              storeObj.dispatch("updateGiohang", a)
            }
          })
        })
      }

      return tkm
    })

    pro.dieukienkhuyenmai.map(dkkm => {
      dkkm.spList?.map(sp => {
        let spsd = dkkm.ctkmId + " # " + dkkm.dkkmId + " # " + sp.ma + " # " + sp.soluong + " # " + sp.dongia
        SanPhamSuDung += SanPhamSuDung.length <= 0 ? spsd : (';' + spsd)
      })
      return dkkm
    })
    return pro
  })

  if (dieuchinh === 0) {
    promotions.sort((a, b) => b.tongtienTungkm - a.tongtienTungkm)
    let index = 1
    promotions.forEach(pro => {
      pro.trakhuyenmai.forEach(tkm => {
        chuoiSort.push({
          ctkmId: tkm.ctkmId + '',
          trakmId: tkm.id + '',
          scheme: pro.scheme + '',
          stt: index + '',
          chon: tkm.chontkm ? "1" : "0"
        })
        index++
      })
    })
  }

  return { promotions, SanPhamSuDung, chuoiSort, prizes }
}
