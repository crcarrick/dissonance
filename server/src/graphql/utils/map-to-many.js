export const mapToMany = (keys, keyFn) => (rows) => {
  const group = new Map(keys.map((key) => [key, []]));

  rows.forEach((row) => (group.get(keyFn(row)) || []).push(row));

  return Array.from(group.values());
};
