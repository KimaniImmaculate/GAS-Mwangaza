export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: string;
  studentId?: string;
  facultyId?: string;
  yearLevel?: string;
  avatarUrl: string;
  bookmarkedResourceIds: string[];
  joinedGroupIds: string[];
  createdAt: string;
}

export type ResourceType = 
  | 'past_paper' 
  | 'lecture_notes' 
  | 'syllabus' 
  | 'lab_manual' 
  | 'project_doc' 
  | 'marking_scheme';

export type FileFormat = 'PDF' | 'DOCX' | 'ZIP' | 'PPTX' | 'EPUB';

export interface AcademicResource {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  department: string;
  faculty: string;
  resourceType: ResourceType;
  academicYear: string;
  semester: string;
  fileName: string;
  fileSize: string;
  fileFormat: FileFormat;
  downloadUrl: string;
  uploadedBy: string;
  uploaderRole: UserRole;
  uploaderName: string;
  status: 'approved' | 'pending_moderation' | 'archived';
  downloadCount: number;
  rating: number;
  summary?: string;
  keyTakeaways?: string[];
  tags: string[];
  difficultyLevel?: 'Foundational' | 'Intermediate' | 'Advanced';
  estimatedReadTimeMinutes?: number;
  verifiedByFaculty: boolean;
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  yearLevel: string;
  lecturerName: string;
  room: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  classType: 'Lecture' | 'Lab' | 'Tutorial';
  status: 'upcoming' | 'ongoing' | 'rescheduled';
}

export interface DiscussionReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  isFacultyEndorsed?: boolean;
  createdAt: string;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  courseCode: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  upvotes: number;
  isUpvoted?: boolean;
  repliesCount: number;
  isFacultyVerified: boolean;
  tags: string[];
  createdAt: string;
  replies: DiscussionReply[];
}

export interface StudyGroup {
  id: string;
  title: string;
  courseCode: string;
  description: string;
  platform: 'Google Meet' | 'Discord' | 'Science Library Rm 2B' | 'Engineering Lab 4';
  meetLink?: string;
  memberCount: number;
  maxMembers: number;
  leaderName: string;
  scheduleTime: string;
  tags: string[];
  isJoined?: boolean;
}
