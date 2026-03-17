import { useState } from "react"

const SanPham = ({ zmproute }) => {
    const { loai = 0, kmId = "", title = "Sản phẩm khuyến mãi" } = zmproute

    const [sanpham, setSanpham] = useState()

    return(
        <Page
            onPageBeforeIn={() => {
                zmp.toolbar.hide("#main-nav")
            }}
            className="detail-page"
            style={{ background: "#f8f8f8" }}
        >
            <Header back>{title}</Header>

        </Page>
    )
}

export default SanPham