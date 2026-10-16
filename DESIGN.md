# Quy chuẩn giao diện – Rohto Zalo Mini App

App dành cho **khách hàng** (nhà thuốc / cửa hàng) nên mọi màn hình phải trông chuyên nghiệp và **cùng một phong cách**: nhẹ nhàng, rõ ràng, không lòe loẹt.

Trước khi làm hoặc sửa một màn hình, dùng component trong `src/components/ui` và đối chiếu với các màn đã chuẩn hoá: Kiểm tra POSM, Khuyến mãi, Chi tiết khuyến mãi, Tìm kiếm, Chi tiết sản phẩm.

## 1. Màu sắc

| Vai trò | Giá trị | Ghi chú |
|---|---|---|
| Nền trang | `bg-slate-50` | |
| Thẻ | nền trắng, viền `#E3EBF6` | `<Card>` |
| Màu nhấn | `text-primary` / `bg-primary` (#005DAA) | nút chính, tab đang chọn, link |
| Giá, nút thêm giỏ | `#e5232a` | khách thích nút "+" màu đỏ |
| Tiêu đề, tên sản phẩm | `text-slate-700` | **không dùng đen đậm** |
| Nội dung | `text-slate-600` | |
| Chữ phụ (mã, ngày, nhãn) | `text-slate-500` | |
| Chữ mờ (trống, gợi ý) | `text-slate-400` | |
| Trạng thái | xanh lá / cam / đỏ nhạt | `<StatusBadge tone=...>` |

Không dùng gradient đậm, bóng đổ nặng, hay ô icon màu đậm.

## 2. Chữ

Font ProximaNova (đã đặt chung trong `app.scss`).

| Loại | Cỡ / độ đậm |
|---|---|
| Tiêu đề header | 16px bold (`AppHeader`) |
| Tiêu đề mục | 14px semibold (`<SectionTitle>`) |
| Tên mục / sản phẩm | 13–14px medium/semibold |
| Nội dung | 13–14px |
| Chữ phụ | 11–12px |
| Giá | 14–15px bold, số `tabular-nums` |

Hiện **đủ thông tin**. Chỉ dùng `line-clamp-2` cho tên trong lưới; danh sách dài thì có nút "Xem thêm".

## 3. Bố cục

- Lề trang 16px (`px-4`), thẻ cách nhau 10–12px (`gap-2.5` / `gap-3`).
- Thẻ: bo `rounded-xl`, padding `p-3`–`p-3.5`.
- Nút, chip, tab: bo tròn hẳn (`rounded-full`), riêng nút chính là `rounded-xl`.
- Thanh cố định ở đáy (nút hành động): nền trắng, viền trên, chừa `env(safe-area-inset-bottom)`.

## 4. Component dùng chung (`@components/ui`)

| Component | Dùng cho |
|---|---|
| `AppHeader` (`@components/Header/AppHeader`) | header mọi trang; có nút quay lại, chừa chỗ cho cụm nút Zalo |
| `Card` | thẻ nội dung (`tone`: default/success/warning/danger/reward/info) |
| `SectionTitle` | tiêu đề mục |
| `PillTabs` | tab nội dung (`variant="solid"`) hoặc bộ lọc / sắp xếp (`variant="segmented"`) |
| `StatusBadge` | nhãn trạng thái |
| `InfoRow` | dòng "nhãn — giá trị" |
| `QtyStepper` | tăng/giảm số lượng |
| `Button` | nút (primary/danger/success/outline/soft/ghost) |
| `EmptyState` | trạng thái trống |
| `Grid` | lưới n cột |
| `TextInput` | ô nhập / ô tìm kiếm |

## 5. Lỗi CSS hay gặp với zmp

1. **Nút bị rộng 100%:** zmp-framework có `button { width: 100% }` cho mọi nút. Nút co theo nội dung phải có `w-auto` (`<Button>` đã tự xử lý).
2. **Lưới thành 3 cột:** `giohang.scss` có `.grid { grid-template-columns: 3fr 10fr 40px }`. Không dùng class `grid` của Tailwind; dùng `<Grid>` hoặc style trực tiếp.
3. **Ô nhập có viền lạ / viền xanh lá khi focus:** zmp-ui và `app.scss` tự thêm viền cho `input[type=text]`. Dùng `<TextInput>` hoặc reset bằng style trực tiếp.
4. **Header cố định:** con trực tiếp của `<Page>` có `slot="fixed"` hoặc `displayName = "zmp-navbar"` sẽ nằm cố định phía trên vùng cuộn.
5. **Không đổi màu chữ bằng `style={{ color }}` hay `Color.*`**; dùng class theo bảng màu ở mục 1.
