export type UserRole = "student" | "teacher";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string | Date;
}

export type Category =
  | "วิทย์"
  | "คณิต"
  | "ภาษาไทย"
  | "ภาษาอังกฤษ"
  | "สังคม"
  | "เทคโนโลยี"
  | "ทักษะชีวิต"
  | "อื่นๆ";

export type CardType = "text-image" | "slide" | "quiz";

export interface TextImageCard {
  id: string;
  type: "text-image";
  title: string;
  body: string;
  imageUrl?: string;
}

export interface SlideCard {
  id: string;
  type: "slide";
  imageUrl: string;
  caption?: string;
}

export interface QuizCard {
  id: string;
  type: "quiz";
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
}

export type LessonCard = TextImageCard | SlideCard | QuizCard;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  objective?: string;
  thumbnailUrl?: string;
  authorId: string;
  authorName: string;
  estimatedMinutes: number; // 3–5 minutes
  category: Category;
  tags: string[];
  passingScore: number; // 0–100, default 70
  isPublished: boolean;
  deletedAt: string | null; // soft-delete timestamp ISO string or null
  createdAt: string;
  updatedAt: string;
  cards: LessonCard[];
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  bestScore: number | null; // highest score %
  lastAttemptScore: number | null;
  attempts: number;
  completedAt: string | null; // set when bestScore >= passingScore
  lastCardIndex: number;
  updatedAt: string;
}

export type ProgressState = "not_started" | "in_progress" | "completed";
