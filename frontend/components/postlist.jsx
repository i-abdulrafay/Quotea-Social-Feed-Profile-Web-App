"use client";
import PostCard from "./postcard";

export default function PostList({ posts, showDeletePost = false, onPostDeleted }) {
  if (!posts.length) {
    return (
      <p className="text-center text-gray-500 py-10 italic">
        No posts yet. Be the first to share something!
      </p>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} showDeletePost={showDeletePost} onPostDeleted={onPostDeleted} />
      ))}
    </div>
  );
}
