import { MouseEvent as ReactMouseEven, CSSProperties, useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  SnapGrid,
  Connection,
  Edge,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Position,
  OnSelectionChangeParams,
  Controls,
  Background,
  ConnectionLineType,
  ConnectionMode,
  ReactFlowProvider,
} from "reactflow";
import useUndoable from "use-undoable";

import CustomNode from "../CustomNode";
import MultiSelectorNode from "../MultiSelectorNode";
import MessageNode from "../MessageNode";
import StartNode from "../StartNode";
import EndNode from "../EndNode";
import PlusNode from "../PlusNode";
import PlusEdge from "../PlusEdge";

import NodeSelectorDialog from "../NodeSelectorDialog";


const onNodeDragStart = (_, node, nodes) => console.log("drag start", node, nodes);
const onNodeDrag = (_, node, nodes) => console.log("drag", node, nodes);
const onNodeDragStop = (_, node, nodes) => console.log("drag stop", node, nodes);
const onNodeDoubleClick = (_, node) => console.log("node double click", node);
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
  multiSelectorNode: MultiSelectorNode,
  thinkNode: MessageNode,
  startNode: StartNode,
  endNode: EndNode,
  plusNode: PlusNode,
};

const edgeTypes = {
  plusEdge: PlusEdge,
};

let id = 3;
const getId = () => `node-${id++}`;
const getEdgeId = (startNode, endNode) => {
  const start = parseInt(startNode.match(/-(\d+)/)[1], 10);
  const end = parseInt(endNode.match(/-(\d+)/)[1], 10);
  return `edge-${start}-${end}`;
}




// const initialNodes = [
//   {
//     id: "1",
//     type: "startNode",
//     toolbarPosition: Position.Top,
//     position: { x: 250, y: -100 },
//   },
//   {
//     id: "2",
//     type: "selectorNode",
//     data: { color: "success", text: "Send message" },
//     position: { x: -50, y: 70 },
//   },
//   {
//     id: "3",
//     type: "selectorNode",
//     data: { color: "primary", text: "Hello" },
//     position: { x: 500, y: 70 },
//   },
//   {
//     id: "4",
//     type: "multiSelectorNode",
//     data: { color: "primary", text: "Hello" },
//     position: { x: 250, y: 150 },
//   },
//   {
//     id: "5",
//     type: "thinkNode",
//     data: {
//       label: (
//         <>
//           Or check out the other <strong>examples</strong>
//         </>
//       ),
//     },
//     position: { x: 250, y: 325 },
//   },
//   {
//     id: "6",
//     type: "endNode",
//     data: { label: "Output node (not deletable)" },
//     position: { x: 0, y: 550 },
//     deletable: false,
//   },
//   {
//     id: "7",
//     type: "endNode",
//     data: { label: "Another output node" },
//     position: { x: 400, y: 550 },
//   },
// ];

// const initialEdges = [
//   { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true },
//   { id: "e1-3", source: "1", target: "3", type: "smoothstep", animated: true },
//   { id: "e3-4", source: "3", target: "4", type: "smoothstep", animated: true },
//   { id: "e4-5", source: "4", target: "5", type: "smoothstep", animated: true },
//   { id: "e5-6", source: "5", animated: true, type: "smoothstep", target: "6", deletable: false },
//   { id: "e5-7", source: "5", target: "7", type: "step", animated: true },
// ];


const connectionLineStyle = { stroke: "#ddd", animated: true };
const snapGrid = [25, 25];

// const [elements, setElements, { undo, canUndo, redo, canRedo }] = useUndoable(initialNodes);
/*
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
*/
function OverviewFlow() {

  const [selectedEdge, setSelectedEdge] = useState('');




  const handleClickOpen = (edge) => {
    setSelectedValue('');
    console.log('Selected Edge: ', edge);
    setSelectedEdge(edge);
    setOpenDialog(true);
  };


  const handleClose = (value) => {
    setOpenDialog(false);
    if (value.length) {
      const newNode = {
        id: getId(),
        position: { x: (selectedEdge.targetX + selectedEdge.sourceX) / 2, y: (selectedEdge.targetY + selectedEdge.sourceY) /2  },
        type: value,
      };
      const newEdgeStart = {
        id: getEdgeId(selectedEdge.source, newNode.id),
        source: selectedEdge.source,
        target: newNode.id,
        type: "plusEdge",
        animated: true,
        data: { handle: handleClickOpen }
      };
      const newEdgeEnd = {
        id: getEdgeId(newNode.id, selectedEdge.target),
        source: newNode.id,
        target: selectedEdge.target,
        type: "plusEdge",
        animated: true,
        data: { handle: handleClickOpen }
      };

      const updatedEdges = edges.filter((edge) => edge.id !== selectedEdge.id);
      updatedEdges.push(newEdgeStart, newEdgeEnd);
      console.log(updatedEdges);
      setNodes((nds) => nds.concat(newNode));
      setEdges(updatedEdges);
      setSelectedValue(value);
    }
  };

  const initialNodes = [
    {
      id: `node-${1}`,
      type: "startNode",
      toolbarPosition: Position.Top,
      position: { x: 0, y: -100 },
    },
    {
      id: `node-${2}`,
      type: "endNode",
      position: { x: 0, y: 500 },
    },

  ];
  const initialEdges = [
    { id: `edge-${1}-${2}`, source: `node-${1}`, target: `node-${2}`, type: "plusEdge", animated: true, data: { handle: handleClickOpen } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const [nodes, setNodes, { undo, redo, onNodesChange}] = useUndoable(useNodesState(initialNodes));
  // const [edges, setEdges, { undo, redo }] = useUndoable(useEdgesState(initialEdges), { type: 'edges' });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );
  const { project } = useReactFlow();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });

  const onPaneClick = useCallback(
    (evt) => {
      setSelectedPosition({ x: evt.clientX - 330, y: evt.clientY - 110 });
    },
    [project, setNodes]
  );

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
      // connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineStyle={connectionLineStyle}
      // connectionMode={ConnectionMode.Loose}
      snapToGrid
      snapGrid={snapGrid}
      onEdgeContextMenu={onEdgeContextMenu}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseMove={onEdgeMouseMove}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeDoubleClick={onEdgeDoubleClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      // attributionPosition="top-right"
      maxZoom={Infinity}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
      onPaneMouseMove={onPaneMouseMove}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <Controls />
      <Background color="#aaa" gap={25} />
      <NodeSelectorDialog
        selectedValue={selectedValue}
        open={openDialog}
        onClose={handleClose}
      />
    </ReactFlow>
  );
}

const WrappedFlow = () => (
  <ReactFlowProvider>
    <OverviewFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;
