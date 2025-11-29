"use client";
import React, { useEffect, useState } from "react";
import { sendRequest } from "@/components/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [colorCode, setColorCode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [mode, setMode] = useState("home");
  const [joinInput, setJoinInput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const initSession = async () => {
      const storedSession = localStorage.getItem("livecode_session");

      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.user_name) {
            setUserName(parsed.user_name);
            setColorCode(parsed.color);
            return;
          }
        } catch (e) {
          localStorage.removeItem("livecode_session");
        }
      }

      try {
        const data = await sendRequest({
          route: "/room/session",
          method: "POST",
        });
        setUserName(data.user_name);
        setColorCode(data.color);

        localStorage.setItem("livecode_session", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching session data:", err);
      }
    };

    initSession();
  }, []);

  const handleCopy = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_CLIENT || window.location.origin + "/";
    navigator.clipboard.writeText(`${baseUrl}room/${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCreateRoom = async () => {
    try {
      const data = await sendRequest({
        route: "/room",
        method: "POST",
      });
      setRoomId(data.room_id);
      setMode("create");
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleJoinRoom = async (room_id) => {
    const id = room_id.toUpperCase();
    try {
      const data = await sendRequest({
        route: `/room/${id}`,
        method: "GET",
      });

      if (data?.id) {
        setError("");
        router.push(`/room/${id}`);
        return;
      }

      setError("Invalid Room ID");
    } catch (err) {
      setError("Invalid Room ID");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-6 py-4">
        <span className="font-bold text-2xl tracking-wide">LiveCode</span>

        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: colorCode || "transparent" }}
          ></div>
          <span className="text-sm font-medium">
            {userName ? `${userName} (you)` : ""}
          </span>
        </div>
      </header>

      <main className="flex flex-col flex-grow justify-center items-center p-4 translate-y-[-40px]">
        {mode === "home" && (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-neutral-50 px-4">
              Live Coding Spaces for You & Your Team.
            </h1>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                onClick={handleCreateRoom}
                className="w-56 sm:w-60 bg-neutral-800 hover:bg-neutral-700 py-4 font-extrabold text-lg sm:text-xl rounded-md shadow-lg cursor-pointer transition"
              >
                CREATE ROOM
              </button>

              <button
                onClick={() => setMode("join")}
                className="w-56 sm:w-60 bg-neutral-800 hover:bg-neutral-700 py-4 font-extrabold text-lg sm:text-xl rounded-md shadow-lg cursor-pointer transition"
              >
                JOIN ROOM
              </button>
            </div>
          </div>
        )}

        {mode === "create" && (
          <div className="flex flex-col items-center bg-neutral-900 p-8 rounded-md shadow-xl w-96">
            <div className="text-3xl font-extrabold text-neutral-200 mb-4">
              Room ID: {roomId}
            </div>

            <button
              onClick={() => router.push(`/room/${roomId}`)}
              className="w-full bg-neutral-700 hover:bg-neutral-600 py-3 rounded-md text-xl font-semibold cursor-pointer"
            >
              JOIN NOW
            </button>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-gray-400 bg-neutral-800 px-3 py-2 rounded-md">
                livecode008.app/room/{roomId}
              </span>
              <button
                onClick={handleCopy}
                className="bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded-md text-xs cursor-pointer"
              >
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <button
              onClick={() => setMode("home")}
              className="mt-6 text-sm text-gray-400 hover:text-gray-200 cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="flex flex-col items-center bg-neutral-900 p-8 rounded-md shadow-xl w-96">
            <h2 className="text-2xl font-bold  ">JOIN ROOM</h2>
            <p className="text-sm text-red-400 mb-2">{error}</p>
            <input
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full bg-neutral-800 p-3 rounded-lg outline-none text-center text-lg mb-3"
            />

            <div className="flex gap-4 w-full">
              <button
                onClick={() => {
                  setError("");
                  setJoinInput("");
                  setMode("home");
                }}
                className="bg-red-400 hover:bg-red-500 cursor-pointer px-5 py-3 rounded-md font-bold text-md w-1/2"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (joinInput.length != 8) {
                    setError("Invalid Room ID");
                  } else {
                    handleJoinRoom(joinInput);
                  }
                }}
                className="bg-neutral-700 hover:bg-neutral-500 cursor-pointer px-5 py-3 rounded-lg font-bold text-md w-1/2"
              >
                Join
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
