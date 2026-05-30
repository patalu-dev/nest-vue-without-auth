# Cấu hình biến môi trường

Tạo file `.env` trong thư mục backend với các biến sau:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_database_username
DB_PASSWORD=your_strong_password
DB_DATABASE=your_database_name
PORT=3000
```

**Lưu ý quan trọng:**
- Không sử dụng mật khẩu mặc định hoặc mật khẩu trống
- Sử dụng mật khẩu mạnh (ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)
- Không commit file `.env` vào git (đã được gitignore)
- Trong production, sử dụng biến môi trường từ hệ thống hoặc secret management service
