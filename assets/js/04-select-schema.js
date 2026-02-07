function selectSchema(payload, schemas = {}) {
  return typeof schemas.match === 'function'
    ? schemas.match(payload)
    : null;
}
