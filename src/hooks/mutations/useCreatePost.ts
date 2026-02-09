import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/lib/posts";
import { queryKeys } from "@/hooks/queries/keys";
import type { PostInput, User } from "@/types";
import { toast } from "sonner"; // UI 추가

interface CreatePostVariables {
    input: PostInput;
    user: User;
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ input, user }: CreatePostVariables) =>
            createPost(input, user),

        onSuccess: () => {
            toast.success("새 글이 등록되었습니다"); //Toast 실행 위치
            queryClient.invalidateQueries({
                queryKey: queryKeys.posts.lists(),
            });
        },
        onError: () => {
            toast.error("글 등록에 실패했습니다");  //Toast 실행 위치
        },
    });
}
