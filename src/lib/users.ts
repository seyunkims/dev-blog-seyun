import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, UserProfile } from "@/types";

/**
 * 회원 문서 생성 (이미 존재하면 skip)
 */
export async function createUserDocument(
  user: User,
  provider: "email" | "google",
): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) return;

  await setDoc(userRef, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/**
 * 회원 프로필 조회
 */
export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  return {
    uid: userSnap.id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    provider: data.provider,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as UserProfile;
}

/**
 * 회원 프로필 업데이트
 */
export async function updateUserProfileDoc(
  uid: string,
  data: { displayName?: string; photoURL?: string | null },
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}
