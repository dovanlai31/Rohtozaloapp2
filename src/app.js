// Import React and ReactDOM
import React from "react"
import ReactDOM from "react-dom"

// Import ZMP
import ZMP from "zmp-framework/core/lite-bundle"

// Import ZMP-React Plugin
import ZMPReact from "zmp-framework/react"

// Import ZMP Styles
import "zmp-framework/zmp-bundle.min.css"

// Import Icons and App Custom Styles
import "./styles/icons.css"
import "./styles/app.scss"
import "./styles/tailwind.css"
// Import App Component
import App from "./components/app.jsx"
import appConfig from "../app-config.json"
import "zmp-ui/zaui.css"
import "./styles/FixZmp-framework.css";
// Import MomentJs and setLocale
import moment from "moment"
import "moment/locale/vi"
import { SnackbarProvider } from "zmp-ui"

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig
}

// Init ZMP React Plugin
ZMP.use(ZMPReact)

moment.locale("vi")

ReactDOM.render(
  React.createElement(SnackbarProvider, null, React.createElement(App)),
  document.getElementById("app")
)

