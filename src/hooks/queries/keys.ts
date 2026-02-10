/**
 * TanStack Query Key 상수
 */

import type { Category } from "@/types";

export const queryKeys = {
    posts: {
        all: ["posts"] as const,
        lists: () => [...queryKeys.posts.all, "list"] as const,
        list: (filters: { category?: Category | null }) =>
            [...queryKeys.posts.lists(), filters] as const,
        details: () => [...queryKeys.posts.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    },
    comments: {
        all: ["comments"] as const,
        lists: () => [...queryKeys.comments.all, "list"] as const,
        list: (postId: string) =>
            [...queryKeys.comments.lists(), postId] as const,
    },
};
