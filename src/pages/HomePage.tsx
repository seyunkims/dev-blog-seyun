/**
 * 홈 페이지 (게시글 목록)
 *
 * Day 1 요구사항: POST-002, UX-001
 * Day 1 사용자 스토리: US-004 (게시글 목록 보기)
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../lib/posts";
import { useAuthStore } from "@/store/authStore";
import PostList from "@/components/PostList";
import type { PostSummary } from "@/types";

function HomePage() {
    const user = useAuthStore((state) => state.user);
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * 게시글 목록 불러오기
     *
     * Day 1 기능명세서 FUNC-003 기본 흐름:
     * 1. 사용자가 메인 페이지에 접근한다
     * 2. 시스템이 Firestore에서 게시글 목록을 조회한다
     * 3. 시스템이 최신순으로 정렬하여 표시한다
     */
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (err) {
                console.error("게시글 목록 조회 실패:", err);
                setError("게시글을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

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

            {/* 에러 메시지 */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* 게시글 목록 */}
            <PostList posts={posts} isLoading={isLoading} />
        </div>
    );
}

export default HomePage;
