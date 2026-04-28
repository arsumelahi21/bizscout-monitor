import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

import LogTable from "./components/LogTable";
import Pagination from "./components/Pagination";
import StatusIndicator from "./components/StatusIndicator";

const API_URL = process.env.REACT_APP_API_URL;
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const socket = io(SOCKET_URL);

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit) || 1;

  // Fetch logs
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${API_URL}/api/logs?page=${page}&limit=${limit}`)
      .then((res) => {
        setLogs(res.data.data);
        setTotal(res.data.meta?.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load logs");
        setLoading(false);
      });
  }, [page]);

  // Socket
  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("new-log", (data) => {
      if (page === 1) {
        setLogs((prev) => [data, ...prev].slice(0, limit));
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-log");
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
        <StatusIndicator connected={connected} />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Insights</h2>

          <p>Total Logs: {total}</p>

          <p>
            Anomalies: {logs.filter(l => l.is_anomaly).length}
          </p>

          <p>
            Avg Response Time: {
              logs.length > 0
                ? Math.round(
                    logs.reduce((a, b) => a + b.response_time, 0) / logs.length
                  )
                : 0
            } ms
          </p>
        </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No data available
          </div>
        ) : (
          <LogTable logs={logs} />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      <div className="text-center text-gray-400 text-sm mt-4">
        Realtime updates active on page 1
      </div>
    </div>
  );
}

export default App;