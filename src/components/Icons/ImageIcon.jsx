import React from "react";

function ImageIcon({
  style = {},
  fill = "#000",
  width = "24px",
  height = "28px",
  className = "",
  viewBox = "0 0 24 28"
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill={fill} transform="translate(-360 -99)">
          <path d="M368 109a2 2 0 11.001-4.001A2 2 0 01368 109zm0-6a4 4 0 100 8 4 4 0 000-8zm22 13.128L384 110l-9.941 10.111L370 116l-8 7.337V103a2 2 0 012-2h24a2 2 0 012 2v13.128zM390 127a2 2 0 01-2 2h-5.168l-7.368-7.465 8.536-8.536 6 6V127zm-26 2a2 2 0 01-2-2v-.939l7.945-7.116L380.001 129H364zm24-30h-24a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4v-24a4 4 0 00-4-4z"></path>
        </g>
      </g>
    </svg>
  );
}

export default ImageIcon;
