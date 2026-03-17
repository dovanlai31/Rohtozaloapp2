export const ConvertOpacity =(hexColor, alpha) => {
    
    const red = parseInt(hexColor.substring(1, 3), 16);
    const green = parseInt(hexColor.substring(3, 5), 16);
    const blue = parseInt(hexColor.substring(5, 7), 16);
  
    
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  