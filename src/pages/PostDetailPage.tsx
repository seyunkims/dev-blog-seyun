/**
 * 게시글 상세 페이지
 *
 * Day 1 요구사항: POST-003, POST-004, POST-005
 *
 * TanStack Query 적용으로 리팩토링
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import { usePost } from "@/hooks/queries";
import { useDeletePost } from "@/hooks/mutations";
import { useAuthStore } from "@/store/authStore";
import { CATEGORY_LABELS } from "@/types";

function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    // TanStack Query로 게시글 조회
    const { data: post, isLoading, error } = usePost(id);

    // 삭제 뮤테이션
    const deletePostMutation = useDeletePost();

    /**
     * 게시글 삭제 핸들러
     */
    const handleDelete = async () => {
        if (!id) return;

        if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
            return;
        }

        deletePostMutation.mutate(id, {
            onSuccess: () => {
                navigate("/");
            },
            onError: () => {
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            },
        });
    };

    /**
     * 날짜 포맷팅
     */
    const formatDate = (timestamp: { toDate: () => Date }) => {
        const date = timestamp.toDate();
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /**
     * 작성자 본인 여부 확인
     *
     * Day 1 사용자 스토리 US-005, US-006:
     * - 내가 쓴 글에만 수정/삭제 버튼이 보인다
     */
    const isAuthor = user && post && user.uid === post.authorId;

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error || !post) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                        {error?.message || "게시글을 찾을 수 없습니다."}
                    </p>
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-lg shadow">
                {/* 게시글 헤더 */}
                <header className="p-6 border-b">
                    {/* 카테고리 */}
                    {post.category && (
                        <span
                            className="inline-block px-2 py-1 text-xs font-medium 
                           bg-blue-100 text-blue-800 rounded mb-3"
                        >
                            {CATEGORY_LABELS[post.category]}
                        </span>
                    )}

                    {/* 제목 */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {post.title}
                    </h1>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            <span>
                                {post.authorDisplayName ||
                                    post.authorEmail.split("@")[0]}
                            </span>
                            <span className="mx-2">·</span>
                            <span>{formatDate(post.createdAt)}</span>
                            {/* 수정됨 표시 */}
                            {post.updatedAt.toMillis() !==
                                post.createdAt.toMillis() && (
                                <span className="ml-2 text-gray-400">
                                    (수정됨)
                                </span>
                            )}
                        </div>

                        {/* 수정/삭제 버튼 (작성자만 표시) */}
                        {isAuthor && (
                            <div className="flex gap-2">
                                <Link
                                    to={`/posts/${post.id}/edit`}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900
                           border border-gray-300 rounded hover:bg-gray-50
                           transition-colors"
                                >
                                    수정
                                </Link>
                                {/* 수정됨 ---------------------------------- */}
                                <button
                                    onClick={handleDelete}
                                    disabled={deletePostMutation.isPending}
                                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700
                           border border-red-300 rounded hover:bg-red-50
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                                >
                                    {deletePostMutation.isPending
                                        ? "삭제 중..."
                                        : "삭제"}
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* 게시글 본문 */}
                <div className="p-6">
                    <div className="prose max-w-none">
                        {/* 줄바꿈 유지하여 표시 */}
                        {post.content.split("\n").map((line, index) => (
                            <p key={index} className="mb-4">
                                {line || <br />}
                            </p>
                        ))}
                    </div>
                </div>
            </article>

            {/* 목록으로 돌아가기 */}
            <div className="mt-6">
                <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    ← 목록으로
                </Link>
            </div>
        </div>
    );
}

export default PostDetailPage;
