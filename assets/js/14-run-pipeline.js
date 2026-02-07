function runPipeline(url, root, options) {
  return apiOnInput(url, options)
    .then(payload => processPayload(payload, schemas.enterprise, intentRegions, insertionRules))
    .then(plan => insertPlan(plan, root));
}
