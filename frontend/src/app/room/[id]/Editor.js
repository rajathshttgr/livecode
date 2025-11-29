"use client";
import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

export default function EditorWrapper({ language, theme, socket, remoteCode }) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  useEffect(() => {
    if (isEditorReady && editorRef.current && remoteCode !== null) {
      const currentContent = editorRef.current.getValue();

      if (currentContent !== remoteCode) {
        // Flag to prevent loop
        isRemoteUpdate.current = true;

        // Save cursor position
        const position = editorRef.current.getPosition();

        editorRef.current.setValue(remoteCode);

        // Restore cursor position
        editorRef.current.setPosition(position);

        isRemoteUpdate.current = false;
      }
    }
  }, [remoteCode, isEditorReady]);

  const handleEditorChange = (value) => {
    if (isRemoteUpdate.current) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          type: "CODE_UPDATE",
          payload: value,
        });
        socket.send(message);
      }
    }, 100);
  };

  return (
    <div className="flex-1 relative h-full">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        defaultValue="// Connecting..."
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
}
