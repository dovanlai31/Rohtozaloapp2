import React from "react"
import { Icon, zmp } from "zmp-framework/react"
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"
import { renderToStaticMarkup } from "react-dom/server"

export type withOverlayProps = {
  showToast: (
    text: string,
    type?: "danger" | "success" | "info",
    duration?: number,
    position?: "top" | "bottom"
  ) => void
  showDialog: () => void
}

const withOverlay = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P & withOverlayProps> => {
  const showToast = (
    text: string,
    type: "danger" | "success" | "info" = "info",
    duration: number = 1000,
    position: "top" | "bottom" = "bottom"
  ) => {
    let icon: React.ReactElement
    let bgColor = ""

    switch (type) {
      case "success":
        icon = <FaCheckCircle color="white" />
        bgColor = "bg-green-600 bg-opacity-90"
        break
      case "danger":
        icon = <FaTimesCircle color="white" />
        bgColor = "bg-red-600 bg-opacity-90"
        break
      case "info":
      default:
        icon = <FaInfoCircle color="white" />
        bgColor = "bg-blue-600 bg-opacity-90"
        break
    }

    const iconHTML = renderToStaticMarkup(icon)

    zmp.toast.show({
      closeButton: false,
      closeTimeout: duration,
      text: `
        <div style="display: flex; align-items:  center; gap: 0.5rem;">
          ${iconHTML}
          <Text style="font-size: 13px;">${text}</Text>
        </div>
      `,
      position: position || "bottom",
      destroyOnClose: true,
      cssClass: `${bgColor}`,
    })
  }

  const showDialog = () => {
    // Tùy chọn custom dialog sau này
  }

  return (props: P) => {
    return (
      <WrappedComponent
        {...props}
        showToast={showToast}
        showDialog={showDialog}
      />
    )
  }
}

export default withOverlay
