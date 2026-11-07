export const TECHNICAL_SPECIFICATION_DOCUMENT = {
  title: "Mwangaza School Student Resource Hub - Cloud-Native Technical Specification & Architectural Blueprint",
  version: "1.0.0-PROD",
  organization: "Mwangaza School - Directorate of Information Systems & Academic Registry",
  leadArchitect: "Senior Cloud & Enterprise Solutions Architect",
  classification: "Production Grade / Technical Blueprint",
  date: "November 2026",

  sections: {
    systemArchitecture: {
      id: "architecture",
      title: "1. System Architecture & Tech Stack",
      summary: "A resilient, cloud-native hybrid architecture pairing a high-performance React + Vite SPA frontend with Google Cloud Firebase (Firestore, Auth, Storage) and a secure server-side Express proxy for Gemini 3.8 Flash AI ingestion.",
      frontend: {
        framework: "React 19 + TypeScript (ES2022+)",
        bundler: "Vite 8.3 with @tailwindcss/vite compiler for zero-runtime CSS footprint",
        styling: "Tailwind CSS v4 with custom academic design tokens and dark/light adaptive contrast",
        stateManagement: "Modular React Context Providers (AuthContext with RBAC, ResourceContext, ThemeContext)",
        iconsAndMotion: "Lucide-React for semantic visual cues, Motion (Framer Motion v12) for tactile page transitions"
      },
      backendAndDatabase: {
        database: "Google Cloud Firestore (NoSQL, multi-region distributed document store with sub-100ms read latency)",
        auth: "Firebase Authentication (Email/Password, Google Workspace SSO for @mwangaza.ac.ke domains, JWT token verification)",
        storage: "Firebase Cloud Storage (GCP Cloud Storage buckets with signed URL generation for academic PDFs, DOCX, ZIP files)",
        aiEngine: "Google Gemini 3.8 Flash via official @google/genai TypeScript SDK running in secure server-side proxy mode"
      },
      infrastructureTopology: [
        {
          tier: "Client Presentation Tier",
          description: "Single Page Application (SPA) delivered via Google Cloud CDN with HTTP/2 and asset prefetching.",
          security: "Content Security Policy (CSP), strictly no client-side API secrets or private tokens."
        },
        {
          tier: "API & AI Orchestration Layer",
          description: "Lightweight Express.js server on Node.js 22 LTS hosting /api/gemini/summarize and /api/gemini/tag-resource.",
          security: "Server-side GEMINI_API_KEY injection, rate-limiting, request schema validation, and User-Agent telemetry."
        },
        {
          tier: "Data & Persistence Tier",
          description: "Firebase Firestore partitioned across US-Central or Europe-West with optimistic offline persistence enabled.",
          security: "Granular firestore.rules verifying request.auth.token.role and document ownership before any write."
        },
        {
          tier: "Blob Storage Tier",
          description: "Firebase Cloud Storage bucket (mwangaza-resource-hub.appspot.com) segmented by /resources/{academicYear}/{dept}/.",
          security: "Firebase Storage Security Rules verifying MIME types (PDF, DOCX, EPUB, PPTX) and maximum size limits (50MB)."
        }
      ],
      nonFunctionalRequirements: [
        { metric: "Availability & SLA", target: "99.95% uptime across academic terms via multi-zone Firestore replicas." },
        { metric: "Read Latency", target: "<120ms P95 query latency for indexed department and course catalog searches." },
        { metric: "Cold Start Recovery", target: "Local IndexedDB caching layer enables immediate offline document lookup." },
        { metric: "Security Compliance", target: "FERPA and GDPR-aligned student data protection with AES-256 encryption at rest." }
      ]
    },

    functionalRequirements: {
      id: "modules",
      title: "2. Core Functional Requirements & Feature Modules",
      modules: [
        {
          moduleName: "Authentication & Role-Based Access Control (RBAC)",
          objective: "Enforce zero-trust role separation across Students, Faculty/Lecturers, and Academic Administrators.",
          features: [
            "Institutional SSO via @student.mwangaza.ac.ke and @faculty.mwangaza.ac.ke Google accounts.",
            "Role hierarchy: Student (consumer, peer contributor), Faculty (publisher, verifier), Admin (moderator, auditor).",
            "Session token invalidation on role changes and automated session timeout after 24 hours.",
            "Student profile tracking: Department, Student Registration Number, Year of Study, bookmarked resources."
          ]
        },
        {
          moduleName: "Academic Resource Repository & Past Papers Archive",
          objective: "Centralized, high-throughput digital library for past examinations, marking schemes, syllabi, and lab manuals.",
          features: [
            "Multi-faceted search and filter matrix: Department, Course Code, Academic Year, Semester, and Document Type.",
            "Direct PDF browser preview with page navigation and watermarked download counter.",
            "Peer uploads pipeline: Student submissions default to 'pending_moderation' until verified by Faculty or Admin.",
            "Automated checksum hashing to prevent duplicate past paper uploads across semesters."
          ]
        },
        {
          moduleName: "Timetable Schedule & Room Planner",
          objective: "Live synchronized weekly lecture, laboratory, and tutorial schedule viewer for campus courses.",
          features: [
            "Interactive 5-day grid (Monday through Friday) with real-time status indicators (Ongoing, Upcoming, Rescheduled).",
            "Room and lab allocation viewer (e.g., Turing Lab 3, Science Complex Hall B) with capacity alerts.",
            "Personalized schedule view: Students filter slots to only their registered course units.",
            "One-click schedule export to standard iCalendar (.ics) and printable timetable matrix."
          ]
        },
        {
          moduleName: "Academic Discussion & Peer Collaboration Hub",
          objective: "Collaborative learning space with threaded Q&A, verified solutions, and peer study groups.",
          features: [
            "Threaded discussion posts tagged by Course Code and academic topic.",
            "Faculty 'Official Verified Solution' endorsement badge with pinned answer priority.",
            "Study Group Directory: Peer-led study circles with member limits, schedule slots, and Google Meet/Discord join links.",
            "Upvoting mechanism to highlight most helpful peer explanations and exam insights."
          ]
        },
        {
          moduleName: "Gemini AI Academic Assistant & Auto-Summarizer",
          objective: "AI-assisted cognitive accelerator for rapid revision and automatic metadata taxonomy.",
          features: [
            "Automatic document ingestion: Extracts core learning objectives and produces structured executive summaries.",
            "Exam flashcard & review question generation from past exam papers.",
            "Automated tagging: Analyzes resource syllabus and suggests accurate taxonomy tags without manual entry."
          ]
        }
      ],
      rbacMatrix: [
        { capability: "Browse approved resources & past papers", student: "Allowed", faculty: "Allowed", admin: "Allowed" },
        { capability: "Download past examination papers & syllabi", student: "Allowed", faculty: "Allowed", admin: "Allowed" },
        { capability: "Upload peer study notes (pending moderation)", student: "Allowed", faculty: "Allowed", admin: "Allowed" },
        { capability: "Publish official past papers & marking schemes", student: "Denied", faculty: "Allowed", admin: "Allowed" },
        { capability: "Verify / Endorse discussion answers", student: "Denied", faculty: "Allowed", admin: "Allowed" },
        { capability: "Modify master course timetable slots", student: "Denied", faculty: "Allowed", admin: "Allowed" },
        { capability: "Delete any resource or ban user accounts", student: "Denied", faculty: "Denied", admin: "Allowed" },
        { capability: "Trigger server-side Gemini auto-summarization", student: "Allowed", faculty: "Allowed", admin: "Allowed" }
      ]
    },

    databaseSchema: {
      id: "database",
      title: "3. Database Schema Design & Security Rules",
      collections: [
        {
          collection: "users",
          path: "/users/{uid}",
          description: "Canonical user profile and role authority document.",
          schemaJson: `{
  "uid": "STRING (Firebase Auth UID)",
  "email": "STRING (e.g. amara@student.mwangaza.ac.ke)",
  "displayName": "STRING",
  "role": "STRING ('student' | 'faculty' | 'admin')",
  "department": "STRING",
  "studentId": "STRING? (Optional for faculty/admin)",
  "facultyId": "STRING? (Optional for students)",
  "yearLevel": "STRING? (e.g. 'Year 2')",
  "avatarUrl": "STRING (URL)",
  "bookmarkedResourceIds": "ARRAY<STRING>",
  "joinedGroupIds": "ARRAY<STRING>",
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}`
        },
        {
          collection: "resources",
          path: "/resources/{resourceId}",
          description: "Academic repository catalog storing past papers, notes, and metadata.",
          schemaJson: `{
  "id": "STRING (UUID / auto-id)",
  "title": "STRING",
  "courseCode": "STRING (e.g. 'CS 201')",
  "courseName": "STRING",
  "department": "STRING",
  "faculty": "STRING",
  "resourceType": "STRING ('past_paper'|'lecture_notes'|'syllabus'|'lab_manual'|'project_doc')",
  "academicYear": "STRING (e.g. '2023/2024')",
  "semester": "STRING ('Semester 1' | 'Semester 2')",
  "fileName": "STRING",
  "fileSize": "STRING",
  "fileFormat": "STRING ('PDF' | 'DOCX' | 'ZIP' | 'PPTX')",
  "downloadUrl": "STRING (Cloud Storage signed URL)",
  "storagePath": "STRING (/resources/2024/cs/cs201.pdf)",
  "uploadedBy": "STRING (User UID)",
  "uploaderRole": "STRING ('student' | 'faculty' | 'admin')",
  "uploaderName": "STRING",
  "status": "STRING ('approved' | 'pending_moderation' | 'archived')",
  "downloadCount": "NUMBER",
  "rating": "NUMBER (0.0 - 5.0)",
  "summary": "STRING? (Gemini-generated executive summary)",
  "keyTakeaways": "ARRAY<STRING>?",
  "tags": "ARRAY<STRING>",
  "difficultyLevel": "STRING ('Foundational'|'Intermediate'|'Advanced')",
  "estimatedReadTimeMinutes": "NUMBER",
  "verifiedByFaculty": "BOOLEAN",
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}`
        },
        {
          collection: "timetables",
          path: "/timetables/{slotId}",
          description: "Scheduled course sessions, room assignments, and lecturer allocations.",
          schemaJson: `{
  "id": "STRING",
  "courseCode": "STRING (e.g. 'CS 201')",
  "courseName": "STRING",
  "department": "STRING",
  "yearLevel": "STRING ('Year 1' | 'Year 2' | 'Year 3' | 'Year 4')",
  "lecturerName": "STRING",
  "room": "STRING (e.g. 'Turing Computer Lab 3')",
  "dayOfWeek": "STRING ('Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday')",
  "startTime": "STRING (e.g. '08:30')",
  "endTime": "STRING (e.g. '10:30')",
  "classType": "STRING ('Lecture' | 'Lab' | 'Tutorial')",
  "status": "STRING ('upcoming' | 'ongoing' | 'rescheduled')",
  "lastModifiedBy": "STRING (Faculty/Admin UID)"
}`
        },
        {
          collection: "discussions",
          path: "/discussions/{postId} and subcollection /replies/{replyId}",
          description: "Peer Q&A threads with faculty endorsements and vote tallies.",
          schemaJson: `{
  "id": "STRING",
  "title": "STRING",
  "content": "STRING (Markdown / Text)",
  "courseCode": "STRING",
  "authorId": "STRING (UID)",
  "authorName": "STRING",
  "authorRole": "STRING ('student' | 'faculty')",
  "authorAvatar": "STRING",
  "upvotes": "NUMBER",
  "repliesCount": "NUMBER",
  "isFacultyVerified": "BOOLEAN",
  "tags": "ARRAY<STRING>",
  "createdAt": "TIMESTAMP"
}`
        },
        {
          collection: "study_groups",
          path: "/study_groups/{groupId}",
          description: "Student study circles with collaboration links and participant caps.",
          schemaJson: `{
  "id": "STRING",
  "title": "STRING",
  "courseCode": "STRING",
  "description": "STRING",
  "platform": "STRING ('Google Meet' | 'Discord' | 'Library Room')",
  "meetLink": "STRING?",
  "memberCount": "NUMBER",
  "maxMembers": "NUMBER",
  "leaderId": "STRING (UID)",
  "leaderName": "STRING",
  "scheduleTime": "STRING",
  "tags": "ARRAY<STRING>",
  "activeMembers": "ARRAY<STRING> (UIDs)"
}`
        }
      ],
      firestoreRules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions for zero-trust authorization
    function isSignedIn() {
      return request.auth != null;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isFaculty() {
      return isSignedIn() && (getUserData().role == 'faculty' || getUserData().role == 'admin');
    }

    function isAdmin() {
      return isSignedIn() && getUserData().role == 'admin';
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // USERS COLLECTION
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) && request.resource.data.role == resource.data.role; // Prevent self-elevation to admin
      allow delete: if isAdmin();
    }

    // RESOURCES COLLECTION
    match /resources/{resourceId} {
      // Anyone signed in can read approved resources; Admins/Faculty can read pending items
      allow read: if isSignedIn() && (resource.data.status == 'approved' || isFaculty() || isOwner(resource.data.uploadedBy));

      // Students can upload notes in 'pending_moderation' state; Faculty/Admin can publish immediately as 'approved'
      allow create: if isSignedIn() && (
        (isFaculty() && request.resource.data.status == 'approved') ||
        (request.resource.data.status == 'pending_moderation' && request.resource.data.uploadedBy == request.auth.uid)
      );

      // Only Faculty or Admin can verify, change status, or edit official curriculum tags
      // Uploader can update their own notes before approval
      allow update: if isFaculty() || (isOwner(resource.data.uploadedBy) && resource.data.status == 'pending_moderation');

      // Only Admin can permanently delete resources
      allow delete: if isAdmin();
    }

    // TIMETABLES COLLECTION
    match /timetables/{slotId} {
      allow read: if isSignedIn();
      allow write: if isFaculty(); // Lecturers and Admins manage class schedules
    }

    // DISCUSSIONS & REPLIES
    match /discussions/{postId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        isOwner(resource.data.authorId) ||
        isFaculty() || // Faculty can set isFacultyVerified = true
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvotes', 'repliesCount']) // Voting/reply counters
      );
      allow delete: if isOwner(resource.data.authorId) || isAdmin();

      match /replies/{replyId} {
        allow read: if isSignedIn();
        allow create: if isSignedIn();
        allow update, delete: if isOwner(resource.data.authorId) || isFaculty();
      }
    }

    // STUDY GROUPS
    match /study_groups/{groupId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn(); // Joining/leaving groups
      allow delete: if isOwner(resource.data.leaderId) || isAdmin();
    }
  }
}`
    },

    apiAndServices: {
      id: "services",
      title: "4. API & Service Integration Layer",
      expressProxyPipeline: "To strictly prevent API key leaks and conform to AI Studio security rules, all Gemini AI interactions are mediated via an Express backend route (/api/gemini/*).",
      endpoints: [
        {
          method: "POST",
          path: "/api/gemini/summarize",
          purpose: "Extracts curriculum concepts, generates a 3-paragraph executive summary, computes read time, and assigns difficulty.",
          requestPayload: `{
  "title": "CS 201 Final Examination",
  "subject": "Data Structures & Algorithms",
  "faculty": "Science & Technology",
  "resourceType": "past_paper",
  "textContent": "Full extracted text or question syllabus..."
}`,
          responsePayload: `{
  "success": true,
  "summary": "Comprehensive 3-hour examination covering asymptotic runtime...",
  "keyTakeaways": ["Mastery of graph traversal...", "Worst-case amortized cost..."],
  "tags": ["Algorithms", "Trees", "Big-O", "Past-Paper-2024"],
  "difficultyLevel": "Intermediate",
  "estimatedReadTimeMinutes": 25
}`
        },
        {
          method: "POST",
          path: "/api/gemini/tag-resource",
          purpose: "Classifies uploaded materials into course categories and targets correct academic level automatically.",
          requestPayload: `{
  "title": "Electrophilic Aromatic Substitution mechanism notes",
  "courseCode": "CHEM 212",
  "description": "Curly arrow electron pushing mechanisms with FeCl3 catalyst"
}`,
          responsePayload: `{
  "success": true,
  "tags": ["CHEM-212", "EAS", "Reaction-Mechanisms", "Benzene"],
  "recommendedCategory": "Lecture Notes",
  "targetAcademicYear": "Year 2"
}`
        },
        {
          method: "GET",
          path: "/api/health",
          purpose: "Heartbeat endpoint returning cloud infrastructure status, Firebase configuration, and AI engine telemetry.",
          responsePayload: `{
  "status": "healthy",
  "platform": "Mwangaza School Student Resource Hub",
  "geminiConfigured": true,
  "services": {
    "auth": "Firebase Auth (RBAC Enabled)",
    "database": "Cloud Firestore",
    "storage": "Firebase Storage",
    "aiEngine": "Gemini 3.8 Flash"
  }
}`
        }
      ],
      geminiPipelineCode: `// Server-Side Ingestion Controller (server.ts)
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

