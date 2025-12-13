# Prisma CLI - Các câu lệnh hay dùng

## 1. Khởi tạo Prisma

```bash
npx prisma init
```
**Ý nghĩa:** Khởi tạo Prisma trong dự án. Tạo thư mục `prisma/` chứa file `schema.prisma` và file `.env` để cấu hình database connection.

---

## 2. Migration (Quản lý thay đổi database)

### Tạo migration mới
```bash
npx prisma migrate dev --name <tên_migration>
```
**Ý nghĩa:** Tạo migration mới dựa trên thay đổi trong `schema.prisma`, áp dụng migration vào database và tự động generate Prisma Client. Dùng trong môi trường development.

### Áp dụng migration cho production
```bash
npx prisma migrate deploy
```
**Ý nghĩa:** Áp dụng tất cả migration chưa được áp dụng vào database. Dùng cho môi trường production/staging.

### Reset database
```bash
npx prisma migrate reset
```
**Ý nghĩa:** Xóa toàn bộ database, tạo lại từ đầu và áp dụng tất cả migration. **Cẩn thận: Sẽ mất hết dữ liệu!**

### Xem trạng thái migration
```bash
npx prisma migrate status
```
**Ý nghĩa:** Kiểm tra trạng thái các migration đã áp dụng và chưa áp dụng.

---

## 3. Generate Prisma Client

```bash
npx prisma generate
```
**Ý nghĩa:** Tạo/cập nhật Prisma Client dựa trên `schema.prisma`. Cần chạy sau mỗi lần thay đổi schema.

---

## 4. Prisma Studio (GUI quản lý database)

```bash
npx prisma studio
```
**Ý nghĩa:** Mở giao diện web để xem, thêm, sửa, xóa dữ liệu trong database một cách trực quan.

---

## 5. Database Push (Không tạo migration)

```bash
npx prisma db push
```
**Ý nghĩa:** Đồng bộ `schema.prisma` trực tiếp vào database mà không tạo migration. Thích hợp cho prototyping hoặc khi không cần theo dõi lịch sử thay đổi.

---

## 6. Database Pull (Introspection)

```bash
npx prisma db pull
```
**Ý nghĩa:** Đọc cấu trúc database hiện tại và cập nhật vào `schema.prisma`. Hữu ích khi làm việc với database có sẵn.

---

## 7. Seed Database

```bash
npx prisma db seed
```
**Ý nghĩa:** Chạy file seed để thêm dữ liệu mẫu vào database. Cần cấu hình script seed trong `package.json`.

---

## 8. Validate Schema

```bash
npx prisma validate
```
**Ý nghĩa:** Kiểm tra cú pháp và tính hợp lệ của file `schema.prisma`.

---

## 9. Format Schema

```bash
npx prisma format
```
**Ý nghĩa:** Tự động format file `schema.prisma` theo chuẩn của Prisma.

---

## 10. Xem thông tin phiên bản

```bash
npx prisma version
# hoặc
npx prisma -v
```
**Ý nghĩa:** Hiển thị phiên bản Prisma CLI và các thông tin liên quan.

---

## Tóm tắt nhanh

| Câu lệnh | Mục đích |
|----------|----------|
| `prisma init` | Khởi tạo Prisma |
| `prisma migrate dev` | Tạo & áp dụng migration (dev) |
| `prisma migrate deploy` | Áp dụng migration (production) |
| `prisma migrate reset` | Reset database |
| `prisma generate` | Tạo Prisma Client |
| `prisma studio` | Mở GUI quản lý DB |
| `prisma db push` | Đồng bộ schema không qua migration |
| `prisma db pull` | Lấy schema từ DB có sẵn |
| `prisma db seed` | Thêm dữ liệu mẫu |
| `prisma validate` | Kiểm tra schema |
| `prisma format` | Format schema |

