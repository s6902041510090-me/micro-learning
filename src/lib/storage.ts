import { storage, isFirebaseConfigured } from "@/lib/firebase";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UploadResult {
  url: string;
  error?: string;
}

export async function uploadLessonImage(
  file: File,
  folder: string = "lessons"
): Promise<UploadResult> {
  if (!file) {
    return { url: "", error: "กรุณาเลือกไฟล์รูปภาพ" };
  }

  if (!file.type.startsWith("image/")) {
    return { url: "", error: "ไฟล์ต้องเป็นรูปภาพเท่านั้น (JPEG, PNG, WebP)" };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      url: "",
      error: `ขนาดไฟล์เกิน 5MB (ไฟล์ของคุณ: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  if (isFirebaseConfigured() && storage) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return { url: downloadUrl };
    } catch (e: unknown) {
      console.warn("Firebase storage upload error, fallback to local dataURL:", e);
    }
  }

  // Fallback to Base64 Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: "", error: "เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ" });
    };
    reader.readAsDataURL(file);
  });
}
