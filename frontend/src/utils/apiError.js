function pickMessage(data) {
  if (!data || typeof data !== "object") {
    return null;
  }
  const direct =
    (typeof data.message === "string" && data.message) ||
    (typeof data.error === "string" && data.error) ||
    null;
  if (direct) {
    return direct;
  }
  if (Array.isArray(data.errors) && data.errors.length) {
    const first = data.errors[0];
    if (typeof first === "string") {
      return first;
    }
    if (first && typeof first.message === "string") {
      return first.message;
    }
  }
  return null;
}

export function toAppError(error) {
  if (error instanceof Error) {
    return error;
  }
  const status = error?.response?.status;
  const data = error?.response?.data ?? error;
  if (typeof data === "string") {
    return new Error(data);
  }
  const msg = pickMessage(data);
  if (msg) {
    return new Error(msg);
  }
  if (status) {
    return new Error(`Request failed (${status})`);
  }
  return new Error("Request failed");
}
