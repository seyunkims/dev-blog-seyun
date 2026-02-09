import { useParams, useNavigate, Link } from "react-router-dom";
import { usePost } from "@/hooks/queries";
import { useDeletePost } from "@/hooks/mutations";
import { useAuthStore } from "@/store/authStore";
import { CATEGORY_LABELS } from "@/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DeletePostDialog from "@/components/DeletePostDialog";
import ErrorMessage from "@/components/ErrorMessage";

function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: post, isLoading, error, refetch } = usePost(id);
  const deletePostMutation = useDeletePost();

  const handleDelete = async () => {
    if (!id) return;

    deletePostMutation.mutate(id, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const formatDate = (timestamp: { toDate: () => Date }) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAuthor = user && post && user.uid === post.authorId;

  // 로딩 스켈레톤
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

  // 에러 상태
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
          {/* 카테고리 */}
          {post.category && (
            <Badge variant="secondary" className="w-fit">
              {CATEGORY_LABELS[post.category]}
            </Badge>
          )}

          {/* 제목 */}
          <h1 className="text-2xl font-bold">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
              <span>
                {post.authorDisplayName || post.authorEmail.split("@")[0]}
              </span>
              <span className="mx-2">·</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.updatedAt.toMillis() !== post.createdAt.toMillis() && (
                <span className="ml-2">(수정됨)</span>
              )}
            </div>

            {/* 수정/삭제 버튼 */}
            {isAuthor && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/posts/${post.id}/edit`}>수정</Link>
                </Button>
                <DeletePostDialog
                  onConfirm={handleDelete}
                  isLoading={deletePostMutation.isPending}
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {post.content.split("\n").map((line, index) => (
              <p key={index} className="mb-4">
                {line || <br />}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 목록으로 링크 */}
      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link to="/">← 목록으로</Link>
        </Button>
      </div>
    </div>
  );
}

export default PostDetailPage;
