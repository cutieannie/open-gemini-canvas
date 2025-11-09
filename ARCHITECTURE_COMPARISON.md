# So sánh kiến trúc Python vs Next.js

## Tóm tắt

Đã đơn giản hóa từ **Python FastAPI + LangGraph** sang **Next.js + Gemini** để dễ deploy và maintain.

## So sánh chi tiết

### 1. Post Generation Agent

| Feature | Python (FastAPI + LangGraph) | Next.js (Gemini Adapter) | Status |
|---------|------------------------------|--------------------------|---------|
| Agent metadata | ✅ Có | ✅ Có | ✅ |
| Google Search grounding | ✅ Có (bắt buộc mọi query) | ❌ Không (Gemini dùng training data) | ⚠️ Trade-off |
| Tool logs/progress | ✅ Có ("Analyzing query", "Web search") | ❌ Không | ⚠️ UI có fallback |
| Custom prompts | ✅ Có (system_prompt_3) | ✅ Có thể thêm | 🔧 Cần implement |
| Tool calling (generate_post) | ✅ Có | ✅ Tự động qua adapter | ✅ |
| Multi-step workflow | ✅ Có (chat → fe_actions → end) | ❌ Single-step | ⚠️ Trade-off |

**Impact:**
- ✅ **Core function hoạt động**: Gemini vẫn generate được posts
- ⚠️ **Quality thấp hơn**: Không có web search → content generic hơn, không current
- ⚠️ **Không có progress**: UI không hiển thị "Analyzing...", "Searching..."

### 2. Stack Analysis Agent

| Feature | Python (FastAPI + LangGraph) | Next.js (Gemini Adapter) | Status |
|---------|------------------------------|--------------------------|---------|
| Agent metadata | ✅ Có | ✅ Có | ✅ |
| GitHub API fetching | ✅ Có (README, languages, manifests) | ❌ Không | ❌ **Critical** |
| Tool logs/progress | ✅ Có ("Fetching repo", "Analyzing") | ❌ Không | ⚠️ UI có fallback |
| Structured output | ✅ Có (return_stack_analysis tool) | ❌ Không | ❌ **Critical** |
| State management | ✅ Có (show_cards, analysis) | ❌ Không | ❌ **Critical** |

**Impact:**
- ❌ **Không hoạt động đúng**: Agent không thể fetch GitHub data
- ❌ **UI broken**: Expect show_cards và analysis state

## Recommendations

### Option 1: Chấp nhận trade-offs (Hiện tại)

**Pros:**
- Đơn giản, dễ deploy
- Chỉ cần Vercel + Gemini API key
- Chi phí thấp

**Cons:**
- Post Generator: Kém chất lượng (không web search)
- Stack Analyzer: **KHÔNG HOẠT ĐỘNG**
- Không có progress indicators

### Option 2: Implement missing features

**Cần làm:**
1. ✅ Custom instructions cho agents (dễ)
2. ❌ GitHub fetching for stack analyzer (trung bình - cần API calls)
3. ❌ Tool logs/state management (khó - cần custom agent logic)
4. ❌ Google search integration (khó - cần external API)

**Estimate:** 4-6 giờ development

### Option 3: Hybrid approach

- **Post Generator**: Giữ đơn giản, add custom instructions
- **Stack Analyzer**: Add GitHub fetching via server action
- **Tool logs**: Skip (UI có fallback)

**Estimate:** 2-3 giờ development

## Khuyến nghị

**Short-term (ngay):**
- Thêm custom instructions để improve post quality
- Document rõ limitations

**Medium-term (nếu cần):**
- Implement GitHub fetching cho stack analyzer
- Add progress indicators

**Long-term (nếu scale):**
- Quay lại FastAPI backend riêng
- Hoặc dùng LangGraph.js thay vì simple Gemini adapter
