import { Timestamp } from "firebase/firestore";
import { MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY } from "@/constants"; // [수정] 시간 단위 상수 import 추가

/**
 * Firestore Timestamp를 한국어 날짜 문자열로 변환
 *
 * @example
 * formatDate(timestamp) // "2025년 1월 30일"
 */
export function formatDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Firestore Timestamp를 짧은 날짜 문자열로 변환
 *
 * @example
 * formatDateShort(timestamp) // "2025. 01. 30."
 */
export function formatDateShort(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Firestore Timestamp를 한국어 날짜+시간 문자열로 변환
 *
 * @example
 * formatDateTime(timestamp) // "2025년 1월 30일 오후 2:30"
 */
export function formatDateTime(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 상대적 시간 표시 (n분 전, n시간 전, n일 전)
 *
 * @example
 * formatRelativeTime(timestamp) // "5분 전", "2시간 전", "3일 전"
 */
export function formatRelativeTime(timestamp: Timestamp): string {
  const now = new Date();
  const date = timestamp.toDate();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDate(timestamp);
}

/**
 * 이메일에서 사용자 이름 추출
 *
 * @example
 * getDisplayName("user@example.com", null) // "user"
 * getDisplayName("user@example.com", "홍길동") // "홍길동"
 */
export function getDisplayName(
  email: string,
  displayName: string | null,
): string {
  if (displayName) return displayName;
  return email.split("@")[0];
}

/**
 * HTML 콘텐츠에서 첫 번째 이미지 URL 추출
 *
 * @example
 * extractFirstImageUrl('<p>텍스트</p><img src="https://example.com/img.jpg">') // "https://example.com/img.jpg"
 * extractFirstImageUrl('<p>텍스트만</p>') // undefined
 */
export function extractFirstImageUrl(html: string): string | undefined {
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = html.match(imgRegex);
  return match ? match[1] : undefined;
}
