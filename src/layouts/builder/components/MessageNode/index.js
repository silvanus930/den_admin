import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { memo, useCallback } from "react";
import { Handle, Position, useOnViewportChange } from "reactflow";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

const onConnect = (params) => console.log("handle onConnect", params);

function MessageNode(data) {
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
        color="primary"
        icon="person_add"
        title="Followers"
        count="+91"
        percentage={{
          color: "success",
          amount: "To: ",
          label: "What can I help you?",
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
        className="left-1/4 w-2 h-2 bg-blue-900"
        position={Position.Bottom}
        id="a"
      />
      <Handle
        type="source"
        className="right-2/3 w-2 h-2 bg-blue-900"
        position={Position.Bottom}
        id="b"
      />
      <Handle
        type="source"
        className="left-3/4 w-2 h-2 bg-blue-900"
        position={Position.Bottom}
        id="c"
      />
    </>
  );
}

export default memo(MessageNode);
