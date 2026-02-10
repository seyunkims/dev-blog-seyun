import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/PostForm";
import type { PostInput } from "@/types";
import { usePost } from "@/hooks/queries";
import { useUpdatePost } from "@/hooks/mutations";

function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: post, isLoading, error } = usePost(id);
  const updatePostMutation = useUpdatePost();

  const handleSubmit = useCallback(
    async (data: PostInput) => {
      if (!id) return;

      updatePostMutation.mutate(
        { postId: id, input: data },
        {
          onSuccess: () => {
            navigate(`/posts/${id}`);
          },
        },
      );
    },
    [id, updatePostMutation, navigate],
  );

  const hasPermission = user && post && user.uid === post.authorId;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post || !hasPermission) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600 mb-4">
            {error ? "게시글을 찾을 수 없습니다." : "수정 권한이 없습니다."}
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
    <div className="max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>

      <PostForm
        initialData={{
          title: post.title,
          content: post.content,
          category: post.category,
        }}
        onSubmit={handleSubmit}
        submitLabel="수정하기"
        isLoading={updatePostMutation.isPending}
        userId={user?.uid ?? ""}
      />
    </div>
  );
}

export default PostEditPage;
