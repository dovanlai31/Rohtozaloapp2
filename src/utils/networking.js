// const url = 'https://salesup.com.vn:61266/'//test 
// const url = 'https://dms2.imexpharm.com:3524/'//thậts
// const url = "https://salesup.com.vn:61266/" //test
//const url = "https://pgms.nutifood.net:4123/" //thật
 const url = "https://dms.opcpharma.com:1238/" //thật

// link ảnh https://dms1.imexpharm.com:9443/

function objToQueryString(obj) {  const keyValuePairs = []
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
  }
  return keyValuePairs.join("&")
}
export function getAPI(api, method = "GET", body, paramater) {
  // eslint-disable-next-line func-names
  return new Promise(function (resolve, reject) {
    try {
      //console.log('api xxxxxx 2 :  ' + api, body,paramater,accessToken);
      //console.log('api accessToken :  ' ,accessToken);
      var queryString = ""
      if (paramater != null) {
        queryString = objToQueryString(paramater)
      }

      if (queryString.length > 0) {
        queryString = "?" + queryString
      }
      console.log("queryString :  " + api, queryString)
      fetch(`${url}${api}${queryString}`, {
        method,
        ...(body
          ? {
              body: JSON.stringify(body),
            }
          : {}),
        headers: {
          "Content-Type": "application/json",
          userId: "Bearer", // `Bearer ${token.accessToken}`,
        },
        //redirect: 'follow',
      })
        .then((response) => {
          const { status } = response
          console.log(" fetch api  ", response)
          // if (status === 401 || status === 403) {
          //   console.log('lõi fetch api 401 ' + `${api}`);
          //   // store.dispatch(actions.account.setUserData(null));
          // }
          response
            .json()
            .then((data) => {
              let res = {
                data: data,
                error: false,
              }
              console.log(`${api} response`, { res, body })
              resolve(res)
            })
            .catch((e) => {
              //alert(JSON.stringify(response));
              console.log("error xxx", e)
              if (status === 200) {
                resolve()
                return
              }
              reject({ message: "Remote server fail with status " + status })
            })

          //response.text();
        })
        .catch((err) => {
          // console.log('There is an error occurred while requesting api', err, api)
          console.log("err 22", err)
        })
    } catch (error) {
      console.log("err 223", error)
      let res = {
        data: error,
        error: false,
      }
      reject(res)
    }
  })
}

export const request = async (method, api, data, paramater) => {
  //console.log('token',token)
  const headers = {
    "Content-Type": "application/json",
    userId: "Bearer", // `Bearer ${token.accessToken}`,
  }

  // if (token) {
  //   headers.Authorization = `Bearer ${token.accessToken}`
  // }
  console.log(api, data)
  
  var queryString = ""
  if (paramater != null) {
    queryString = objToQueryString(paramater)
  }

  if (queryString.length > 0) {
    ;(queryString = "?" + queryString),
      console.log("queryString :  " + api, queryString)
  }
  console.log('Link__request>>>>>>>>>>>>>> ', `${url}${api}${queryString}`, 'data__>>>>>>>> ', data);
  return fetch(`${url}${api}${queryString}`, {
    method: method,
    body: JSON.stringify(data),
    headers,
    //credentials: 'include'
    redirect: "follow",
  })
}

