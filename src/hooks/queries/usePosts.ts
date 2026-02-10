// src/hooks/usePosts.ts

/**
 * 게시글 목록 조회 훅
 *
 * Day 1 요구사항: POST-002, POST-006
 */

import { useQuery } from "@tanstack/react-query";
import { getPostsWithOptions } from "@/lib/posts";
import { queryKeys } from "./keys";
import type { Category } from "@/types";

interface UsePostsOptions {
    category?: Category | null;
    enabled?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
    const { category = null, enabled = true } = options;

    return useQuery({
        // 쿼리 키: 카테고리에 따라 다른 캐시 사용
        queryKey: queryKeys.posts.list({ category }),

        // 데이터 페칭 함수
        queryFn: async () => {
            const result = await getPostsWithOptions({
                category,
                limitCount: 5,
            });
            return result.posts;
        },

        // 쿼리 활성화 여부
        enabled,
    });
}

