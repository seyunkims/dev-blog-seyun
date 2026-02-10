import { useCallback } from "react";
import { useComments } from "@/hooks/queries";
import { useCreateComment } from "@/hooks/mutations";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

function CommentSection({ postId }: CommentSectionProps) {
  const user = useAuthStore((state) => state.user);
  const { data: comments, isLoading, error } = useComments(postId);
  const createCommentMutation = useCreateComment();

  const handleCreate = useCallback(
    (content: string) => {
      if (!user) return;

      createCommentMutation.mutate({
        postId,
        input: { content },
        user,
      });
    },
    [postId, user, createCommentMutation],
  );

  const commentCount = comments?.length ?? 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          댓글 {commentCount > 0 && `(${commentCount})`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 댓글 목록 */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            댓글을 불러오는데 실패했습니다.
          </p>
        ) : comments && comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isAuthor={user?.uid === comment.authorId}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            첫 번째 댓글을 남겨보세요.
          </p>
        )}

        {/* 구분선 */}
        {comments && comments.length > 0 && <hr />}

        {/* 댓글 작성 폼 */}
        <CommentForm
          onSubmit={handleCreate}
          isLoading={createCommentMutation.isPending}
          isLoggedIn={!!user}
        />
      </CardContent>
    </Card>
  );
}

export default CommentSection;
