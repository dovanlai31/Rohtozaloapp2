const colorsArr = [
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
"#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  "#006830",
  "#8cc63e",
  // "#FF8181",
  // "#50E3C1",
  // "#E52726",
  // "#2F2A6B",
  // "#50118E",
  // "#F2C94C",
  // "#F9E71B",
  // "#4ECB71",
  // "#FF8181",
  // "#50E3C1",
  // "#E52726",
  // "#2F2A6B",
  // "#50118E",
  // "#F2C94C",
  // "#F9E71B",
  // "#4ECB71",
  // "#FF8181",
  // "#50E3C1",
  // "#E52726",
  // "#2F2A6B",
  // "#50118E",
  // "#F2C94C",
]

const datePickerData = [
  {
    // Năm
    values: (function createValues() {
      const arr = [];
      for (let i = 1950; i <= new Date().getFullYear() + 10; i += 1) {
        arr.push(i);
      }
      return arr;
    })()
  },
  // Tháng
  {
    values: '0 1 2 3 4 5 6 7 8 9 10 11'.split(' '),
    displayValues:
      'Tháng 1#Tháng 2#Tháng 3#Tháng 4#Tháng 5#Tháng 6#Tháng 7#Tháng 8#Tháng 9#Tháng 10#Tháng 11#Tháng 12'.split(
        '#'
      )
  },
  // Ngày
  {
    values: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ]
  }
];
export { colorsArr,datePickerData }
