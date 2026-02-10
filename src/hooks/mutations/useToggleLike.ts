/**
 * 좋아요 토글 뮤테이션
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "@/lib/likes";
import { queryKeys } from "@/hooks/queries/keys";
import { toast } from "sonner";
import type { User } from "@/types";

interface ToggleLikeVariables {
  postId: string;
  user: User;
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, user }: ToggleLikeVariables) =>
      toggleLike(postId, user),

    onSuccess: (_, { postId, user }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.likes.status(postId, user.uid),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
    },

    onError: () => {
      toast.error("좋아요 처리에 실패했습니다");
    },
  });
}
