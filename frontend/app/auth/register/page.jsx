'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/AuthCard";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import RegisterHeader from "@/components/RegisterHeader";
import toast from "react-hot-toast";


export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Registration successful!");
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center pt-16">
      <RegisterHeader />

      <AuthCard
        title="Create a new account"
        footer={
          <>
            Already have an account?{" "}
            <a
              href="http://localhost:3001/auth/login"
              className="text-blue-600 hover:underline"
            >
              Log in
            </a>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
          />
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" label="Sign Up" />
        </form>
      </AuthCard>
    </div>
  );
}
