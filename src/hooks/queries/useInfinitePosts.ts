// src/hooks/queries/useInfinitePosts.ts

/**
 * 무한 스크롤 게시글 목록 조회 훅
 * 
 * Day 1 요구사항: UX-003 (모바일 반응형 지원 - 무한 스크롤)
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsWithOptions, type GetPostsResult } from '@/lib/posts';
import { queryKeys } from './keys';
import type { Category } from '@/types';

interface UseInfinitePostsOptions {
  category?: Category | null;
  pageSize?: number;
}

export function useInfinitePosts(options: UseInfinitePostsOptions = {}) {
  const { category = null, pageSize = 5 } = options;

  return useInfiniteQuery({
    queryKey: queryKeys.posts.list({ category }),
    
    queryFn: async ({ pageParam }) => {
      return getPostsWithOptions({
        category,
        limitCount: pageSize,
        lastDoc: pageParam,
      });
    },
    
    // 첫 페이지는 커서 없이 시작
    initialPageParam: null as GetPostsResult['lastDoc'],
    
    // 다음 페이지 파라미터 결정
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined;
    },
  });
}