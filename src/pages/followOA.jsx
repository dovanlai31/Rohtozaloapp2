import NavigationBar from "@components/NavigationBar"
import { Box, Card, Icon, Link, Page, Text, zmp } from "zmp-framework/react"
const followOA = ({ zmproute }) => {
  return (
    <Page
      className="menu-page"
      onPageBeforeIn={() => {
        zmp.toolbar.hide("#main-nav")
        //zmp.tab.show("#view-giohang")
      }}
      // className="detail-page"
    >
      <NavigationBar active={zmproute.path} />
      <Box className="btnClose">
        <Link back>
          <Icon color="black" zmp="zi-chevron-left-header"></Icon>
        </Link>
      </Box>
      <Card inset title="article">
        <Box textAlign="center">
          <Text>followOA soon</Text>
        </Box>
      </Card>
    </Page>
  )
}
export default followOA
