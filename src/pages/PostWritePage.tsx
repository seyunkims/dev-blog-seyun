import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCreatePost } from "@/hooks/mutations";
import PostForm from "@/components/PostForm";
import type { PostInput } from "@/types";

function PostWritePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const handleSubmit = useCallback(
    async (data: PostInput) => {
      if (!user) return;

      createPostMutation.mutate(
        { input: data, user },
        {
          onSuccess: (postId) => {
            navigate(`/posts/${postId}`);
          },
        },
      );
    },
    [user, createPostMutation, navigate],
  );

  return (
    <div className="max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>

      <PostForm
        onSubmit={handleSubmit}
        isLoading={createPostMutation.isPending}
        userId={user?.uid ?? ""}
      />
    </div>
  );
}

export default PostWritePage;
