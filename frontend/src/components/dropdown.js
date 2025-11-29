"use client";
import { useState, useRef, useEffect } from "react";

export default function DropDown({
  value,
  options,
  onChange,
  width = "140px",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref} style={{ minWidth: width }}>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 w-full border rounded-lg text-sm bg-white 
          hover:bg-gray-50 flex justify-between items-center 
          shadow-sm transition"
      >
        <span className="text-gray-700 capitalize">{value}</span>

        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg py-1 z-30">
          {options.map((opt) => (
            <button
              key={opt}
              className="block w-full text-left px-3 py-1.5 text-sm 
                hover:bg-gray-100 text-gray-700 capitalize"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
