/**
 * 홈 페이지 (게시글 목록)
 *
 * Day 1 요구사항: POST-002, POST-006, UX-001
 *
 * TanStack Query 적용으로 리팩토링
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PostList from "@/components/PostList";

import type { Category } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { usePosts } from "@/hooks/queries";

function HomePage() {
    const user = useAuthStore((state) => state.user);

    // 카테고리 필터 상태 (Day 1 POST-006)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );

    // TanStack Query로 게시글 목록 조회
    const {
        data: posts = [],
        isLoading,
        error,
    } = usePosts({
        category: selectedCategory,
    });

    // 카테고리 목록
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
                <h1 className="text-2xl font-bold text-gray-900">
                    최신 게시글
                </h1>
                {/* 로그인 시 글쓰기 버튼 */}
                {user && (
                    <Link
                        to="/write"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium
                     rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        글쓰기
                    </Link>
                )}
            </div>

            {/* 카테고리 필터 (Day 1 POST-006) */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${
                selectedCategory === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
                >
                    전체
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${
                  selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                        {CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error.message}</p>
                </div>
            )}

            {/* 게시글 목록 */}
            <PostList posts={posts} isLoading={isLoading} />
        </div>
    );
}

export default HomePage;
