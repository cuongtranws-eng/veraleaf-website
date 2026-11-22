# Hướng dẫn đưa website VeraLeaf lên mạng

Website gồm **Next.js 16 + Payload CMS + PostgreSQL**, cần hosting chạy được **Node.js 22/24** và **PostgreSQL**.
Hosting WordPress / PHP thông thường **không** chạy được.

Có 3 cách. Khuyên dùng **Cách A (VPS)** — nếu công ty đã có VPS cho trang cũ (Strapi cũng chạy Node.js), có thể dùng luôn máy đó.

| | Cách A: VPS + PM2 | Cách B: VPS + Docker | Cách C: Vercel + Neon |
|---|---|---|---|
| Độ khó | Trung bình | Dễ (nếu quen Docker) | Dễ nhất |
| Chi phí | ~150–400k đ/tháng | ~150–400k đ/tháng | Miễn phí → ~20 USD/tháng |
| Ảnh tải lên | Lưu trên ổ đĩa | Lưu trong volume | **Cần thêm cấu hình lưu trữ** (chưa làm) |

---

## Chuẩn bị chung

1. **Tên miền**: trỏ bản ghi `A` của `veraleaf.com.vn` và `www` về IP của máy chủ (làm tại nơi mua tên miền).
2. **File `.env` trên máy chủ** (sao chép từ `.env.example`), tối thiểu:
   ```
   DATABASE_URL=postgres://veraleaf:<mật-khẩu-db>@127.0.0.1:5432/veraleaf
   PAYLOAD_SECRET=<chuỗi ngẫu nhiên ≥ 32 ký tự, KHÁC với máy của bạn>
   NEXT_PUBLIC_SERVER_URL=https://veraleaf.com.vn
   PAYLOAD_DB_PUSH=false
   ```
   Tạo chuỗi ngẫu nhiên trên Linux: `openssl rand -base64 48`
3. **Email (cho chức năng Quên mật khẩu)** — điền các biến `SMTP_*`. Với Gmail: bật xác minh 2 bước, tạo *App Password* rồi dùng
   `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=<gmail>`, `SMTP_PASS=<app password>`, `SMTP_FROM_ADDRESS=<gmail>`.

> **Không dùng lại `.env` của máy tính cá nhân trên máy chủ.** Mỗi môi trường có mật khẩu và secret riêng.

---

## Cách A — VPS Ubuntu 24.04 + PM2 (khuyên dùng)

