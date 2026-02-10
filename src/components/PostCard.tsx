import { memo } from "react";
import { Link } from "react-router-dom";
import type { PostSummary } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { getPostDetailPath } from "@/constants";
import { formatDateShort, getDisplayName } from "@/utils/formatters";

interface PostCardProps {
  post: PostSummary;
}

const PostCard = memo(function PostCard({ post }: PostCardProps) {
  return (
    <article className="card">
      <Link to={getPostDetailPath(post.id)} className="block p-6">
        {post.category && (
          <span
            className="inline-block px-2 py-1 text-xs font-medium
                         bg-blue-100 text-blue-800 rounded mb-3"
          >
            {CATEGORY_LABELS[post.category]}
          </span>
        )}

        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
          {post.title}
        </h2>

        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <span>{getDisplayName(post.authorEmail, post.authorDisplayName)}</span>
          <span>·</span>
          <span>{formatDateShort(post.createdAt)}</span>
        </div>
      </Link>
    </article>
  );
});

export default PostCard;
