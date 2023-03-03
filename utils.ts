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
    default:
      return HandleColors.white;
  }
};