export async function processAcademicResource(title: string, content: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: content,
    config: {
      systemInstruction: 'You are the lead academic tutor for Mwangaza School. Output structured JSON.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficultyLevel: { type: Type.STRING },
          estimatedReadTimeMinutes: { type: Type.NUMBER }
        },
        required: ['summary', 'keyTakeaways', 'tags', 'difficultyLevel', 'estimatedReadTimeMinutes']
      }
    }
  });

  return JSON.parse(response.text || '{}');
}`
    },

    starterBlueprint: {
      id: "blueprint",
      title: "5. Comprehensive Implementation Prompt & Starter Code Blueprint",
      engineeringPrompt: `You are tasked with executing the production implementation of the Mwangaza School Student Resource Hub. 
Follow this strict 4-step implementation sequence:
1. Initialize the Firebase Connector (src/services/firebaseConnector.ts) using the official Firebase Web SDK (v11+), exporting singleton firestoreDb, authClient, and storageClient instances with graceful offline fallback.
2. Establish the AuthContext (src/context/AuthContext.tsx) enforcing Role-Based Access Control (Student, Faculty, Admin). Derive permissions (canUploadOfficial, canModerateResources, canVerifyDiscussions, canManageTimetable) directly from the authenticated user token.
3. Build the Resource Data Layer (src/services/resourceService.ts) supporting Firestore CRUD with snapshot listeners (onSnapshot) for real-time past paper updates and download counter atomic increments (FieldValue.increment(1)).
4. Wire the Gemini AI proxy on the Express server (server.ts) utilizing model 'gemini-3.8-flash' to automatically summarize uploaded syllabi and extract study tags without leaking client credentials.`,
      boilerplateCode: {
        firebaseConnectorSnippet: `// src/services/firebaseConnector.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firestoreDb = getFirestore(app);
