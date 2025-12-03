"use client";
import { useEffect, useState } from "react";
import LandingPage from "./home";
import Loader from "@/components/loader";

const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL;

export default function Home() {
  const [mode, setMode] = useState(REDIRECT_URL ? "redirect" : "loading");

  useEffect(() => {
    if (REDIRECT_URL) return;
    setMode("normal");
  }, []);

  if (mode === "redirect") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-neutral-100">
        <div className="bg-neutral-900 p-8 rounded-xl shadow-xl max-w-md text-center border border-neutral-700">
          <h1 className="text-3xl font-extrabold mb-4">We’ve Moved</h1>

          <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
            This workspace is temporarily under maintenance.
            <br />
            Click below to continue your session seamlessly on our new URL.
          </p>

          <a
            href={REDIRECT_URL}
            className="bg-neutral-800 hover:bg-neutral-700 px-6 py-3 rounded-lg 
                       font-semibold text-lg cursor-pointer inline-block transition"
          >
            Continue to New Workspace →
          </a>
        </div>
      </div>
    );
  }

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader message="Connecting to server..." />
      </div>
    );
  }

  return (
    <div className="bg-black text-neutral-100 min-h-screen">
      <LandingPage />
    </div>
  );
}
