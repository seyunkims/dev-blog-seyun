/**
 * 좋아요 상태 조회 훅
 */

import { useQuery } from "@tanstack/react-query";
import { getLikeStatus } from "@/lib/likes";
import { queryKeys } from "./keys";

export function useLikeStatus(postId: string, userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.likes.status(postId, userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getLikeStatus(postId, userId);
    },
    enabled: !!userId && !!postId,
  });
}
