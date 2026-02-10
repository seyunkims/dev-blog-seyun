import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { COMMENT_MAX_LENGTH } from "@/constants";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
  isLoading?: boolean;
  isLoggedIn: boolean;
}

function CommentForm({
  onSubmit,
  onCancel,
  initialContent = "",
  isLoading = false,
  isLoggedIn,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);

  const isEditing = !!onCancel;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    onSubmit(trimmed);

    if (!isEditing) {
      setContent("");
    }
  };

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        댓글을 작성하려면 로그인이 필요합니다.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        maxLength={COMMENT_MAX_LENGTH}
        rows={3}
        disabled={isLoading}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/{COMMENT_MAX_LENGTH}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !content.trim()}
          >
            {isLoading
              ? isEditing
                ? "수정 중..."
                : "등록 중..."
              : isEditing
                ? "수정"
                : "댓글 등록"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
