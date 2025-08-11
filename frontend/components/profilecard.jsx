"use client";
import { useState } from "react";

export default function ProfileCard({ user, onProfileUpdate }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!imageUrl.trim()) return alert("Please enter an image URL");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/profile-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to upload image");

      if (onProfileUpdate) onProfileUpdate();
      setImageUrl("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="sticky top-20">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 h-[90vh] overflow-auto">
        <img
          src={user.profileImage || user.avatar || "/default-avatar.png"}
          alt={user.name || user.username || "Profile"}
          className="w-28 h-28 rounded-full mx-auto object-cover mb-6"
        />

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {user.name || user.username || "Anonymous"}
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
