export const buildUserFilter = (query) => {
  const { search, role, isActive, filter: filterParam } = query;
  const filter = {};

  const normalizedSearch = Array.isArray(search)
    ? String(search[0] || "").trim()
    : typeof search === "string"
      ? search.trim()
      : "";
  const normalizedSearchLower = normalizedSearch.toLowerCase();

  // Search by username, email hoặc fullName
  if (normalizedSearch && normalizedSearchLower !== "allusers" && normalizedSearchLower !== "all") {
    filter.$or = [
      { userName: { $regex: normalizedSearch, $options: "i" } },
      { email: { $regex: normalizedSearch, $options: "i" } },
      { fullName: { $regex: normalizedSearch, $options: "i" } },
    ];
  }

  const normalizedFilter = typeof filterParam === "string" ? filterParam.trim().toLowerCase() : "";
  if (normalizedFilter === "active") {
    filter.isActive = true;
  }
  if (normalizedFilter === "inactive") {
    filter.isActive = false;
  }
  if (normalizedFilter === "admin") {
    filter.role = "Admin";
  }
  if (normalizedFilter === "author") {
    filter.role = "Author";
  }

  // Filter by role
  if (role) {
    filter.role = role;
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  return filter;
};