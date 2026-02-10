/**
 * 애플리케이션 상수 정의
 */

// 페이지네이션
export const PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;

// 입력 제한
export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 50000;
export const COMMENT_MAX_LENGTH = 1000;
export const PASSWORD_MIN_LENGTH = 6;

// 시간 단위 (ms)
export const MS_PER_MINUTE = 1000 * 60;
export const MS_PER_HOUR = MS_PER_MINUTE * 60;
export const MS_PER_DAY = MS_PER_HOUR * 24;

// 캐시 시간 (ms)
export const STALE_TIME = MS_PER_MINUTE * 5; // 5분
export const GC_TIME = MS_PER_MINUTE * 10; // 10분

// 라우트 경로
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  WRITE: "/write",
  POST_DETAIL: "/posts/:id",
  POST_EDIT: "/posts/:id/edit",
  PROFILE: "/profile/:uid",
} as const;

// 동적 라우트 생성 헬퍼
export const getPostDetailPath = (id: string) => `/posts/${id}`;
export const getPostEditPath = (id: string) => `/posts/${id}/edit`;
export const getProfilePath = (uid: string) => `/profile/${uid}`;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK: "네트워크 연결을 확인해주세요.",
  UNKNOWN: "알 수 없는 오류가 발생했습니다.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "권한이 없습니다.",
  NOT_FOUND: "페이지를 찾을 수 없습니다.",
  INVALID_FILE_TYPE:
    "지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)",
  FILE_TOO_LARGE: "파일 크기는 5MB 이하여야 합니다.",
  UPLOAD_FAILED: "업로드 실패",
  DOWNLOAD_URL_FAILED: "다운로드 URL 생성 실패",
} as const;

// Storage 경로
export const STORAGE_PATH_PREFIX = "posts";

// 허용된 이미지 용량
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * 허용된 이미지 MIME 타입
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];