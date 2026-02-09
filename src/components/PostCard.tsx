import { Link } from "react-router-dom";
import type { PostSummary } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface PostCardProps {
  post: PostSummary;
}

function PostCard({ post }: PostCardProps) {
  const formatDate = (timestamp: { toDate: () => Date }) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getAuthorName = () => {
    if (post.authorDisplayName) {
      return post.authorDisplayName;
    }
    return post.authorEmail.split("@")[0];
  };

  return (
    <article className="card">
      <Link to={`/posts/${post.id}`} className="block p-6">
        {/* 카테고리 태그 */}
        {post.category && (
          <span
            className="inline-block px-2 py-1 text-xs font-medium 
                         bg-blue-100 text-blue-800 rounded mb-3"
          >
            {CATEGORY_LABELS[post.category]}
          </span>
        )}

        {/* 제목 (Day 1: 최대 50자, 초과 시 "..." 처리) */}
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
          {post.title}
        </h2>

        {/* 메타 정보 */}
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <span>{getAuthorName()}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
