# Mwangaza School Student Resource Hub

> A modern, cloud-native academic resource platform and technical architecture blueprint for Mwangaza School. Centralizes academic resources, past examination papers, model marking schemes, lecture notes, timetable schedules, and peer collaboration circles with Google Gemini AI auto-tagging and summarization.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-ffca28.svg)](https://firebase.google.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Gemini%20API-3.8%20Flash-8e75ff.svg)](https://ai.google.dev/)

---

## 🏛️ Platform Overview

The **Mwangaza School Student Resource Hub** serves students, faculty lecturers, and academic registry administrators:

* 📚 **Academic Resource & Past Papers Archive:** Search, preview, and download past examinations, syllabi, lab manuals, and capstone project blueprints by department, course unit, year, and semester.
* 🗓️ **Master Timetable & Venue Scheduler:** Real-time weekly lecture and laboratory scheduling grid with conflict-free hall allocations, "My Registered Units" filtering, and one-click `.ics` export.
* 💬 **Academic Discussions & Study Circles:** Threaded Q&A forum with official Faculty Endorsement badges, upvoting, and peer study groups with Google Meet and Discord join links.
* ⚡ **Gemini 3.8 Flash Cognitive Copilot:** Server-side AI summarizer that extracts syllabus objectives, estimates study read time, generates interactive revision flashcards, and tags curriculum taxonomy.
* 🛡️ **Role-Based Access Control (RBAC):** Zero-trust permission separation across Students, Faculty, and Registry Administrators.
* 📐 **Lead Architect Specification Viewer:** An interactive in-app technical specification documentation viewer complete with cloud topology diagrams, Firestore JSON schemas, and security rules testing harness.

---

## 🛠️ System Architecture & Tech Stack

```
                                 [ Mwangaza Client Application ]
                                      (React 19 + Vite SPA)
                                  /            |            \
                                 /             |             \
                   (JWT Auth)   /    (Direct   |    (Uploads) \
                               v     Firestore)|               v
                +--------------------+         |        +--------------------+
                |   Firebase Auth    |         v        |  Firebase Storage  |
                | (Google SSO / RBAC)|   +-----------+  | (Signed PDF / DOCX |
                +--------------------+   | Cloud     |  |  Bucket Storage)   |
                                         | Firestore |  +--------------------+
                +--------------------+   | (NoSQL    |
                | Express AI Gateway |   |  Database)|
                | (Node.js 22 Proxy) |-->+-----------+
                |         |          |
                |         v          |
                |  Gemini 3.8 Flash  |
                | (Cognitive Engine) |
                +--------------------+
```

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion | Responsive SPA with accessible academic UI tokens |
| **Bundler** | Vite 8.3 | High-throughput build pipeline & dev server |
| **Server Gateway** | Express.js / Node.js 22 | Secure proxy mediating Gemini API requests |
| **Database** | Google Cloud Firestore | Distributed multi-region NoSQL document store |
| **Auth** | Firebase Authentication | Institutional SSO with RBAC custom claims |
| **Storage** | Firebase Cloud Storage | Encrypted PDF/DOCX blob storage with signed URLs |
| **AI Engine** | Google Gemini 3.8 Flash (`@google/genai`) | Cognitive auto-summarization and taxonomy tagging |

---

## 📦 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **bun** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KimaniImmaculate/GAS-Mwangaza.git
   cd GAS-Mwangaza
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   APP_URL="http://localhost:3000"
   ```

4. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:3000`.

5. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🗄️ Firestore Collections Schema

* `/users/{uid}`: Profiles, academic year, department, registered units, and role (`student | faculty | admin`).
* `/resources/{resourceId}`: Past papers, marking schemes, syllabi, format metadata, and download tallies.
* `/timetables/{slotId}`: Weekly lecture/lab slots, room allocations, lecturer names, and schedule status.
* `/discussions/{postId}`: Course-specific student questions, upvotes, and `/replies/{replyId}` with faculty verification.
* `/study_groups/{groupId}`: Student-led study circles with participant caps and meeting links.

---

## 🔒 Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function getUserData() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data; }
    function isFaculty() { return isSignedIn() && (getUserData().role == 'faculty' || getUserData().role == 'admin'); }
    function isAdmin() { return isSignedIn() && getUserData().role == 'admin'; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) && request.resource.data.role == resource.data.role;
      allow delete: if isAdmin();
    }

    match /resources/{resourceId} {
      allow read: if isSignedIn() && (resource.data.status == 'approved' || isFaculty() || isOwner(resource.data.uploadedBy));
      allow create: if isSignedIn() && (
        (isFaculty() && request.resource.data.status == 'approved') ||
        (request.resource.data.status == 'pending_moderation' && request.resource.data.uploadedBy == request.auth.uid)
      );
      allow update: if isFaculty() || (isOwner(resource.data.uploadedBy) && resource.data.status == 'pending_moderation') || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['downloadCount']);
      allow delete: if isAdmin();
    }

    match /timetables/{slotId} {
      allow read: if isSignedIn();
      allow write: if isFaculty();
    }

    match /discussions/{postId} {
      allow read, create: if isSignedIn();
      allow update: if isSignedIn() && (isOwner(resource.data.authorId) || isFaculty() || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes', 'repliesCount']));
      allow delete: if isOwner(resource.data.authorId) || isAdmin();

      match /replies/{replyId} {
        allow read, create: if isSignedIn();
        allow update, delete: if isOwner(resource.data.authorId) || isFaculty();
      }
    }

    match /study_groups/{groupId} {
      allow read, create, update: if isSignedIn();
      allow delete: if isOwner(resource.data.leaderId) || isAdmin();
    }
  }
}
```

---

## 📄 License
This project is licensed under the Apache 2.0 License.
