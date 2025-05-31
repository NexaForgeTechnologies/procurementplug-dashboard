"use client";

import { useRouter } from "next/navigation";
import React, { FocusEvent, useEffect, useRef, useState } from "react";

function LoginPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocusedField(e.target.id);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setFocusedField(null);
    }
  };

  const autofillStyles: React.CSSProperties = {
    backgroundColor: "white",
    WebkitBoxShadow: "0 0 0 30px white inset",
    boxShadow: "0 0 0 30px white inset",
    WebkitTextFillColor: "#858484",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setFocusedField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
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
  };

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
  }, [username, password]);

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
          <img
            src="/images/logo.png"
            alt="Logo"
            className="mx-auto w-full max-w-[300px] bg-white backdrop-blur-md rounded-lg p-6 mb-8"
          />
          <h1 className="mb-4 text-3xl font-semibold">Good to see you!</h1>
        </div>
        <div className="space-y-4 mt-8">
          <input
            id="username"
            type="text"
            placeholder="*****@****.com"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            style={autofillStyles}
            className="w-full rounded-md border-2 border-[#b08d57] bg-white/20 px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#b08d57] transition duration-200"
          />

          <input
            id="password"
            type="password"
            placeholder="*********"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            style={autofillStyles}
            className="w-full rounded-md border-2 border-[#b08d57] bg-white/20 px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#b08d57] transition duration-200"
          />

          <div onClick={handleSubmit}>
            {/* <Button text="Log in" bg="#31DFD4" /> */}
            <button className="w-full rounded-md bg-[#b08d57] px-4 py-2 font-semibold text-white hover:bg-[#a07b4f] hover:scale-105 hover:shadow-lg transition-transform duration-200 ease-in-out cursor-pointer disabled:opacity-50 flex items-center justify-center">
              {loading ? "" : "Log in"}
              {loading && (
                <div className="w-6 h-6 border-4 border-t-transparent border-[#FFFF] rounded-full animate-spin"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
