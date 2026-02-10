/**
 * 회원 프로필 조회 훅
 */

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/users";
import { queryKeys } from "./keys";

export function useUserProfile(uid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(uid || ""),
    queryFn: () => {
      if (!uid) throw new Error("User ID is required");
      return getUserProfile(uid);
    },
    enabled: !!uid,
  });
}
