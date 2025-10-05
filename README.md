# 📰 Simple News Feed System

> A simple social media platform built with **NestJS**, **Next.js**, and **PostgreSQL**, featuring authentication, posting, following, and infinite scrolling feed — all containerized with **Docker**.

---

## 📘 Overview

**Simple News Feed System** adalah aplikasi sosial sederhana yang memungkinkan pengguna untuk:

-   🔐 **Register & Login** menggunakan **JWT Authentication** (dengan **refresh token**).
-   🧑‍🤝‍🧑 **Follow & Unfollow** pengguna lain untuk mengatur siapa yang tampil di feed.
-   👤 **Lihat profil sendiri dan profil teman** termasuk postingan mereka, total folowers, dan total following.
-   📝 **Menambahkan postingan baru** yang muncul di feed teman.
-   📰 **Melihat feed dengan infinite scroll** (otomatis memuat lebih banyak data bila lebih dari 10).
-   🚪 **Logout** dengan aman dan menghapus token sesi.

Sistem ini juga dilengkapi dengan:

-   📱 **Responsive Design** dapat dibuka disemua tampilan mobile,tablet atau desktop.
-   ✅ **Unit Testing (Jest)** untuk setiap modul backend.
-   🔄 **CI/CD lifecycle sederhana** (build → test).
-   🐳 **Docker & Docker Compose** untuk kemudahan setup dan environment yang konsisten.

---

## 📂 Clone Repository

Clone repository dari GitHub:

```bash
git clone https://github.com/RezalSultan/simple-news-feed-system.git
```

## ⚙️ 1. Backend Setup (NestJS) (For Local)

### 1️⃣ Masuk ke Direktori Backend

```bash
cd simple-news-feed-system/api-nestjs
```

---

### 2️⃣ 🧾 Environment Variables

Salin file `.env.example` lalu ubah menjadi `.env` di dalam folder `api-nestjs` dan sesuaikan dengan konfigurasi lokalmu:

```env
DATABASE_URL="postgresql://{username}:{password}@{host.docker.internal(kalau dari docker)/localhost}:{portdatabase}/database?schema=public"

PORT=3030
JWT_ACCESS_SECRET="access"
JWT_REFRESH_SECRET="refresh"

DB_HOST=host.docker.internal ->(run in docker)
DB_HOST=localhost ->(run in local)
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_DATABASE=simple_news_feed_system
```

> 💡 **Note:**
>
> -   Ubah `DB_HOST` menjadi `postgres` jika kamu menjalankan sistem di dalam **Docker Compose**.
> -   `DATABASE_URL` digunakan oleh **Prisma** untuk koneksi ke database PostgreSQL untuk keperluan migrasi.

---

### 3️⃣ 📦 Install Dependencies

Gunakan **npm** atau **bun** (pilih salah satu):

```bash
npm install
```

──── atau ────

```bash
bun install
```

---

### 4️⃣ 🧱 Database Migration

Gunakan Prisma untuk membuat struktur tabel dan menyinkronkan database:

```bash
npx prisma migrate dev
npx prisma db push
```

Perintah ini akan:

-   Membuat tabel sesuai dengan skema Prisma (`prisma/schema.prisma`)
-   Mengaplikasikan semua perubahan terbaru ke database

---

### 5️⃣ ▶️ Jalankan Development Server

Jalankan aplikasi dalam mode pengembangan (hot reload aktif):

```bash
npm run start:dev
```

──── atau ────

```bash
bun run start:dev
```

Server akan berjalan di:

```
http://localhost:3030
```

---

### 6️⃣ 🚀 Build & Run (Production)

Build aplikasi untuk production:

```bash
npm run build
```

──── atau ────

```bash
bun run build
```

Lalu jalankan hasil build-nya:

```bash
npm run start
```

──── atau ────

```bash
bun run start
```

---

## 🧪 Unit Testing

Backend menggunakan **Jest** untuk melakukan unit testing.  
Setiap modul memiliki test case terpisah di dalam folder `src/**/__tests__`.

Jalankan semua test:

```bash
npm run test
```

