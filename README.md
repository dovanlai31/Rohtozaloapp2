# ZaloMiniApp_RoHTo

## Mục tiêu dự án
Ứng dụng Zalo Mini App cho thương hiệu Rohto, phục vụ khách hàng với các tính năng tích điểm, đổi quà, quản lý đơn hàng, khảo sát, thông báo, và nhiều tiện ích khác.

## Tính năng chính
- Đăng nhập, quản lý tài khoản khách hàng
- Tích lũy điểm, đổi quà
- Xem, đặt và quản lý đơn hàng
- Theo dõi thông báo, khuyến mãi
- Khảo sát khách hàng, thu thập ý kiến
- Xem danh mục sản phẩm, video, blog
- Tích hợp với hệ sinh thái Zalo

## Công nghệ sử dụng
- ReactJS (JSX)
- Vite
- TailwindCSS, SCSS
- Zalo Mini App SDK
- State management: custom store

## Cấu trúc thư mục
- `src/` — Mã nguồn chính
  - `components/` — Các component giao diện
  - `pages/` — Các trang chức năng
  - `services/` — Giao tiếp API, dịch vụ ngoài
  - `data/` — Dữ liệu mẫu
  - `hooks/` — Custom hooks
  - `utils/` — Tiện ích dùng chung
  - `styles/` — File style SCSS, CSS
- `assets-src/` — Tài nguyên gốc (ảnh, icon...)
- `www/` — Thư mục build, deploy

## Hướng dẫn chạy dự án
1. Cài đặt Node.js >= 16
2. Cài dependencies:
   ```bash
   npm install
   ```
3. Chạy dev:
   ```bash
   npm run dev
   ```
4. Build production:
   ```bash
   npm run build
   ```

## Đóng góp
Vui lòng tạo pull request hoặc liên hệ quản trị viên dự án để đóng góp ý kiến, báo lỗi hoặc bổ sung tính năng.