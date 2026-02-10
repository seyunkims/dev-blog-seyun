/**
 * 프로필 수정 뮤테이션 (이름, 사진)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserDisplayName, updateUserPhoto } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { queryKeys } from "@/hooks/queries/keys";
import { toast } from "sonner";

interface UpdateProfileVariables {
  uid: string;
  displayName?: string;
  photoURL?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ displayName, photoURL }: UpdateProfileVariables) => {
      if (displayName !== undefined) {
        await updateUserDisplayName(displayName);
      }
      if (photoURL !== undefined) {
        await updateUserPhoto(photoURL);
      }
    },

    onSuccess: (_, { uid, displayName, photoURL }) => {
      const { user, setUser } = useAuthStore.getState();
      if (user && user.uid === uid) {
        setUser({
          ...user,
          ...(displayName !== undefined && { displayName }),
          ...(photoURL !== undefined && { photoURL }),
        });
      }

      toast.success("프로필이 수정되었습니다");
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(uid),
      });
    },

    onError: () => {
      toast.error("프로필 수정에 실패했습니다");
    },
  });
}
