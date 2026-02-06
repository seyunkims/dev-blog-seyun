/**
 * 글쓰기 페이지
 *
 * Day 1 요구사항: POST-001
 *
 * TanStack Query 적용으로 리팩토링
 */

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCreatePost } from "@/hooks/mutations";
import PostForm from "@/components/PostForm";
import type { PostInput } from "@/types";

function PostWritePage() {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    // 생성 뮤테이션
    const createPostMutation = useCreatePost();

    /**
     * 게시글 작성 핸들러
     */
    const handleSubmit = async (data: PostInput) => {
        if (!user) return;

        createPostMutation.mutate(
            { input: data, user },
            {
                onSuccess: (postId) => {
                    navigate(`/posts/${postId}`);
                },
            },
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                새 글 작성
            </h1>

            <div className="bg-white rounded-lg shadow p-6">
                <PostForm
                    onSubmit={handleSubmit}
                    isLoading={createPostMutation.isPending}
                />
            </div>
        </div>
    );
}

export default PostWritePage;
