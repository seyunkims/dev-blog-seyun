import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToPostsRealtime } from "@/lib/posts copy 1";
import { useAuthStore } from "@/store/authStore";
import PostList from "@/components/PostList";
import type { PostSummary } from "@/types";

function HomePage() {
    const user = useAuthStore((state) => state.user);
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToPostsRealtime(
            // 성공 콜백
            (data) => {
                setPosts(data);
                setIsLoading(false);
                setError(null);
            },
            // 옵션
            { limitCount: 5 },
        );

        return () => unsubscribe();
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