# English App - Monolith Backend

## Mô tả

Đây là phiên bản Monolith của backend English App, gom tất cả các services (auth, content, learning) vào một ứng dụng duy nhất.

## Cấu trúc thư mục

```
monolith/
├── index.js                 # Entry point
├── package.json
├── .env                     # Environment variables
├── prisma/
│   └── schema.prisma        # Database schema
├── uploads/                 # Thư mục chứa file upload
└── src/
    ├── controllers/
    │   ├── authController.js
    │   ├── contentController.js
    │   └── learningController.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── authRoutes.js
        ├── contentRoutes.js
        └── learningRoutes.js
```

## Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend/monolith
npm install
```

### 2. Cấu hình môi trường

Chỉnh sửa file `.env`:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/english_app"
JWT_SECRET="secret_key_123"
PORT=3000
```

### 3. Khởi tạo database

```bash
npx prisma generate
npx prisma db push
```

### 4. Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Auth API (`/auth`)

- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập

### Content API (`/content`)

- `GET /content/topics` - Lấy danh sách chủ đề
- `POST /content/topics` - Tạo chủ đề mới
- `PUT /content/topics/:id` - Cập nhật chủ đề
- `DELETE /content/topics/:id` - Xóa chủ đề
- `GET /content/topics/:topicId/vocabulary` - Lấy từ vựng theo chủ đề
- `POST /content/vocabulary` - Thêm từ vựng mới
- `PUT /content/vocabulary/:id` - Cập nhật từ vựng
- `DELETE /content/vocabulary/:id` - Xóa từ vựng
- `GET /content/topics/:topicId/tests` - Lấy bài test theo chủ đề
- `GET /content/tests/:id` - Lấy chi tiết bài test
- `POST /content/tests` - Tạo bài test mới
- `PUT /content/tests/:id` - Cập nhật bài test
- `DELETE /content/tests/:id` - Xóa bài test

### Learning API (`/api/learning`) - Yêu cầu đăng nhập

- `POST /api/learning/test/submit` - Nộp bài test
- `GET /api/learning/profile` - Lấy thông tin profile
- `GET /api/learning/review` - Lấy danh sách từ cần ôn tập
- `GET /api/learning/stats` - Lấy thống kê học tập

## Lưu ý

- Frontend sử dụng port 5000 trong môi trường phát triển
- Tất cả API endpoints giữ nguyên như phiên bản microservices
