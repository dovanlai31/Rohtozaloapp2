import { getAPI, request } from "@utils/networking"
import { validateString } from "@utils/util"
import {
  closeApp,
  followOA,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  requestSendNotification,
} from "zmp-sdk/apis"
import config from "../config"
import blogs from "../data/blogs.json"
import categories from "../data/categories.json"
import stories from "../data/stories.json"
import store from "../store"

const base = config.BASE_URL
const DEFAULT_DELAY = 100
const token = ""

export const getBanner = async (sdt) => {
  try {
    const response = await (
      await request(
        "POST",
        "khachhang/getBanner",
        {
          a: "",
        },
        token
      )
    ).json()
    if (response) {
      //console.log("khachhang/getBanner: ", response)
      return JSON.parse(response.message)
    } else {
      return [
        // { HinhAnh: 'https://geso.us/upload/images/Tin%20t%E1%BB%A9c/Chi%E1%BA%BFn%20l%C6%B0%E1%BB%A3c%20t%C4%83ng%20%C4%91%E1%BB%99%20bao%20ph%E1%BB%A7%20s%E1%BA%A3n%20ph%E1%BA%A9m%20nh%E1%BB%9D%20ph%E1%BA%A7n%20m%E1%BB%81m%20DMS.png' }
      ]
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }

  //return Banners
}

export const getListKM = async (userId, spId) => {
  try {
    const response = await (
      await request(
        "POST",
        "khuyenmai/getListKM",
        {
          userId: validateString(userId + "", true),
          spId: validateString(spId + "", true),
        },
        token
      )
    ).json()
    if (response.result) {
      let p = JSON.parse(response.message)
      store.dispatch("setListKM", p)
    } else {
      return []
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }
  //
}

export const getListCTTLXu = async (userId, spId) => {
  try {
    const response = await (
      await request(
        "POST",
        "khuyenmai/getListCTTLXu",
        {
          userId: validateString(userId + "", true),
          spId: validateString(spId + "", true),
        },
        token
      )
    ).json()
    if (response.result) {
      let p = response.content
      store.dispatch("setListCTTLXu", p)
    } else {
      return []
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }
  //
}

export const getListCTTLDiem = async (userId, spId) => {
  try {
    const response = await (
      await request(
        "POST",
        "khuyenmai/getListCTTLDiem",
        {
          userId: validateString(userId + "", true),
          spId: validateString(spId + "", true),
        },
        token
      )
    ).json()
    if (response.result) {
      store.dispatch("setListCTTLDiem", JSON.parse(response.content))
    } else {
      return []
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }
  //
}

export const getDataCusFromSevice = async (sdt) => {
  try {
    const response = await (
      await request("POST", "khachhang/getDataCusFromSevice", {
        sdt,
      })
    ).json()
    if (response.result) {
      const res = JSON.parse(response.message)
      return res
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }
  //
}

export const getDataCusFromId = async (id) => {
  try {
    const response = await (
      await request(
        "POST",
        "khachhang/getDataCusFromSevice",
        {
          id: id,
        }
        // ,
        // {userId}
      )
    ).json()

    if (response) {
       console.log("getDataCusFromSevice: ", response)
      const data = JSON.parse(response.message)
      return data
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return null
  }
  //
}

export const getDanhmucSp = async (sdt) => {
  // khai tạm vài cái
  try {
    const response = await (
      await request(
        "POST",
        "khachhang/getDanhmucSP",
        {
          a: "",
        },
        token
      )
    ).json()
    if (response) {
      console.log("khachhang/getDanhmucSP: ", response)

      return JSON.parse(response.message)
    } else {
      return []
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }
  //
}

export const getToken = async (accessToken) => {
  const Token = await new Promise((resolve) => {
    getAccessToken({
      success: (accessToken) => {
        // xử lý khi gọi api thành công
        console.log("accessToken", accessToken)
        resolve({ accessToken: accessToken || "" })
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error)
        reject({ error })
      },
    })
  })
  return Token
}

export const _getPhoneNumber = async (accessToken) => {
  const phonne = await new Promise((resolve, reject) => {
    getPhoneNumber({
      success: (data) => {
        let { token, number } = data
        // console.log("api getPhoneNumber zalo ", accessToken)
        // xử lý cho trường hợp sử dụng phiên bản Zalo mới (phiên bản lớn hơn 23.02.01)
        // if (token) {
        //   // const sdt = getPhoneNumberByToken(token, accessToken)
        //   resolve({ token })
        //   /// gọi API Server của bạn để truy xuất thông tin từ token và user access token
        //   // getDataCusFromSevice(number)
        // }
        resolve({ token: token || "" })
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error)
        reject({ error })
      },
    })
  })
  return phonne
}

export const login = async () => {
  try {
    const { userInfo } = await getUserInfo({})

    if (userInfo.id && userInfo.name) {
      return {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
      }
    }
  } catch (error) {
    console.error(error)
  }

  return {
    id: "",
    name: "",
    avatar: "",
  }
}

export const getZaloUserInfo = async () => {
  const user = await new Promise((resolve) => {
    getUserInfo({
      success: (data) => {
        // xử lý khi gọi api thành công
        const { userInfo } = data
        console.log("userInfo", userInfo)
        resolve({
          jwt: "access_token",
          id: userInfo.id,
          avatar: userInfo.avatar,
          name: userInfo.name,
        })
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error)
      },
    })
  })
  return user
}

export const getBlogs = async ({ userId }) => {
  console.log("getBlogs__", userId);
  
  try {
    const response = await (
      await request(
        "POST",
        "khachhang/getListSP",
        {
          userId: validateString(userId?.KHACHHANG_fk + "", true),
          spId: "",
        },
        {
          userId: validateString(userId?.KHACHHANG_fk + "", true),
          loai: 1,
          spId: "",
        },
      )
    ).json()

      console.log("getBlogs__", response);
    if (response) {
      console.log("khachhang/getListSP: ", response)
      let res = {
        blogs: [],
        total: 0,
      }
      res.blogs = JSON.parse(response.message)
      res.total = res.blogs.length
      return res
    } else {
      return []
    }
  } catch (error) {
    console.log("Error request api 2 ", error)
    return []
  }

  // let res = {
  //   blogs: [],
  //   total: 0,
  // }
  // if (id === undefined) {
  //   res.blogs = blogs.slice(skip, skip + limit)
  //   res.total = res.blogs.length
  // } else {
  //   res.blogs = blogs.filter((item) => item.id === id).slice(skip, skip + limit)
  //   res.total = res.blogs.length
  // }
  // return new Promise((resolve) => setTimeout(() => resolve(res), DEFAULT_DELAY))
}

export const getBlog = ({ id }) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject({ msg: "inivalid blog id" })
    } else {
      let blog = blogs.findOne((blog) => blog.id === id)
      if (blog) {
        setTimeout(() => {
          resolve(blog)
        }, DEFAULT_DELAY)
      } else {
        reject({ msg: "not found" })
      }
    }
  })
}

export const getCategories = () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(categories), DEFAULT_DELAY)
  )
}

export const getStories = async (payload) => {
  return new Promise((resolve) => setTimeout(() => resolve(stories), DEFAULT_DELAY))
}

export const CapNhatDonHang = async (khId) => {
  try {
    const { data, error } = await getAPI(
      "customer/capnhatdonhang",
      "POST",
      { khId },
      { khId }
    )
  } catch (err) {
    console.log(err)
  }
}

export const FetchInitData = async (userId) => {
  await getListKM(userId)
  await getListCTTLXu(userId)
  await getListCTTLDiem(userId)
  // getDataCusFromId(userId)
  return
}

export const follow = async () => {
  try {
    console.log("Following OA")
    await followOA({
      id: config.OA_ID,
    })
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error)
    // await closeMiniApp()
  }
  return
}

export const requestSendNotifications = async () => {
  try {
    console.log("request send notifications")
    await requestSendNotification({})
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error)
    // await closeMiniApp()
  }
  return
}

const closeMiniApp = async () => {
  try {
    await closeApp({})
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error)
  }
  return
}
