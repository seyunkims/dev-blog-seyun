/**
 * 애플리케이션 상수 정의
 */

// 페이지네이션
export const PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;

// 입력 제한
export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 50000;
export const PASSWORD_MIN_LENGTH = 6;

// 캐시 시간 (ms)
export const STALE_TIME = 1000 * 60 * 5; // 5분
export const GC_TIME = 1000 * 60 * 10; // 10분

// 라우트 경로
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  WRITE: "/write",
  POST_DETAIL: "/posts/:id",
  POST_EDIT: "/posts/:id/edit",
} as const;

// 동적 라우트 생성 헬퍼
export const getPostDetailPath = (id: string) => `/posts/${id}`;
export const getPostEditPath = (id: string) => `/posts/${id}/edit`;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK: "네트워크 연결을 확인해주세요.",
  UNKNOWN: "알 수 없는 오류가 발생했습니다.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "권한이 없습니다.",
  NOT_FOUND: "페이지를 찾을 수 없습니다.",
} as const;
