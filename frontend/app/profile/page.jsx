"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import PostList from "@/components/postlist";
import CreatePost from "@/components/CreatePost";
import ProfileCard from "@/components/ProfileCard";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const data = await res.json();
        setUser(data.user);
        setPosts(data.posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [router]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter(post => post._id !== deletedPostId));
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-10">
        <div className="flex gap-6 px-4">

          <aside className="hidden md:block w-[30%] sticky top-30 h-[90vh] self-start">
            <ProfileCard user={user} onProfileUpdate={() => {
              const token = localStorage.getItem("token");
              if (!token) return;
              fetch("http://localhost:3000/profile", {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((res) => res.json())
                .then((data) => {
                  setUser(data.user);
                  setPosts(data.posts);
                })
                .catch(console.error);
            }} />
          </aside>

          <main className="w-[70%]">
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
              <PostList posts={posts} showDeletePost={true} onPostDeleted={handlePostDeleted} />
            ) : (
              <p className="text-center text-gray-400 py-20 select-none italic">
                No posts yet.
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
