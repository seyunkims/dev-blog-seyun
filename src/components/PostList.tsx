import { memo } from "react";
import type { PostSummary } from "@/types";
import PostCard from "./PostCard";

interface PostListProps {
  posts: PostSummary[];
  isLoading?: boolean;
}

const PostList = memo(function PostList({
  posts,
  isLoading = false,
}: PostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">아직 작성된 글이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">첫 번째 글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
});

export default PostList;
