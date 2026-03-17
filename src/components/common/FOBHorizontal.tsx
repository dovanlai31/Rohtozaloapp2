import React from "react"
import { Button, Icon } from "zmp-ui"
import { ButtonProps } from "zmp-ui/button"
import { IconProps } from "zmp-ui/icon"

type Props = {
  buttons: Buttons[]
  containerStyle?: React.CSSProperties
  position?: "top" | "bottom"
}

type States = {}

type Buttons = {
  variant?: ButtonProps["variant"]
  icon?: IconProps["icon"]
  iconStyle?: {
    size?: number
    color?: string
  }
  text?: string
  containerStyle?: React.CSSProperties
  buttonStyle?: React.CSSProperties
  textStyle?: React.CSSProperties
  type?: ButtonProps["type"]
  onClick?: () => void
}

class FOBHorizontal extends React.PureComponent<Props, States> {
  constructor(props: Props) {
    super(props)
  }

  render(): React.ReactNode {
    const { buttons, containerStyle, position } = this.props

    return (
      <div
        style={{
          ...containerStyle,
          position: "fixed",
          left: 0,
          top: position === "top" ? 32 : "",
          bottom: position === "bottom" ? 32 : "",
          width: "100%",
          height: 50,
          paddingInline: 16,
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        {buttons.map((item: Buttons, index: number) => (
          <Button
            type={item.type || "highlight"}
            variant={item?.variant || "primary"}
            style={{ ...item.containerStyle }}
            prefixIcon={
              item?.icon && (
                <Icon
                  icon={item?.icon}
                  size={item?.iconStyle?.size || 20}
                  style={{
                    color: item?.iconStyle?.color || "#FFF",
                    fontWeight: "bold",
                  }}
                />
              )
            }
            onClick={() => item.onClick && item.onClick()}
          >
            <span style={{ position: "relative", top: 1.5, fontWeight: "bold" }}>
              {item?.text}
            </span>
          </Button>
        ))}
      </div>
    )
  }
}

export default FOBHorizontal
