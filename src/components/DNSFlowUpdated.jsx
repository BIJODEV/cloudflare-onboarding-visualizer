// src/components/DNSFlow.jsx
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = { custom: CustomNode };

const getEdgeStyle = (type) => {
  const baseStyle = {
    strokeWidth: 3,
    strokeLinecap: 'round',
  };

  switch (type) {
    case 'dns':
      return { ...baseStyle, stroke: '#3B82F6', strokeDasharray: '5,5' };
    case 'direct':
      return { ...baseStyle, stroke: '#EF4444' };
    case 'proxy-client':
      return { ...baseStyle, stroke: '#10B981' }; // Green for client-to-proxy
    case 'proxy-origin':
      return { ...baseStyle, stroke: '#8B5CF6' }; // Purple for proxy-to-origin
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
          subtitle: "End User"
        },
        type: "custom",
      },
      {
        id: "origin",
        position: { x: 250, y: 400 },
        data: { 
          emoji: "🖥️", 
          title: "Origin Server",
          subtitle: "AWS Application"
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
        {
          id: "dns-lookup",
          source: "client",
          target: "route53",
          label: "DNS Query",
          style: getEdgeStyle('dns'),
          animated: true,
        },
        {
          id: "direct-request",
          source: "client",
          target: "origin",
          label: "Direct Connection\nNo Security Filtering",
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
  stageNodes.push(
    {
      id: "cloudflare-proxy",
      position: { x: 250, y: 210 },  // Centered horizontally, moved down slightly
      data: { 
        emoji: "🛡️", 
        title: "Cloudflare Proxy",
        subtitle: "Security & Performance Layer"
      },
      type: "custom",
    },
    {
      id: "ssl-termination",
      position: { x: 40, y: 200 },  // Top-left position
      data: { 
        emoji: "🔒", 
        title: "SSL Termination",
        subtitle: "TLS/SSL Offloading"
      },
      type: "custom",
    },
    {
      id: "waf-layer",
      position: { x: 500, y: 200 },  // Top-right position
      data: { 
        emoji: "🚫", 
        title: "WAF Protection",
        subtitle: "779+ Security Rules"
      },
      type: "custom",
    }
  );

  stageEdges = [
    // Client to Cloudflare (Secure connection)
    {
      id: "client-to-proxy",
      source: "client",
      target: "cloudflare-proxy",
      label: "1. Secure HTTPS\nTLS 1.3 Encrypted",
      style: getEdgeStyle('proxy-client'),
      animated: true,
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: '#D1FAE5', fillOpacity: 0.9 },
    },
    // Cloudflare to Origin (Optimized connection)
    {
      id: "proxy-to-origin",
      source: "cloudflare-proxy",
      target: "origin",
      label: "2. Optimized Connection\nReduced SSL Overhead",
      style: getEdgeStyle('proxy-origin'),
      animated: true,
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: '#EDE9FE', fillOpacity: 0.9 },
    },
    // Security features connections - use bezier curves to avoid overlap
    {
      id: "ssl-feature",
      source: "cloudflare-proxy",
      target: "ssl-termination",
      type: "smoothstep",
      style: { stroke: '#F59E0B', strokeWidth: 2, strokeDasharray: '5,5' },
      animated: false,
    },
    {
      id: "waf-feature",
      source: "cloudflare-proxy",
      target: "waf-layer",
      type: "smoothstep",
      style: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '5,5' },
      animated: false,
    }
  ];
}

    return { nodes: stageNodes, edges: stageEdges };
  }, [stage]);

  return (
    <div className="w-[900px] h-[550px] rounded-xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300">
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