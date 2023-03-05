// @ts-nocheck
import { Handle, Position } from "reactflow";
import { ENodeInputOutputType } from "@/types";

export interface IInputOutputNodeProps {
  id: string;
  type: string;
  data: {
    name: string;
    type: ENodeInputOutputType;
    mode: "source" | "target";
  };
  position: { x: number; y: number };
}

const RenderNodeInputOutputType = (type: ENodeInputOutputType) => {
  switch (type) {
    case ENodeInputOutputType.Boolean:
      return "B";
    case ENodeInputOutputType.String:
      return "S";
    case ENodeInputOutputType.Address:
      return "A";
    case ENodeInputOutputType.Uint256:
      return "U";
    case ENodeInputOutputType.Execute:
      return "E";
    case ENodeInputOutputType.Custom:
      return "C";
    default:
      return "H";
  }
};

const InputOutputNode = ({ id, type, data }: IInputOutputNodeProps) => {
  return (
    <div
      style={{ padding: 12, display: "flex", flexDirection: "row", width: 100 }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <Handle
            type={data.mode}
            position={data.mode === "source" ? Position.Right : Position.Left}
            isConnectable={true}
            style={{
              width: 100,
              height: 25,
              display: "flex",
              backgroundColor: "transparent",
              borderRadius: 0,
              border: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 6,
                borderRadius: 4,
                fontWeight: 500,
                width: 16,
                height: 16,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                fontSize: "10px",
              }}
            >
              {RenderNodeInputOutputType(data.type)}
            </div>
            <div
              style={{
                fontSize: "9.6px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
              }}
            >
              {data.name}
            </div>
          </Handle>
        </div>
      </div>
    </div>
  );
};

export default InputOutputNode;
