/**
 * Firebase Authentication 서비스 함수 모음
 * 📚 공식 문서: https://firebase.google.com/docs/auth/web/start
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { auth } from "./firebase";
import type { User } from "@/types";
import { createUserDocument, updateUserProfileDoc } from "./users";

/**
 * Google Auth Provider
 * Google 로그인을 위한 인증 제공자입니다.
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Google 계정으로 로그인 (팝업 방식)
 * @returns 로그인한 사용자 정보
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = formatUser(result.user);
  await createUserDocument(user, "google");
  return user;
}

/**
 * Firebase User를 우리 앱의 User 타입으로 변환
 */
export function formatUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

/**
 * 이메일/비밀번호로 회원가입
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호 (6자 이상)
 * @returns 생성된 사용자 정보
 * @throws 이미 가입된 이메일, 약한 비밀번호 등의 에러
 */
export async function signUp(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = formatUser(userCredential.user);
  await createUserDocument(user, "email");
  return user;
}

/**
 * 이메일/비밀번호로 로그인
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 * @returns 로그인한 사용자 정보
 * @throws 존재하지 않는 사용자, 잘못된 비밀번호 등의 에러
 */
export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return formatUser(userCredential.user);
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * 비밀번호 재설정 이메일 발송
 *
 * @param email - 비밀번호를 재설정할 이메일
 * @throws 존재하지 않는 이메일 등의 에러
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * 이메일 인증 메일 발송
 *
 * @throws 로그인된 사용자가 없는 경우 에러
 */
export async function verifyEmail(): Promise<void> {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error("로그인된 사용자가 없습니다.");
  }
}

/**
 * 인증 상태 변경 감지
 *
 * @param callback - 인증 상태 변경 시 호출될 함수
 * @returns 구독 해제 함수 (cleanup)
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(formatUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}

/**
 * Firebase Auth 에러 메시지를 사용자 친화적인 한글로 변환
 *
 * @param error - Firebase Auth 에러 객체, 에러 코드 문자열, 또는 unknown 타입
 * @returns 사용자 친화적인 한글 에러 메시지
 */
export function getAuthErrorMessage(error: unknown): string {
  const errorMessages: Record<string, string> = {
    // 회원가입 에러
    "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
    "auth/invalid-email": "올바른 이메일 형식을 입력해주세요.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",

    // 로그인 에러
    "auth/user-not-found": "등록되지 않은 이메일입니다.",
    "auth/wrong-password": "비밀번호가 일치하지 않습니다.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "auth/too-many-requests":
      "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",

    // 일반 에러
    "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
    "auth/internal-error":
      "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  };

  // 문자열로 직접 전달된 경우 (에러 코드)
  if (typeof error === "string") {
    return errorMessages[error] || "알 수 없는 오류가 발생했습니다.";
  }

  // AuthError 타입인지 확인 후 에러 코드 추출
  if (error && typeof error === "object" && "code" in error) {
    const authError = error as AuthError;
    return errorMessages[authError.code] || "알 수 없는 오류가 발생했습니다.";
  }

  return "알 수 없는 오류가 발생했습니다.";
}

/**
 * 사용자 표시 이름 변경
 */
export async function updateUserDisplayName(
  displayName: string,
): Promise<void> {
  if (!auth.currentUser) throw new Error("로그인된 사용자가 없습니다.");

  await updateProfile(auth.currentUser, { displayName });
  await updateUserProfileDoc(auth.currentUser.uid, { displayName });
}

/**
 * 사용자 프로필 사진 변경
 */
export async function updateUserPhoto(photoURL: string): Promise<void> {
  if (!auth.currentUser) throw new Error("로그인된 사용자가 없습니다.");

  await updateProfile(auth.currentUser, { photoURL });
  await updateUserProfileDoc(auth.currentUser.uid, { photoURL });
}

/**
 * 비밀번호 변경 (이메일 계정 전용)
 * 보안을 위해 현재 비밀번호로 재인증 후 변경
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!auth.currentUser || !auth.currentUser.email) {
    throw new Error("로그인된 사용자가 없습니다.");
  }

  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    currentPassword,
  );
  await reauthenticateWithCredential(auth.currentUser, credential);
  await firebaseUpdatePassword(auth.currentUser, newPassword);
}
