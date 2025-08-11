"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CreatePost({onPostCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const data = await res.json();

      onPostCreated({
        _id: data._id,
        text: data.text,
        userId: data.user._id,
        user: {
          _id: data.user._id,
          name: data.user.name,
          profileImage: data.user.profileImage,
        },
        createdAt: data.createdAt,
        likes: data.likes,
        comments: data.comments,
      });


      setText("");
      toast.success("Post created");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        disabled={loading}
        className="w-full resize-none rounded border border-gray-300 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <div className="flex justify-end w-full">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md transition cursor-pointer"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
