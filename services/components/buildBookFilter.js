export const buildBookFilter = (query) => {
  const { search, status, category, author, genre } = query;
  const filter = {};

  // Search filter - tìm theo title hoặc author
  if (search?.trim()) {
    filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { author: { $regex: search.trim(), $options: "i" } },
    ];
  }

  // Status filter (published, draft, hidden, etc.)
  if (status) {
    filter.status = status;
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Author filter (exact match hoặc regex)
  if (author) {
    filter.author = { $regex: author, $options: "i" };
  }

  // Genre/Tag filter
  if (genre) {
    filter.genre = genre;
  }

  return filter;
};