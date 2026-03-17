import React from "react";

function Department({
    fill = "#000",
    width = 30,
    height = 30
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox="-2 0 16 16"
    >
      <path
        d="M323.5-192h-9a1.5 1.5 0 00-1.5 1.5v14.5h12v-14.5a1.5 1.5 0 00-1.5-1.5zm-5.5 15v-3h2v3zm6 0h-3v-3.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5v3.5h-3v-13.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5zm-8-12h2v2h-2zm4 0h2v2h-2zm-4 4h2v2h-2zm4 0h2v2h-2z"
        data-name="Path 133"
        transform="translate(-313 192)"
      ></path>
    </svg>
  );
}

export default Department;
