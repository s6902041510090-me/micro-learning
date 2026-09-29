"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { AppUser, UserRole } from "@/types";
import { getUserProfile, saveUserProfile } from "@/lib/firestore/users";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signInEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInGoogle: (roleForNewUser?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole
  ) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = "micro_learning_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage or Firebase on mount
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setUser(fbUser);
        if (fbUser) {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setAppUser(profile);
          } else {
            // New Firebase user without profile yet
            const newProfile: AppUser = {
              uid: fbUser.uid,
              email: fbUser.email || "",
              displayName: fbUser.displayName || "ผู้เรียนใหม่",
              role: "student",
              photoURL: fbUser.photoURL || undefined,
              createdAt: new Date().toISOString(),
            };
            await saveUserProfile(newProfile);
            setAppUser(newProfile);
          }
        } else {
          setAppUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local fallback mode
      try {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppUser;
          setAppUser(parsed);
        }
      } catch (e) {
        console.warn("Failed to read stored user", e);
      }
      setLoading(false);
    }
  }, []);

  const signInEmail = async (email: string, pass: string) => {
    try {
      if (isFirebaseConfigured() && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const profile = await getUserProfile(cred.user.uid);
        if (profile) setAppUser(profile);
        return { success: true };
      }

      // Mock sign in
      const mockProfile: AppUser = {
        uid: `demo-user-${email.split("@")[0]}`,
        email,
        displayName: email.split("@")[0],
        role: "student",
        createdAt: new Date().toISOString(),
      };
      setAppUser(mockProfile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockProfile));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      return { success: false, error: message };
    }
  };

  const signInGoogle = async (roleForNewUser: UserRole = "student") => {
    try {
      if (isFirebaseConfigured() && auth) {
        const res = await signInWithPopup(auth, googleProvider);
        let profile = await getUserProfile(res.user.uid);
        if (!profile) {
          profile = {
            uid: res.user.uid,
            email: res.user.email || "",
            displayName: res.user.displayName || "ผู้ใช้ Google",
            role: roleForNewUser,
            photoURL: res.user.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };
          await saveUserProfile(profile);
        }
        setAppUser(profile);
        return { success: true };
      }

      // Mock Google sign in
      const mockGoogle: AppUser = {
        uid: "demo-google-student",
        email: "student@google.demo",
        displayName: "น้องนกฮูก (Google)",
        role: roleForNewUser,
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString(),
      };
      setAppUser(mockGoogle);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockGoogle));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google";
      return { success: false, error: message };
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole
  ) => {
    try {
      if (isFirebaseConfigured() && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName });
        const profile: AppUser = {
          uid: cred.user.uid,
          email,
          displayName,
          role,
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(profile);
        setAppUser(profile);
        return { success: true };
      }

      // Mock sign up
      const mockUser: AppUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
      };
      setAppUser(mockUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      return { success: false, error: message };
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    const demoUser: AppUser =
      role === "teacher"
        ? {
            uid: "teacher-1",
            email: "teacher@microlearning.th",
            displayName: "ครูพี่เมฆ ☁️",
            role: "teacher",
            photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString(),
          }
        : {
            uid: "student-1",
            email: "student@microlearning.th",
            displayName: "น้องต้นกล้า 🌱",
            role: "student",
            photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString(),
          };

    setAppUser(demoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
  };

  const signOut = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn("Sign out error", e);
      }
    }
    setAppUser(null);
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        signInEmail,
        signInGoogle,
        signUp,
        quickDemoLogin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
