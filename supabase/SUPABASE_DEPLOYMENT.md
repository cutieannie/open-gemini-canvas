# Supabase Backend Deployment Guide

## Tổng quan
Thư mục này chứa Supabase Edge Functions thay thế cho FastAPI backend Python. Edge Functions chạy trên Deno runtime và sử dụng TypeScript.

## Cấu trúc
```
supabase/
├── config.toml                    # Cấu hình Supabase
├── functions/
│   └── copilotkit/
│       ├── index.ts               # Entry point chính
│       └── agents/
│           ├── post-generator.ts  # Agent tạo posts
│           └── stack-analyzer.ts  # Agent phân tích stack
```

## Yêu cầu
1. Cài đặt Supabase CLI:
   ```bash
   brew install supabase/tap/supabase
   ```
   Hoặc xem hướng dẫn tại: https://supabase.com/docs/guides/cli

2. Tạo tài khoản Supabase tại: https://supabase.com

## Các bước triển khai

### 1. Login vào Supabase CLI
```bash
supabase login
```

### 2. Tạo project mới trên Supabase Dashboard
- Truy cập https://supabase.com/dashboard
- Click "New Project"
- Điền tên project, database password, và chọn region
- Lưu lại **Project Ref** (dạng: `abcdefghijklmnop`)

### 3. Link project local với Supabase
```bash
cd /Users/nad/Gits/open-gemini-canvas
supabase link --project-ref <your-project-ref>
```

### 4. Cấu hình Environment Variables
Đặt biến môi trường cho Edge Function:

```bash
# GOOGLE_API_KEY (bắt buộc)
supabase secrets set GOOGLE_API_KEY=<your-gemini-api-key>

# GITHUB_TOKEN (tùy chọn, cho stack analyzer)
supabase secrets set GITHUB_TOKEN=<your-github-token>
```

### 5. Deploy Edge Function
```bash
supabase functions deploy copilotkit
```

Sau khi deploy thành công, bạn sẽ nhận được URL dạng:
```
https://<project-ref>.supabase.co/functions/v1/copilotkit
```

### 6. Test Edge Function
```bash
curl -X POST \
  'https://<project-ref>.supabase.co/functions/v1/copilotkit' \
  -H 'Authorization: Bearer <anon-key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [{"role": "user", "content": "Generate a LinkedIn post about AI"}],
    "agent": "post_generation_agent"
  }'
```

Lấy `anon-key` từ Dashboard → Settings → API → Project API keys

### 7. Cập nhật Next.js Frontend
Cập nhật file `.env.local` (hoặc Vercel env vars):

```env
NEXT_PUBLIC_LANGGRAPH_URL=https://<project-ref>.supabase.co/functions/v1/copilotkit
GOOGLE_API_KEY=<your-gemini-api-key>
```

### 8. Redeploy Frontend trên Vercel
```bash
vercel --prod
```

## Testing Local
Để test Edge Function local:

```bash
# Start Supabase local dev
supabase start

# Deploy function locally
supabase functions serve copilotkit --env-file supabase/.env.local

# Test
curl -X POST \
  'http://localhost:54321/functions/v1/copilotkit' \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "agent": "post_generation_agent"
  }'
```

## Monitoring & Logs
Xem logs của Edge Function:
```bash
supabase functions logs copilotkit
```

Hoặc trên Dashboard → Edge Functions → copilotkit → Logs

## Troubleshooting

### Lỗi "GOOGLE_API_KEY not configured"
- Kiểm tra đã set secret: `supabase secrets list`
- Nếu chưa có, set lại: `supabase secrets set GOOGLE_API_KEY=<key>`

### Lỗi CORS
- Edge Function đã được cấu hình với CORS headers
- Nếu vẫn gặp lỗi, kiểm tra Supabase Dashboard → Settings → API → CORS

### Lỗi timeout
- Edge Functions có giới hạn 150 giây
- Nếu agent chạy lâu, cần optimize hoặc chia nhỏ logic

## Chi phí
- Edge Functions: Miễn phí 500K invocations/tháng
- Xem thêm: https://supabase.com/pricing

## So sánh với FastAPI
| Tiêu chí | FastAPI (Python) | Supabase Edge Functions |
|----------|------------------|-------------------------|
| Runtime | Python + uvicorn | Deno (TypeScript) |
| Deploy | Cần server riêng | Serverless, tự scale |
| Chi phí | $5-20/tháng | Miễn phí 500K calls |
| Cold start | ~1-2s | ~100-300ms |
| Giới hạn | Tùy server | 150s timeout, 2GB RAM |

## Lưu ý
- Edge Functions chạy trên Deno, không phải Node.js
- Import packages bằng `npm:` prefix
- Không hỗ trợ binary dependencies phức tạp
- Lint errors trong IDE là bình thường (do config Node.js)
