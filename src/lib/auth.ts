/**
 * Firebase Authentication 서비스 함수 모음
 *
 * Day 1 API 명세서에서 정의한 인증 관련 함수들을 구현합니다.
 * - AUTH-001: 이메일 회원가입
 * - AUTH-002: 이메일 로그인
 * - AUTH-004: 로그아웃
 *
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
} from "firebase/auth";
import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { auth } from "./firebase";
import type { User } from "@/types";

/**
 * Google Auth Provider
 *
 * Google 로그인을 위한 인증 제공자입니다.
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Google 계정으로 로그인 (팝업 방식)
 *
 * Day 1 요구사항: AUTH-003
 * Day 1 사용자 스토리: US-002 (소셜 로그인)
 *
 * 인수 조건:
 * - Google 로그인 버튼이 있다
 * - 클릭 시 Google 로그인 팝업이 뜬다
 * - 로그인 성공 시 메인 페이지로 이동한다
 * - 처음 로그인해도 별도 회원가입 절차가 없다
 *
 * 참고: COOP 경고는 콘솔에만 표시되며 기능에는 영향 없음
 *
 * @returns 로그인한 사용자 정보
 */
export async function signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    return formatUser(result.user);
}

/**
 * Firebase User를 우리 앱의 User 타입으로 변환
 *
 * Firebase가 제공하는 user 객체에서 필요한 정보만 추출합니다.
 * Day 1 데이터 모델의 User 인터페이스에 맞춰 변환합니다.
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
 * Day 1 요구사항: AUTH-001
 * Day 1 기능명세서: FUNC-001 (회원가입)
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
    return formatUser(userCredential.user);
}

/**
 * 이메일/비밀번호로 로그인
 *
 * Day 1 요구사항: AUTH-002
 * Day 1 기능명세서: 기본 흐름 참고
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
 *
 * Day 1 요구사항: AUTH-004
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
 * 현재 로그인된 사용자에게 이메일 인증 메일을 발송합니다.
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
 * Day 1 요구사항: AUTH-005 (로그인 상태 유지)
 *
 * Firebase Auth의 onAuthStateChanged를 래핑합니다.
 * 로그인/로그아웃 시, 또는 페이지 새로고침 시 호출됩니다.
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
 * Day 1 기능명세서: 예외 흐름의 사용자 메시지 참고
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
        // 참고: 최신 Firebase는 보안상 user-not-found, wrong-password 대신
        // invalid-credential을 주로 반환합니다.
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
        return (
            errorMessages[authError.code] || "알 수 없는 오류가 발생했습니다."
        );
    }

    return "알 수 없는 오류가 발생했습니다.";
}