──── atau ────

```bash
bun run test
```

## 📁 Struktur Direktori Backend

```
api-nestjs/
├── prisma/
│   ├── schema.prisma               # Skema database Prisma
│   └── migrations/                 # Folder migrasi otomatis
├── src/
│   ├── app/                        # Folder untuk semua modul
│   │   ├── auth/                   # Modul untuk authentication
│   │   ├── follow/                 # Modul follow/unfollow
│   │   ├── post/                   # Modul postingan dan feed
│   │   └── user/                   # Modul user dan profil
│   ├── common/                     # Folder setup global module
│   │   ├── decorator/              # Decorator Custom
│   │   ├── middleware/             # Middleware
│   │   ├── common.module.ts        # Module Global
│   │   ├── error.filter.ts         # Catch and Filter Error
│   │   └── validation.service.ts   # Service untu Zod Validation
│   ├── repository/                 # Repository untuk Raw Query setiap Entity
│   ├── type-model/                 # Deklarasi Class atau Type
│   ├── utils/                      # Function bantu yang reusable
│   ├── app.module.ts               # Modul utama NestJS
│   └── main.ts                     # Entry point aplikasi
├── test/                           # Folder unit test global
├── Dockerfile                      # Docker config untuk backend
├── .env                            # Konfigurasi environment lokal
├── package.json
...
```

---

## 🧰 Tech Stack

| Layer                                | Teknologi                    |
| ------------------------------------ | ---------------------------- |
| Framework                            | [NestJS]                     |
| Language                             | [TypeScript & Node.js]       |
| Database                             | [PostgreSQL]                 |
| Raw Query & ORM(for migration table) | [Prisma]                     |
| Auth                                 | JWT (Access & Refresh Token) |
| Testing With Mock                    | Jest                         |
| CI/CD                                | GitHub Actions / GitLab CI   |
| Container                            | Docker & Docker Compose      |

---

## ⚙️ 2. Frontend Setup (Next.js) (For Local)

### 1️⃣ Environment Variables

```bash
cd simple-news-feed-system/client-nextjs
```

Salin file `.env.example` lalu ubah menjadi `.env` di dalam folder `client-nextjs` dengan isi seperti berikut:

```env
# Untuk client-side (browser)
NEXT_PUBLIC_API_URL=http://localhost:3030/api

# Untuk server-side (SSR, middleware, server actions)
API_URL=http://localhost:3030/api

API_URL=http://api-nestjs-dev:3030/api -> untuk dockerized
```

> 💡 **Catatan:**  
> Jika kamu menjalankan sistem di Docker Compose, ubah `API_URL` = `localhost` menjadi `api-nestjs-dev` agar bisa diakses antar container.

---

### 2️⃣ Install Dependencies

Gunakan salah satu package manager berikut:

```bash
npm install
```

──── atau ────

```bash
bun install
```

---

### 3️⃣ Jalankan Aplikasi di Mode Development

Jalankan Next.js dengan hot reload aktif:

```bash
npm run dev
```

──── atau ────

```bash
bun run dev
```

Aplikasi akan berjalan di:
👉 **http://localhost:3000**

---

### 4️⃣ Build & Jalankan untuk Production

Build aplikasi untuk production:

```bash
npm run build
npm start
```

──── atau ────

```bash
bun run build
bun run start
```

---

### 🧱 Struktur Direktori Frontend

