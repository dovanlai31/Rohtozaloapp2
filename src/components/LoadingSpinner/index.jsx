import iconSalesUp from "@static/images/salesup.png"
import { Box, Preloader } from "zmp-framework/react"
import "../../styles/giohang.scss"

export default function LoadingSpinner({ isMargin = true }) {
  return (
    <Box my={isMargin ? "4" : "0"}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Preloader size={35} logo={iconSalesUp} />
      </div>
    </Box>
    // <div className="spinner-container">
    //   <div className="loading-spinner"></div>
    // </div>
  )
}
