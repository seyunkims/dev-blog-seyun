/**
 * 댓글 목록 조회 훅
 */

import { useQuery } from "@tanstack/react-query";
import { getCommentsByPostId } from "@/lib/comments";
import { queryKeys } from "./keys";

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.comments.list(postId || ""),
    queryFn: () => {
      if (!postId) throw new Error("Post ID is required");
      return getCommentsByPostId(postId);
    },
    enabled: !!postId,
  });
}