```
client-nextjs/
├── public/                    # Folder penyimpanan asset
├── src/                       # Folder semua file aplikasi
│   ├── app/                   # Next.js App Router (SSR & Client Components)
│   │   ├── (auth-layout)/
│   │   │     ├── feed/*             # Halaman utama feed
│   │   │     ├── find-new-friend/*  # Halaman cari teman yang belum di follow
│   │   │     ├── look/*
│   │   │     │   └── [username]/*   # Halaman detail profile user lain
│   │   │     ├── posting/*          # Halaman tambah postingan
│   │   │     ├── profile/*          # Halaman profile
│   │   │     └── layout.tsx         # Layout setelah login
│   │   ├── (pre-auth-layout)
│   │   │     ├── (login)/*          # Halaman login
│   │   │     └── register/*         # Halaman register
│   │   ├── not-found.tsx       # Halaman 404
│   │   └── layout.tsx          # Layout global
│   ├── components/             # Komponen UI seperti card, navigation, shadcn-ui, dsb
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utility functions (fetcher, API handler, dll)
│   ├── service/                # Function buat fetch API
│   ├── type/                   # Deklarasi Type
│   ├── validation-schema/      # Folder menyimpan validasi schema zod
│   └── middleware.ts           # Middleware untuk Authentication and Authorization
├── .env                        # Konfigurasi environment lokal
├── Dockerfile                  # Konfigurasi Docker frontend
├── package.json
...
```

---

---

## 🧰 Tech Stack

| Layer             | Teknologi                   |
| ----------------- | --------------------------- |
| Framework         | [Next.js 15 (App Router)]   |
| Language          | [TypeScript]                |
| UI                | [Tailwind CSS + Shadcn/UI]  |
| API Call          | Axios                       |
| Form & Validation | React Hook Form + Zod       |
| Auth              | JWT Auth (Access & Refresh) |
| CI/CD             | GitHub Actions / GitLab CI  |
| Container         | Docker & Docker Compose     |

---

## ⚙️ 3. Docker Setup

---

### 🧱 Struktur Direktori Frontend

```
simple-news-feed-system/
├── api-nestjs/ # Backend
│   ├── .dockerignore
│   └── Dockerfile
├── client-nextjs/ # Frontend
│   ├── .dockerignore
│   └── Dockerfile
├── docker-compose.yml # Orchestrator utama
└── README.md
...
```

---

> 💡 **Catatan:**  
> Pastikan sudah setup file .env pada:
> /api-nestjs/.env → Backend
> /client-nextjs/.env → Frontend

> Pastikan sudah merunning docker desktop kalau OS/Windows di local

---

### 1️⃣ Build semua container

```bash
docker compose build
```

---

### 2️⃣ Jalankan semua service

```bash
docker-compose up -d
```

---

### 3️⃣ Pastikan semua container aktif

```bash
docker ps
```

Harus muncul

```bash
client-nextjs-dev
api-nestjs-dev
postgres
```

> 💡 **Catatan:**  
> Migration database sudah otomatis di setup di Docker Compose dan Dockerfile di nest js nya kalau gagal bisa dilihat di setup backend atau sebagai berikut:

### Migrasi Database (Opsional)

```bash
docker exec -it api-nestjs-dev sh
```

lalu jalankan

```bash
npx prisma migrate dev
npx prisma db push
exit
```

---

---

#

# API DOCUMENTATION

### **POST - /api/login - login**

**Request (Body)**

```json
{
	"username": "johndoe",
	"password": "password123"
}
```

**Response**

```json
{
	"statusCode": 201,
	"status": "Created",
	"message": "Login successful. Great to see you again!",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJ1c2VybmFtZSI6Im1hbnRhcHBlIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1OTY0OTU2OCwiZXhwIjoxNzU5NjUwNDY4fQ.o4y77d6kF02Xtb9UkDQcUpqsS-DS8Zx2yXwgu69bL9k",
		"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJ1c2VybmFtZSI6Im1hbnRhcHBlIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk2NDk1Njh9.5ACsqwy0djGN54BpOh3dkMC6DXZNQV2tHmRiTdNZOAE"
	}
}
```

---

### **POST - /api/register - register**

**Request (Body)**

```json
{
	"username": "johndoe",
	"password": "password123",
	"confirm_password": "password123"
}
```

**Response**

```json
{
	"statusCode": 201,
	"status": "Created",
	"message": "Registration successful! You can now log in.",
	"data": {
		"id": 1,
		"username": "johndoe"
	}
}
```

---

### **GET - /api/generate-access-token - getAccessToken**

**Headers**

```
Authorization: Bearer <refresh_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Generate access token successfully.",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJ1c2VybmFtZSI6Im1hbnRhcHBlIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk2NDk1Njh9.5ACsqwy0djGN54BpOh3dkMC6DXZNQV2tHmRiTdNacgaw"
	}
}
```

