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
- **Backend**: FastAPI (Python) hoặc Supabase Edge Functions (TypeScript/Deno)
- **Agents**:  Google Gemini + LangGraph
- **UI Layer**: CopilotKit


## 📌 About

This demo illustrates how CopilotKit can be paired with LangGraph and Gemini to create agents that are:
- **Context-aware** (understand the input you provide)
- **Task-focused** (generate content or analyze stacks)
- **UI-integrated** (feels like part of your app, not just a chatbox)


---

## Project Structure

- `/` — Next.js 15 app (UI) in the Project Root 
- `agent/` — FastAPI backend agent (Python) - tùy chọn
- `supabase/functions/copilotkit/` — Supabase Edge Functions backend (TypeScript/Deno) - tùy chọn

**Lưu ý**: Bạn chỉ cần chọn một trong hai backend: FastAPI hoặc Supabase Edge Functions.

---

## 🚀 Getting Started

### 1. Clone the repository
Clone this repo `git clone <project URL>`


### 2. Environment Configuration

Create a `.env` file in each relevant directory as needed. 

#### Backend (`agent/.env`):
```env
GOOGLE_API_KEY=<<your-gemini-key-here>>
```

#### Frontend (`/.env`):
```env
GOOGLE_API_KEY=<<your-gemini-key-here>>
```

---

### 3. Running the project

```bash
pnpm install
pnpm dev
```

---

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## Notes
- Ensure the backend agent is running before using the frontend.
- Update environment variables as needed for your deployment.

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Supabase (Backend) - **Được khuyến nghị**

**Ưu điểm**: 
- Serverless, tự động scale
- Miễn phí cho 500K requests/tháng
- Không cần quản lý server
- Cold start nhanh (~100-300ms)

**Các bước**:
1. **Deploy Frontend lên Vercel**:
   ```bash
   vercel --prod
   ```

2. **Deploy Backend lên Supabase**:
   - Xem hướng dẫn chi tiết tại: [`supabase/SUPABASE_DEPLOYMENT.md`](./supabase/SUPABASE_DEPLOYMENT.md)
   - Tóm tắt:
     ```bash
     # Login Supabase
     supabase login
     
     # Link project
     supabase link --project-ref <your-project-ref>
     
     # Set secrets
     supabase secrets set GOOGLE_API_KEY=<your-key>
     
     # Deploy
     supabase functions deploy copilotkit
     ```

3. **Cấu hình Vercel Environment Variables**:
   - `GOOGLE_API_KEY`: Gemini API key
   - `NEXT_PUBLIC_LANGGRAPH_URL`: `https://<project-ref>.supabase.co/functions/v1/copilotkit`

### Option 2: Vercel (Frontend) + FastAPI (Backend riêng)

**Ưu điểm**:
- Full control Python environment
- Có thể dùng dependencies phức tạp

**Nhược điểm**:
- Cần quản lý server riêng (Railway, Render, Fly.io)
- Chi phí $5-20/tháng

**Các bước**:
1. Deploy Frontend lên Vercel (như Option 1)
2. Deploy FastAPI lên Railway/Render/Fly.io
3. Set `NEXT_PUBLIC_LANGGRAPH_URL` trên Vercel trỏ tới URL backend

---

### Hosted URL: https://copilot-kit-deepmind.vercel.app/
