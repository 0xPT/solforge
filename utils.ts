import { EDataType } from "@/types";

const LineColors = {
  green: "#228B22",
  blue: "#0F52BA",
  purple: "#BF00FF",
  red: "#FF2400",
  orange: "#FF8C00",
  yellow: "#FFD700",
  pink: "#FF00FF",
  white: "#FFFFFF",
};

const HandleColors = {
  green: "#228B22",
  blue: "#0F52BA",
  purple: "#BF00FF",
  red: "#FF2400",
  orange: "#FF8C00",
  yellow: "#FFD700",
  pink: "#FF00FF",
  white: "#FFFFFF",
};

export const getEdgeColor = (type: EDataType) => {
  switch (type) {
    case EDataType.UINT_256:
      return LineColors.green;
    case EDataType.STRING:
      return LineColors.pink;
    case EDataType.ADDRESS:
      return LineColors.yellow;
    case EDataType.INT_256:
      return LineColors.blue;
    case EDataType.STRUCT:
      return LineColors.purple;
    case EDataType.MAPPING:
      return LineColors.orange;
    case EDataType.BOOL:
      return LineColors.red;
    default:
      return LineColors.white;
  }
};

export const getHandleColor = (type: EDataType) => {
  switch (type) {
    case EDataType.UINT_256:
      return HandleColors.green;
    case EDataType.STRING:
      return HandleColors.pink;
    case EDataType.ADDRESS:
      return HandleColors.yellow;
    case EDataType.INT_256:
      return HandleColors.blue;
    case EDataType.STRUCT:
      return HandleColors.purple;
    case EDataType.MAPPING:
      return HandleColors.orange;
    case EDataType.BOOL:
      return HandleColors.red;
    case EDataType.BOOLEAN_LITERAL:
      return HandleColors.red;
    case EDataType.NUMBER_LITERAL:
      return HandleColors.green;
    case EDataType.STRING_LITERAL:
      return HandleColors.pink;
    default:
      return HandleColors.white;
  }
};

export const getColorOfType = (type: string) => {
  switch (type) {
    case EDataType.UINT_256:
      return "green.500";
    case EDataType.STRING:
      return "pink.500";
    case EDataType.ADDRESS:
      return "yellow.500";
    case EDataType.INT_256:
      return "blue.500";
    case EDataType.STRUCT:
      return "purple.500";
    case EDataType.MAPPING:
      return "orange.500";
    case EDataType.BOOL:
      return "teal.500";
    case EDataType.ARRAY:
      return "cyan.500";
    default:
      return "zinc.500";
  }
};