export const authClient = getAuth(app);
export const storageClient = getStorage(app);`,

        resourceServiceSnippet: `// src/services/resourceService.ts
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestoreDb, storageClient } from './firebaseConnector';
import { AcademicResource } from '../types';

export const resourceService = {
  // Fetch approved resources by department and course
  async getApprovedResources(department?: string, courseCode?: string) {
    const resourcesRef = collection(firestoreDb, 'resources');
    let q = query(resourcesRef, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    
    if (department && department !== 'All') {
      q = query(resourcesRef, where('status', '==', 'approved'), where('department', '==', department));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AcademicResource[];
  },

  // Upload academic resource binary to Cloud Storage and save metadata in Firestore
  async uploadResource(file: File, metadata: Partial<AcademicResource>, uploaderUid: string, uploaderRole: string) {
    const filePath = \`resources/\${metadata.academicYear || '2024'}/\${metadata.courseCode || 'GEN'}/\${Date.now()}_\${file.name}\`;
    const storageRef = ref(storageClient, filePath);
    
    // 1. Upload file binary
    const uploadResult = await uploadBytes(storageRef, file, { contentType: file.type });
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    // 2. Determine initial status based on RBAC
    const initialStatus = (uploaderRole === 'faculty' || uploaderRole === 'admin') 
      ? 'approved' 
      : 'pending_moderation';

    // 3. Write document to Firestore
    const docRef = await addDoc(collection(firestoreDb, 'resources'), {
      ...metadata,
      fileName: file.name,
      fileSize: \`\${(file.size / (1024 * 1024)).toFixed(1)} MB\`,
      downloadUrl,
      storagePath: filePath,
      uploadedBy: uploaderUid,
      uploaderRole,
      status: initialStatus,
      downloadCount: 0,
      rating: 5.0,
      verifiedByFaculty: uploaderRole === 'faculty' || uploaderRole === 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, downloadUrl };
  },

  // Atomic download counter increment
  async recordDownload(resourceId: string) {
    const docRef = doc(firestoreDb, 'resources', resourceId);
    await updateDoc(docRef, { downloadCount: increment(1) });
  }
};`
      }
    }
  }
};
