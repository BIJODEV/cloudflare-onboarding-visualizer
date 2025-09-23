import { useState } from 'react';

function ProxyToggle() {
  const [isProxied, setIsProxied] = useState(false);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold mb-4">
        Proxy Mode:{" "}
        <span className={isProxied ? "text-orange-500" : "text-gray-500"}>
          {isProxied ? "ON 🟧" : "OFF ☁️"}
        </span>
      </h2>

      <label className="inline-flex items-center cursor-pointer mb-6">
        <span className="mr-3 text-sm font-medium text-gray-700">DNS Only</span>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isProxied}
          onChange={() => setIsProxied(!isProxied)}
        />
        <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 relative transition-all">
          <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6"></div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700">Proxied</span>
      </label>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        {isProxied ? (
          <ul className="space-y-2 text-left text-gray-800">
            <li>🔐 <strong>SSL Termination</strong> — Secure connections at the edge</li>
            <li>🛡️ <strong>WAF Rules</strong> — OWASP + Managed protection</li>
            <li>⚡ <strong>Caching</strong> — Faster load times via edge caching</li>
            <li>🧠 <strong>Smart Rules</strong> — Traffic optimization and filtering</li>
          </ul>
        ) : (
          <p className="text-gray-600">DNS resolution only. No protection or performance features enabled.</p>
        )}
      </div>
    </div>
  );
}

export default ProxyToggle;
