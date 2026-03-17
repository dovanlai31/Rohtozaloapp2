import React from "react";

function CameraLens({
  style = {},
  fill = "#0F0F0F",
  width = "24",
  height = "28",
  className = "",
  viewBox = "0 0 24 28",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        fillRule="evenodd"
        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm-.834-6l2.322 3.87A8.996 8.996 0 0019.477 17h-8.31zm-4.29-3.262l4.333 7.22a8.987 8.987 0 01-6.595-3.826l2.263-3.394zM7.632 9H3.52a8.979 8.979 0 00-.512 3c0 1.093.195 2.14.552 3.11L7.63 9zm12.85 6h-4.167l4.025-6.373A8.967 8.967 0 0120.993 12c0 1.052-.18 2.062-.512 3zm-7.647-8h-8.31a8.996 8.996 0 015.987-3.87L12.835 7zm-.043-3.959l4.244 7.073 2.19-3.47a8.983 8.983 0 00-6.434-3.603zM8.179 12l1.875-3h3.892l1.875 3-1.875 3h-3.892L8.18 12z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default CameraLens;