```bash
# 1. Cài phần mềm (chạy với quyền root / sudo)
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs postgresql nginx certbot python3-certbot-nginx git
npm i -g pm2

# 2. Tạo cơ sở dữ liệu UTF-8
sudo -u postgres psql -c "CREATE USER veraleaf WITH PASSWORD '<mật-khẩu-db>';"
sudo -u postgres psql -c "CREATE DATABASE veraleaf OWNER veraleaf ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0;"

# 3. Đưa mã nguồn lên (qua Git, hoặc nén thư mục dự án — BỎ node_modules, .next, .env, backups)
mkdir -p /var/www && cd /var/www
git clone <địa-chỉ-repo> veraleaf     # hoặc giải nén file zip vào /var/www/veraleaf
cd veraleaf
nano .env                              # điền theo mục "Chuẩn bị chung"

# 4. Cài đặt, tạo bảng, build
npm ci
npm run migrate
npm run build

# 5. Chạy nền và tự khởi động lại khi máy chủ reboot
pm2 start deploy/ecosystem.config.cjs
pm2 save && pm2 startup

# 6. Nginx + HTTPS miễn phí
cp deploy/nginx.conf /etc/nginx/sites-available/veraleaf
ln -s /etc/nginx/sites-available/veraleaf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d veraleaf.com.vn -d www.veraleaf.com.vn

# 7. Tường lửa
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

**Cập nhật phiên bản mới** sau này:
```bash
cd /var/www/veraleaf && git pull && npm ci && npm run migrate && npm run build && pm2 restart veraleaf
```

---

## Cách B — VPS + Docker

```bash
apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
cd /var/www/veraleaf
nano .env     # PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL=https://veraleaf.com.vn, DB_PASSWORD, SMTP_* ...
docker compose up -d --build      # tự tạo PostgreSQL UTF-8, chạy migration rồi khởi động web
```
Sau đó làm bước 6–7 của Cách A (Nginx + HTTPS + tường lửa).
Cập nhật: `git pull && docker compose up -d --build`.

---

## Cách C — Vercel + Neon (không cần quản lý máy chủ)

1. Tạo database PostgreSQL trên **neon.tech** (chọn vùng Singapore), lấy chuỗi kết nối.
2. Đưa mã nguồn lên GitHub, import vào **vercel.com**, khai báo các biến môi trường như mục "Chuẩn bị chung".
3. **Bắt buộc thêm lưu trữ ảnh**: Vercel không giữ file tải lên, cần cài `@payloadcms/storage-vercel-blob` (hoặc S3) — báo để được cấu hình thêm.
4. Chạy `npm run migrate` một lần với `DATABASE_URL` của Neon (từ máy tính của bạn).

---

## Chuyển dữ liệu hiện có từ máy tính lên máy chủ

Nội dung bạn đã nhập (lĩnh vực, thông tin công ty, sơ đồ tổ chức, tài khoản admin…) đang nằm trong PostgreSQL trên máy tính. Để mang lên máy chủ:

1. Trên máy tính (Windows), trong thư mục dự án:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\backup.ps1
   ```
   → tạo `backups\db-<ngày-giờ>.dump` và `backups\media-<ngày-giờ>.zip`.
2. Tải 2 file này lên máy chủ (WinSCP, FileZilla hoặc `scp`).
3. Trên máy chủ (Cách A), **sau khi** đã tạo database ở bước 2:
   ```bash
   cd /var/www/veraleaf
   pg_restore --clean --if-exists --no-owner --dbname="$(grep ^DATABASE_URL .env | cut -d= -f2-)" db-<ngày-giờ>.dump
   unzip media-<ngày-giờ>.zip -d .        # tạo lại thư mục media/
   npm run migrate                         # áp dụng migration mới nếu có
   ```
   Với Docker: `docker compose cp db-<...>.dump db:/tmp/` rồi
   `docker compose exec db pg_restore --clean --if-exists --no-owner -U veraleaf -d veraleaf /tmp/db-<...>.dump`.

> Mật khẩu admin đi theo database, nên bạn đăng nhập máy chủ bằng đúng tài khoản đang dùng trên máy tính.

---

## Sao lưu tự động trên máy chủ

```bash
crontab -e
# Thêm dòng sau: sao lưu lúc 2 giờ sáng mỗi ngày, giữ 14 ngày
0 2 * * * cd /var/www/veraleaf && bash scripts/backup.sh >> backups/backup.log 2>&1
```
Nên định kỳ tải thư mục `backups/` về máy khác hoặc lưu trữ đám mây.

**Khôi phục**: dùng lệnh `pg_restore` như mục "Chuyển dữ liệu" với file `.dump` cần khôi phục, và giải nén file `media-*.tar.gz` (`tar -xzf media-....tar.gz`).

---

## Kiểm tra sau khi đưa lên

- [ ] `https://veraleaf.com.vn` tự chuyển sang `/vi`, có ổ khoá HTTPS.
- [ ] Chuyển VN / EN, bấm thử các trang con.
- [ ] `https://veraleaf.com.vn/admin` đăng nhập được; thử "Forgot password" nếu đã cấu hình SMTP.
- [ ] `https://veraleaf.com.vn/sitemap.xml` và `/robots.txt` mở được.
- [ ] Khai báo sitemap trong **Google Search Console**.
- [ ] Đã đặt lịch sao lưu tự động.
