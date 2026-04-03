import { FaStore } from "react-icons/fa"
import { Box, Link, Text } from "zmp-framework/react"

export default function AccountHeader({ phoneNumber }) {
  const show = phoneNumber && phoneNumber.length > 2

  return (
    <Box
      className="HeaderBox pt-st bg-slate-50/95 backdrop-blur-sm"
      noSpace={true}
      flex
      alignItems="center"
      justifyContent="space-between"
      slot="fixed"
    >
      <Box flex alignItems="center">
        <Box flex justifyContent="space-between" m="0">
          <Box m={0} flex justifyContent="center" alignItems="center">
            <Link>
              {show && (
                <Box
                  flex
                  className="items-center justify-center gap-1.5 rounded-[10px] bg-blue-50/80 px-2.5 py-1.5"
                >
                  <FaStore size={22} className="shrink-0 text-primary" />
                  <Text
                    className="view-center !mt-0 text-[17px] font-medium text-primary"
                    size="xsmall"
                  >
                    {"" + phoneNumber + " "}
                  </Text>
                </Box>
              )}
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
