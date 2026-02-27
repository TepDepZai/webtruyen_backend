# RBAC (Role-Based Access Control) System

## Tổng quan

Hệ thống RBAC quản lý quyền truy cập dựa trên vai trò (Role) và quyền hạn (Permission).

## Cấu trúc Role

### Role mặc định:

| Role | Priority | Mô tả |
|------|----------|-------|
| **SuperAdmin** | 0 | Toàn quyền quản trị hệ thống |
| **Admin** | 10 | Quản trị viên, quản lý users và nội dung |
| **Moderator** | 20 | Kiểm duyệt nội dung và báo cáo |
| **Author** | 30 | Tác giả, tạo và quản lý truyện |
| **User** | 50 | Người dùng thông thường |
| **Guest** | 100 | Khách chưa đăng nhập |

## Permissions

### Danh sách permissions:
- `read` - Đọc truyện
- `comment` - Bình luận
- `follow` - Theo dõi
- `favorite` - Yêu thích
- `create_book` - Tạo truyện
- `edit_own_book` - Sửa truyện của mình
- `edit_any_book` - Sửa bất kỳ truyện nào
- `delete_own_book` - Xóa truyện của mình
- `delete_any_book` - Xóa bất kỳ truyện nào
- `moderate` - Kiểm duyệt nội dung
- `manage_users` - Quản lý người dùng
- `manage_roles` - Quản lý roles
- `system_config` - Cấu hình hệ thống

## API Endpoints

### Public endpoints (không cần xác thực):
```
GET /api/v1/role/getAllRoles - Lấy tất cả roles
GET /api/v1/role/getRole/:roleId - Lấy role theo ID
GET /api/v1/role/getRoleByName/:name - Lấy role theo tên
```

### Admin endpoints (cần Admin/SuperAdmin):
```
GET /api/v1/role/getRoleStats - Lấy thống kê role
```

### SuperAdmin endpoints (chỉ SuperAdmin):
```
POST /api/v1/role/createRole - Tạo role mới
PUT /api/v1/role/updateRole/:roleId - Cập nhật role
DELETE /api/v1/role/deleteRole/:roleId - Xóa role
```

## Seed Roles

### Tự động seed khi khởi động server:
Server sẽ tự động seed roles khi khởi động (xem `src/server.js`).

### Chạy seed thủ công:
```bash
cd PaperPointAPI
node db/seed.js
```

## Sử dụng trong Backend

### 1. Kiểm tra theo Role (checkRole):
```javascript
import checkRole from "../middleware/checkRole.js";

router.get("/admin-only", 
  isAuthenticated, 
  checkRole(["Admin", "SuperAdmin"]), 
  handler
);
```

### 2. Kiểm tra theo Permission (checkPermission):
```javascript
import checkPermission from "../middleware/checkPermission.js";

router.post("/create-book", 
  isAuthenticated, 
  checkPermission(["create_book"]), 
  handler
);
```

### 3. Kiểm tra trong Controller:
```javascript
const isAdmin = ["Admin", "SuperAdmin"].includes(req.user.role);
const isOwner = resource.createdById.toString() === req.user._id.toString();

if (!isAdmin && !isOwner) {
  return res.status(403).json({ 
    success: false, 
    message: "Permission denied" 
  });
}
```

## Sử dụng trong Frontend

### 1. Import service:
```typescript
import { getAllRoles, getRoleStats } from "@/services/roleService";
```

### 2. Kiểm tra permission:
```typescript
import { canCreateBook, canEditBook } from "@/lib/permissions";

if (canCreateBook(user)) {
  // Show create button
}
```

### 3. Sử dụng trong component:
```tsx
const { user } = useAuth();

{["Admin", "SuperAdmin"].includes(user?.role) && (
  <AdminPanel />
)}
```

## Best Practices

1. **Luôn kiểm tra quyền ở backend** - Frontend chỉ để UX
2. **Sử dụng checkRole cho route guards** - Nhanh và đơn giản
3. **Sử dụng checkPermission cho logic phức tạp** - Linh hoạt hơn
4. **Kiểm tra ownership ở controller** - Tránh user sửa resource của người khác
5. **Không cho phép user tự nâng quyền** - Bảo vệ endpoint assignRole
6. **Log mọi thay đổi role/permission** - Audit trail

## Mở rộng

### Thêm role mới:
1. Thêm vào enum trong `models/user.js`
2. Thêm vào `db/seedRoles.js`
3. Chạy seed: `node db/seed.js`

### Thêm permission mới:
1. Thêm vào permissions list trong `db/seedRoles.js`
2. Cập nhật roles cần permission đó
3. Chạy seed để cập nhật

### Tạo hierarchy roles:
Sử dụng `priority` để xác định thứ bậc roles (số nhỏ hơn = quyền cao hơn).

## Troubleshooting

### Lỗi "Role not found":
- Chạy seed: `node db/seed.js`
- Kiểm tra database connection

### Lỗi "Permission denied":
- Kiểm tra user có role phù hợp
- Kiểm tra role có permission cần thiết
- Kiểm tra middleware order (isAuthenticated phải trước checkRole)

### Seed không chạy:
- Kiểm tra .env có SECRET_KEY và DB connection
- Kiểm tra models đã import đúng
- Xem log để biết lỗi cụ thể
