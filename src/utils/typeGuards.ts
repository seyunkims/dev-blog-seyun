// src/utils/typeGuards.ts

/**
 * 타입 가드 유틸리티
 */

/**
 * Firebase 에러인지 확인
 */
export function isFirebaseError(
  error: unknown
): error is { code: string; message: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  );
}

/**
 * null/undefined가 아닌지 확인
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * 빈 문자열이 아닌지 확인
 */
export function isNotEmpty(value: string | null | undefined): value is string {
  return isDefined(value) && value.trim().length > 0;
}