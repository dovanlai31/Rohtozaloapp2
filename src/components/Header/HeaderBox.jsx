import { Box, Button, Icon, Text } from "zmp-framework/react"

const HeaderBox = ({
  iconName = "",
  icon = <></>,
  HeaderBoxName = "",
  customBox = null,
  bottomOnPress,
}) => {
  return (
    <Box
      className="HeaderBox pt-st"
      noSpace={true}
      flex
      alignItems="center"
      justifyContent="space-between"
      slot="fixed"
      //  style={{ height: 150 }}
    >
      <Box flex alignItems="center" >
        {!bottomOnPress ? (
          <Box style={{ background: "#dcedf7dc", borderRadius: 5 }} p={2}>
            {iconName.length > 0 ? (
              <Icon className="text-blue-imex" icon={iconName} />
            ) : (
              icon
            )}
          </Box>
        ) : (
          <Button onClick={bottomOnPress} className="RoundIcon3">
            {iconName.length > 0 ? (
              <Icon
                color="black"
                size={20}
                style={{ fontWeight: "bold", margin: 0, padding: 0 }}
                zmp={iconName}
              />
            ) : (
              icon
            )}
          </Button>
        )}

        <Box pl={2}>
          {customBox ? (
            customBox
          ) : (
            <Box style={{ width: "200px" }}>
              <Text
                size="large"
                style={{ fontWeight: "bold" }}
                className="text-blue-imex my-0 overflow-ellipsis overflow-hidden whitespace-nowrap"
              >
                {HeaderBoxName}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default HeaderBox
