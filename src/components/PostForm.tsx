import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { PostInput, Category } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { TITLE_MAX_LENGTH } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichEditor from "@/components/RichEditor";

interface PostFormProps {
  initialData?: PostInput;
  onSubmit: (data: PostInput) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  userId: string;
}

function PostForm({
  initialData,
  onSubmit,
  submitLabel = "발행하기",
  isLoading = false,
  userId,
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState<Category | null>(
    initialData?.category || null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (title.length > TITLE_MAX_LENGTH) {
      setError(`제목은 ${TITLE_MAX_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
      });
    } catch (err) {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
      console.error("PostForm handleSubmit error:", err);
    }
  };

  const categories: Category[] = [
    "javascript",
    "typescript",
    "react",
    "firebase",
    "etc",
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          {initialData ? "게시글 수정" : "새 게시글 작성"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              maxLength={TITLE_MAX_LENGTH}
              className="h-11"
            />
            <p className="text-xs text-right">
              {title.length}/{TITLE_MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리 (선택)</Label>
            <Select
              value={category || ""}
              onValueChange={(value) =>
                setCategory(value ? (value as Category) : null)
              }
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>내용</Label>
            <RichEditor
              content={content}
              onChange={setContent}
              userId={userId}
              placeholder="게시글 내용을 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="min-w-5"
            >
              {isLoading ? (
                <>
                  <Spinner className="size-8" />
                  저장 중...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PostForm;
