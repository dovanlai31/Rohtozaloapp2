import AppHeader from "@components/Header/AppHeader"

// Header các màn POSM: nút quay lại + tiêu đề + nút phụ (vd. "Tải lại", "Lưu")
const PosmHeader = ({ title, rightText, onRightClick }) => {
  return <AppHeader title={title} back force rightText={rightText} onRightClick={onRightClick} />
}

PosmHeader.displayName = "zmp-navbar"
export default PosmHeader
