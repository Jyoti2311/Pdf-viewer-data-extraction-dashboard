# Pdf-viewer-data-extraction-dashboard
# PDF Review Dashboard

A monorepo for reviewing, extracting, and managing invoice data from PDFs using AI (Gemini/Groq), built with Next.js and Node.js.

## Structure

- **apps/web** – Next.js frontend (PDF upload/view, AI extract, edit, CRUD)
- **apps/api** – Node.js REST API (PDF upload, AI extract, CRUD, MongoDB)
- **packages/types** – Shared TypeScript interfaces

## Demo

- Web: [https://yourproject-web.vercel.app](https://yourproject-web.vercel.app)
- API: [https://yourproject-api.vercel.app](https://yourproject-api.vercel.app)

Demo video: [link to your video]

## Setup

### 1. Install dependencies (at root)
```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in each app and fill in your MongoDB and API keys.

### 3. Run locally

#### Backend (API)
```bash
cd apps/api
npm run dev
```

#### Frontend (Web)
```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the web app.

## API Docs

### Upload PDF
`POST /upload`
- Body: form-data, field `file`
- Response:
  ```json
  { "fileId": "...", "fileName": "invoice.pdf" }
  ```

### Extract Data
`POST /extract`
- Body:
  ```json
  {
    "fileId": "...",
    "model": "gemini" | "groq"
  }
  ```
- Response:
  ```json
  {
    "vendor": {...},
    "invoice": {...}
  }
  ```

### CRUD Endpoints

- `GET /invoices?q=searchTerm`
- `GET /invoices/:id`
- `POST /invoices`
- `PUT /invoices/:id`
- `DELETE /invoices/:id`

**Sample Invoice Record**
```json
{
  "fileId": "abc123",
  "fileName": "invoice.pdf",
  "vendor": { "name": "Vendor", "address": "123 St", "taxId": "TAX123" },
  "invoice": {
    "number": "INV-001",
    "date": "2025-09-11",
    "currency": "USD",
    "subtotal": 100,
    "taxPercent": 5,
    "total": 105,
    "poNumber": "PO-789",
    "poDate": "2025-09-09",
    "lineItems": [
      { "description": "Item A", "unitPrice": 50, "quantity": 2, "total": 100 }
    ]
  },
  "createdAt": "2025-09-11T16:44:44Z",
  "updatedAt": "2025-09-11T17:00:00Z"
}
```

## Acceptance Criteria

- PDF uploads and renders in the viewer.
- AI extraction (Gemini/Groq) returns JSON matching minimal shape.
- Edited fields save to MongoDB and list view shows records with search.
- All listed API endpoints respond correctly.
- Both apps run locally and are live on Vercel.

## License

MIT
