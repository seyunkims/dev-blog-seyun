import { useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePost } from "@/hooks/queries";
import { useDeletePost } from "@/hooks/mutations";
import { useAuthStore } from "@/store/authStore";
import { CATEGORY_LABELS } from "@/types";
import { ROUTES, getPostEditPath } from "@/constants";
import { formatDateTime, getDisplayName } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DeletePostDialog from "@/components/DeletePostDialog";
import ErrorMessage from "@/components/ErrorMessage";

import DOMPurify from "dompurify"; // 추가된 부분

function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: post, isLoading, error, refetch } = usePost(id);
  const deletePostMutation = useDeletePost();

  const handleDelete = useCallback(() => {
    if (!id) return;

    deletePostMutation.mutate(id, {
      onSuccess: () => {
        navigate(ROUTES.HOME);
      },
    });
  }, [id, deletePostMutation, navigate]);

  const isAuthor = user && post && user.uid === post.authorId;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !post) {
    return (
      <ErrorMessage
        title="게시글을 찾을 수 없습니다"
        message="요청하신 게시글이 존재하지 않거나 삭제되었습니다."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <Card>
        <CardHeader className="space-y-4">
          {post.category && (
            <Badge variant="secondary" className="w-fit">
              {CATEGORY_LABELS[post.category]}
            </Badge>
          )}

          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
              <span>
                {getDisplayName(post.authorEmail, post.authorDisplayName)}
              </span>
              <span className="mx-2">·</span>
              <span>{formatDateTime(post.createdAt)}</span>
              {post.updatedAt.toMillis() !== post.createdAt.toMillis() && (
                <span className="ml-2">(수정됨)</span>
              )}
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={getPostEditPath(post.id)}>수정</Link>
                </Button>
                <DeletePostDialog
                  onConfirm={handleDelete}
                  isLoading={deletePostMutation.isPending}
                />
              </div>
            )}
          </div>
        </CardHeader>

        {/* 수정된 부분 */}
        <CardContent>
          <div
            className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content, {
                ADD_TAGS: ["iframe"],
                ADD_ATTR: [
                  "allow",
                  "allowfullscreen",
                  "frameborder",
                  "scrolling",
                ],
              }),
            }}
          />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link to={ROUTES.HOME}>← 목록으로</Link>
        </Button>
      </div>
    </div>
  );
}

export default PostDetailPage;
