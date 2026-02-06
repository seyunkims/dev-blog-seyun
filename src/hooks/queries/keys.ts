/**
 * TanStack Query Key 상수
 *
 * 쿼리 키를 한 곳에서 관리하여 일관성을 유지합니다.
 */

import type { Category } from "@/types";

export const queryKeys = {
    // 게시글 관련 키
    posts: {
        // 모든 게시글 관련 쿼리의 기본 키
        all: ["posts"] as const,

        // 목록 쿼리
        lists: () => [...queryKeys.posts.all, "list"] as const,

        // 필터가 적용된 목록 쿼리
        list: (filters: { category?: Category | null }) =>
            [...queryKeys.posts.lists(), filters] as const,

        // 상세 쿼리
        details: () => [...queryKeys.posts.all, "detail"] as const,

        // 특정 게시글 상세
        detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    },
};