---

### **GET - /api/verify-token - verifyToken**

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Token is active."
}
```

---

### **DELETE - /api/logout - logout**

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "OK",
	"message": "Logout successful! You have been logged out."
}
```

---

### **POST - /api/follow/:userId - followUser**

**Request (URL Param)**  
`/api/follow/2`

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 201,
	"status": "Created",
	"message": "you are now following johndoe"
}
```

---

### **DELETE - /api/follow/:userId - unfollowUser**

**Request (URL Param)**  
`/api/follow/2`

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "you unfollowed johndoe"
}
```

---

### **POST - /api/posts - posts**

**Request (Body)**

```json
{
	"content": "Hello world! This is my first post."
}
```

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 201,
	"status": "Created",
	"message": "Create posts successfully",
	"data": {
		"id": 10,
		"user_id": 1,
		"content": "Hello world! This is my first post.",
		"created_at": "2025-10-05T10:00:00Z"
	}
}
```

---

### **GET - /api/feed - getFeed**

**Query**

```
/api/feed?page=1&limit=2
```

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Get feed successfully",
	"data": {
		"posts": [
			{
				"id": 10,
				"user_id": 1,
				"username": "johndoe",
				"content": "Hello world! This is my first post.",
				"created_at": "2025-10-05T10:00:00Z"
			},
			{
				"id": 11,
				"user_id": 2,
				"username": "janedoe",
				"content": "Welcome to the app!",
				"created_at": "2025-10-05T11:00:00Z"
			}
		]
	},
	"meta": {
		"pagination": {
			"page": 1,
			"limit": 2,
			"totalItems": 5,
			"totalPages": 3
		}
	}
}
```

---

### **GET - /api/data-user - getAllInfoUser**

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Get all information user successfully",
	"data": {
		"id": 1,
		"username": "johndoe",
		"created_at": "2025-01-01T08:00:00Z",
		"is_following": false,
		"posts": [
			{
				"id": 10,
				"content": "Hello world!",
				"created_at": "2025-10-05T10:00:00Z"
			}
		],
		"followers": [{ "username": "janedoe" }],
		"following": [{ "username": "alex" }]
	}
}
```

---

### **GET - /api/other-user/:username - getAllInfoOtherUser**

**Request (URL Param)**  
`/api/other-user/janedoe`

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Look all information this user successfully",
	"data": {
		"id": 2,
		"username": "janedoe",
		"created_at": "2025-01-02T08:00:00Z",
		"is_following": true,
		"posts": [
			{
				"id": 12,
				"content": "My coffee this morning ☕",
				"created_at": "2025-10-05T07:00:00Z"
			}
		],
		"followers": [{ "username": "johndoe" }],
		"following": []
	}
}
```

---

### **GET - /api/suggest-users - getFiveSuggestedUsers**

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Get five suggested user successfully",
	"data": [
		{ "id": 3, "username": "alex" },
		{ "id": 4, "username": "maria" },
		{ "id": 5, "username": "david" },
		{ "id": 6, "username": "chris" },
		{ "id": 7, "username": "linda" }
	]
}
```

---

### **GET - /api/all-users - getAllUsers**

**Headers**

```
Authorization: Bearer <access_token>
```

**Response**

```json
{
	"statusCode": 200,
	"status": "Ok",
	"message": "Get all user successfully",
	"data": [
		{ "id": 1, "username": "johndoe" },
		{ "id": 2, "username": "janedoe" },
		{ "id": 3, "username": "alex" }
	]
}
```

---

📌 **Notes**

-   All authenticated routes require the `Authorization: Bearer <token>` header.
-   All responses follow the `AppResponse` structure.
-   Example usernames use `johndoe` and `janedoe` for demonstration.

### 👨‍💻 Author

**Muhammad Rezal Sultan**  
Fullstack Developer

📧 [muhammadrezalsultan@gmail.com](mailto:muhammadrezalsultan@gmail.com)

---
