function processPayload(payload, schemas, regions, rules) {
  const normalized = normalizePayload(payload);
  const valid = requirePayload(normalized);
  if (!valid) return null;

  const schema = selectSchema(valid, schemas);
  if (!schema) return null;

  return {
    data: valid,
    intent: schema.intent,
    regions: regions[schema.intent] || [],
    rules
  };
}
