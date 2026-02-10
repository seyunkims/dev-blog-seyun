/**
 * 댓글 삭제 뮤테이션
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/lib/comments";
import { queryKeys } from "@/hooks/queries/keys";
import { toast } from "sonner";

interface DeleteCommentVariables {
  commentId: string;
  postId: string;
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentVariables) =>
      deleteComment(commentId),

    onSuccess: (_, { postId }) => {
      toast.success("댓글이 삭제되었습니다");
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(postId),
      });
    },

    onError: () => {
      toast.error("댓글 삭제에 실패했습니다");
    },
  });
}
