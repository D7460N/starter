function normalizePayload(payload, schema = {}) {
  if (!payload) return null;
  return typeof schema.transform === 'function'
    ? schema.transform(payload)
    : payload;
}
