// src/hooks/mutations/useUpdatePost.ts

/**
 * 게시글 수정 뮤테이션
 *
 * Day 1 요구사항: POST-004
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/lib/posts copy 1";
import { queryKeys } from "@/hooks/queries/keys";
import type { PostInput } from "@/types";

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
            // 상세 페이지 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: queryKeys.posts.detail(postId),
            });
            // 목록 캐시도 무효화 (제목이 변경될 수 있으므로)
            queryClient.invalidateQueries({
                queryKey: queryKeys.posts.lists(),
            });
        },
    });
}
