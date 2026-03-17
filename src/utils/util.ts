const PAGE_SIZE = 15

//prettier-ignore
const   MAPPING = {
  // Latin-1 Supplement
  Ả: "A", À: "A", Á: "A", Â: "A", Ã: "A", Ä: "A", Å: "A", Æ: "AE", Ç: "C", Ẻ: "E", È: "E", É: "E", 
  Ê: "E", Ë: "E", Ỉ: "I", Ì: "I", Í: "I", Î: "I", Ï: "I", Ð: "D", Ñ: "N", Ỏ: "O", Ò: "O", Ó: "O", 
  Ô: "O", Õ: "O", Ö: "O", ["×"]: "x", Ø: "O", Ủ: "U", Ù: "U", Ú: "U", Û: "U", Ü: "U", Ỷ: "Y", Ý: "Y", 
  Þ: "Th", ß: "ss", ả: "a", à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", æ: "ae", ç: "c", 
  ẻ: "e", è: "e", é: "e", ê: "e", ë: "e", ỉ: "i", ì: "i", í: "i", î: "i", ï: "i", ð: "d", ñ: "n", 
  ỏ: "o", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o", ủ: "u", ù: "u", ú: "u", û: "u", ü: "u", 
  ỷ: "y", ý: "y", þ: "th", ÿ: "y",

  // Latin Extended-A
  Ā: "A", Ă: "A", Ą: "A", ā: "a", ă: "a", ą: "a", Ć: "C", Ĉ: "C", Ċ: "C", Č: "C", 
  ć: "c", ĉ: "c", ċ: "c", č: "c", Ď: "D", Đ: "D", ď: "d", đ: "d", Ē: "E", Ĕ: "E", 
  Ė: "E", Ę: "E", Ě: "E", ē: "e", ĕ: "e", ė: "e", ę: "e", ě: "e", Ĝ: "G", Ğ: "G", 
  Ġ: "G", Ģ: "G", ĝ: "g", ğ: "g", ġ: "g", ģ: "g", Ĥ: "H", Ħ: "H", ĥ: "h", ħ: "h", 
  Ĩ: "I", Ī: "I", Ĭ: "I", Į: "I", İ: "I", ĩ: "i", ī: "i", ĭ: "i", į: "i", ı: "i", 
  Ĵ: "J", ĵ: "j", Ķ: "K", ķ: "k", ĸ: "k", Ĺ: "L", Ļ: "L", Ľ: "L", Ŀ: "L", Ł: "L", 
  ĺ: "l", ļ: "l", ľ: "l", ŀ: "l", ł: "l", Ń: "N", Ņ: "N", Ň: "N", Ŋ: "N", ń: "n", 
  ņ: "n", ň: "n", ŋ: "n", Ō: "O", Ŏ: "O", Ő: "O", ō: "o", ŏ: "o", ő: "o", Ŕ: "R", 
  Ŗ: "R", Ř: "R", ŕ: "r", ŗ: "r", ř: "r", Ś: "S", Ŝ: "S", Ş: "S", Š: "S", ś: "s", 
  ŝ: "s", ş: "s", š: "s", Ţ: "T", Ť: "T", Ŧ: "T", ţ: "t", ť: "t", ŧ: "t", Ũ: "U", 
  Ū: "U", Ŭ: "U", Ů: "U", Ű: "U", Ų: "U", ũ: "u", ū: "u", ŭ: "u", ů: "u", ű: "u", 
  ų: "u", Ŵ: "W", ŵ: "w", Ŷ: "Y", ŷ: "y", Ÿ: "Y", Ź: "Z", Ż: "Z", Ž: "Z", ź: "z", 
  ż: "z", ž: "z",

  // Vietnamese-specific characters
  ấ: "a", Ấ: "A", ầ: "a", Ầ: "A", ẩ: "a", Ẩ: "A",
  ẫ: "a", Ẫ: "A", ậ: "a", Ậ: "A", ế: "e", Ế: "E",
  ề: "e", Ề: "E", ể: "e", Ể: "E", ễ: "e", Ễ: "E", ệ: "e", Ệ: "E",
  ố: "o", Ố: "O", ồ: "o", Ồ: "O", ổ: "o", Ổ: "O", ỗ: "o", Ỗ: "O", ộ: "o", Ộ: "O",
  ơ: "o", Ơ: "O", ở: "o", Ở: "O", ỡ: "o", Ỡ: "O", ợ: "o", Ợ: "O", ư: "u", Ư: "U",
  ứ: "u", Ứ: "U", ừ: "u", Ừ: "U", ử: "u", Ử: "U", ữ: "u", Ữ: "U", ự: "u", Ự: "U",
};

const replaceUnicode = (text: string) => {
  return text
    .split("")
    .map((char) => MAPPING[char] || char)
    .join("")
}

function formatDateToYYYYMMDD(gmtDate: string) {
  const date = new Date(gmtDate)
  const year = date.getUTCFullYear()
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2)
  const day = ("0" + date.getUTCDate()).slice(-2)
  return `${year}-${month}-${day}`
}

function formatDateToDDMMYYYY(gmtDate: string, delimter: string) {
  if (delimter == null) {
    delimter = "-"
  }

  const date = new Date(gmtDate)
  const year = date.getUTCFullYear()
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2)
  const day = ("0" + date.getUTCDate()).slice(-2)
  return `${day}${delimter}${month}${delimter}${year}`
}

function formatDateFromArray(dateArr: number[]) {
  //let formatDate = dateArr[2] + "-" + String(Number(dateArr[1]) + 1).padStart(2, "0") + "-" + String(dateArr[0]).padStart(2, "0")
  let formatDate = new Date(Date.UTC(dateArr[2], Number(dateArr[1]), dateArr[0]))

  return formatDate
}

function formatDateWrongTimezone(date: Date) {
  const year = date?.getFullYear()
  const month = String(date?.getMonth() + 1).padStart(2, "0") // Months are zero-based
  const day = String(date?.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const validateString = (value: string, isId?: boolean): string => {
  if (!value) {
    return ""
  }

  if (value === undefined || value === null) {
    return ""
  }

  if (value === "null" || value === "undefined") {
    return ""
  }

  if (isId && value.trim() === "0") {
    return ""
  }

  return value
}

const formatNumWhenTyping = (value: string, lamTron?: number) => {
  let integerPart: string = ""
  let decimalPart: string = ""
  let num: string = ""

  const lamTronLocal = lamTron || 4

  if (value.includes(".")) {
    integerPart = formatDecimal(value.split(".")[0])
    decimalPart = value.split(".")[1]

    if (decimalPart.length > lamTronLocal) {
      decimalPart = decimalPart.slice(0, lamTronLocal)
    }

    if (decimalPart.length > 0) {
      num = integerPart + "." + decimalPart
    } else {
      num = integerPart + "."
    }
  } else {
    num = formatDecimal(value)
  }

  return num
}

export function formatDecimal(value: number | string): string {
  const formatter = new Intl.NumberFormat("en", {
    style: "decimal",
    minimumFractionDigits: 0,
  })

  return formatter.format(Number(value))
}

export {
  formatDateToYYYYMMDD,
  formatDateToDDMMYYYY,
  formatDateFromArray,
  formatDateWrongTimezone,
  validateString,
  formatNumWhenTyping,
  replaceUnicode,
  PAGE_SIZE,
  MAPPING,
}
