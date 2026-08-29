# AI Assessment Extraction & Answer Mapping

A full-stack, polished, responsive Next.js application built for teachers to automate the extraction and mapping of handwritten student answers to assessment questions using Google's Gemini Multimodal AI.

## Features

- **Question Extraction**: Intelligently extracts every question while preserving printed order and handling subquestions (e.g., 11(a)).
- **Handwritten Answer Extraction**: Detects answers, page numbers, and exact visual bounding box regions across multiple pages.
- **Answer Mapping**: Maps answers to questions seamlessly, even if answers are out-of-order.
- **Exact Answer Highlighting**: Polished document viewer that draws a visible highlight rectangle over the exact handwritten answer on the scanned page.
- **Unanswered & Unmatched Support**: Clearly identifies unanswered questions and unmapped student answers.
- **Demo Mode**: Test the complete UI experience and interactive viewer without requiring an API key.
- **AI Grading**: Provides optional grading and detailed feedback.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui, Lucide React, Framer Motion
- **State Management**: Zustand
- **Document Viewing**: Canvas + CSS transforms
- **AI Integration**: Google Gemini Vision (`@google/genai`)

## AI Model & Architecture

This application utilizes **Gemini 2.5 Pro** for its exceptional reasoning and multimodal capabilities. It effectively reads both printed text (questions) and handwritten text (answers), recognizing structural patterns like subquestions and visual bounding boxes. 

**Pipeline:**
1. **Upload**: PDF/Images are uploaded by the teacher.
2. **Extraction**: `extract-questions` parses the question paper; `extract-answers` parses the answer sheet.
3. **Mapping**: `map-answers` semantically connects answers to questions.
4. **Grading**: Optional `grade` endpoint analyzes the mapping for correctness.

## Local Development

```bash
# Clone and enter the directory
cd D

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run development server
npm run dev
```

## Deployment

This application is ready to be deployed on **Vercel**.
1. Push the code to a GitHub repository.
2. Import the project in Vercel.
3. Set the `GEMINI_API_KEY` environment variable in the Vercel dashboard.
4. Deploy.

## Limitations

- **Handwriting Quality**: Extremely poor scans or illegible handwriting may lead to incorrect text extraction or mapping.
- **Bounding Box Precision**: AI-generated bounding boxes are an approximation and may occasionally exclude trailing words.
- **Multi-page Answer Overlap**: Answers spanning across physical page boundaries might be split unpredictably.
