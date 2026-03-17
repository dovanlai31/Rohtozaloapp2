import React from "react";

function Number({
    height = 30,
    width = 30,
    fill = "#000"
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 36 36"
    >
      <path
        d="M5.46 7.41L5.46 11.56 6.65 11.56 6.65 6.05 5.7 6.05 4.05 7.16 4.52 8 5.46 7.41z"
        className="clr-i-outline clr-i-outline-path-1"
        fill={fill}
      ></path>
      <path
        d="M5.57 14.82a.76.76 0 01.83.73c0 .38-.21.74-.87 1.27l-2 1.57v1h4.14v-1.11H5.33l1-.77c1-.7 1.28-1.27 1.28-2a1.83 1.83 0 00-2-1.76 2.63 2.63 0 00-2.14 1.08l.76.73a1.75 1.75 0 011.34-.74z"
        className="clr-i-outline clr-i-outline-path-2"
        fill={fill}
      ></path>
      <path
        d="M6.56 24.64a1.32 1.32 0 001-1.27c0-.87-.78-1.51-2-1.51a2.61 2.61 0 00-2.1 1l.69.72a1.78 1.78 0 011.3-.64c.54 0 .92.26.92.66s-.36.62-1 .62h-.58v1h.64c.74 0 1.07.21 1.07.63s-.35.68-1 .68a2 2 0 01-1.46-.65l-.7.78a2.85 2.85 0 002.21.93c1.29 0 2.13-.69 2.13-1.64a1.33 1.33 0 00-1.12-1.31z"
        className="clr-i-outline clr-i-outline-path-3"
        fill={fill}
      ></path>
      <path
        d="M32.42 9a1 1 0 00-1-1H10v2h21.42a1 1 0 001-1z"
        className="clr-i-outline clr-i-outline-path-4"
        fill={fill}
      ></path>
      <path
        d="M31.42 16H10v2h21.42a1 1 0 000-2z"
        className="clr-i-outline clr-i-outline-path-5"
        fill={fill}
      ></path>
      <path
        d="M31.42 24H10v2h21.42a1 1 0 000-2z"
        className="clr-i-outline clr-i-outline-path-6"
        fill={fill}
      ></path>
      <path fillOpacity="0" d="M0 0H36V36H0z"></path>
    </svg>
  );
}

export default Number;