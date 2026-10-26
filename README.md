# Lịch Họ Phạm

Ứng dụng lịch âm cho dòng họ, có hai bản dùng chung một mã nguồn:

- **Android:** tệp APK, có thông báo nhắc trước ngày giỗ và sự kiện.
- **iPhone và máy tính:** trang web, mở bằng Safari rồi "Thêm vào MH chính" là dùng như app (không có thông báo nhắc).

Tính năng:

- **Lịch âm–dương** theo giờ Việt Nam: can chi, tiết khí, giờ hoàng đạo, lễ tết, Thanh minh.
- **Thông tin chung** lấy từ Google Sheet: ngày giỗ, sự kiện, danh bạ, thông báo. Sửa Sheet xong, mọi người bấm ⟳ là thấy bản mới. Dữ liệu được lưu lại nên mất mạng vẫn xem được.
- **Ghi chú riêng** của từng người: chỉ lưu trên máy của người đó, có nút sao lưu và khôi phục.

## Dữ liệu: Google Sheet

Link Sheet được khai báo trong `www/config.js`. Sheet phải chia sẻ ở chế độ "Bất kỳ ai có đường liên kết → Người xem". Chỉ người được thêm với quyền **Người chỉnh sửa** mới sửa được.

Sheet có 4 tab, giữ đúng tên: `Ngày giỗ`, `Sự kiện`, `Danh bạ`, `Cài đặt`. Mẫu trống nằm trong `docs/`.

| Tab | Ghi chú |
|---|---|
| Ngày giỗ | Nhập trực tiếp **ngày/tháng âm**. Cột "Tháng nhuận" ghi `Có` nếu cụ mất vào tháng nhuận. Năm đó không có tháng nhuận thì app tính vào tháng thường. Giỗ ngày 30 mà tháng đó chỉ có 29 ngày thì app hiện vào ngày 29. |
| Sự kiện | "Loại lịch" ghi `Âm` hoặc `Dương`. **Để trống cột Năm** thì sự kiện lặp lại hằng năm. |
| Danh bạ | Nên định dạng cột Điện thoại là **văn bản thuần túy** để không mất số 0 ở đầu. |
| Cài đặt | Tên dòng họ, link trang gia phả, thông báo chung, số ngày nhắc trước. |

Sửa dữ liệu trong Sheet thì **không cần** build lại app. Chỉ build lại khi sửa mã nguồn.

## Bản Android (APK)

GitHub tự build mỗi lần push lên nhánh `main`, theo cấu hình `.github/workflows/build-apk.yml`.

1. **Làm một lần:** vào **Settings → Secrets and variables → Actions → New repository secret**, đặt tên `ANDROID_DEBUG_KEYSTORE` và dán nội dung tệp `ANDROID_DEBUG_KEYSTORE.txt`. Phải dùng **đúng khóa cũ**, nếu không bản mới sẽ không cài đè được lên bản họ hàng đang dùng. Không đưa tệp khóa lên GitHub.
2. Push mã lên, hoặc vào **Actions → Build Lịch Âm APK → Run workflow** để chạy tay.
3. Khoảng 5 phút sau, mở lần chạy đó, kéo xuống mục **Artifacts** và tải `lich-ho-pham-apk` về (tệp zip chứa APK).

## Bản web và iPhone (Vercel)

1. Vào vercel.com → **Add New → Project**, chọn repo `calendar`, rồi bấm **Deploy**. Không cần chỉnh gì thêm, vì cấu hình đã có sẵn trong `vercel.json`.
2. Nếu muốn có tên miền riêng: vào **Settings → Domains** của dự án, thêm ví dụ `lich.hophamdongngac.io.vn`. Sau đó tạo bản ghi CNAME theo hướng dẫn Vercel hiển thị.
3. Gửi link cho họ hàng. Người dùng iPhone mở bằng **Safari**, bấm **Chia sẻ → Thêm vào MH chính**. Lần đầu mở app sẽ hiện sẵn hướng dẫn này.

Mỗi lần push lên `main`, Vercel tự cập nhật bản web.

Lưu ý trên iPhone:
- Không có thông báo nhắc nhở. iPhone không cho ứng dụng web tự hẹn giờ thông báo.
- Ghi chú riêng lưu trong app ở màn hình chính, tách riêng với Safari. iPhone có thể xóa dữ liệu này nếu không mở app nhiều tuần, nên hãy dùng nút sao lưu.

## Chạy thử trên máy tính

Mở thư mục `www` bằng một máy chủ tĩnh bất kỳ, ví dụ `npx serve www`, rồi vào địa chỉ nó in ra. Không mở trực tiếp tệp `index.html` bằng cách nhấp đúp.

## Cấu trúc

```
www/                 mã ứng dụng (dùng chung cho APK và web)
  index.html, style.css
  app.js             đọc Sheet, lịch, sắp tới, danh bạ, ghi chú, nhắc nhở
  lunar.js           âm lịch (thuật toán Hồ Ngọc Đức, UTC+7)
  config.js          link Sheet, tên app, link gia phả
  sw.js              cho bản web mở được khi mất mạng
assets/              biểu tượng và màn hình chờ cho Android
capacitor.config.json, package.json   đóng gói Android
vercel.json          đưa bản web lên Vercel
docs/                mẫu Google Sheet
```
