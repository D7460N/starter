function insertPlan(plan, root) {
  if (!plan) return null;

  plan.regions.forEach(region => {
    projectCollection(plan, root);
  });

  return true;
}
