import { MouseEvent as ReactMouseEven, CSSProperties, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Node,
  Viewport,
  SnapGrid,
  Connection,
  Edge,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  Position,
  OnSelectionChangeParams,
  Controls,
  Background,
  MiniMap,
} from "reactflow";

import CustomNode from "../CustomNode";
import MessageNode from "../MessageNode";
import StartNode from "../StartNode";
import EndNode from "../EndNode";

const onNodeDragStart = (_, node, nodes) => console.log("drag start", node, nodes);
const onNodeDrag = (_, node, nodes) => console.log("drag", node, nodes);
const onNodeDragStop = (_, node, nodes) => console.log("drag stop", node, nodes);
const onNodeDoubleClick = (_, node) => console.log("node double click", node);
const onPaneClick = (event) => console.log("pane click", event);
const onPaneScroll = (event) => console.log("pane scroll", event);
const onPaneContextMenu = (event) => console.log("pane context menu", event);
const onSelectionDrag = (_, nodes) => console.log("selection drag", nodes);
const onSelectionDragStart = (_, nodes) => console.log("selection drag start", nodes);
const onSelectionDragStop = (_, nodes) => console.log("selection drag stop", nodes);
const onSelectionContextMenu = (event, nodes) => {
  event.preventDefault();
  console.log("selection context menu", nodes);
};
const onNodeClick = (_, node) => console.log("node click:", node);

const onSelectionChange = ({ nodes, edges }) => console.log("selection change", nodes, edges);
const onInit = (reactFlowInstance) => {
  console.log("pane ready:", reactFlowInstance);
};

const onMoveStart = (_, viewport) => console.log("zoom/move start", viewport);
const onMoveEnd = (_, viewport) => console.log("zoom/move end", viewport);
const onEdgeContextMenu = (_, edge) => console.log("edge context menu", edge);
const onEdgeMouseEnter = (_, edge) => console.log("edge mouse enter", edge);
const onEdgeMouseMove = (_, edge) => console.log("edge mouse move", edge);
const onEdgeMouseLeave = (_, edge) => console.log("edge mouse leave", edge);
const onEdgeDoubleClick = (_, edge) => console.log("edge double click", edge);
const onNodesDelete = (nodes) => console.log("nodes delete", nodes);
const onEdgesDelete = (edges) => console.log("edges delete", edges);
const onPaneMouseMove = (e) => console.log("pane move", e.clientX, e.clientY);

const nodeTypes = {
  selectorNode: CustomNode,
  thinkNode: MessageNode,
  startNode: StartNode,
  endNode: EndNode,
};

const initialNodes = [
  {
    id: "1",
    type: "startNode",
    toolbarPosition: Position.Top,
    position: { x: 250, y: -100 },
  },
  {
    id: "2",
    type: "selectorNode",
    data: { color: "success", text: "Send message" },
    position: { x: -50, y: 70 },
  },
  {
    id: "3",
    type: "selectorNode",
    data: { color: "primary", text: "Hello" },
    position: { x: 500, y: 70 },
  },
  {
    id: "4",
    type: "thinkNode",
    data: { color: "primary", text: "Hello" },
    position: { x: 250, y: 150 },
  },
  {
    id: "5",
    type: "thinkNode",
    data: {
      label: (
        <>
          Or check out the other <strong>examples</strong>
        </>
      ),
    },
    position: { x: 250, y: 325 },
  },
  {
    id: "6",
    type: "endNode",
    data: { label: "Output node (not deletable)" },
    position: { x: 0, y: 550 },
    deletable: false,
  },
  {
    id: "7",
    type: "endNode",
    data: { label: "Another output node" },
    position: { x: 400, y: 550 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true },
  { id: "e1-3", source: "1", target: "3", type: "smoothstep", animated: true },
  { id: "e3-4", source: "3", target: "4", type: "smoothstep", animated: true },
  { id: "e4-5", source: "4", target: "5", type: "smoothstep", animated: true },
  { id: "e5-6", source: "5", animated: true, type: "smoothstep", target: "6", deletable: false },
  { id: "e5-7", source: "5", target: "7", type: "step", animated: true },
];

const connectionLineStyle = { stroke: "#ddd" };
const snapGrid = [25, 25];

function OverviewFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onPaneScroll={onPaneScroll}
      onPaneContextMenu={onPaneContextMenu}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onNodeDoubleClick={onNodeDoubleClick}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
      onSelectionChange={onSelectionChange}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
      onInit={onInit}
      connectionLineStyle={connectionLineStyle}
      snapToGrid
      snapGrid={snapGrid}
      onEdgeContextMenu={onEdgeContextMenu}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseMove={onEdgeMouseMove}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeDoubleClick={onEdgeDoubleClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      attributionPosition="top-right"
      maxZoom={Infinity}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
      onPaneMouseMove={onPaneMouseMove}
      nodeTypes={nodeTypes}
    >
      <Controls />
      <Background color="#aaa" gap={25} />
    </ReactFlow>
  );
}

export default OverviewFlow;
