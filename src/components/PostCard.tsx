import { memo } from "react";
import { Link } from "react-router-dom";
import type { PostSummary } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { getPostDetailPath } from "@/constants";
import { formatDateShort, getDisplayName } from "@/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: PostSummary;
}

const PostCard = memo(function PostCard({ post }: PostCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/50">
      <Link
        to={getPostDetailPath(post.id)}
        className="flex flex-col sm:flex-row gap-4"
      >
        <CardContent className="flex-1 min-w-0">
          {post.category && (
            <Badge variant="secondary" className="mb-3">
              {CATEGORY_LABELS[post.category]}
            </Badge>
          )}

          <h2 className="text-lg font-semibold mb-2 line-clamp-2">
            {post.title}
          </h2>

          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <span>
              {getDisplayName(post.authorEmail, post.authorDisplayName)}
            </span>
            <span>·</span>
            <span>{formatDateShort(post.createdAt)}</span>
          </div>
        </CardContent>

        {post.thumbnailUrl && (
          <div className="w-full sm:w-24 sm:h-24 h-40 shrink-0 sm:my-6 sm:mr-6">
            <img
              src={post.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </Link>
    </Card>
  );
});

export default PostCard;
