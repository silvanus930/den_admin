import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { memo, useCallback } from "react";
import { Handle, Position, useOnViewportChange } from "reactflow";

const onConnect = (params) => console.log("handle onConnect", params);

function CustomNode() {

  const onStart = useCallback((viewport) => console.log("onStart", viewport), []);
  const onChange = useCallback((viewport) => console.log("onChange", viewport), []);
  const onEnd = useCallback((viewport) => console.log("onEnd", viewport), []);

  useOnViewportChange({
    onStart,
    onChange,
    onEnd,
  });

  return (
    <>
      <ComplexStatisticsCard
        color={'success' }
        icon="weekend"
        title={"Send Message"}
        percentage={{
          color: "success",
          amount: "To: ",
          label: "Hello, how are you?",
        }}
      />
      <Handle
        type="target"
        className="w-2 h-2 bg-cyan-500"
        position={Position.Top}
        onConnect={onConnect}
      />
      <Handle
        type="source"
        className="left-2/4 w-2 h-2 bg-blue-900"
        position={Position.Bottom}
        id="a"
      />
    </>
  );
}

export default memo(CustomNode);
