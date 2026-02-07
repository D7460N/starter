function projectRecord(record, row) {
  Object.entries(record).forEach(([key, value]) => {
    let tag;

    if (!key) {
      tag = 'no-key';
    } else {
      const normalized = toTagName(key);
      tag = normalized && !normalized.startsWith('-')
        ? normalized
        : 'invalid-key';
    }

    if (key && (value == null || value === '')) {
      tag = 'no-value';
    }

    const el = document.createElement(tag);
    if (value != null && value !== '') el.textContent = value;

    row.appendChild(el);
  });
}
