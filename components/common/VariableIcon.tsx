import { EDataType } from "@/types";
import { getColorOfType } from "@/utils";
import { Text } from "@chakra-ui/react";

export const VariableIcon = ({ type }: { type: EDataType }) => {
  return (
    <Text
      color={`${getColorOfType(type)}`}
      className="ignore-click-outside"
      letterSpacing="0.1em"
      fontWeight="800"
      fontSize="10px"
      style={{ fontFeatureSettings: "'ss02'" }}
      textTransform="uppercase"
    >
      {type.charAt(0).toUpperCase()}
    </Text>
  );
};
