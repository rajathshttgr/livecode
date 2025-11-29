"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RoomHeader from "./RoomHeader";
import EditorWrapper from "./Editor";
import { sendRequest } from "@/components/api";
import Loader from "@/components/loader";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id;
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [remoteCode, setRemoteCode] = useState(null);
  const [activePeople, setActivePeople] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-light");

  useEffect(() => {
    const ensureSession = async () => {
      try {
        const stored = localStorage.getItem("livecode_session");

        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.user_name) {
            setCurrentUser(parsed);
            return;
          }
        }

        const session = await sendRequest({
          route: "/room/session",
          method: "POST",
        });

        localStorage.setItem("livecode_session", JSON.stringify(session));
        setCurrentUser(session);
      } catch (err) {
        console.error("Failed to create session:", err);
        router.push("/");
      }
    };

    ensureSession();
  }, [router]);

  useEffect(() => {
    if (!currentUser || !roomId) return;

    const wsUrl = `${
      process.env.NEXT_PUBLIC_WS_URL
    }/ws/room/${roomId}?user_name=${
      currentUser.user_name
    }&color=${encodeURIComponent(currentUser.color)}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to room");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "USER_LIST_UPDATE") {
        setActivePeople(msg.payload);
      } else if (msg.type === "INIT" || msg.type === "CODE_UPDATE") {
        setRemoteCode(msg.payload);
      }
    };

    ws.onclose = () => console.log("WS closed");

    setSocket(ws);

    return () => ws.close();
  }, [currentUser, roomId]);

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader message="Syncing workspace..." />
      </div>
    );
  }

  if (remoteCode === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader message="Loading editor..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#fafafa]">
      <RoomHeader
        roomId={roomId}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        activePeople={activePeople}
        currentUser={currentUser.user_name}
      />

      <EditorWrapper
        language={language}
        theme={theme}
        socket={socket}
        remoteCode={remoteCode}
      />
    </div>
  );
}
