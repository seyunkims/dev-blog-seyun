import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/lib/posts";
import { queryKeys } from "@/hooks/queries/keys";
import type { PostInput } from "@/types";
import { toast } from "sonner"; // UI 추가

interface UpdatePostVariables {
  postId: string;
  input: PostInput;
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, input }: UpdatePostVariables) =>
      updatePost(postId, input),

    // 성공 시 해당 게시글 캐시 무효화
    onSuccess: (_, { postId }) => {
      toast.success("글이 수정되었습니다"); //Toast 실행 위치
      // 상세 페이지 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      // 목록 캐시도 무효화 (제목이 변경될 수 있으므로)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
    },
    // 오류 처리
    onError: () => {
      toast.error("글 수정에 실패했습니다"); //Toast 실행 위치
    },
  });
}
