import { memo, useState, useCallback } from "react";
import type { Comment } from "@/types";
import { formatRelativeTime, getDisplayName } from "@/utils/formatters";
import { useUpdateComment, useDeleteComment } from "@/hooks/mutations";
import CommentForm from "./CommentForm";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { Button } from "@/components/ui/button";

interface CommentItemProps {
  comment: Comment;
  isAuthor: boolean;
}

const CommentItem = memo(function CommentItem({
  comment,
  isAuthor,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const handleUpdate = useCallback(
    (content: string) => {
      updateCommentMutation.mutate(
        {
          commentId: comment.id,
          postId: comment.postId,
          input: { content },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
    },
    [comment.id, comment.postId, updateCommentMutation],
  );

  const handleDelete = useCallback(() => {
    deleteCommentMutation.mutate({
      commentId: comment.id,
      postId: comment.postId,
    });
  }, [comment.id, comment.postId, deleteCommentMutation]);

  const isModified =
    comment.updatedAt.toMillis() !== comment.createdAt.toMillis();

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            {getDisplayName(comment.authorEmail, comment.authorDisplayName)}
          </span>
          <span className="text-muted-foreground">
            {formatRelativeTime(comment.createdAt)}
          </span>
          {isModified && (
            <span className="text-muted-foreground text-xs">(수정됨)</span>
          )}
        </div>

        {isAuthor && !isEditing && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
            <DeleteCommentDialog
              onConfirm={handleDelete}
              isLoading={deleteCommentMutation.isPending}
            />
          </div>
        )}
      </div>

      {isEditing ? (
        <CommentForm
          initialContent={comment.content}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={updateCommentMutation.isPending}
          isLoggedIn={true}
        />
      ) : (
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
});

export default CommentItem;
