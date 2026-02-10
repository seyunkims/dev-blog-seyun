import { memo, useCallback } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLikeStatus } from "@/hooks/queries";
import { useToggleLike } from "@/hooks/mutations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  likeCount: number;
  size?: "sm" | "default";
}

const LikeButton = memo(function LikeButton({
  postId,
  likeCount,
  size = "default",
}: LikeButtonProps) {
  const user = useAuthStore((state) => state.user);
  const { data: liked } = useLikeStatus(postId, user?.uid);
  const toggleLikeMutation = useToggleLike();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        toast.error("로그인이 필요합니다");
        return;
      }

      toggleLikeMutation.mutate({ postId, user });
    },
    [postId, user, toggleLikeMutation],
  );

  const iconSize = size === "sm" ? 14 : 18;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={toggleLikeMutation.isPending}
      className="gap-1.5 text-muted-foreground hover:text-red-500"
    >
      <Heart
        size={iconSize}
        className={liked ? "fill-red-500 text-red-500" : ""}
      />
      <span className="text-xs">{likeCount}</span>
    </Button>
  );
});

export default LikeButton;
