import SuccessButton from "@components/common/SuccessButton"
import React, { useState } from "react"
import { Icon, Link, List, Text } from "zmp-framework/react"
import Logo from "../../static/images/logoMain.webp"

type IProps = {
  login?: (username: string, password: string) => void
  signup?: (value: number) => void
  error?: {
    username: false
    password: false
  }
}

const LoginComponent: React.FC<IProps> = ({ login, signup, error }) => {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  return (
    <List
      form
      id="my-form"
      className="login_background"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 9999,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        listStyle: "none",
        margin: 0,
      }}
    >
      <div style={{ margin: "0 auto", marginTop: 128 }}>
        <img
          src={Logo}
          width={"300"}
          style={{
            alignItems: "center",
            textAlign: "center",
            padding: "8px 24px",
          }}
        ></img>
        <Text style={{ marginBottom: 128 }}>
          *App dành cho đại lý của <b style={{ color: "#539000" }}>Nutifood</b>
        </Text>
      </div>
      <div style={{ position: "relative", margin: "8px 24px" }}>
        <Icon
          zmp="zi-members-solid"
          style={{ position: "absolute", left: 12, top: "50%", translate: "0 -50%" }}
        />
        <input
          type="number"
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
          // readOnly
          style={{
            width: "100%",
            background: "#fff",
            paddingLeft: 52,
            borderWidth: error.username ? 2 : 0,
            borderColor: "#d73f3b",
          }}
          placeholder="Nhập số điện thoại"
          required
        ></input>
      </div>
      <div style={{ position: "relative", margin: "8px 24px" }}>
        <Icon
          zmp="zi-lock-solid"
          style={{ position: "absolute", left: 12, top: "50%", translate: "0 -50%" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          // readOnly
          style={{
            width: "100%",
            background: "#fff",
            paddingLeft: 52,
            borderWidth: error.password ? 2 : 0,
            borderColor: "#d73f3b",
          }}
          placeholder="Nhập mật khẩu"
          required
        ></input>
      </div>
      <Link
        href="#"
        onClick={() => signup(0)}
        style={{
          alignSelf: "flex-end",
          marginRight: 24,
          textDecoration: "underline",
          color: "#136f43",
          fontWeight: "bold",
          fontSize: 13,
          marginTop: 8,
        }}
        noLinkClass
      >
        Đăng ký
      </Link>
      <SuccessButton
        title="Đăng nhập"
        icon="zi-send-solid"
        styles={{
          marginTop: 32,
          background: "#136f43",
          color: "#fff",
          fontSize: 18,
        }}
        typeName="primary"
        onClick={() => login(username, password)}
      />
    </List>
  )
}

export default LoginComponent
