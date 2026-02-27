import { PaperPoint } from "../models/paperPoint.js";
import { User } from "../models/user.js";
import { buildBookFilter } from "./components/buildBookFilter.js";
import { buildUserFilter } from "./components/buildUserFilter.js";


export const getBooksPaginated = async (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const size = Math.max(1, parseInt(query.size) || 9);
    const sortBy = query.sortBy || "createdAt"; // createdAt, title, views, etc.
    const sortOrder = query.sortOrder === "asc" ? 1 : -1; // desc by default

    const filter = buildBookFilter(query);
    const totalItems = await PaperPoint.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalItems / size));

    const books = await PaperPoint.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * size)
        .limit(size);

    return {
        success: true,
        books,
        pagination: {
            total: totalItems,
            page,
            size,
            total_pages: totalPages,
            has_prev: page > 1,
            has_next: page < totalPages,
        },
    };
};


export const getUsersPaginated = async (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const size = Math.max(1, parseInt(query.size) || 10);
    const filter = buildUserFilter(query);
    
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalUsers / size));
    const usersActive = await User.countDocuments({ ...filter, isActive: true });
    const usersInactive = await User.countDocuments({ ...filter, isActive: false });
    const admins = await User.countDocuments({ ...filter, role: "Admin" });
    const authors = await User.countDocuments({ ...filter, role: "Author" });

    const users = await User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size);

    return {
        success: true,
        users,
        stats: {
            totalUsers,
            activeUsers: usersActive,
            inactiveUsers: usersInactive,
            admins,
            authors,
        },
        pagination: {
            total: totalUsers,
            page,
            size,
            totalPages,
            has_prev: page > 1,
            has_next: page < totalPages,
        },
    };
};
