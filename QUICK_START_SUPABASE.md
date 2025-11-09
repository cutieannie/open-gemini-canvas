# Quick Start: Deploy với Supabase Backend

Hướng dẫn nhanh để deploy toàn bộ ứng dụng lên Vercel + Supabase.

## Prerequisites

```bash
# Cài đặt Supabase CLI
brew install supabase/tap/supabase

# Hoặc với npm
npm install -g supabase
```

## Bước 1: Setup Supabase Project

1. Tạo tài khoản tại https://supabase.com
2. Tạo project mới trên Dashboard
3. Lưu lại **Project Reference ID** (dạng: `abcdefghijklmnop`)

## Bước 2: Deploy Backend lên Supabase

```bash
# Login
supabase login

# Link project
cd /Users/nad/Gits/open-gemini-canvas
supabase link --project-ref <your-project-ref>

# Set environment variables
supabase secrets set GOOGLE_API_KEY=<your-gemini-api-key>
supabase secrets set GITHUB_TOKEN=<your-github-token>  # Optional

# Deploy Edge Function
supabase functions deploy copilotkit
```

Sau khi deploy thành công, bạn sẽ có URL:
```
https://<project-ref>.supabase.co/functions/v1/copilotkit
```

## Bước 3: Deploy Frontend lên Vercel

```bash
# Nếu chưa link với Vercel
vercel link --yes

# Set environment variables trên Vercel
vercel env add GOOGLE_API_KEY production
# Nhập: <your-gemini-api-key>

vercel env add NEXT_PUBLIC_LANGGRAPH_URL production
# Nhập: https://<project-ref>.supabase.co/functions/v1/copilotkit

# Deploy
vercel --prod
```

## Bước 4: Test

Truy cập URL Vercel của bạn và test các agent:
- Post Generator: Thử tạo LinkedIn/Twitter posts
- Stack Analyzer: Thử phân tích một GitHub repo

## Troubleshooting

### Lỗi "GOOGLE_API_KEY not configured"
```bash
# Kiểm tra secrets
supabase secrets list

# Set lại nếu cần
supabase secrets set GOOGLE_API_KEY=<your-key>

# Redeploy
supabase functions deploy copilotkit
```

### Xem logs
```bash
# Real-time logs
supabase functions logs copilotkit --follow

# Hoặc trên Dashboard
# Edge Functions → copilotkit → Logs
```

### Test local
```bash
# Start Supabase local
supabase start

# Copy env file
cp supabase/.env.example supabase/.env.local
# Edit supabase/.env.local với API keys

# Serve function locally
supabase functions serve copilotkit --env-file supabase/.env.local

# Test với curl
curl -X POST \
  'http://localhost:54321/functions/v1/copilotkit' \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [{"role": "user", "content": "Generate a LinkedIn post about AI"}],
    "agent": "post_generation_agent"
  }'
```

## Chi phí

- **Supabase**: Miễn phí 500K function invocations/tháng
- **Vercel**: Miễn phí cho hobby projects
- **Gemini API**: Xem pricing tại https://ai.google.dev/pricing

**Tổng chi phí dự kiến**: $0/tháng cho usage thấp đến trung bình

## Next Steps

- Thêm custom domain trên Vercel
- Setup monitoring và alerts trên Supabase Dashboard
- Tối ưu hóa agent responses để giảm latency
- Thêm caching layer nếu cần

## Hỗ trợ

- Supabase Docs: https://supabase.com/docs/guides/functions
- Vercel Docs: https://vercel.com/docs
- Gemini API: https://ai.google.dev/docs
