import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PostList from "@/components/PostList";
import type { Category } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { useInfinitePosts } from "@/hooks/queries";
//
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import ErrorMessage from "@/components/ErrorMessage";

function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePosts({
    category: selectedCategory,
    pageSize: 5,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const categories: Category[] = [
    "javascript",
    "typescript",
    "react",
    "firebase",
    "etc",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">최신 게시글</h1>

        {user && (
          <Button asChild>
            <Link to="/write">✏️ 글쓰기</Link>
          </Button>
        )}
      </div>

      {/* 카테고리 필터 (Day 1 POST-006) */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          전체
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </Badge>
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <ErrorMessage
          message="게시글을 불러오는데 실패했습니다"
          onRetry={() => refetch()}
        />
      )}

      {/* 게시글 목록 */}
      {!error && <PostList posts={posts} isLoading={isLoading} />}

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner className="size-8" />
            <span className="text-sm">불러오는 중...</span>
          </div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-sm text-gray-400">모든 게시글을 불러왔습니다</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;