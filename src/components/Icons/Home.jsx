import React from "react"

const HomeIcon = ({ active }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#ff1926" }} />
        <stop offset="100%" style={{ stopColor: "#f54d56b8" }} />
      </linearGradient>
    </defs>
    <path
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 10.1503V17.9668C21 20.1943 19.2091 22 17 22H7C4.79086 22 3 20.1943 3 17.9668V10.1503C3 8.93937 3.53964 7.7925 4.46986 7.02652L9.46986 2.90935C10.9423 1.69689 13.0577 1.69688 14.5301 2.90935L19.5301 7.02652C20.4604 7.7925 21 8.93937 21 10.1503ZM15.25 17.25V19.5C15.25 20.0523 14.8023 20.5 14.25 20.5H9.75C9.19772 20.5 8.75 20.0523 8.75 19.5V17.25C8.75 15.4551 10.2051 14 12 14C13.7949 14 15.25 15.4551 15.25 17.25Z"
      fill={active ? "url(#homeGradient)" : "#7B8BB2"}
    />
  </svg>
)

export default HomeIcon
