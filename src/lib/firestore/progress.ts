import { db, isFirebaseConfigured } from "@/lib/firebase";
import { LessonProgress } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const LOCAL_PROGRESS_KEY = "micro_learning_progress";

function getLocalProgressStore(): Record<string, Record<string, LessonProgress>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalProgressStore(data: Record<string, Record<string, LessonProgress>>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to write local progress", e);
  }
}

export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const ref = doc(db, `progress/${userId}/lessons`, lessonId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as LessonProgress;
      }
    } catch (e) {
      console.warn("Firestore getLessonProgress fallback:", e);
    }
  }

  const store = getLocalProgressStore();
  return store[userId]?.[lessonId] || null;
}

export async function getAllUserProgress(
  userId: string
): Promise<Record<string, LessonProgress>> {
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, `progress/${userId}/lessons`);
      const snap = await getDocs(colRef);
      const map: Record<string, LessonProgress> = {};
      snap.forEach((d) => {
        const item = d.data() as LessonProgress;
        map[item.lessonId] = item;
      });
      if (Object.keys(map).length > 0) return map;
    } catch (e) {
      console.warn("Firestore getAllUserProgress fallback:", e);
    }
  }

  const store = getLocalProgressStore();
  return store[userId] || {};
}

export async function updateCardIndex(
  userId: string,
  lessonId: string,
  cardIndex: number
): Promise<void> {
  const current = (await getLessonProgress(userId, lessonId)) || {
    userId,
    lessonId,
    bestScore: null,
    lastAttemptScore: null,
    attempts: 0,
    completedAt: null,
    lastCardIndex: 0,
    updatedAt: new Date().toISOString(),
  };

  current.lastCardIndex = cardIndex;
  current.updatedAt = new Date().toISOString();

  // Save to local
  const store = getLocalProgressStore();
  if (!store[userId]) store[userId] = {};
  store[userId][lessonId] = current;
  setLocalProgressStore(store);

  // Save to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const ref = doc(db, `progress/${userId}/lessons`, lessonId);
      await setDoc(ref, current, { merge: true });
    } catch (e) {
      console.error("Firestore updateCardIndex error:", e);
    }
  }
}

export async function recordQuizAttempt(
  userId: string,
  lessonId: string,
  score: number,
  passingScore: number
): Promise<LessonProgress> {
  const existing = (await getLessonProgress(userId, lessonId)) || {
    userId,
    lessonId,
    bestScore: null,
    lastAttemptScore: null,
    attempts: 0,
    completedAt: null,
    lastCardIndex: 0,
    updatedAt: new Date().toISOString(),
  };

  const newAttempts = existing.attempts + 1;
  const newBestScore =
    existing.bestScore === null
      ? score
      : Math.max(existing.bestScore, score);

  const isCompletedNow = newBestScore >= passingScore;
  const completedAt =
    existing.completedAt || (isCompletedNow ? new Date().toISOString() : null);

  const updated: LessonProgress = {
    ...existing,
    attempts: newAttempts,
    lastAttemptScore: score,
    bestScore: newBestScore,
    completedAt,
    updatedAt: new Date().toISOString(),
  };

  // Save to local
  const store = getLocalProgressStore();
  if (!store[userId]) store[userId] = {};
  store[userId][lessonId] = updated;
  setLocalProgressStore(store);

  // Save to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const ref = doc(db, `progress/${userId}/lessons`, lessonId);
      await setDoc(ref, updated, { merge: true });
    } catch (e) {
      console.error("Firestore recordQuizAttempt error:", e);
    }
  }

  return updated;
}
