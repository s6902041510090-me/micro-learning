import { db, isFirebaseConfigured } from "@/lib/firebase";
import { AppUser } from "@/types";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LOCAL_USERS_KEY = "micro_learning_users";

function getLocalUsers(): Record<string, AppUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUser(user: AppUser): void {
  if (typeof window === "undefined") return;
  try {
    const users = getLocalUsers();
    users[user.uid] = user;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save local user", e);
  }
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as AppUser;
      }
    } catch (err) {
      console.warn("Firestore getUserProfile fallback to local:", err);
    }
  }

  const localUsers = getLocalUsers();
  return localUsers[uid] || null;
}

export async function saveUserProfile(user: AppUser): Promise<void> {
  saveLocalUser(user);

  if (isFirebaseConfigured() && db) {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore saveUserProfile error:", err);
    }
  }
}
