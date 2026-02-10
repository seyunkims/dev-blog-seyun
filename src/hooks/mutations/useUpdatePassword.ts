/**
 * 비밀번호 변경 뮤테이션
 */

import { useMutation } from "@tanstack/react-query";
import { changePassword, getAuthErrorMessage } from "@/lib/auth";
import { toast } from "sonner";

interface UpdatePasswordVariables {
  currentPassword: string;
  newPassword: string;
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: UpdatePasswordVariables) =>
      changePassword(currentPassword, newPassword),

    onSuccess: () => {
      toast.success("비밀번호가 변경되었습니다");
    },

    onError: (error) => {
      toast.error(getAuthErrorMessage(error));
    },
  });
}
