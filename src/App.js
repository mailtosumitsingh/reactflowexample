import React, {useState, useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  updateEdge,
  useReactFlow,
  Panel,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import "./styles.css";
import './text-updater-node.css';

import TextUpdaterNode from './TextUpdaterNode.js';
import DownloadButton from './DownloadButton.js';
import SideBar from './SideBar.js';

const nodeTypes = { textUpdater: TextUpdaterNode };
const flowKey = 'example-flow';

import {
  nodes as initialNodes,
  edges as initialEdges
} from "./initial-elements";

const getNodeId = () => `addnode_${+new Date()}`;


 
  const SaveRestore = () => {
  const reactFlowWrapper = useRef(true);
  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);
 
  const { setViewport } = useReactFlow();
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);


  const getId = () => `dndode_${+new Date()}`
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);
  const onInit = (reactFlowInstance) =>{
     setRfInstance(reactFlowInstance);
    console.log("flow loaded:", reactFlowInstance);
  }
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log(JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      console.log("REstoring")
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
   const id = getNodeId();
    const newNode = {
      id: id,
      data: { label: 'Added node'+id },
      position: {
        x: 100,
        y: 200,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance]
  );

  return (

    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      onConnect={onConnect}
      onInit={setRfInstance}
      nodeTypes={nodeTypes}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
      attributionPosition="top-right"
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === "input") return "#0041d0";
          if (n.type === "output") return "#ff0072";
          if (n.type === "default") return "#1a192b";

          return "#eee";
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return "#fff";
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
      <Panel position="top-right">
        <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button>
      </Panel>
      <DownloadButton/>
    </ReactFlow>
    </div>
  );
};
export default () => (
  <div className="dndflow">
    <ReactFlowProvider>
    <SaveRestore />
    <SideBar/>
  </ReactFlowProvider>
  </div>
);
