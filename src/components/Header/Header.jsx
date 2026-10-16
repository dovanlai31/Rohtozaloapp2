import AppHeader from "./AppHeader"

export const Header = ({ title, back, children, force = false }) => {
  if (!title && !children) return null

  return <AppHeader title={children || title} back={!!back} force={force} />
}

Header.displayName = "zmp-navbar"
export default Header
