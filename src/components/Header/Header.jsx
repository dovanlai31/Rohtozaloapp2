import { Box, Icon, Link, Text } from "zmp-framework/react"

export const Header = ({ title, back, children, force = false }) => {
  if (!title && !children) return null

  const titleContent = children || title

  return (
    <Box
      className="HeaderBoxC"
      noSpace={true}
      flex
      alignItems="center"
      justifyContent="space-between"
      slot="fixed"
      style={{ height: 150 }}
    >
      <Box flex alignItems="center" m={5} py={7}>
        <Box flex justifyContent="space-between" m="0">
          <Box m={0} flex justifyContent="center" alignItems="center">
            {back && (
              <Link back={back} force={force} className="RoundIcon3">
                <Icon
                  color="black"
                  size={20}
                  style={{ fontWeight: "bold" }}
                  zmp="zi-chevron-left-header"
                ></Icon>
              </Link>
            )}
            <Box pl={2}>
              <Box style={{ width: "200px" }}>
                <Text
                  size="large"
                  style={{ fontWeight: "bold" }}
                  className="text-blue-imex my-0 overflow-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {titleContent}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

Header.displayName = "zmp-navbar"
export default Header
