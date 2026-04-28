function StatusIndicator({ connected }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">

      <span
        className={`w-2.5 h-2.5 rounded-full animate-pulse ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>

      <span className={connected ? "text-green-600" : "text-red-600"}>
        {connected ? "Connected" : "Disconnected"}
      </span>

    </div>
  );
}

export default StatusIndicator;