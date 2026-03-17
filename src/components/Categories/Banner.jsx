import { Link, SkeletonBlock, useStore } from "zmp-framework/react"

import { getAPI } from "@utils/networking"
import store from "../../store"
import Category from "./Category"
import { Swiper } from "zmp-ui"
import { validateString } from "@utils/util"

const Banner = (props) => {
  const Banners = useStore("Banners")
  const { user, cusInfo } = props

  const handleClickBanner = async (bn) => {
    try {
      const { data, error } = await getAPI(
        "banner/tichXu",
        "POST",
        {
          id: validateString(bn.pk_seq + "", true),
          userId: validateString(cusInfo.KHACHHANG_fk + "", true),
        },
        {}
      )
      if (error) {
        console.error(data.message)
      } else {
        store.dispatch("setCusInfo", {
          ...cusInfo,
          xu: Number(cusInfo?.xu) + Number(data.content),
        })
        console.log(data.message)
      }
    } catch (ex) {
      console.error(ex)
    }
  }

  if (Banners && Banners.length > 0) {
    return (
      <Swiper
         dots={false}
        id="swiper"
        duration={6000}
        loop={true}
        effect={"fade"}
        slidesPerView="auto"
        autoplay={true}
        className="categories"
      >
        {Banners.map((bn, index) => (
          <Swiper.Slide key={index + ""}>
            <Link
              style={{
                width: "100%",
                height: "100%",
              }}
              onClick={() => handleClickBanner(bn)}
            >
              <Category
                url={bn.HinhAnh}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
          </Swiper.Slide>
        ))}
      </Swiper>
    )
  }

  return (
    <SkeletonBlock
      effect="wave"
      width="100%"
      style={{ height: "170px", borderRadius: 24 }}
    />
  )
}

export default Banner
