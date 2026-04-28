export function generatePayload() {
  return {
    userId: Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    value: Math.random() * 100,
  };
}