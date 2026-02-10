/**
 * ============================================
 * 블로그 앱 타입 정의
 * ============================================
 */

import { Timestamp } from "firebase/firestore";

// ============================================
// User (사용자)
// ============================================

export interface User {
  /** Firebase Auth에서 자동 생성되는 고유 ID */
  uid: string;

  /** 사용자 이메일 (로그인 ID로 사용) */
  email: string;

  /** 표시 이름 (소셜 로그인 시 가져옴, 없으면 null) */
  displayName: string | null;

  /** 프로필 이미지 URL (소셜 로그인 시 가져옴) */
  photoURL: string | null;
}

// ============================================
// Post (게시글)
// ============================================

export type Category =
  | "javascript"
  | "typescript"
  | "react"
  | "firebase"
  | "etc";

/**
 * 카테고리 한글 라벨
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  firebase: "Firebase",
  etc: "기타",
};

/**
 * 게시글 타입
 */
export interface Post {
  id: string;
  title: string;
  content: string;
  category: Category | null;
  authorId: string;
  authorEmail: string;
  authorDisplayName: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likeCount: number;
}

/**
 * 게시글 작성/수정 시 입력 데이터 타입
 */
export interface PostInput {
  /** 게시글 제목 */
  title: string;

  /** 게시글 내용 */
  content: string;

  /** 카테고리 (선택사항) */
  category: Category | null;
}

/**
 * 게시글 목록 표시용 간략 타입
 */
export interface PostSummary {
  id: string;
  title: string;
  category: Category | null;
  authorId: string;
  authorEmail: string;
  authorDisplayName: string | null;
  createdAt: Timestamp;
  thumbnailUrl?: string;
  likeCount: number;
}

// ============================================
// Form 관련 타입
// ============================================

/**
 * 로그인 폼 데이터
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 회원가입 폼 데이터
 */
export interface SignUpFormData {
  email: string;
  password: string;
  passwordConfirm: string;
}

// ============================================
// Auth 상태 관련 타입
// ============================================

/**
 * 인증 상태 타입
 */
export interface AuthState {
  /** 현재 로그인한 사용자 (없으면 null) */
  user: User | null;

  /** 인증 상태 로딩 중 여부 */
  isLoading: boolean;

  /** 에러 메시지 */
  error: string | null;
}

// ============================================
// API 응답 관련 타입
// ============================================

/**
 * 공통 API 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// UserProfile (회원 프로필)
// ============================================

/**
 * Firestore users 컬렉션에 저장되는 회원 프로필 타입
 */
export interface UserProfile {
  /** Firebase Auth UID (문서 ID와 동일) */
  uid: string;

  /** 이메일 */
  email: string;

  /** 표시 이름 */
  displayName: string | null;

  /** 프로필 이미지 URL */
  photoURL: string | null;

  /** 인증 제공자 */
  provider: "email" | "google";

  /** 가입 시각 */
  createdAt: Timestamp;

  /** 수정 시각 */
  updatedAt: Timestamp;
}

// ============================================
// Comment (댓글)
// ============================================

/**
 * 댓글 타입
 */
export interface Comment {
  /** Firestore 문서 ID */
  id: string;

  /** 댓글이 속한 게시글 ID */
  postId: string;

  /** 댓글 내용 */
  content: string;

  /** 작성자 Firebase Auth UID */
  authorId: string;

  /** 작성자 이메일 */
  authorEmail: string;

  /** 작성자 표시 이름 */
  authorDisplayName: string | null;

  /** 생성 시각 */
  createdAt: Timestamp;

  /** 수정 시각 */
  updatedAt: Timestamp;
}

/**
 * 댓글 작성/수정 시 입력 데이터 타입
 */
export interface CommentInput {
  /** 댓글 내용 */
  content: string;
}
