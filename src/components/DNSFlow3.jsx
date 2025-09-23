// src/components/DNSFlow.jsx
import React, { useMemo, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import FeaturePanel from "./FeaturePanel";

const nodeTypes = { custom: CustomNode };

const getEdgeStyle = (type) => {
  const baseStyle = {
    strokeWidth: 3,
    strokeLinecap: 'round',
  };

  switch (type) {
    case 'dns': return { ...baseStyle, stroke: '#3B82F6', strokeDasharray: '5,5' };
    case 'direct': return { ...baseStyle, stroke: '#EF4444' };
    case 'proxy-client': return { ...baseStyle, stroke: '#10B981' };
    case 'proxy-origin': return { ...baseStyle, stroke: '#8B5CF6' };
    default: return baseStyle;
  }
};

export default function Diagram({ stage }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const { nodes, edges } = useMemo(() => {
    const baseNodes = [
      {
        id: "client",
        position: { x: 250, y: 30 },
        data: { 
          emoji: "👩‍💻", 
          title: "Client Browser",
          subtitle: "End User"
        },
        type: "custom",
      },
      {
        id: "origin",
        position: { x: 250, y: 370 },
        data: { 
          emoji: "🖥️", 
          title: "Origin Server",
          subtitle: "Nginx"
        },
        type: "custom",
      },
    ];

    let stageNodes = [...baseNodes];
    let stageEdges = [];

    if (stage === "before") {
      stageNodes.push({
        id: "route53",
        position: { x: 250, y: 200 },
        data: { 
          emoji: "📘", 
          title: "Route53 DNS",
          subtitle: "Basic DNS Service"
        },
        type: "custom",
      });

      stageEdges = [
        { id: "e1", source: "client", target: "route53", label: "DNS Query", style: getEdgeStyle('dns'), animated: true },
        { id: "e2", source: "client", target: "origin", label: "Direct Connection", style: getEdgeStyle('direct') },
      ];
    }

    if (stage === "dnsOnly") {
      stageNodes.push(
        {
          id: "route53-cached",
          position: { x: 100, y: 200 },
          data: { emoji: "📘", title: "Route53 (Cached)", subtitle: "During Propagation" },
          type: "custom",
        },
        {
          id: "cloudflare-dns",
          position: { x: 400, y: 200 },
          data: { emoji: "🌐", title: "Cloudflare DNS", subtitle: "New Authoritative" },
          type: "custom",
        }
      );

      stageEdges = [
        { id: "e1", source: "client", target: "route53-cached", label: "Cached DNS", style: getEdgeStyle('dns'), animated: true },
        // { id: "e2", source: "client", target: "origin", label: "Direct to Origin", style: getEdgeStyle('direct') },
        { id: "e3", source: "client", target: "cloudflare-dns", label: "New DNS Query", style: getEdgeStyle('dns'), animated: true },
        // { id: "e4", source: "client", target: "origin", label: "Direct to Origin", style: getEdgeStyle('direct') },
        { id: "e7", source: "route53-cached", target: "origin", label: "", style: getEdgeStyle('dns'), animated: true },
        { id: "e8", source: "cloudflare-dns", target: "origin", label: "", style: getEdgeStyle('dns'), animated: true },
      ];
    }

    if (stage === "proxy") {
      stageNodes.push({
        id: "cloudflare-proxy",
        position: { x: 150, y: 200 },
        data: { 
          emoji: "🛡️", 
          title: "Cloudflare Proxy",
          subtitle: "Security & Performance Layer",
          hasFeatures: true  // This enables the click indicator
        },
        type: "custom",
      });

      stageEdges = [
        {
          id: "client-to-proxy",
          source: "client",
          target: "cloudflare-proxy",
          label: "Secure HTTPS\nTLS 1.3 Encrypted",
          style: getEdgeStyle('proxy-client'),
          animated: true,
        },
        {
          id: "proxy-to-origin",
          source: "cloudflare-proxy",
          target: "origin",
          // label: "2. Optimized Connection\nWAF Protected",
          style: getEdgeStyle('proxy-origin'),
          animated: true,
        },
      ];
    }

    return { nodes: stageNodes, edges: stageEdges };
  }, [stage]);

  const onNodeClick = (event, node) => {
    if (node.id === "cloudflare-proxy") {
      setSelectedNode(node);
    }
  };

  return (
    <div className="w-[900px] h-[550px] rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={onNodeClick}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={true}
      >
        <Background color="#ccc" gap={25} />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
      
      <FeaturePanel 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
}
