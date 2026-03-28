import { createStore } from "zmp-core/lite"
import { zmp } from "zmp-framework/react"

import {
  getBlog,
  getBlogs,
  getCategories,
  getStories,
  login,
  getToken,
  getBanner,
  _getPhoneNumber,
  getDanhmucSp,
  getListKM,
  getListCTTLXu,
} from "./services/services"
import { getAPI } from "@utils/networking"

const store = createStore({
  state: {
    logged: false,
    jwt: null,
    user: null,
    loadingCategories: false,
    loadingBlogs: false,
    scrollPosition: [],
    latestBlogs: {
      limit: 10,
      skip: 0,
      data: [],
      hasMore: false,
    },
    loadingStories: false,
    stories: [],
    onboarding: true,
    Token: "",
    PhoneNumner: "",
    banners: [],
    categories: [],
    CurentProduct: null,
    ListGiohang: [],
    ListKM: [],
    ListCTTLXu: [],
    ListCTTLDiem: [],
    ListTrungBay: [],
    ListCTTrungBay: [],
    ListKhaoSat: [],
    refres: "1",
    // dl từ api geso trả về
    CusInfo: {
      zaloID: "",
      active: "0",
      KHACHHANG_fk: 0,
      DDKD_FK: 0,
      DIENTHOAI: "",
      tenkh: "",
      xu: 0,
      diem: 0,
      mafast: "",
      mucduyet: 0,
    },
    Videos: [],
  },

  getters: {
    getLogged({ state }) {
      return state.logged
    },
    getCusInfo({ state }) {
      return state.CusInfo
    },
    getGioHang({ state }) {
      return state.ListGiohang
    },
    getCurentProduct({ state }) {
      return state.CurentProduct
    },
    PhoneNumner({ state }) {
      return state.PhoneNumner
    },
    categories({ state }) {
      return state.categories
    },
    scrollPosition({ state }) {
      return state.scrollPosition
    },
    user({ state }) {
      return state.user
    },

    loadingCategories({ state }) {
      return state.loadingCategories
    },
    latestBlogs({ state }) {
      return state.latestBlogs
    },
    loadingBlogs({ state }) {
      return state.loadingBlogs
    },
    stories({ state }) {
      return state.stories
    },
    loadingStories({ state }) {
      return state.loadingStories
    },
    jwt({ state }) {
      return state.jwt
    },
    onboarding({ state }) {
      return state.onboarding
    },
    Banners({ state }) {
      return state.banners
    },
    Token({ state }) {
      return state.Token
    },
    getPhoneNumner({ state }) {
      return state.PhoneNumner
    },
    ListKM({ state }) {
      return state.ListKM
    },
    ListCTTLXu({ state }) {
      return state.ListCTTLXu
    },
    ListCTTLDiem({ state }) {
      return state.ListCTTLDiem
    },
    refres({ state }) {
      return state.refres
    },
    getListTrungBay({ state }) {
      return state.ListTrungBay
    },
    getListCTTrungBay({ state }) {
      return state.ListCTTrungBay
    },
    getListKhaoSat({ state }) {
      return state.ListKhaoSat
    },
    getVideos({ state }) {
      return state.Videos
    },
  },
  actions: {
    setLogged({ state }, data) {
      state.logged = data
    },
    setScrollPosition({ state }, data) {
      state.scrollPosition = data
    },
    setOnboarding({ state }, onboarding) {
      state.onboarding = onboarding
    },
    setUser({ state }, user) {
      state.user = user
    },
    setRefres({ state }, data) {
      state.refres = data
    },
    setToken({ state }, Token) {
      state.Token = Token
    },
    setJwt({ state }, jwt) {
      state.jwt = jwt
    },
    setBanners({ state }, banners) {
      state.banners = banners
    },
    setCategories({ state }, categories) {
      state.categories = categories
    },
    setPhoneNumber({ state }, number) {
      state.PhoneNumner = number
    },
    setCusInfo({ state }, data) {
      state.CusInfo = data
    },
    setListKM({ state }, ListKM) {
      state.ListKM = ListKM
    },
    setListCTTLXu({ state }, ListCTTLXu) {
      state.ListCTTLXu = ListCTTLXu
    },
    setListCTTLDiem({ state }, ListCTTLDiem) {
      state.ListCTTLDiem = ListCTTLDiem
    },
    SetCurentProduct({ state }, CurentProduct) {
      state.CurentProduct = CurentProduct
    },
    async SetAddGioHang({ state }, pr) {
      const arr = state.ListGiohang.filter((w) => w.id != pr.id)
      arr.push(pr)
      console.log('ListGiohang___',arr)
      state.ListGiohang = arr
      return true 
    },
    remoteItemGioHang({ state }, id) {
      const arr = state.ListGiohang.filter((w) => w.id != id)
      state.ListGiohang = arr
    },
    remoteAllGioHang({ state }, id) {
      state.ListGiohang = []
    },
    async  AddAllGioHang({ state }, list) {
      state.ListGiohang = list
    },
    updateGiohang({ state }, item) {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx lai ", item)
      let index = state.ListGiohang.findIndex((w) => w.id == item.id)
      //let newgh =  state.ListGiohang;
      state.ListGiohang[index] = item

      //  state.ListGiohang=newgh;
    },
  

    setListTrungBay({ state }, list) {
      state.ListTrungBay = list
    },
    setVideos({ state }, list) {
      state.Videos = list
    },
    //
    async getLatestBlogs({ state }, { skip, limit, showSkeleton, reset = false }) {
     
      if (showSkeleton) {
        state.loadingBlogs = true
      }
      console.log('_getLatestBlogs', state.CusInfo,);
      const { blogs } = await getBlogs({ userId: state.CusInfo })
      state.latestBlogs = {
        skip,
        limit,
        data: reset ? [...blogs] : [...state.latestBlogs.data, ...blogs],
        hasMore: blogs.length && blogs.length === limit,
      }
      if (showSkeleton) {
        state.loadingBlogs = false
      }
    },
    async getCategories({ state }) {
      // state.loadingCategories = true
      //const categories = await getCategories()
      // state.categories = categories
      // state.loadingCategories = false
    },
    async getStories({ state }) {
      state.loadingStories = true
      const stories = await getStories()
      state.stories = stories

      state.loadingStories = false
    },
    async login({ dispatch }) {
      const user = await login()
      if (user) {
        dispatch("setUser", user)
      }
    },
    async getToken({ dispatch }) {
      const Token = await getToken()
      if (Token) {
        dispatch("setToken", Token)
      }
    },

    async getBanner({ dispatch }) {
      const Banners = await getBanner()
      if (Banners) {
        dispatch("setBanners", Banners)
      }
    },
    async getListKM({ state }) {
      const ListKM = await getListKM(state.CusInfo?.KHACHHANG_fk, "")
      if (ListKM) {
        state.ListKM = ListKM
        //dispatch("setListKM", ListKM)
      }
    },
    async getDanhmucSp({ state }) {
      const DanhmucSp = await getDanhmucSp()
      if (DanhmucSp) {
        state.categories = DanhmucSp
      }
    },
    async getPhoneNumner({ state }) {
      const PhoneNumner = await _getPhoneNumber(state.Token)
      if (PhoneNumner) {
        state.PhoneNumner = PhoneNumner
      }
    },
    getListTrungBay({ state }) {
      const param = {
        dienthoai: state.PhoneNumner,
      }

      const url = "trungbay/getTrungBay"
      return getAPI(url, "POST", param, param)
        .then(({ data, error }) => {
          if (error) {
            // zmp.dialog.create({
            //   title: "Thông báo",
            //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
            //   buttons: [
            //     {
            //       text: "Đóng",
            //     },
            //   ],
            //   destroyOnClose: true
            // }).open()
          } else {
            if (data.message.includes("Info")) {
              zmp.dialog
                .create({
                  title: "Thông báo",
                  content: '<div className="dialog-text">' + data.message + "</div>",
                  buttons: [
                    {
                      text: "Đóng",
                    },
                  ],
                  destroyOnClose: true,
                })
                .open()
            } else {
              state.ListTrungBay = data.content
            }
          }
        })
        .catch((err) => {
          // zmp.dialog.create({
          //   title: "Thông báo",
          //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
          //   buttons: [
          //     {
          //       text: "Đóng",
          //     },
          //   ],
          //   destroyOnClose: true
          // }).open()
        })
    },
    getListCTTrungBay({ state }) {
      const url = "trungbay/getCTTrungBay"
      return getAPI(url, "POST", {}, {})
        .then(({ data, error }) => {
          if (error) {
            // zmp.dialog.create({
            //   title: "Thông báo",
            //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
            //   buttons: [
            //     {
            //       text: "Đóng",
            //     },
            //   ],
            //   destroyOnClose: true
            // }).open()
          } else {
            if (data.message.includes("Info")) {
              zmp.dialog
                .create({
                  title: "Thông báo",
                  content: '<div className="dialog-text">' + data.message + "</div>",
                  buttons: [
                    {
                      text: "Đóng",
                    },
                  ],
                  destroyOnClose: true,
                })
                .open()
            } else {
              state.ListCTTrungBay = data.content
            }
          }
        })
        .catch((err) => {
          // zmp.dialog.create({
          //   title: "Thông báo",
          //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
          //   buttons: [
          //     {
          //       text: "Đóng",
          //     },
          //   ],
          //   destroyOnClose: true
          // }).open()
        })
    },
    getListKhaoSat({ state }) {
      const url = "khaosat/getKhaoSat"
      return getAPI(url, "POST", {}, {})
        .then(({ data, error }) => {
          if (error || !data.result) {
            console.error(data)
          } else {
            if (data.message.includes("Info")) {
              console.log(data.message)
            } else {
              console.log(data.content)
              state.ListKhaoSat = JSON.parse(data.content)
            }
          }
        })
        .catch((err) => {
          // zmp.dialog.create({
          //   title: "Thông báo",
          //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
          //   buttons: [
          //     {
          //       text: "Đóng",
          //     },
          //   ],
          //   destroyOnClose: true
          // }).open()
          console.error(err)
        })
    },
    getListVideos({ state }) {
      const url = "video/getListVideos"
      return getAPI(url, "POST", {}, {})
        .then(({ data, error }) => {
          if (error) {
            // zmp.dialog.create({
            //   title: "Thông báo",
            //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
            //   buttons: [
            //     {
            //       text: "Đóng",
            //     },
            //   ],
            //   destroyOnClose: true
            // }).open()
          } else {
            state.Videos = data.content
          }
        })
        .catch((err) => {
          // zmp.dialog.create({
          //   title: "Thông báo",
          //   content: '<div className="dialog-text">Error. Lỗi hệ thống. Xin vui lòng liên hệ Admin để được hỗ trợ.</div>',
          //   buttons: [
          //     {
          //       text: "Đóng",
          //     },
          //   ],
          //   destroyOnClose: true
          // }).open()
        })
    },
  },
})

export default store
