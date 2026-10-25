# QUAD-API

A lightweight REST API for **QR codes, barcodes, and image processing**.
Generate and read QR codes and barcodes, convert images between formats, and resize images, all through simple HTTP endpoints.

![version](https://img.shields.io/badge/version-1.0.0-blue)
![node](https://img.shields.io/badge/node-%3E%3D20-green)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Table of Contents

- [Features](#features)
- [Roadmap (v2)](#roadmap-v2)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Security](#security)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Contributions](#contributions)
- [License](#license)

---

## Features

### Available in v1

| Module | Description |
|---|---|
| **QR Codes** | Create QR codes from text/URLs and read (decode) QR codes from images |
| **Barcodes** | Create barcodes (e.g. Code128, EAN-13) and read barcodes from images |
| **Image Conversion** | Convert images between formats (PNG, JPEG, WebP, etc.) |
| **Image Resizing** | Resize images by width, height, or both, with fit options |

---

## Roadmap (v2)

The following features are planned for **version 2** and are **not yet available**:

- [ ] **User authentication**: registration, login, JWT-based access, API keys
- [ ] **Background workers**: async processing of heavy jobs using **Redis** and **BullMQ**
- [ ] **Job status tracking**: submit a job, receive a job ID, poll for results
- [ ] **Per-user usage limits and history**

---

## Tech Stack

| Area | Packages |
|---|---|
| Runtime / framework | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| QR codes | `qrcode` (create), `jsqr` (read) |
| Barcodes | `bwip-js` (create), `@zxing/library` (read) |
| Image processing | `sharp` |
| File uploads | `multer` |
| Security | `helmet`, `cors`, `express-rate-limit`, `express-mongo-sanitize` |
| Utilities | `compression`, `morgan`, `dotenv`, `cookie-parser` |
| Auth (v2) | `bcrypt`, `jsonwebtoken` |
| Background jobs (v2) | Redis, BullMQ |
| Dev | `nodemon` |

---

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm
- A running MongoDB instance (local or Atlas)

> Redis is **not** required for v1. It will be required from v2 onward.

### Installation

```bash
git clone https://github.com/<your-username>/quad-api.git
cd quad-api
npm install
```

### Run the server

```bash
# development (auto-reload)
npm run dev

# production
npm start
```

The API will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/quad-api
MAX_FILE_SIZE_MB=10
CORS_ORIGIN=http://localhost:5173
```

Planned for v2:

```env
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## API Reference

**Base URL:** `/api/v1`

### QR Codes

#### Create a QR code
`POST /api/v1/qrcode/create`

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | string | yes | Text or URL to encode |
| `format` | string | no | `png` (default), `svg` |
| `size` | number | no | Output size in pixels |

```bash
curl -X POST http://localhost:3000/api/v1/qrcode/create \
  -H "Content-Type: application/json" \
  -d '{"data": "https://example.com", "format": "png", "size": 300}' \
  --output qr.png
```

#### Read a QR code
`POST /api/v1/qrcode/read`

Send an image as `multipart/form-data` with the field name `image`.

```bash
curl -X POST http://localhost:3000/api/v1/qrcode/read \
  -F "image=@qr.png"
```

**Response**
```json
{
  "success": true,
  "data": "https://example.com"
}
```

### Barcodes

#### Create a barcode
`POST /api/v1/barcode/create`

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | string | yes | Value to encode |
| `type` | string | no | `code128` (default), `ean13`, etc. |
| `format` | string | no | `png` (default), `svg` |

```bash
curl -X POST http://localhost:3000/api/v1/barcode/create \
  -H "Content-Type: application/json" \
  -d '{"data": "123456789012", "type": "code128"}' \
  --output barcode.png
```

#### Read a barcode
`POST /api/v1/barcode/read`

```bash
curl -X POST http://localhost:3000/api/v1/barcode/read \
  -F "image=@barcode.png"
```

**Response**
```json
{
  "success": true,
  "type": "code128",
  "data": "123456789012"
}
```

### Image Conversion

#### Convert an image
`POST /api/v1/image/convert`

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | file | yes | Image to convert |
| `format` | string | yes | Target format: `png`, `jpeg`, `webp`, etc. |
| `quality` | number | no | 1-100 (for lossy formats) |

```bash
curl -X POST http://localhost:3000/api/v1/image/convert \
  -F "image=@photo.png" \
  -F "format=webp" \
  --output photo.webp
```

### Image Resizing

#### Resize an image
`POST /api/v1/image/resize`

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | file | yes | Image to resize |
| `width` | number | no* | Target width in pixels |
| `height` | number | no* | Target height in pixels |
| `fit` | string | no | `cover`, `contain`, `fill`, `inside`, `outside` |

\*At least one of `width` or `height` is required.

```bash
curl -X POST http://localhost:3000/api/v1/image/resize \
  -F "image=@photo.jpg" \
  -F "width=800" \
  -F "fit=contain" \
  --output resized.jpg
```

---

## Security

- **Helmet** sets secure HTTP headers
- **Rate limiting** protects endpoints from abuse (`express-rate-limit`)
- **Input sanitization** guards against NoSQL injection (`express-mongo-sanitize`)
- **CORS** is restricted via the `CORS_ORIGIN` variable
- **Upload limits** are enforced with Multer (`MAX_FILE_SIZE_MB`)

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Invalid image format"
  }
}
```

| Code | Meaning |
|---|---|
| 400 | Bad request / missing or invalid parameters |
| 413 | File too large |
| 415 | Unsupported media type |
| 422 | No QR code or barcode found in image |
| 429 | Too many requests (rate limit exceeded) |
| 500 | Internal server error |

---

## Project Structure

```
quad-api/
├── src/
│   ├── routes/
│   │   ├── qrcode.routes.js
│   │   ├── barcode.routes.js
│   │   └── image.routes.js
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── app.js
├── .env.example
├── package.json
└── README.md
```

> Adjust to match your real folder layout.

---

## Contributions

This is a personal project and is not currently accepting contributions.
If you find a bug, feel free to open an issue.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
