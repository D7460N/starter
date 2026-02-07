function toTagName(key) {
  if (!key) return null;

  const words = key
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .split('-')
    .slice(0, 4);

  const name = words.join('-');
  return name.includes('-') && !name.startsWith('-') ? name : `${name}-`;
}
