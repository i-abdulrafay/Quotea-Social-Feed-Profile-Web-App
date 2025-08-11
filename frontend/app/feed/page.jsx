"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/postlist";
import CreatePost from "@/components/CreatePost";
import Navbar from "@/components/navbar";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/feed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowCreatePost((prev) => !prev)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              {showCreatePost ? "Close" : "Create Post"}
            </button>
          </div>

          {showCreatePost && (
            <div className="space-y-6 px-4 sm:px-6 md:px-8 mb-6">
              <div className="rounded-lg shadow-md bg-white p-6 border border-gray-200">
                <CreatePost onPostCreated={handlePostCreated} />
              </div>
            </div>
          )}

          {posts.length > 0 ? (
            <PostList posts={posts}/>
          ) : (
            <p className="text-center text-gray-400 py-20 select-none italic">
              No posts yet. Be the first to share!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
