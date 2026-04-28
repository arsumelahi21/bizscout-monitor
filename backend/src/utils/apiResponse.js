export function success(res, data, meta = {}) {
  return res.json({
    success: true,
    data,
    meta,
  });
}

export function error(res, message = 'Something went wrong', status = 500) {
  return res.status(status).json({
    success: false,
    error: message,
  });
}