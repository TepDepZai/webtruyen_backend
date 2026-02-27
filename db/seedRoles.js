import { Role } from "../models/role.js";

const rolesData = [
    {
        name: "Guest",
        description: "Khách chưa đăng nhập, chỉ được xem truyện",
        permissions: ["read"],
        priority: 100
    },
    {
        name: "User",
        description: "Người dùng bình thường, có thể đọc, bình luận, theo dõi",
        permissions: ["read", "comment", "follow", "favorite"],
        priority: 50
    },
    {
        name: "Author",
        description: "Tác giả có thể tạo và quản lý truyện của mình",
        permissions: ["read", "comment", "follow", "favorite", "create_book", "edit_own_book", "delete_own_book"],
        priority: 30
    },
    {
        name: "Moderator",
        description: "Kiểm duyệt viên, có thể kiểm duyệt nội dung và báo cáo",
        permissions: ["read", "comment", "follow", "favorite", "moderate", "edit_any_book"],
        priority: 20
    },
    {
        name: "Admin",
        description: "Quản trị viên hệ thống, có thể quản lý người dùng và nội dung",
        permissions: ["read", "comment", "follow", "favorite", "create_book", "edit_any_book", "delete_any_book", "moderate", "manage_users"],
        priority: 10
    },
    {
        name: "SuperAdmin",
        description: "Quản trị viên cấp cao nhất, có toàn quyền",
        permissions: ["read", "comment", "follow", "favorite", "create_book", "edit_any_book", "delete_any_book", "moderate", "manage_users", "manage_roles", "system_config"],
        priority: 0
    }
];

export const seedRoles = async () => {
    try {
        console.log("🌱 Seeding roles...");
        
        // Xóa tất cả role cũ (optional, bỏ comment nếu muốn reset)
        // await Role.deleteMany({});
        
        for (const roleData of rolesData) {
            const existingRole = await Role.findOne({ name: roleData.name });
            
            if (!existingRole) {
                await Role.create(roleData);
                console.log(`✅ Created role: ${roleData.name}`);
            } else {
                // Update existing role with new permissions/description
                await Role.findOneAndUpdate(
                    { name: roleData.name },
                    { 
                        $set: {
                            description: roleData.description,
                            permissions: roleData.permissions,
                            priority: roleData.priority
                        }
                    }
                );
                console.log(`🔄 Updated role: ${roleData.name}`);
            }
        }
        
        console.log("✅ Roles seeded successfully!");
        return { success: true, message: "Roles seeded successfully" };
    } catch (error) {
        console.error("❌ Error seeding roles:", error);
        return { success: false, message: error.message };
    }
};
