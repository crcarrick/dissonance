export const mapTo = (keys, keyFn) => (rows) => {
  const group = new Map(keys.map((key) => [key, null]));

  rows.forEach((row) => group.set(keyFn(row), row));

  return Array.from(group.values());
};
