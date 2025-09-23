// src/components/DNSFlow.jsx
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = { custom: CustomNode };

// Custom edge styles
const getEdgeStyle = (type) => {
  const baseStyle = {
    strokeWidth: 3,
    strokeLinecap: 'round',
  };

  switch (type) {
    case 'dns':
      return { ...baseStyle, stroke: '#3B82F6', strokeDasharray: '5,5' }; // Blue dashed
    case 'direct':
      return { ...baseStyle, stroke: '#EF4444' }; // Red solid
    case 'proxy':
      return { ...baseStyle, stroke: '#10B981', strokeDasharray: '0' }; // Green solid
    default:
      return baseStyle;
  }
};

export default function Diagram({ stage }) {
  const { nodes, edges } = useMemo(() => {
    const baseNodes = [
      {
        id: "client",
        position: { x: 250, y: 50 },
        data: { 
          emoji: "👩‍💻", 
          title: "Client Browser",
          subtitle: "User making request"
        },
        type: "custom",
      },
      {
        id: "origin",
        position: { x: 250, y: 350 },
        data: { 
          emoji: "🖥️", 
          title: "Origin Server",
          subtitle: "AWS/Your Application"
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
          subtitle: "Authoritative Nameserver"
        },
        type: "custom",
      });

      stageEdges = [
        {
          id: "dns-lookup",
          source: "client",
          target: "route53",
          label: "1. DNS Query",
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#DBEAFE', fillOpacity: 0.8 },
          style: getEdgeStyle('dns'),
          animated: true,
        },
        {
          id: "direct-request",
          source: "client",
          target: "origin",
          label: "2. Direct Connection",
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#FEE2E2', fillOpacity: 0.8 },
          style: getEdgeStyle('direct'),
        },
      ];
    }

    if (stage === "dnsOnly") {
      stageNodes.push(
        {
          id: "route53-cached",
          position: { x: 100, y: 200 },
          data: { 
            emoji: "📘", 
            title: "Route53 (Cached)",
            subtitle: "During Propagation"
          },
          type: "custom",
        },
        {
          id: "cloudflare-dns",
          position: { x: 400, y: 200 },
          data: { 
            emoji: "🌐", 
            title: "Cloudflare DNS",
            subtitle: "New Authoritative"
          },
          type: "custom",
        }
      );

      stageEdges = [
        {
          id: "dns-cached",
          source: "client",
          target: "route53-cached",
          label: "Cached DNS",
          style: getEdgeStyle('dns'),
          animated: true,
        },
        {
          id: "direct-cached",
          source: "client",
          target: "origin",
          label: "Direct to Origin",
          style: getEdgeStyle('direct'),
        },
        {
          id: "dns-new",
          source: "client",
          target: "cloudflare-dns",
          label: "New DNS Query",
          style: getEdgeStyle('dns'),
          animated: true,
        },
        {
          id: "direct-new",
          source: "client",
          target: "origin",
          label: "Direct to Origin",
          style: getEdgeStyle('direct'),
        },
      ];
    }

    if (stage === "proxy") {
      stageNodes.push({
        id: "cloudflare-proxy",
        position: { x: 250, y: 200 },
        data: { 
          emoji: "🛡️", 
          title: "Cloudflare Proxy",
          subtitle: "WAF + SSL + Cache"
        },
        type: "custom",
      });

      stageEdges = [
        {
          id: "to-proxy",
          source: "client",
          target: "cloudflare-proxy",
          label: "1. Secure Connection",
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#D1FAE5', fillOpacity: 0.8 },
          style: getEdgeStyle('proxy'),
          animated: true,
        },
        {
          id: "to-origin",
          source: "cloudflare-proxy",
          target: "origin",
          label: "2. Optimized Connection",
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#D1FAE5', fillOpacity: 0.8 },
          style: getEdgeStyle('proxy'),
          animated: true,
        },
      ];
    }

    return { nodes: stageNodes, edges: stageEdges };
  }, [stage]);

  return (
    <div className="w-[800px] h-[500px] rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
      >
        <Background color="#ccc" gap={25} />
        <Controls 
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}