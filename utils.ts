export const getColorOfType = (type: string) => {
  switch (type) {
    case "uint256":
      return "#38A169";
    case "string":
      return "#D53F8C";
    case "address":
      return "#D69E2E";
    case "int256":
      return "#3182CE";
    case "struct":
      return "#805AD5";
    case "map":
      return "#DD6B20";
    default:
      return "rgb(113 113 122)";
  }
};

export const getBackgroundColorOfType = (type: string) => {
  switch (type) {
    case "uint256":
      return "#68D391";
    case "string":
      return "#F687B3";
    case "address":
      return "#F6E05E";
    case "int256":
      return "#63B3ED";
    case "struct":
      return "#B794F4";
    case "map":
      return "#F6AD55";
    default:
      return "rgb(212 212 216)";
  }
};