export const request2 = async (method, api, data, paramater) => {
  //console.log('token',token)
  var myHeaders = new Headers()
  myHeaders.append("userId", "s")
  myHeaders.append("Content-Type", "application/json")

  // if (token) {
  //   headers.Authorization = `Bearer ${token.accessToken}`
  // }
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: "follow",
  }

  return fetch(`${url}${api}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error))
}

export const request3 = async (your_user_access_token, your_token) => {
  return new Promise(function (resolve, reject) {
    const endpoint = "https://graph.zalo.me/v2.0/me/info"
    const userAccessToken = your_user_access_token.accessToken
    const token = your_token
    const secretKey = "YkE0TOHp2pG5lhECDK27"

    var requestOptions = {
      method: "GET",
      headers: {
        access_token: userAccessToken,
        code: token,
        secret_key: secretKey,
      },
    }

    console.log(" options xxxx ", {
      access_token: userAccessToken,
      code: token,
      secret_key: secretKey,
    })

    fetch(`${endpoint}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        console.log("err 223", error)
        let res = {
          data: error,
          error: true,
          message: "lõi",
        }
        reject(res)
      })
  })
}
export const zaloErrorMessages = {
  "-1400": "Tham số truyền vào [API] không hợp lệ.",
  "-1401": "Người dùng chưa xác thực. Vui lòng gọi getAccessToken trước.",
  "-1403": "Bạn chưa xin quyền trong Quản lý ứng dụng (Developer Console).",
  "-1404": "Phiên bản Zalo không hỗ trợ API này. Vui lòng cập nhật Zalo.",
  "-1408": "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.",
  "-2000": "Lỗi không xác định. Vui lòng thử lại sau.",
  "-2001": "ID truyền vào [API] không hợp lệ.",
  "-2002": "Người dùng đã từ chối cấp quyền trước đó và không muốn hỏi lại.",
  "-2003": "Người dùng đã hủy thao tác chọn media.",
  "-2004": "Không thể chọn media. Kiểm tra lại kết nối mạng.",
  "-2005": "Không thể lưu ảnh vào thư viện.",
  "-2006": "Không thể lưu video vào thư viện.",
  "-201": "Người dùng từ chối cấp quyền truy cập.",
  "-202": "Người dùng từ chối và chọn không hỏi lại.",
  "-203": "Bạn đã vượt quá giới hạn gọi [API]. Vui lòng thử lại sau.",
  "-301": "Thiết bị của bạn đã hết dung lượng lưu trữ.",
  "-302": "Không tìm thấy file. Đường dẫn sai hoặc không tồn tại.",
  "-304": "hông có kết nối Internet.",
  "-305": "Tải file thất bại. Kiểm tra kết nối mạng.",
  "-306": "Định dạng file không được hỗ trợ.",
  "114": "Tham số code truyền vào đang bị rỗng.",
  "115": "Tham số code không hợp lệ.",
  "116": "secret_key bị rỗng.",
  "117": "secret_key không hợp lệ.",
  "118": "Code không hợp lệ hoặc không thuộc ứng dụng.",
  "119": "Code đã được sử dụng trước đó.",
  "100": "Lỗi không xác định khi xác thực sinh trắc học.",
  "101": "Xác thực thất bại 3 lần trên Android.",
  "102": "Người dùng hủy xác thực.",
  "103": "Người dùng chọn nhập mật khẩu trên iOS.",
  "108": "Bạn đã bị khóa chức năng xác thực sinh trắc học.",
}

export const requestWithAbortController = async (
  method,
  api,
  data,
  paramater,
  abortController
) => {
  //console.log('token',token)
  const headers = {
    "Content-Type": "application/json",
    userId: "Bearer", // `Bearer ${token.accessToken}`,
  }

  // if (token) {
  //   headers.Authorization = `Bearer ${token.accessToken}`
  // }
  var queryString = ""
  if (paramater != null) {
    queryString = objToQueryString(paramater)
  }

  // if (queryString.length > 0) {
  //   ;(queryString = "?" + queryString),
  //     console.log("queryString :  " + api, queryString)
  // }

  return fetch(`${url}${api}${queryString}`, {
    method: method,
    body: JSON.stringify(data),
    headers,
    //credentials: 'include'
    redirect: "follow",
    signal: abortController.current.signal,
  })
}

export function formatCurrency(value, hideVND) {
  try {
    try {
      if (hideVND) {
        value = new Intl.NumberFormat("en-US").format(parseFloat(value))
      } else {
        value = value.toLocaleString("en-US", { style: "currency", currency: "VND" })
        return value.replace(/(.*)(₫)(.*)/, "$1$3 $2")
      }
      return value
    } catch (ex) {}
  } catch (error) {
    console.log("formatCurrency" + error, error)
    return value
  }
}
