/**
 * 댓글 수정 뮤테이션
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "@/lib/comments";
import { queryKeys } from "@/hooks/queries/keys";
import type { CommentInput } from "@/types";
import { toast } from "sonner";

interface UpdateCommentVariables {
  commentId: string;
  postId: string;
  input: CommentInput;
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, input }: UpdateCommentVariables) =>
      updateComment(commentId, input),

    onSuccess: (_, { postId }) => {
      toast.success("댓글이 수정되었습니다");
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(postId),
      });
    },

    onError: () => {
      toast.error("댓글 수정에 실패했습니다");
    },
  });
}
