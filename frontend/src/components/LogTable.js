function LogTable({ logs }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Response Time</th>
          <th className="p-3 text-left">Time</th>
          
          
        </tr>
      </thead>

      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className="border-b hover:bg-gray-50">

            <td className="p-3">{log.id}</td>

            <td className={`p-3 font-semibold ${
                log.is_anomaly ? "text-red-600" : "text-green-600"
              }`}>
                {log.status}

                {log.is_anomaly && (
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    Anomaly
                  </span>
                )}
              </td>

            <td className="p-3">
              <span className="bg-blue-100 px-2 py-1 rounded">
                {log.response_time} ms
              </span>
            </td>

            <td className="p-3 text-gray-600">
              {new Date(log.created_at).toLocaleString()}
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LogTable;