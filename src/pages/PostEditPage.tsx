/**
 * 게시글 수정 페이지
 *
 * Day 1 요구사항: POST-004
 * "작성자는 자신의 게시글을 수정할 수 있다"
 *
 * Day 1 사용자 스토리: US-005 (내 글 수정)
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../lib/posts";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/PostForm";
import type { Post, PostInput } from "@/types";

function PostEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 기존 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;

            try {
                const data = await getPost(id);

                if (!data) {
                    setError("게시글을 찾을 수 없습니다.");
                    return;
                }

                // Day 1 사용자 스토리 US-005: 다른 사람의 글은 수정할 수 없다
                if (!user || data.authorId !== user.uid) {
                    setError("수정 권한이 없습니다.");
                    return;
                }

                setPost(data);
            } catch (err) {
                console.error("게시글 조회 실패:", err);
                setError("게시글을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id, user]);

    /**
     * 게시글 수정 핸들러
     */
    const handleSubmit = async (data: PostInput) => {
        if (!id) return;

        setIsSaving(true);
        try {
            await updatePost(id, data);
            navigate(`/posts/${id}`);
        } finally {
            setIsSaving(false);
        }
    };

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error || !post) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-red-600 mb-4">
                        {error || "게시글을 찾을 수 없습니다."}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">글 수정</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <PostForm
                    initialData={{
                        title: post.title,
                        content: post.content,
                        category: post.category,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="수정하기"
                    isLoading={isSaving}
                />
            </div>
        </div>
    );
}

export default PostEditPage;
