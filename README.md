# G-Scores System 🚀

A full-stack web application designed to process, search, and visualize the Vietnam National High School Exam scores (2024). Built with focus on **Performance Optimization**, **Big Data Handling (1 Million+ records)**, and **Clean Architecture**.

## 🌐 Live Demo
- **Live Application:** [PASTE_YOUR_RENDER_LINK_HERE] *(Please wait a few seconds for the initial load if the server is asleep)*
- **Database:** Supabase (PostgreSQL)

## 🛠️ Tech Stack & Architecture
- **Backend:** NestJS (TypeScript), Prisma ORM
- **Frontend:** HTML5, CSS3, Bootstrap 5, Chart.js
- **Database:** PostgreSQL (with heavily optimized Indexes for Read-Heavy operations)
- **Architecture:** Monolithic (Server-Side Rendering with Handlebars)

## ✨ Key Features & Technical Highlights

1. **Massive Data Seeding (Stream & Bulk Insert):**
   - Successfully processed and seeded **~1.06 million records** from the raw CSV file.
   - Utilized Node.js `ReadStream` combined with Prisma's `createMany` (Batching) to prevent Out-Of-Memory (OOM) issues and maximize insertion speed.

2. **Ultra-Fast Query Performance:**
   - **Database Indexing:** Applied Composite Indexes `@@index([toan, vat_ly, hoa_hoc])` to reduce Top 10 Group A query time from ~60s to **< 1s**.
   - **Raw SQL Optimization:** Used `$queryRaw` to push calculation loads to the Database Engine, minimizing network latency.
   - **Concurrent Processing:** Implemented `Promise.all()` to aggregate score statistics (Chart data) simultaneously, boosting performance by 4x.

3. **Security & Data Integrity:**
   - Implemented `class-validator` (DTOs) to tighten logic and prevent malicious/invalid inputs at the Controller layer.

4. **UX/UI Design:**
   - Designed a modern, responsive "Mint Pastel" Dashboard.
   - Implemented Frontend Caching (Flag variables) to prevent redundant API calls when switching tabs.
   - Added loading indicators and error handling messages for a seamless user experience.

---

## 💻 How to run locally

Follow these steps to run the project on your local machine:

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Local or Cloud like Supabase)

### 1. Clone the repository
git clone [https://github.com/LeVanTai19/g-scores.git]
cd g-scores-app

### 2. Install dependencies
npm install 

### 3. Setup Environment Variables
Create a .env file in the root directory and add your PostgreSQL connection string:
DATABASE_URL="postgresql://user:password@localhost:5432/gscores"

### 4. Setup Database & Prisma
Run the following commands to generate Prisma client and push the schema to your database:
npx prisma generate
npx prisma db push
(Note: I used db push for local testing instead of migrate to quickly sync the schema)

### 5. Start the application
npm run start:dev
The application will be running at: http://localhost:3000