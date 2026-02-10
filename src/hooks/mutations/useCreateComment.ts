/**
 * 댓글 작성 뮤테이션
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/lib/comments";
import { queryKeys } from "@/hooks/queries/keys";
import type { CommentInput, User } from "@/types";
import { toast } from "sonner";

interface CreateCommentVariables {
  postId: string;
  input: CommentInput;
  user: User;
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, input, user }: CreateCommentVariables) =>
      createComment(postId, input, user),

    onSuccess: (_, { postId }) => {
      toast.success("댓글이 등록되었습니다");
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(postId),
      });
    },

    onError: () => {
      toast.error("댓글 등록에 실패했습니다");
    },
  });
}
