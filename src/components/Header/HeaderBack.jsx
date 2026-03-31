import { Box, Icon, Link, Text } from "zmp-framework/react"

const HeaderBack = ({ title, force = true }) => {
  return (
    <Box
      className="HeaderBox pt-st"
      noSpace={true}
      flex
      alignItems="center"
      justifyContent="space-between"
      slot="fixed"
    // style={{ height: 150 }}
    >
      <Box flex alignItems="center" m={5} className="!mb-0">
        <Box flex justifyContent="space-between" m="0">
          <Box
            m={0}
            flex
            justifyContent="center"
            alignItems="center"
          >
            <Link back force={force} className="RoundIcon3">
              <Icon color="black" size={20} zmp="zi-chevron-left-header"></Icon>
            </Link>
            <Box >
              <Box style={{ width: "200px" }}>
                <Text
                  size="large"
                  style={{ fontWeight: "bold" }}
                  className={`!font-extrabold text-primary `}
                // className="text- -imex my-0 overflow-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {title}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HeaderBack
