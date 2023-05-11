import { MouseEvent as ReactMouseEven, CSSProperties, useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import MultiSelectorNode from "../Nodes/MultiSelectorNode";
import ConditionalNode from "../Nodes/ConditionalNode";
import StartNode from "../Nodes/StartNode";
import EndNode from "../Nodes/EndNode";
import MessageNode from "../Nodes/MessageNode";
import CustomNode from "../Nodes/CustomNode";
import PlusNode from "../Nodes/PlusNode";

import PlusEdge from "../Edges/PlusEdge";

import NodeSelectorDialog from "../NodeSelectorDialog";

import { createSessionApi, updateSessionApi } from 'library/apis/session';

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
  conditionalNode: ConditionalNode,
  thinkNode: MessageNode,
  startNode: StartNode,
  endNode: EndNode,
  plusNode: PlusNode,
};

const edgeTypes = {
  plusEdge: PlusEdge,
};

const connectionLineStyle = { stroke: "#ddd", animated: true };
const snapGrid = [25, 25];

const OverviewFlow = ({ item }) => {

  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState(!item);
  const [selectedEdge, setSelectedEdge] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });

  const getId = () => `node-${nodes.length + 1}`;
  const getEdgeId = (startNode, endNode) => {
    const start = parseInt(startNode.match(/-(\d+)/)[1], 10);
    const end = parseInt(endNode.match(/-(\d+)/)[1], 10);
    return `edge-${start}-${end}`;
  }

  useEffect(() => {
    if (item) {
      setIsCreate(false);
      setNodes(item.nodes);
      setEdges(item.edges.map(edge => {
        const data = { ...edge, data: { handle: handleClickOpen } };
        return data;
      }))
    } else {
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
        {
          id: `edge-${1}-${2}`,
          source: `node-${1}`,
          target: `node-${2}`,
          type: "plusEdge",
          animated: true,
        },
      ];
      setIsCreate(true);
      setNodes(initialNodes);
      setEdges(initialEdges.map(edge => {
        const data = { ...edge, data: { handle: handleClickOpen } };
        return data;
      }))
    }
  }, []);

  const handleSave = async () => {
    console.log('Nodes: ', nodes);
    console.log('Edges: ', edges);

    const updatedEdges = edges.map((edge) => {
      const { data, ...rest } = edge;
      return rest;
    });

    const updatedNodes = nodes.map((node) => {
      return { ...node, data: { texts: [], uri: '' } };
    });

    const data = {
      nodes: updatedNodes,
      edges: updatedEdges,
    }

    if (isCreate) {
      try {
        const result = await createSessionApi(data);
        console.log(result);
        handleNavBack();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await updateSessionApi(item._id, data);
        console.log(result);
        handleNavBack();
      } catch (error) {
        console.log(error);
      }
    }
  }

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
        position: { x: (selectedEdge.targetX + selectedEdge.sourceX) / 2, y: (selectedEdge.targetY + selectedEdge.sourceY) / 2 },
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

  const handleNavBack = () => {
    navigate(-1);
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: "plusEdge", data: { handle: handleClickOpen } }, eds)),
    [setEdges]
  );

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
      maxZoom={5}
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
      <MDBox mt={0} mr={0} position="fixed" right={10} bottom={5} zIndex={10}>
        <MDButton variant="contained" color="success" onClick={handleSave}>{item ? "Update" : "Save"}</MDButton>
      </MDBox>
    </ReactFlow>
  );
}

const WrappedFlow = ({ item }) => (
  <ReactFlowProvider>
    <OverviewFlow item={item} />
  </ReactFlowProvider>
);

export default WrappedFlow;
