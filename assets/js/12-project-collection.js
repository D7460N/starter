function projectCollection(plan, root) {
  if (!plan || !Array.isArray(plan.data)) return null;

  plan.regions.forEach(region => {
    const container = root.querySelector(`${region} ol`);
    if (!container) return;

    if (plan.rules.strategy === 'replace') {
      container.replaceChildren();
    }

    plan.data.forEach(record => {
      const row = document.createElement('li');
      projectRecord(record, row);
      container.appendChild(row);
    });
  });

  return true;
}
