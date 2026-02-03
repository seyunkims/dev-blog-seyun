// src/types/index.ts

/**
 * ============================================
 * 블로그 앱 타입 정의
 * ============================================
 * 
 * Day 1에서 설계한 데이터 모델을 기반으로 작성되었습니다.
 * 모든 컴포넌트와 함수에서 이 타입들을 import해서 사용합니다.
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// User (사용자)
// ============================================

/**
 * 사용자 정보 타입
 * 
 * Firebase Auth에서 제공하는 사용자 정보를 기반으로
 * 우리 앱에서 사용할 형태로 정의합니다.
 * 
 * Day 1 요구사항: AUTH-001 ~ AUTH-005
 */
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

/**
 * 게시글 카테고리 타입
 * 
 * Day 1 데이터 모델에서 정의한 카테고리 목록입니다.
 * Day 1 요구사항: POST-006 (카테고리별 필터링)
 */
export type Category = 
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'firebase'
  | 'etc';

/**
 * 카테고리 한글 라벨
 * 
 * UI에서 표시할 때 사용합니다.
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  firebase: 'Firebase',
  etc: '기타',
};

/**
 * 게시글 타입
 * 
 * Firestore의 'posts' 컬렉션에 저장되는 문서 구조입니다.
 * 
 * Day 1 요구사항: POST-001 ~ POST-007
 * Day 1 기능명세서: FUNC-002 (게시글 작성)
 */
export interface Post {
  /** Firestore 문서 ID (자동 생성) */
  id: string;
  
  /** 게시글 제목 (1~100자) - Day 1 기능명세서 참고 */
  title: string;
  
  /** 게시글 본문 내용 */
  content: string;
  
  /** 카테고리 (선택사항) */
  category: Category | null;
  
  /** 작성자 UID (User.uid 참조) */
  authorId: string;
  
  /** 작성자 이메일 (화면 표시용) */
  authorEmail: string;
  
  /** 작성자 표시 이름 */
  authorDisplayName: string | null;
  
  /** 작성 일시 - Firestore Timestamp 타입 사용 */
  createdAt: Timestamp;
  
  /** 수정 일시 */
  updatedAt: Timestamp;
}

/**
 * 게시글 작성/수정 시 입력 데이터 타입
 * 
 * id, authorId, createdAt 등 자동 생성되는 필드는 제외됩니다.
 * Day 1 기능명세서: FUNC-002 입력 데이터 참고
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
 * 
 * 목록에서는 전체 content를 표시하지 않으므로
 * 필요한 필드만 포함한 타입을 별도로 정의합니다.
 */
export interface PostSummary {
  id: string;
  title: string;
  category: Category | null;
  authorEmail: string;
  authorDisplayName: string | null;
  createdAt: Timestamp;
}

// ============================================
// Form 관련 타입
// ============================================

/**
 * 로그인 폼 데이터
 * 
 * Day 1 기능명세서: FUNC-001 (회원가입) 입력 데이터 참고
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
 * 
 * AuthContext에서 관리할 상태 구조입니다.
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