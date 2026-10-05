<div align="center">
<div align="center">

<div align="center">

[![Live Demo](https://img.shields.io/badge/LIVE_PREVIEW-VISIT_WEBSITE-2ea44f?style=for-the-badge&logo=vercel&logoColor=white)](https://cse-3206-software-engineering-sessi-hazel.vercel.app)

</div>

> 🌐 **Live Website Link:** [https://cse-3206-software-engineering-sessi-hazel.vercel.app](https://cse-3206-software-engineering-sessi-hazel.vercel.app)  
> *Click the green button above to explore the live web application.*

> 🌐 **Live Application URL:** [https://ais-pre-cqv7rbsiahdoofy5pedhka-963075115032.asia-southeast1.run.app](https://ais-pre-cqv7rbsiahdoofy5pedhka-963075115032.asia-southeast1.run.app)  
> *Click the button above to explore the live website directly without installing anything.*

# 🏛️ Lagos Prime Real Estate
### Full Stack Web Application | Software Engineering Sessional (CSE-3206)

[![React 19](https://img.shields.io/badge/React-19-blue?logo=react&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&style=flat-square)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&style=flat-square)](https://vitejs.dev/)

<p align="center">
  A modern, responsive real estate web application built to connect luxury property seekers in Lagos with high-end villas, waterfront penthouses, and prime commercial plots — complete with real-time inspection bookings and role-based management.
</p>

[**🌐 Explore Live Application**](https://ais-pre-cqv7rbsiahdoofy5pedhka-963075115032.asia-southeast1.run.app) • [**Report Bug**](https://github.com/tayebarizu/CSE-3206-Software-Engineering-Sessional-B210101011/issues)

</div>

---

## 💡 About The Project

During the **CSE-3206 (Software Engineering Sessional)** lab, I wanted to build something beyond a standard to-do list or simple blog. Real estate portals need to handle diverse data models, role privileges, dynamic search filters, and scheduling workflows.

**Lagos Prime Real Estate** was designed with an editorial, architectural aesthetic (inspired by physical luxury property flyers) while maintaining a rock-solid, type-safe full-stack architecture behind the scenes.

### 🎯 What makes this project practical:
- **Clean Separation of Concerns:** Divided into modular React components, custom hooks, and centralized state contexts (`AuthContext` and `PropertyContext`).
- **Real Two-Tier Access (RBAC):** Clients can browse and schedule private visits, while admins use an executive security key to manage listings and inspect incoming booking requests.
- **Persistent Cloud Data:** Backed by Google Cloud Firestore for real-time live synchronization.

---

## 🛠️ Tech Stack & Why I Chose Them

| Layer | Technology | Why It Was Chosen |
|---|---|---|
| **Frontend Framework** | **React 19** | For fast component re-renders, declarative UI structure, and modern hooks. |
| **Language** | **TypeScript** | Eliminates runtime typos, enforces strict data contracts (`Property`, `Booking`, `User`). |
| **Styling** | **Tailwind CSS v4** | Rapid, pixel-perfect responsive styling without bloated external CSS files. |
| **Icons & Visuals** | **Lucide React** | Clean, lightweight SVG vector icons matching modern design standards. |
| **Build Tooling** | **Vite** | Instant Hot Module Replacement (HMR) and optimized production bundles. |
| **Backend / API** | **Node.js & Express** | Server runtime and proxy middleware for cloud communications. |
| **Authentication** | **Firebase Auth** | Seamless Google Sign-In and secure email/password credential management. |
| **Database** | **Cloud Firestore** | Flexible NoSQL document database with instant real-time synchronization. |

---

## ✨ Core Features & User Journeys

### 1. 🏡 Architectural Property Showcase
- High-resolution hero display with room thumbnails (Chef's Kitchen, Master Suite, Private Pool).
- Dynamic property cards showcasing key specs: bedroom/bathroom count, square footage, and neighborhood.
- One-click modal view featuring full photo galleries, detailed descriptions, and embedded Google Maps directions.

### 2. 🔍 Smart Search & Categorized Filtering
- Instant search by title or neighborhood (Ikoyi, Lekki Phase 1, Victoria Island, Banana Island, Epe).
- Filter by transaction type: **Buy/Sell**, **Rent**, or **Lease**.
- Filter by property category: **Houses/Villas**, **Penthouses**, **Commercial Spaces**, or **Plots/Land**.

### 3. 📅 Inspection Booking & Client Dashboard
- Clients can choose preferred dates, time slots, and submit their contact details for a private showing.
- A personalized **My Bookings Dashboard** where logged-in clients can track their requests (*Pending*, *Confirmed*, *Completed*) or cancel upcoming appointments.

### 4. 🛡️ Executive Admin Portal (Protected with Passkey)
- Secure admin gate requiring the security passkey (`LAGOS_ADMIN_2026`).
- Full CRUD: Add brand-new listings with custom images or modify existing property details.
- Review incoming tour requests with single-click **Approve** or **Reject** actions.
- Manage customer reviews and view high-level platform metrics.

### 5. ⭐ Community Testimonials & Direct Contact
- Interactive review submission with star ratings and verified buyer tags.
- Direct contact ribbon at the footer featuring registered office details (LASRERA compliance) and one-tap telephone links.

---

## 📖 My Weekly Development Journey

Here is how the project evolved over the semester lab sessions:

- **🗓️ Week 1 — Blueprint & Foundation:**  
  Configured the project environment using Vite, React 19, and TypeScript. Set up the custom color palette and typography in Tailwind CSS.

- **🗓️ Week 2 — Crafting the Visual Identity:**  
  Designed the hero flyer section, responsive property cards, and reusable modal frames. Focused on making the layout look like a premium real estate catalogue.

- **🗓️ Week 3 — Services & Information Flow:**  
  Built the **What We Do** section highlighting the 4 core pillars (*Sell, Rent, Manage, Lease*), the gated estate informational guide, and the bottom contact ribbon.

- **🗓️ Week 4 — Authentication & Role Boundaries:**  
  Integrated Firebase Authentication. Implemented distinct user workflows so regular clients and administrators experience the platform differently.

- **🗓️ Week 5 — Scheduling System & Client Portal:**  
  Created the tour booking workflow with real-time state updates and built the user dashboard for clients to monitor their inspection appointments.

- **🗓️ Week 6 — Cloud Database Integration & Polish:**  
  Connected Google Cloud Firestore for persistent storage, built the full admin controls panel, added customer feedback reviews, and deployed the production build.

---

## 🚀 Running the Project Locally

Follow these quick steps to run the application on your computer:

### 1. Clone the repo
```bash
git clone https://github.com/tayebarizu/CSE-3206-Software-Engineering-Sessional-B210101011.git
cd CSE-3206-Software-Engineering-Sessional-B210101011
2. Install dependencies
code
Bash
npm install
3. Launch the development server
code
Bash
npm run dev
Open http://localhost:3000 in your browser to interact with the site!
📜 Available NPM Commands
Command	Action
npm run dev	Starts local dev server at localhost:3000 with hot-reload
npm run build	Compiles and creates an optimized production bundle in /dist
npm run preview	Runs a local web server serving the production build
npm run lint	Runs TypeScript compiler checks (tsc --noEmit) to verify zero errors
🎓 Academic Info & Author
Student Name: Tayeba Joarder
Student ID: B210101011
Course Title: Software Engineering Sessional
Course Code: CSE-3206
Academic Semester: 3rd Year, 2nd Semester
<div align="center">
<sub>Built with care, clean code, and dedication for the CSE-3206 Sessional Course.</sub>
</div>
```
