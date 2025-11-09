# Open Gemini Canvas

https://github.com/user-attachments/assets/1e95c9e1-2d55-4f63-b805-be49fe94a493

# CopilotKit + Google DeepMind (Gemini) + LangGraph Template

This project showcases how to build practical AI agents with **CopilotKit**, **Google DeepMind’s Gemini**, and **LangGraph**.  
It includes two agents, exposed through a **Next.js frontend** and a **FastAPI backend**.

## ✨ Features

- **Post Generator Agent**  
  Generate LinkedIn and Twitter posts from the context you provide.  
  Useful for creating professional, context-aware social content.

- **Stack Analyzer Agent**  
  Provide a URL and get a detailed breakdown of the site’s technology stack.  
  Quickly identify frameworks, libraries, and infrastructure used.

## 🛠️ Tech Stack

- **Frontend**: Next.js  
- **AI Model**: Google Gemini (gemini-2.0-flash-exp)
- **UI Layer**: CopilotKit
- **Deployment**: Vercel


## 📌 About

This demo illustrates how CopilotKit can be paired with LangGraph and Gemini to create agents that are:
- **Context-aware** (understand the input you provide)
- **Task-focused** (generate content or analyze stacks)
- **UI-integrated** (feels like part of your app, not just a chatbox)


---

## Project Structure

- `/` — Next.js 15 app (UI + API Routes)
- `/app/api/copilotkit/` — API route kết nối với Gemini
- `components/` — React components với CopilotKit integration
- `agent/` — Legacy FastAPI backend (không dùng nữa)
- `supabase/` — Legacy Supabase Edge Functions (tham khảo)

---

## 🚀 Getting Started

### 1. Clone the repository
Clone this repo `git clone <project URL>`


### 2. Environment Configuration

Tạo file `.env.local` trong thư mục root:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Lấy API key miễn phí tại: https://aistudio.google.com/apikey

---

### 3. Running the project

```bash
# Install dependencies
npm install --legacy-peer-deps
# hoặc nếu có pnpm: pnpm install

# Start dev server
npm run dev:ui
# hoặc: pnpm dev:ui
```

---

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## Notes
- Chỉ cần một API key Gemini duy nhất
- Tất cả chạy trên Next.js, không cần backend riêng
- Deploy chỉ cần Vercel

## ⚠️ Limitations (so với Python version)

Kiến trúc hiện tại được đơn giản hóa để dễ deploy. So với Python FastAPI version:

**Post Generator:**
- ⚠️ **Không có real-time web search**: Dựa trên Gemini training data thay vì Google Search API
- ⚠️ **Không có progress indicators**: UI không hiển thị "Analyzing query...", "Performing web search..."
- ✅ **Vẫn generate được posts**: Quality tốt nhưng có thể kém current hơn

**Stack Analyzer:**
- ⚠️ **Giới hạn GitHub analysis**: Không fetch trực tiếp repo data (README, package.json, etc.)
- ⚠️ **Dựa vào inference**: Analyze dựa trên patterns và Gemini knowledge
- ⚠️ **Không có progress indicators**: UI không hiển thị fetching steps

**Trade-offs được chấp nhận để:**
- ✅ Đơn giản deployment (chỉ Vercel)
- ✅ Không cần manage backend riêng
- ✅ Chi phí thấp hơn
- ✅ Dễ maintain

Xem chi tiết: [`ARCHITECTURE_COMPARISON.md`](./ARCHITECTURE_COMPARISON.md)

---

## 🌐 Deployment

### Deploy lên Vercel (Đơn giản nhất)

**Ưu điểm**: 
- Serverless, tự động scale
- Miễn phí cho hobby projects
- Không cần backend riêng
- Setup trong 2 phút

**Các bước**:

1. **Link với Vercel** (nếu chưa):
   ```bash
   vercel link
   ```

2. **Cấu hình Environment Variables**:
   ```bash
   vercel env add GOOGLE_API_KEY production
   # Nhập: <your-gemini-api-key>
   
   vercel env add GOOGLE_API_KEY preview
   # Nhập: <your-gemini-api-key>
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

**Hoặc deploy qua Vercel Dashboard**:
1. Import repo từ GitHub
2. Thêm env var `GOOGLE_API_KEY` trong Settings → Environment Variables
3. Click Deploy

---

### Advanced: Custom Backend (Tùy chọn)

Nếu muốn tách backend riêng, xem:
- [`agent/`](./agent/) - FastAPI implementation
- [`supabase/`](./supabase/) - Supabase Edge Functions implementation

**Lưu ý**: Các backend này là legacy code, không cần thiết cho deployment đơn giản.

---

### Hosted URL: https://copilot-kit-deepmind.vercel.app/
