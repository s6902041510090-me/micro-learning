import { db, isFirebaseConfigured } from "@/lib/firebase";
import { INITIAL_SEED_LESSONS } from "@/lib/constants";
import { Lesson } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  orderBy,
} from "firebase/firestore";

const LOCAL_LESSONS_KEY = "micro_learning_lessons";

function getLocalLessons(): Lesson[] {
  if (typeof window === "undefined") return INITIAL_SEED_LESSONS;
  try {
    const raw = localStorage.getItem(LOCAL_LESSONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_LESSONS_KEY, JSON.stringify(INITIAL_SEED_LESSONS));
      return INITIAL_SEED_LESSONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEED_LESSONS;
  }
}

function setLocalLessons(lessons: Lesson[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_LESSONS_KEY, JSON.stringify(lessons));
  } catch (e) {
    console.error("Failed to write local lessons", e);
  }
}

export async function getPublishedLessons(): Promise<Lesson[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "lessons"),
        where("isPublished", "==", true),
        where("deletedAt", "==", null),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list: Lesson[] = [];
      snap.forEach((d) => list.push(d.data() as Lesson));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Firestore getPublishedLessons fallback to local:", e);
    }
  }

  const all = getLocalLessons();
  return all.filter((l) => l.isPublished && !l.deletedAt);
}

export async function getLessonsByAuthor(authorId: string): Promise<Lesson[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "lessons"),
        where("authorId", "==", authorId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list: Lesson[] = [];
      snap.forEach((d) => list.push(d.data() as Lesson));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Firestore getLessonsByAuthor fallback to local:", e);
    }
  }

  const all = getLocalLessons();
  return all.filter((l) => l.authorId === authorId);
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const ref = doc(db, "lessons", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as Lesson;
      }
    } catch (e) {
      console.warn("Firestore getLessonById fallback to local:", e);
    }
  }

  const all = getLocalLessons();
  return all.find((l) => l.id === id) || null;
}

export async function saveLesson(lesson: Lesson): Promise<void> {
  const all = getLocalLessons();
  const index = all.findIndex((l) => l.id === lesson.id);
  if (index >= 0) {
    all[index] = lesson;
  } else {
    all.unshift(lesson);
  }
  setLocalLessons(all);

  if (isFirebaseConfigured() && db) {
    try {
      const ref = doc(db, "lessons", lesson.id);
      await setDoc(ref, lesson, { merge: true });
    } catch (e) {
      console.error("Firestore saveLesson error:", e);
    }
  }
}

export async function softDeleteLesson(id: string): Promise<void> {
  const all = getLocalLessons();
  const lesson = all.find((l) => l.id === id);
  if (lesson) {
    lesson.deletedAt = new Date().toISOString();
    lesson.isPublished = false;
    lesson.updatedAt = new Date().toISOString();
    setLocalLessons(all);

    if (isFirebaseConfigured() && db) {
      try {
        const ref = doc(db, "lessons", id);
        await setDoc(
          ref,
          {
            deletedAt: lesson.deletedAt,
            isPublished: false,
            updatedAt: lesson.updatedAt,
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Firestore softDeleteLesson error:", e);
      }
    }
  }
}

export async function togglePublishLesson(id: string, publish: boolean): Promise<void> {
  const all = getLocalLessons();
  const lesson = all.find((l) => l.id === id);
  if (lesson) {
    lesson.isPublished = publish;
    lesson.updatedAt = new Date().toISOString();
    setLocalLessons(all);

    if (isFirebaseConfigured() && db) {
      try {
        const ref = doc(db, "lessons", id);
        await setDoc(
          ref,
          { isPublished: publish, updatedAt: lesson.updatedAt },
          { merge: true }
        );
      } catch (e) {
        console.error("Firestore togglePublishLesson error:", e);
      }
    }
  }
}
