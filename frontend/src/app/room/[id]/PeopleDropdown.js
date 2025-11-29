"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function PeopleDropdown({ activePeople, currentUser }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        onClick={() => setShow((prev) => !prev)}
        className="flex items-center justify-between sm:justify-start gap-2
               w-full sm:w-auto px-3 py-1 border rounded-lg text-sm bg-white
               hover:bg-gray-50 shadow-sm"
      >
        <div className="flex -space-x-2">
          {activePeople.slice(0, 3).map((p, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white"
              style={{ backgroundColor: p.color }}
            ></div>
          ))}
        </div>

        <span className="font-medium text-gray-700">
          {activePeople.length} Live
        </span>

        <ChevronDown size={16} />
      </button>

      {show && (
        <div
          className="absolute right-0 mt-2 w-full sm:w-48 bg-white border 
                rounded-xl shadow-md py-2 z-20"
        >
          {activePeople.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: p.color }}
              ></div>
              <span className="text-sm text-gray-800">
                {p.name === currentUser ? p.name + " (you)" : p.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
