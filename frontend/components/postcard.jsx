"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export default function PostCard({ post, showDeletePost = false , onPostDeleted}) {
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.userId;

  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(userId));
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  const [openDeleteMenuId, setOpenDeleteMenuId] = useState(null);

  const commentInputRef = useRef(null);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m`;
    return `${seconds}s`;
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to like/unlike post");

      const data = await res.json();
      setLikes(data.likes.length);
      setLiked(data.likes.includes(userId));

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: commentText }),
      });
      if (!res.ok) throw new Error("Failed to add comment");

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/${post._id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:3000/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted successfully");
      onPostDeleted(post._id);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="mb-6 rounded-lg shadow-md bg-white p-6 border border-gray-200 relative">
      <div className="flex gap-4">
        <div className="w-14 flex-shrink-0">
          <img
            src={post.user?.profileImage || defaultAvatar}
            alt={post.user?.name || "Anonymous"}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 relative">
            <h3 className="font-semibold text-gray-900">
              {post.user?.name || "Anonymous"}
            </h3>
            <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>

            {showDeletePost && post.user?._id?.toString() === userId?.toString() && (
              <div className="ml-auto relative">
                <button
                  onClick={() => setShowDeleteMenu((prev) => !prev)}
                  className="text-gray-900 font-bold text-lg px-2 cursor-pointer"
                  aria-label="Toggle delete post menu"
                >
                  &#x2026; 
                </button>

                {showDeleteMenu && (
                  <button
                    onClick={handleDeletePost}
                    className="absolute right-0 top-full mt-1 text-red-700 px-3 py-1 rounded shadow hover:underline text-xs transition cursor-pointer"
                  >
                    Delete Post
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            className="text-gray-800 whitespace-pre-line leading-relaxed break-words"
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          >
            {post.text}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-3 flex gap-6 text-sm">
        <button
          onClick={handleLike}
          className="text-blue-600 hover:underline transition-colors duration-200 cursor-pointer"
        >
          👍 Like ({likes})
        </button>

        <button
          onClick={toggleComments}
          className="text-green-600 hover:underline transition-colors duration-200 cursor-pointer"
        >
          💬 Comment ({comments.length})
        </button>
      </div>

      {showComments && (
        <div className="mt-3">
          <form onSubmit={handleComment} className="flex gap-2 mb-3">
            <input
              id={`comment-${post._id}`}
              ref={commentInputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            >
              Post
            </button>
          </form>

          {comments.length > 0 && (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {comments.map((c) => (
                <div key={c._id} className="flex items-start gap-3 relative">
                  {c.user?.profileImage ? (
                    <img
                      src={c.user.profileImage}
                      alt={c.user.name || "User"}
                      className="w-6 h-6 rounded-full object-cover mt-1"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 mt-1" />
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {c.user?.name || "Anonymous"}{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        • {timeAgo(c.createdAt)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">{c.comment}</p>
                  </div>

                  {c.user?._id?.toString() === userId?.toString() && (
                    <div className="flex flex-col items-end relative">
                      <button
                        onClick={() =>
                          setOpenDeleteMenuId(
                            openDeleteMenuId === c._id ? null : c._id
                          )
                        }
                        className="text-gray-800 hover:text-gray-900 text-xs mt-1 px-2 cursor-pointer"
                        aria-label="Options"
                      >
                        &#x2026; 
                      </button>

                      {openDeleteMenuId === c._id && (
                        <button
                          onClick={() => {
                            handleDeleteComment(c._id);
                            setOpenDeleteMenuId(null);
                          }}
                          className="text-red-500 hover:underline text-xs mt-1 cursor-pointer"
                        >
                          Delete Comment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
