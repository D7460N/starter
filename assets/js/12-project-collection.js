function projectCollection(plan, root) {
  if (!plan || !Array.isArray(plan.data)) {
    logBoundary(false, 'projectCollection:invalid-plan');
    return null;
  }

  logBoundary(true, 'projectCollection:collection-received');

  plan.regions.forEach(region => {
    const container = root.querySelector(`${region} ol`);
    if (!container) {
      logBoundary(false, `projectCollection:missing-container-${region}`);
      return;
    }

    logBoundary(true, `projectCollection:container-${region}`);

    if (plan.rules.strategy === 'replace') {
      container.replaceChildren();
    }

    plan.data.forEach(record => {
      const row = document.createElement('li');
      projectRecord(record, row);
      container.appendChild(row);
    });

    logBoundary(true, `projectCollection:projected-${region}`);
  });

  logBoundary(true, 'projectCollection:completed');
  return true;
}
