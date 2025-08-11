'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/authlayout";
import AuthCard from "@/components/authcard";
import InputField from "@/components/inputfield";
import Button from "@/components/button";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      router.push("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome to Quotea"
        footer={
          <>
            Don’t have an account?{" "}
            <a
              href="http://localhost:3001/auth/register"
              className="text-blue-600 hover:underline"
            >
              Register here
            </a>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" label="Login"  />
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
