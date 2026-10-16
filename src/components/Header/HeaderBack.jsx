import AppHeader from "./AppHeader"

const HeaderBack = ({ title, force = true }) => {
  return <AppHeader title={title} back force={force} />
}

HeaderBack.displayName = "zmp-navbar"
export default HeaderBack
