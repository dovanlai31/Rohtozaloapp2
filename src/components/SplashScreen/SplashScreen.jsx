import React from "react"
import Logo from "@static/images/logo.png"
export default () => {
  return (
    <div className="splash-screen">
      <div className="logo">
        <img loading="lazy" src={Logo} alt="ZMP Blog" />
      </div>
    </div>
  )
}
