export const parsePagination = (query = {}) => {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const sortRaw = query.sort || '-createdAt';
  const sort = sortRaw
    .split(',')
    .reduce((acc, field) => {
      const f = field.trim();
      if (!f) return acc;
      if (f.startsWith('-')) acc[f.slice(1)] = -1;
      else acc[f] = 1;
      return acc;
    }, {});
  const skip = (page - 1) * limit;
  return { page, limit, skip, sort };
};

