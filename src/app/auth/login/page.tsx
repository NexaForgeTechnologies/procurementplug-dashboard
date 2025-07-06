"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    const res = await fetch("/auth/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/home");
    } else {
      alert(data.error);
      setLoading(false);
    }
  }, [username, password, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Future logic like blur effect, etc.
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      {/* Background video */}
      <div className="w-screen ml-[calc(50%-50vw)] h-full absolute">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/headervedio.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Login Card */}
      <div
        ref={containerRef}
        className="mx-6 relative z-10 w-full max-w-md rounded-xl border border-white/20 bg-white/10 px-6 md:px-8 py-14 shadow-2xl backdrop-blur-md"
      >
        <div className="text-center text-white">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={300}
            height={300}
            className="mx-auto w-full max-w-[300px] bg-white backdrop-blur-md rounded-lg p-6 mb-8"
          />
          <h1 className="mb-4 text-3xl font-semibold">Good to see you!</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <input
            required
            id="username"
            type="text"
            placeholder="you@example.com"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border-2 border-[#b08d57] bg-white px-4 py-2 text-[#363636] focus:outline-none focus:ring-2 focus:ring-[#b08d57] transition duration-200"
          />

          <input
            required
            id="password"
            type="password"
            placeholder="Enter your password *******"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm rounded-md border-2 border-[#b08d57] bg-white px-4 py-2 text-[#363636] focus:outline-none focus:ring-2 focus:ring-[#b08d57] transition duration-200"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-[#b08d57] px-4 py-2 font-semibold text-white hover:bg-[#a07b4f] transition-transform duration-200 ease-in-out cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              "Plug in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
