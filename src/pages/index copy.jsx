import { useEffect } from "react"
import { Page } from "zmp-framework/react"
// import useKeepPositionScroll from "@hooks/useKeepPositionScroll"
const HomePage = () => {
  //const user = useStore("user")
  // useKeepPositionScroll()

  useEffect(() => {
    // if (!store.getters["stories"].value.length) {
    //   store.dispatch("getStories")
    // }
    // if (!store.getters["categories"].value.length) {
    //   store.dispatch("getCategories")
    // }
    // if (!store.getters["latestBlogs"].value.data.length) {
    //   store.dispatch("getLatestBlogs", { limit: 20, skip: 0, reset: true })
    // }
  }, [])

  const fetchData = (done) => {
    // store.dispatch("getStories")
    // store.dispatch("getCategories")
    // store.dispatch("getLatestBlogs", {
    //   limit: 20,
    //   skip: 0,
    //   reset: true,
    //   showSkeleton: true,
    // })
    // if (done) {
    //   done()
    // }
  }

  return (
    <Page ptr onPtrRefresh={fetchData} name="home" className="home-page">
      {/* <NavigationBar active="/" /> */}
      {/* <Box m="0" px="10" mt="10">
        <Box m="0" flexDirection="row" justifyContent="space-between">
          <Box m="0">
            {user && (
              <Text size="xlarge" className="text-blue-dark-text">
                Hi, {user.firstName}!
              </Text>
            )}
            <Title size="large" className="font-extrabold text-blue-dark">
              Explore today’s
            </Title>
          </Box>
          <NotificationIcon hasNotification />
        </Box>
      </Box>
      <Box m="0" pt="5" px="0">
        <Stories />
      </Box>
      <Box m="0" pt="5" px="0">
        <Categories />
      </Box>
      <Box m="0">
        <Latest />
      </Box> */}
    </Page>
  )
}
export default HomePage
